"""
trends_backend.py — Swappable Google Trends backend interface.

Author: Donny (Kevin Chan), April 2026.

Why this exists: every free Trends scraper (trendspy, trendspyg, raw pytrends,
home-rolled) can be killed by Google in a single quarter. pytrends was archived
on 2025-04-17 with the maintainer warning that bot-detected requests get
silently altered data. The only durable strategy is composition over
dependency: design every Trends consumer against this interface so backend
swaps are configuration, not refactor.

Usage:
    from trends_backend import get_backend
    backend = get_backend("trendspy")          # or "trendspyg" or "serpapi"
    df = backend.interest_over_time(["claude AI"], geo="US", timeframe="today 5-y")
"""

from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional
import os
import time
import statistics
from datetime import datetime, timezone


# ---------------------------------------------------------------------------
# Result type
# ---------------------------------------------------------------------------

@dataclass
class TrendsResult:
    """Standardized result from any Trends backend."""
    query: str
    geo: str
    timeframe: str
    granularity: str           # "hourly" | "daily" | "weekly" | "monthly"
    series: list[tuple[datetime, float]]  # (timestamp, RSV value 0-100)
    backend: str
    pulled_at: datetime
    pull_index: int = 0        # which pull in the replicate sequence

    def values(self) -> list[float]:
        return [v for _, v in self.series]


# ---------------------------------------------------------------------------
# Abstract backend
# ---------------------------------------------------------------------------

class TrendsBackend(ABC):
    name: str = "abstract"

    @abstractmethod
    def interest_over_time(
        self,
        queries: list[str],
        geo: str = "",
        timeframe: str = "today 12-m",
        category: int = 0,
    ) -> list[TrendsResult]:
        ...

    @abstractmethod
    def related_queries(
        self,
        query: str,
        geo: str = "",
        timeframe: str = "today 12-m",
    ) -> dict:
        ...

    @abstractmethod
    def trending_now(self, geo: str = "US") -> list[str]:
        ...


# ---------------------------------------------------------------------------
# trendspy backend (primary free)
# ---------------------------------------------------------------------------

class TrendspyBackend(TrendsBackend):
    name = "trendspy"

    def __init__(self):
        try:
            from trendspy import Trends
        except ImportError as e:
            raise RuntimeError(
                "trendspy not installed. `pip install trendspy`"
            ) from e
        self._client = Trends()

    def interest_over_time(self, queries, geo="", timeframe="today 12-m", category=0):
        df = self._client.interest_over_time(
            queries, geo=geo, timeframe=timeframe, cat=category
        )
        results = []
        for q in queries:
            if q not in df.columns:
                continue
            series = [(idx.to_pydatetime(), float(df.loc[idx, q])) for idx in df.index]
            results.append(TrendsResult(
                query=q, geo=geo, timeframe=timeframe,
                granularity=_infer_granularity(timeframe),
                series=series, backend=self.name, pulled_at=datetime.now(timezone.utc),
            ))
        return results

    def related_queries(self, query, geo="", timeframe="today 12-m"):
        return self._client.related_queries(query, geo=geo, timeframe=timeframe) or {}

    def trending_now(self, geo="US"):
        return [t.keyword for t in self._client.trending_now(geo=geo)]


# ---------------------------------------------------------------------------
# trendspyg backend (alpha, secondary)
# ---------------------------------------------------------------------------

class TrendspygBackend(TrendsBackend):
    name = "trendspyg"

    def __init__(self):
        try:
            import trendspyg
        except ImportError as e:
            raise RuntimeError("trendspyg not installed. `pip install trendspyg`") from e
        self._mod = trendspyg

    def interest_over_time(self, queries, geo="", timeframe="today 12-m", category=0):
        # API surface intentionally tracks trendspy; consult trendspyg docs for nuances.
        raise NotImplementedError("Wire to trendspyg's actual client; pin the version.")

    def related_queries(self, query, geo="", timeframe="today 12-m"):
        raise NotImplementedError

    def trending_now(self, geo="US"):
        return self._mod.rss_trending_now(geo=geo)


# ---------------------------------------------------------------------------
# SerpApi backend (paid, most reliable)
# ---------------------------------------------------------------------------

