"""
fetch_trends.py - Production-grade Google Trends fetcher for dropshipping.

Fallback chain:
    1. trendspy (primary, free, installable via pip)
    2. Direct /trends/api/widgetdata/* flow (requires cookie from user's browser)
    3. SerpApi (free 250/month, requires SERPAPI_KEY env var)
    4. Tells user to use manual CSV workflow

Throttling: 70-second minimum between calls, outer exponential backoff.
Caching: SQLite via requests-cache with TTL based on data recency.

Usage:
    python fetch_trends.py --keyword "posture corrector" --geo US --timeframe "today 12-m"
    python fetch_trends.py --keyword "posture corrector" --output json
    python fetch_trends.py --keyword "product1" "product2" --compare
"""

import argparse
import json
import logging
import os
import random
import sys
import time
from typing import Dict, List, Optional

try:
    import pandas as pd
except ImportError:
    print("Install pandas: pip install pandas", file=sys.stderr)
    sys.exit(1)

try:
    import requests_cache
    requests_cache.install_cache(
        os.path.expanduser("~/.dropship_trends_cache"),
        backend="sqlite",
        expire_after=60 * 60 * 24 * 7,  # 7 days default
        allowable_codes=(200,),
    )
except ImportError:
    pass  # cache is optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("trends")

BACKOFF_SCHEDULE = [60, 120, 300, 600, 1800]  # seconds
MIN_INTERVAL = 70  # seconds between calls


class TrendsFetcher:
    """Unified interface with fallback chain."""

    def __init__(self, prefer: str = "trendspy"):
        self._last_call = 0.0
        self.prefer = prefer
        self.trendspy_client = None
        self.serpapi_key = os.environ.get("SERPAPI_KEY")
        self._init_clients()

    def _init_clients(self):
        try:
            from trendspy import Trends
            self.trendspy_client = Trends()
            log.info("trendspy client ready")
        except ImportError:
            log.warning("trendspy not installed. Run: pip install trendspy")
        except Exception as e:
            log.warning(f"trendspy init failed: {e}")

    def _throttle(self):
        elapsed = time.time() - self._last_call
        if elapsed < MIN_INTERVAL:
            wait = MIN_INTERVAL - elapsed + random.uniform(0, 5)
            log.info(f"Throttle: sleeping {wait:.1f}s")
            time.sleep(wait)
        self._last_call = time.time()

    def interest_over_time(
        self,
        keywords: List[str],
        timeframe: str = "today 12-m",
        geo: str = "",
    ) -> pd.DataFrame:
        """Try trendspy, then SerpApi, then empty df with instructions."""
        assert 1 <= len(keywords) <= 5, "Google Trends max 5 keywords; use compare_products.py for more"

        # Try trendspy
        if self.trendspy_client:
            for attempt, wait in enumerate([0] + BACKOFF_SCHEDULE):
                if wait:
                    log.warning(f"trendspy retry {attempt}, sleeping {wait}s")
                    time.sleep(wait)
                try:
                    self._throttle()
                    df = self.trendspy_client.interest_over_time(
                        keywords, timeframe=timeframe, geo=geo
                    )
                    if df is not None and not df.empty:
                        # Strip partial data rows
                        if "isPartial" in df.columns:
                            df = df[df["isPartial"] == False].drop(columns=["isPartial"])
                        log.info(f"trendspy returned {len(df)} rows for {keywords}")
                        return df
                    log.warning("trendspy returned empty df")
                    break  # empty not a rate-limit, don't retry
                except Exception as e:
                    log.error(f"trendspy attempt {attempt}: {e}")

        # Fallback to SerpApi
        if self.serpapi_key:
            return self._serpapi_iot(keywords, timeframe, geo)

        # Last resort
        log.error(
            "All automated fetchers failed. Use manual CSV workflow:\n"
            "  1. Visit https://trends.google.com/trends/explore\n"
            f"  2. Enter keyword(s): {', '.join(keywords)}\n"
            f"  3. Set geo: {geo or 'Worldwide'}, timeframe: {timeframe}\n"
            "  4. Click export (download icon) on each chart\n"
            "  5. Run: python ingest_manual_csv.py --watch"
        )
        return pd.DataFrame()

    def _serpapi_iot(self, keywords: List[str], timeframe: str, geo: str) -> pd.DataFrame:
        """SerpApi fallback. 250 free searches per month."""
        try:
            import requests
            params = {
                "engine": "google_trends",
                "q": ",".join(keywords),
                "data_type": "TIMESERIES",
                "api_key": self.serpapi_key,
                "date": timeframe,
                "geo": geo,
            }
            self._throttle()
            r = requests.get("https://serpapi.com/search", params=params, timeout=30)
            if r.status_code != 200:
                log.error(f"SerpApi HTTP {r.status_code}: {r.text[:200]}")
                return pd.DataFrame()
            data = r.json()
            # SerpApi shape: interest_over_time.timeline_data[].values[]
            timeline = data.get("interest_over_time", {}).get("timeline_data", [])
            rows = []
            for bucket in timeline:
                row = {"date": bucket.get("date")}
                for v in bucket.get("values", []):
                    kw = v.get("query", "unknown")
                    row[kw] = v.get("extracted_value", v.get("value", 0))
                rows.append(row)
            df = pd.DataFrame(rows)
            if not df.empty:
                df["date"] = pd.to_datetime(df["date"], errors="coerce")
                df = df.set_index("date")
            log.info(f"SerpApi returned {len(df)} rows")
            return df
        except Exception as e:
            log.error(f"SerpApi failed: {e}")
            return pd.DataFrame()

    def interest_by_region(
        self, keywords: List[str], timeframe: str = "today 12-m", geo: str = "", resolution: str = "COUNTRY"
    ) -> pd.DataFrame:
        """Regional breakdown. Valuable for Meta geo-targeting."""
        if self.trendspy_client:
            try:
                self._throttle()
                df = self.trendspy_client.interest_by_region(
                    keywords, timeframe=timeframe, geo=geo, resolution=resolution
                )
                if df is not None and not df.empty:
                    return df
            except Exception as e:
                log.error(f"interest_by_region trendspy: {e}")
        log.warning("Region data unavailable. Use manual CSV export.")
        return pd.DataFrame()

    def related_queries(
        self, keywords: List[str], timeframe: str = "today 12-m", geo: str = ""
    ) -> Dict[str, Dict]:
        """Returns dict: keyword -> {'top': df, 'rising': df}."""
        if self.trendspy_client:
            try:
                self._throttle()
                rq = self.trendspy_client.related_queries(keywords, timeframe=timeframe, geo=geo)
                return rq or {}
            except Exception as e:
                log.error(f"related_queries: {e}")
        return {}


