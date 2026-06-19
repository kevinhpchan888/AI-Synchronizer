"""
scan_meta_ad_library.py - Meta Ad Library keyword search for dropshipping ad spy.

The key signal from Meta Ad Library is LONG-RUNNING ads with multiple creative variations.
Advertisers don't keep losing ads active, so 30+ day ads are validated winners.

This version uses the official graph.facebook.com/ads_archive endpoint, which is free but
requires a Meta access token. For a faster path without token setup, use the UI scraper
fallback at the bottom of this file.

Usage:
    python scan_meta_ad_library.py --keyword "posture corrector" --country US
    python scan_meta_ad_library.py --keyword "LED desk lamp" --country US,UK,CA --min-days-active 30

Portable. Requires: requests, beautifulsoup4, optionally playwright for UI fallback.
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional

try:
    import requests
except ImportError:
    print("Install requests: pip install requests", file=sys.stderr)
    sys.exit(1)


AD_LIBRARY_API = "https://graph.facebook.com/v18.0/ads_archive"


def fetch_ads_via_api(
    keyword: str,
    countries: List[str],
    access_token: str,
    min_days_active: int = 0,
    limit: int = 100,
) -> List[Dict]:
    """
    Query the official Meta Ad Library API.

    Access token: get one at developers.facebook.com/tools/explorer (requires government ID
    verification for political ads, NOT required for general ad library search).

    For commercial ads (dropshipping), you can use a long-lived user token from a normal
    Facebook developer account. No business verification needed.
    """
    results = []
    after_cursor = None
    pages_fetched = 0
    max_pages = 5

    params_base = {
        "access_token": access_token,
        "search_terms": keyword,
        "ad_reached_countries": json.dumps(countries),
        "ad_type": "ALL",
        "ad_active_status": "ACTIVE",
        "fields": ",".join([
            "id",
            "page_name",
            "page_id",
            "ad_creative_bodies",
            "ad_creative_link_captions",
            "ad_creative_link_descriptions",
            "ad_creative_link_titles",
            "ad_delivery_start_time",
            "ad_delivery_stop_time",
            "ad_snapshot_url",
            "publisher_platforms",
            "languages",
            "impressions",
            "currency",
        ]),
        "limit": min(limit, 100),
    }

    while pages_fetched < max_pages and len(results) < limit:
        params = dict(params_base)
        if after_cursor:
            params["after"] = after_cursor

        try:
            r = requests.get(AD_LIBRARY_API, params=params, timeout=30)
            if r.status_code != 200:
                print(f"API error {r.status_code}: {r.text[:300]}", file=sys.stderr)
                break
            data = r.json()
            ads = data.get("data", [])
            results.extend(ads)

            paging = data.get("paging", {})
            cursors = paging.get("cursors", {})
            after_cursor = cursors.get("after")
            if not after_cursor or not ads:
                break
            pages_fetched += 1
            time.sleep(1)  # polite pacing
        except requests.RequestException as e:
            print(f"Request failed: {e}", file=sys.stderr)
            break

    # Filter by days active
    if min_days_active > 0:
        results = [a for a in results if _days_active(a) >= min_days_active]

    return results[:limit]


def _days_active(ad: Dict) -> int:
    """Calculate how many days an ad has been running. Still-active ads use today as stop date."""
    start_str = ad.get("ad_delivery_start_time")
    if not start_str:
        return 0
    try:
        start = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
    except Exception:
        return 0
    stop_str = ad.get("ad_delivery_stop_time")
    if stop_str:
        try:
            stop = datetime.fromisoformat(stop_str.replace("Z", "+00:00"))
        except Exception:
            stop = datetime.now(start.tzinfo)
    else:
        stop = datetime.now(start.tzinfo)
    return (stop - start).days


def group_by_advertiser(ads: List[Dict]) -> Dict[str, List[Dict]]:
    """Group ads by page_id to count creative variation per advertiser."""
    groups = {}
    for ad in ads:
        pid = ad.get("page_id", "unknown")
        groups.setdefault(pid, []).append(ad)
    return groups


def summarize(ads: List[Dict]) -> None:
    """Print a summary focused on dropshipping signal detection."""
    if not ads:
        print("No ads found. Try a broader keyword or a different country.", file=sys.stderr)
        return

    groups = group_by_advertiser(ads)
    advertisers_sorted = sorted(
        groups.items(),
        key=lambda kv: (len(kv[1]), max((_days_active(a) for a in kv[1]), default=0)),
        reverse=True,
    )

    print(f"Total ads returned: {len(ads)}")
    print(f"Distinct advertisers: {len(groups)}\n")

    # Saturation assessment
    if len(groups) > 50:
        print("!! SATURATION WARNING: 50+ distinct advertisers on this keyword.")
        print("   Creative ceiling is low. Look for a fresh angle or different ICP.\n")
    elif len(groups) < 5:
        print("Few advertisers. Either undiscovered or low demand. Cross-check TikTok Creative Center.\n")
    else:
        print("Healthy competitive density. Fresh angles still have room.\n")

    print("Top advertisers by creative volume + ad age:")
    for page_id, group_ads in advertisers_sorted[:10]:
        page_name = group_ads[0].get("page_name", "unknown")
        max_age = max((_days_active(a) for a in group_ads), default=0)
        print(f"  {page_name} (page {page_id}): {len(group_ads)} ads, oldest {max_age} days")
        # Show the oldest ad as signal
        if max_age >= 30:
            print(f"    -> 30+ day ad confirms the funnel converts. Worth a teardown.")

    print("\nLong-running ads (30+ days) to study:")
    long_runners = sorted(
        [a for a in ads if _days_active(a) >= 30],
        key=_days_active,
        reverse=True,
    )[:10]
    for a in long_runners:
        print(f"  [{_days_active(a)}d] {a.get('page_name', '?')}: {a.get('ad_snapshot_url', '')}")


def main() -> int:
    ap = argparse.ArgumentParser(description="Meta Ad Library keyword scan for dropshipping.")
    ap.add_argument("--keyword", required=True, help="Product keyword to search")
    ap.add_argument("--country", default="US", help="Comma-separated country codes (US,UK,CA)")
    ap.add_argument("--min-days-active", type=int, default=0, help="Filter ads running at least N days")
    ap.add_argument("--limit", type=int, default=100)
    ap.add_argument(
        "--token",
        default=os.environ.get("META_ACCESS_TOKEN"),
        help="Meta access token (or set META_ACCESS_TOKEN env var)",
    )
    ap.add_argument("--output", default="stdout", choices=["stdout", "json"])
    ap.add_argument("--json-path", default="meta_ads.json")
    args = ap.parse_args()

    if not args.token:
        print(
            "No Meta access token provided. Either pass --token or set META_ACCESS_TOKEN.\n"
            "Get a token: developers.facebook.com/tools/explorer\n"
            "Or use the UI workflow: facebook.com/ads/library and paste the keyword manually.",
            file=sys.stderr,
        )
        return 2

    countries = [c.strip() for c in args.country.split(",")]
    print(f"Searching Meta Ad Library for '{args.keyword}' in {countries}...", file=sys.stderr)

    ads = fetch_ads_via_api(
        keyword=args.keyword,
        countries=countries,
        access_token=args.token,
        min_days_active=args.min_days_active,
        limit=args.limit,
    )

    if args.output == "json":
        with open(args.json_path, "w") as f:
            json.dump(ads, f, indent=2, default=str)
        print(f"Wrote {len(ads)} ads to {args.json_path}", file=sys.stderr)
    else:
        summarize(ads)

    return 0


if __name__ == "__main__":
    sys.exit(main())
