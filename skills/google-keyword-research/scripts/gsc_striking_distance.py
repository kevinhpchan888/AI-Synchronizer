"""
gsc_striking_distance.py — the ranking-TRUTH loop for agingparent.care.

Keyword discovery (keyword_backend.py) tells you what to write. Google Search
Console tells you where you ACTUALLY rank — the only ground truth that matters.
The highest-ROI SEO move on an established site is not new articles, it is
pushing "striking distance" queries (avg position ~8-20, i.e. page 1 bottom /
page 2) up onto page 1: the demand already exists and Google already trusts the
page, so a content refresh + internal links converts impressions you're already
getting into clicks.

This is the standard GSC striking-distance pattern (Search Engine Journal /
SEOTesting), adapted to APC. It needs read-only Search Console API access.

SETUP (one time):
  1. In Google Cloud, enable "Google Search Console API".
  2. Create a service account, download its JSON key.
  3. In Search Console, add the service-account email as a (restricted) user
     on the agingparent.care property.
  4. pip install google-api-python-client google-auth
  5. export GSC_CREDENTIALS=/path/to/service-account.json
  6. python gsc_striking_distance.py --site https://agingparent.care/ --days 28

Output: queries ranking in positions 8-20 with real impressions but weak CTR —
ranked by opportunity (impressions * position gap). Each row is a refresh target.
Pair the winners back into keyword_backend.py to mine the long tail you're
missing, then update the existing article (do NOT spin a new one).
"""

from __future__ import annotations

import json
import os
import sys
from datetime import date, timedelta

# Striking-distance band: ranking just off page 1. Below 8 = already winning;
# above 20 = usually needs more than a refresh.
POS_MIN = 8.0
POS_MAX = 20.1


SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]


def _client(credentials_path: str | None = None):
    """Build the Search Console client from EITHER a key file path
    (GSC_CREDENTIALS, for local/desktop runs) OR the key JSON content inline
    (GSC_CREDENTIALS_JSON, for cloud/CI where there is no file on disk)."""
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError as e:
        raise RuntimeError(
            "pip install google-api-python-client google-auth") from e

    inline = os.environ.get("GSC_CREDENTIALS_JSON")
    path = credentials_path or os.environ.get("GSC_CREDENTIALS")
    if inline:
        creds = service_account.Credentials.from_service_account_info(
            json.loads(inline), scopes=SCOPES)
    elif path:
        creds = service_account.Credentials.from_service_account_file(
            path, scopes=SCOPES)
    else:
        raise RuntimeError(
            "No credentials: set GSC_CREDENTIALS (file path) or "
            "GSC_CREDENTIALS_JSON (the key JSON content, for CI).")
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def striking_distance(site: str, days: int = 28,
                      credentials_path: str | None = None) -> list[dict]:
    svc = _client(credentials_path)
    end = date.today() - timedelta(days=2)        # GSC lags ~2 days
    start = end - timedelta(days=days)
    rows = []
    start_row = 0
    while True:
        resp = svc.searchanalytics().query(siteUrl=site, body={
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "dimensions": ["query", "page"],
            "rowLimit": 25000,
            "startRow": start_row,
        }).execute()
        batch = resp.get("rows", [])
        rows.extend(batch)
        if len(batch) < 25000:
            break
        start_row += 25000

    out = []
    for r in rows:
        pos = r.get("position", 99)
        if not (POS_MIN <= pos <= POS_MAX):
            continue
        impressions = r.get("impressions", 0)
        clicks = r.get("clicks", 0)
        ctr = r.get("ctr", 0.0)
        query, page = r["keys"][0], r["keys"][1]
        # opportunity: lots of impressions you're NOT converting, weighted by how
        # far the position has to climb to reach the top of page 1.
        opportunity = round(impressions * (pos - 3) / 10.0, 1)
        out.append({
            "query": query, "page": page,
            "position": round(pos, 1), "impressions": impressions,
            "clicks": clicks, "ctr": round(ctr * 100, 2),
            "opportunity": opportunity,
        })
    out.sort(key=lambda x: x["opportunity"], reverse=True)
    return out


def _main(argv: list[str]) -> int:
    site = None; days = 28; as_json = False; top = 30
    i = 0
    while i < len(argv):
        a = argv[i]
        if a in ("-h", "--help"):
            print(__doc__); return 0
        elif a == "--site": site = argv[i + 1]; i += 2
        elif a == "--days": days = int(argv[i + 1]); i += 2
        elif a == "--top": top = int(argv[i + 1]); i += 2
        elif a == "--json": as_json = True; i += 1
        else: i += 1
    if not site:
        print("--site https://agingparent.care/ required (see header for setup)")
        return 2
    rows = striking_distance(site, days=days)[:top]
    if as_json:
        print(json.dumps(rows, indent=2)); return 0
    print(f"\nStriking-distance queries for {site} (last {days}d, pos {POS_MIN}-{POS_MAX:.0f})")
    print("Refresh the page + add internal links; re-mine the query in keyword_backend.py.\n")
    print(f"{'opp':>7}  {'pos':>5}  {'impr':>6}  {'ctr%':>5}  query  ->  page")
    for r in rows:
        print(f"{r['opportunity']:>7}  {r['position']:>5}  {r['impressions']:>6}  "
              f"{r['ctr']:>5}  {r['query']}  ->  {r['page']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(_main(sys.argv[1:]))