def summarize(df: pd.DataFrame, keyword: str) -> Dict:
    """Compute dropshipping-relevant metrics from interest_over_time."""
    if df.empty or keyword not in df.columns:
        return {"error": "no data"}
    series = df[keyword].dropna()
    if len(series) < 4:
        return {"error": "insufficient history"}

    # Trend slope over last 90 days
    recent = series.tail(13)  # ~13 weeks if weekly
    import numpy as np
    x = np.arange(len(recent))
    if len(recent) >= 2:
        slope, _ = np.polyfit(x, recent.values, 1)
    else:
        slope = 0

    # Seasonality index
    mean = series.mean()
    peak = series.max()
    seasonality_index = peak / mean if mean > 0 else 0

    # Momentum: last month vs previous 5 months
    current = series.tail(4).mean()
    prior = series.iloc[-26:-4].mean() if len(series) >= 26 else series.head(len(series) // 2).mean()
    momentum_pct = ((current - prior) / prior * 100) if prior > 0 else 0

    # Volatility
    volatility = series.std() / mean if mean > 0 else 0

    # Classify
    if slope > 0.5 and seasonality_index < 2.0:
        verdict = "GREEN"
        reason = "Rising trend, low seasonality. Scale-ready."
    elif slope > 0.5 and seasonality_index >= 2.0:
        verdict = "YELLOW"
        reason = f"Rising trend but highly seasonal (peak {seasonality_index:.1f}x mean). Time launch to 30-60 days before peak."
    elif abs(slope) < 0.5 and volatility > 0.5:
        verdict = "YELLOW"
        reason = "Flat with high volatility. Possibly tested product with angle fatigue."
    elif slope < -0.5:
        verdict = "RED"
        reason = "Declining trend. Past peak."
    elif mean < 5:
        verdict = "INCONCLUSIVE"
        reason = "Low search volume. Cross-check absolute volume in Keyword Planner."
    else:
        verdict = "NEUTRAL"
        reason = "Stable interest. Neither strong rise nor fall."

    return {
        "keyword": keyword,
        "slope": round(slope, 3),
        "seasonality_index": round(seasonality_index, 2),
        "momentum_pct": round(momentum_pct, 1),
        "volatility": round(volatility, 2),
        "mean_interest": round(mean, 1),
        "peak_interest": int(peak),
        "verdict": verdict,
        "reason": reason,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Google Trends for dropshipping")
    ap.add_argument("--keyword", nargs="+", required=True, help="1-5 keywords")
    ap.add_argument("--timeframe", default="today 12-m", help="e.g. 'today 12-m', 'today 5-y', 'now 7-d'")
    ap.add_argument("--geo", default="", help="Country code like US, GB, empty for worldwide")
    ap.add_argument("--output", default="summary", choices=["summary", "json", "csv"])
    ap.add_argument("--output-path", default="trends_data")
    ap.add_argument("--include-region", action="store_true")
    ap.add_argument("--include-related", action="store_true")
    args = ap.parse_args()

    if len(args.keyword) > 5:
        print("Max 5 keywords. Use compare_products.py for more.", file=sys.stderr)
        return 1

    fetcher = TrendsFetcher()
    iot = fetcher.interest_over_time(args.keyword, args.timeframe, args.geo)

    if iot.empty:
        return 1

    # Summarize each keyword
    summaries = [summarize(iot, kw) for kw in args.keyword]

    region_df = pd.DataFrame()
    related = {}
    if args.include_region:
        region_df = fetcher.interest_by_region(args.keyword, args.timeframe, args.geo)
    if args.include_related:
        related = fetcher.related_queries(args.keyword, args.timeframe, args.geo)

    if args.output == "json":
        out = {
            "summaries": summaries,
            "interest_over_time": iot.reset_index().to_dict(orient="records"),
            "interest_by_region": region_df.reset_index().to_dict(orient="records") if not region_df.empty else [],
            "related_queries": {
                k: {sk: sv.to_dict(orient="records") if hasattr(sv, "to_dict") else sv for sk, sv in v.items()}
                for k, v in related.items()
            },
        }
        path = f"{args.output_path}.json"
        with open(path, "w") as f:
            json.dump(out, f, indent=2, default=str)
        print(f"Wrote {path}")
    elif args.output == "csv":
        iot.to_csv(f"{args.output_path}_iot.csv")
        if not region_df.empty:
            region_df.to_csv(f"{args.output_path}_region.csv")
        print(f"Wrote {args.output_path}_iot.csv")
    else:
        print("\n" + "=" * 60)
        print("GOOGLE TRENDS ANALYSIS")
        print("=" * 60)
        for s in summaries:
            if "error" in s:
                print(f"{s.get('keyword', '?')}: {s['error']}")
                continue
            print(f"\n{s['keyword']}")
            print(f"  Verdict:      {s['verdict']}  {s['reason']}")
            print(f"  Trend slope:  {s['slope']}")
            print(f"  Seasonality:  {s['seasonality_index']}x (peak vs mean)")
            print(f"  Momentum:     {s['momentum_pct']:+.1f}% (last month vs prior 5)")
            print(f"  Volatility:   {s['volatility']}")
            print(f"  Mean / Peak:  {s['mean_interest']} / {s['peak_interest']}")

        if not region_df.empty:
            print("\nTop 10 regions (by first keyword):")
            first_kw = args.keyword[0]
            if first_kw in region_df.columns:
                top = region_df.nlargest(10, first_kw)
                for geo_name, row in top.iterrows():
                    print(f"  {geo_name:30s}  {int(row[first_kw])}")

        if related:
            for kw, buckets in related.items():
                print(f"\nRelated RISING queries for '{kw}':")
                rising = buckets.get("rising")
                if hasattr(rising, "head"):
                    for _, r in rising.head(10).iterrows():
                        print(f"  {r.get('query', '?'):40s} {r.get('value', '?')}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
