"""
triangulate.py — Combine Google Trends with Wikipedia pageviews and GDELT.

Author: Donny (Kevin Chan), April 2026.

The skill's central rule: never publish a magnitude claim from Trends alone.
This script runs the three-source pull and produces a combined frame for
the user to inspect or feed into stl_decompose.py.

Wikipedia is the gold standard corroborator: free, absolute counts, no
rounding, deterministic, daily granularity since July 2015, multilingual.

GDELT is the news-cycle confound check: high GDELT volume + Trends spike
= press cycle, not organic interest.
"""

from __future__ import annotations
from datetime import datetime, timedelta
from typing import Optional
import urllib.parse
import httpx

from trends_backend import TrendsBackend, replicate


WIKIPEDIA_REST_BASE = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article"
USER_AGENT = "googletrends-mastery-skill/1.0 (kevin@example.com)"  # set yours


def wikipedia_pageviews(
    article: str,
    project: str = "en.wikipedia.org",
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    granularity: str = "daily",
    access: str = "all-access",
    agent: str = "user",  # 'user' filters out bots; 'all-agents' includes them
) -> list[tuple[datetime, int]]:
    """Pull absolute daily pageview counts for a Wikipedia article."""
    if end is None:
        end = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=1)
    if start is None:
        start = end - timedelta(days=365)

    article_encoded = urllib.parse.quote(article, safe="")
    url = (
        f"{WIKIPEDIA_REST_BASE}/{project}/{access}/{agent}/{article_encoded}/"
        f"{granularity}/{start:%Y%m%d}/{end:%Y%m%d}"
    )
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    resp = httpx.get(url, headers=headers, timeout=30.0)
    resp.raise_for_status()
    items = resp.json().get("items", [])
    return [
        (datetime.strptime(item["timestamp"][:8], "%Y%m%d"), item["views"])
        for item in items
    ]


def gdelt_timeline(
    query: str,
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
    mode: str = "timelinevol",  # or "timelinetone"
) -> list[tuple[datetime, float]]:
    """
    Pull GDELT timeline (article volume or average tone) for a query.
    Recommended: wrap the gdeltdoc package; this is the raw HTTP fallback.
    """
    if end is None:
        end = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(hours=1)
    if start is None:
        start = end - timedelta(days=365)

    url = "https://api.gdeltproject.org/api/v2/doc/doc"
    params = {
        "query": query,
        "mode": mode,
        "format": "json",
        "startdatetime": start.strftime("%Y%m%d%H%M%S"),
        "enddatetime": end.strftime("%Y%m%d%H%M%S"),
    }
    resp = httpx.get(url, params=params, timeout=60.0)
    resp.raise_for_status()
    data = resp.json()
    timeline = data.get("timeline", [])
    if not timeline:
        return []
    points = timeline[0].get("data", [])
    out = []
    for p in points:
        ts = datetime.strptime(p["date"][:8], "%Y%m%d")
        # 'value' for volume; same key carries tone in tone mode
        out.append((ts, float(p.get("value", 0))))
    return out


def triangulate(
    query: str,
    wiki_article: str,
    backend: TrendsBackend,
    geo: str = "",
    timeframe: str = "today 12-m",
    n_pulls: int = 4,
    wiki_project: str = "en.wikipedia.org",
) -> dict:
    """
    Run the full three-source pull. Returns a dict with three series and a
    short verdict string the caller should print prominently.
    """
    # 1. Trends with replication
    trends_data = replicate(backend, [query], n_pulls=n_pulls, geo=geo, timeframe=timeframe)
    trends_series = trends_data.get(query, {}).get("mean_series", [])
    trends_max_cv = trends_data.get(query, {}).get("max_cv", 0)

    # 2. Wikipedia pageviews (year-long window for Trends 12-month default)
    end = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=1)
    start = end - timedelta(days=365)
    wiki_series = wikipedia_pageviews(wiki_article, project=wiki_project, start=start, end=end)

    # 3. GDELT volume
    gdelt_series = gdelt_timeline(query, start=start, end=end, mode="timelinevol")

    verdict = _heuristic_verdict(trends_series, wiki_series, gdelt_series)

    return {
        "query": query,
        "wiki_article": wiki_article,
        "geo": geo,
        "timeframe": timeframe,
        "trends": {
            "series": trends_series,
            "max_cv": trends_max_cv,
            "n_pulls": n_pulls,
        },
        "wikipedia": {"series": wiki_series},
        "gdelt": {"series": gdelt_series},
        "verdict": verdict,
    }


def _heuristic_verdict(trends, wiki, gdelt) -> str:
    """
    A quick sniff test. The full validation pipeline is in stl_decompose.py
    plus the briefing template; this function only flags obvious patterns.
    """
    if not trends or not wiki:
        return "INSUFFICIENT_DATA"
    trends_recent = sum(v for _, v in trends[-30:]) / max(1, len(trends[-30:]))
    trends_baseline = sum(v for _, v in trends[:90]) / max(1, len(trends[:90]))
    wiki_recent = sum(v for _, v in wiki[-30:]) / max(1, len(wiki[-30:]))
    wiki_baseline = sum(v for _, v in wiki[:90]) / max(1, len(wiki[:90]))

    trends_up = trends_recent > 1.3 * trends_baseline if trends_baseline > 0 else False
    wiki_up = wiki_recent > 1.3 * wiki_baseline if wiki_baseline > 0 else False

    gdelt_up = False
    if gdelt:
        gdelt_recent = sum(v for _, v in gdelt[-30:]) / max(1, len(gdelt[-30:]))
        gdelt_baseline = sum(v for _, v in gdelt[:90]) / max(1, len(gdelt[:90]))
        gdelt_up = gdelt_recent > 2.0 * gdelt_baseline if gdelt_baseline > 0 else False

    if trends_up and wiki_up and not gdelt_up:
        return "ORGANIC_GROWTH (trends and wiki up, no news cycle)"
    if trends_up and gdelt_up and not wiki_up:
        return "NEWS_CYCLE (trends and news up, but wiki flat — likely SERP event)"
    if trends_up and wiki_up and gdelt_up:
        return "GROWTH_WITH_NEWS_TAILWIND (all three up — sustained vs spike depends on persistence)"
    if not trends_up and wiki_up:
        return "TRENDS_UNDER_REPORTING (wiki up, trends flat — possible rounding-floor issue)"
    if trends_up and not wiki_up:
        return "TRENDS_SPIKE_NOT_CORROBORATED (proceed with extreme caution)"
    return "FLAT (no significant movement in last 30d vs first 90d)"


if __name__ == "__main__":
    import sys
    from trends_backend import get_backend

    if len(sys.argv) < 3:
        print("Usage: python triangulate.py <query> <wikipedia article title> [geo]")
        sys.exit(1)

    query = sys.argv[1]
    article = sys.argv[2]
    geo = sys.argv[3] if len(sys.argv) > 3 else ""

    backend = get_backend("trendspy")
    result = triangulate(query, article, backend, geo=geo)
    print(f"Query: {result['query']}")
    print(f"Wikipedia: {result['wiki_article']}")
    print(f"Trends max CV across buckets: {result['trends']['max_cv']:.1f}%")
    print(f"VERDICT: {result['verdict']}")