class SerpApiBackend(TrendsBackend):
    name = "serpapi"

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("SERPAPI_API_KEY")
        if not self.api_key:
            raise RuntimeError("SERPAPI_API_KEY not set")
        try:
            from serpapi import GoogleSearch  # noqa: F401
        except ImportError as e:
            raise RuntimeError("`pip install google-search-results`") from e

    def interest_over_time(self, queries, geo="", timeframe="today 12-m", category=0):
        from serpapi import GoogleSearch
        params = {
            "engine": "google_trends",
            "q": ",".join(queries),
            "data_type": "TIMESERIES",
            "geo": geo,
            "date": timeframe,
            "cat": category,
            "api_key": self.api_key,
        }
        data = GoogleSearch(params).get_dict()
        timeline = data.get("interest_over_time", {}).get("timeline_data", [])
        # Build per-query results
        results = {q: [] for q in queries}
        for bucket in timeline:
            ts = datetime.fromtimestamp(int(bucket["timestamp"]))
            for value in bucket.get("values", []):
                q = value["query"]
                if q in results:
                    results[q].append((ts, float(value["extracted_value"])))
        return [
            TrendsResult(
                query=q, geo=geo, timeframe=timeframe,
                granularity=_infer_granularity(timeframe),
                series=results[q], backend=self.name, pulled_at=datetime.now(timezone.utc),
            )
            for q in queries if results[q]
        ]

    def related_queries(self, query, geo="", timeframe="today 12-m"):
        from serpapi import GoogleSearch
        params = {
            "engine": "google_trends",
            "q": query,
            "data_type": "RELATED_QUERIES",
            "geo": geo,
            "date": timeframe,
            "api_key": self.api_key,
        }
        return GoogleSearch(params).get_dict().get("related_queries", {})

    def trending_now(self, geo="US"):
        from serpapi import GoogleSearch
        params = {
            "engine": "google_trends_trending_now",
            "geo": geo,
            "api_key": self.api_key,
        }
        return [
            t["query"] for t in
            GoogleSearch(params).get_dict().get("trending_searches", [])
        ]


# ---------------------------------------------------------------------------
# Replicate-and-average wrapper (the discipline this skill enforces)
# ---------------------------------------------------------------------------

def replicate(
    backend: TrendsBackend,
    queries: list[str],
    n_pulls: int = 4,
    sleep_seconds: float = 8.0,
    **kwargs,
) -> dict[str, dict]:
    """
    Run the same query N times and report mean + coefficient of variation.

    This is the single most important thing this skill does. A single Trends
    pull is statistically indefensible. Eichenauer et al. 2022 showed ~90%
    variance reduction at n=12; n=4 is the floor for tactical decisions.
    """
    if n_pulls < 4:
        raise ValueError("Replicate count must be >= 4. This is a hard floor.")
    runs = []
    for i in range(n_pulls):
        if i > 0:
            time.sleep(sleep_seconds)
        for r in backend.interest_over_time(queries, **kwargs):
            r.pull_index = i
            runs.append(r)

    out: dict[str, dict] = {}
    for q in queries:
        per_query = [r for r in runs if r.query == q]
        if not per_query:
            continue
        # Align by index position (Trends returns identical timestamp grids per query)
        series_len = min(len(r.series) for r in per_query)
        per_bucket_means = []
        per_bucket_cvs = []
        for i in range(series_len):
            values = [r.series[i][1] for r in per_query]
            mean = statistics.mean(values)
            cv = (statistics.pstdev(values) / mean * 100) if mean > 0 else 0.0
            per_bucket_means.append(mean)
            per_bucket_cvs.append(cv)
        timestamps = [per_query[0].series[i][0] for i in range(series_len)]
        out[q] = {
            "n_pulls": len(per_query),
            "mean_series": list(zip(timestamps, per_bucket_means)),
            "cv_series": list(zip(timestamps, per_bucket_cvs)),
            "max_cv": max(per_bucket_cvs) if per_bucket_cvs else 0,
            "mean_cv": statistics.mean(per_bucket_cvs) if per_bucket_cvs else 0,
            "warning": "HIGH NOISE" if max(per_bucket_cvs, default=0) > 10 else None,
        }
    return out


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _infer_granularity(timeframe: str) -> str:
    if timeframe.startswith("now ") or "1-d" in timeframe or "4-H" in timeframe:
        return "hourly"
    if "today 1-m" in timeframe or "today 3-m" in timeframe or "today 12-m" in timeframe or "today 9-m" in timeframe:
        return "daily" if "1-m" in timeframe or "3-m" in timeframe else "weekly"
    if "today 5-y" in timeframe:
        return "weekly"
    if "all" in timeframe:
        return "monthly"
    return "weekly"


def get_backend(name: str = "trendspy", **kwargs) -> TrendsBackend:
    """Factory. Add new backends here."""
    backends = {
        "trendspy": TrendspyBackend,
        "trendspyg": TrendspygBackend,
        "serpapi": SerpApiBackend,
    }
    if name not in backends:
        raise ValueError(f"Unknown backend: {name}. Available: {list(backends)}")
    return backends[name](**kwargs)


__all__ = [
    "TrendsBackend",
    "TrendsResult",
    "TrendspyBackend",
    "TrendspygBackend",
    "SerpApiBackend",
    "get_backend",
    "replicate",
]
