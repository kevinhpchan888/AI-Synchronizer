---
name: dropship-trends-intelligence
description: >
  Google Trends data fetching, analysis, and interpretation for dropshipping product research. Use whenever the user mentions Google Trends, search interest, seasonality, regional demand, rising queries, related queries, keyword comparison, trend direction, or any variant of "is this product still trending", "when does this peak", "where should I target geographically based on search interest". Also trigger when the user wants to check if a product's search interest is rising or declining, compare multiple products head-to-head on Google Trends, or export trends data to CSV. The skill treats Google Trends as a CONFIRMATION signal, not primary discovery, and routes discovery questions back to dropship-product-research.
---

# Trends Intelligence Skill

## Core principle

**Google Trends is a lagging confirmation signal, not a discovery signal for dropshipping.** By the time a product shows a clear rising line on Google Trends, it has usually been viral on TikTok for 2 to 8 weeks and Meta CPMs are already bid up by earlier movers. Use Trends to *confirm* what TikTok Creative Center and Meta Ad Library already surfaced, not to *find* products.

Good uses of Google Trends for dropshipping:
- **Seasonality detection** on a 5-year window (Halloween, Christmas, summer, back-to-school)
- **Regional demand mapping** for Facebook and TikTok geo-targeting decisions
- **Search-intent validation** (does anyone actually search the product name?)
- **Head-to-head comparison** of up to 5 keywords on the same normalized scale
- **Rising queries** discovery to surface sub-niches and long-tail angles

Bad uses that waste time:
- Primary product discovery (use TikTok Creative Center via `dropship-product-research`)
- Absolute search volume (Trends is 0-to-100 normalized, not real numbers; use Google Keyword Planner for absolute volume)
- Predicting new viral products (Trends requires accumulated history)

## The free stack in 2026

The flagship Python library `pytrends` was archived April 2025 and now returns potentially manipulated data. The current working stack is:

**Primary: `trendspy`** (the former pytrends maintainer's endorsed successor)
- Install: `pip install trendspy`
- Clean API: `from trendspy import Trends; tr = Trends(); tr.interest_over_time(['keyword'])`
- Covers interest over time, regional breakdown, related queries, trending now
- Single maintainer, low release cadence, but the most reliable free option

**Fallback 1: Direct `/trends/api/widgetdata/*` JSON flow**
- Faster (about 100ms per call vs 5-8s for Playwright)
- Requires cookie and token management
- Used internally by every Trends library
- Documented in `references/direct_api.md`

**Fallback 2: Manual CSV export**
- Zero ban risk, zero maintenance cost, genuinely the best option at 5 to 20 products per week scale
- Auto-ingestion script at `scripts/ingest_manual_csv.py`
- Watches `~/Downloads/` and parses Google's four CSV types

**Fallback 3: SerpApi free tier**
- 250 searches per month permanent free, no credit card
- All five Trends endpoints covered
- Requires env var `SERPAPI_KEY`
- Gated to rare cases where first three paths fail

**Do not use `pytrends` as primary.** It is archived, returns 429 errors on most requests, and the former maintainer's public warning is that Google now tags its traffic as `USER_TYPE_SCRAPER` and returns altered data.

## Scripts in this skill

- `scripts/fetch_trends.py`: main entry point. Uses trendspy with throttling, retries, and caching. Falls through to SerpApi if set.
- `scripts/compare_products.py`: head-to-head comparison of up to 20 products using the pivot-anchor technique to get around the 5-keyword Trends limit.
- `scripts/ingest_manual_csv.py`: watches a folder for Google Trends CSV exports and parses them into a SQLite store.
- `scripts/analyze_dropship_trend.py`: given fetched data, scores a product on trend direction, seasonality, momentum, and volatility. Outputs a dropshipping-specific verdict.

## Dropshipping-specific trend analysis

After fetching data, apply this decision matrix:

| Trend signature | Dropshipping verdict |
|---|---|
| Rising 6-month slope + low seasonality (peak/mean under 2x) | GREEN. Scale-ready, time-independent. |
| Rising 6-month slope + high seasonality | YELLOW. Time the launch to 30-60 days before peak. |
| Flat with moderate volatility | YELLOW. Tested product, possible angle fatigue, needs fresh creative. |
| Single sharp spike then return to baseline | RED. Hype or event-driven, not durable. Examples: Dodgers World Series hats, one-off virals. |
| Declining 6-month slope | RED. Past peak. Skip unless early holiday seasonal. |
| Flat at near-zero | RED or inconclusive. Either no demand or below Google's reporting threshold. Cross-check absolute volume in Keyword Planner. |
| Breakout label (5000%+ growth) | SUSPICIOUS. Often artifact of starting near zero. Verify with Meta Ad Library long-runners. |

Key metrics to compute from `interest_over_time`:

- **Trend slope (last 90 days)**: linear regression. Positive = rising, negative = declining.
- **Seasonality index**: max(12mo) / mean(12mo). Over 2.0 = highly seasonal.
- **Momentum**: recent 30-day mean vs prior 6mo mean, as percentage change.
- **Volatility**: std / mean over 12 months. High = noisy, hard to predict.
- **Partial-data exclusion**: always strip the `isPartial = True` row from trendspy output. The current period is an incomplete estimate.

## Regional demand for Facebook geo-targeting

The `interest_by_region` data (country or subdivision level) is genuinely useful for Meta ad set geo-targeting. Workflow:

1. Pull country-level `interest_by_region` for the product keyword.
2. Rank top 10 countries by score.
3. Cross-reference with Meta CPM benchmarks (see `dropship-product-evaluation`).
4. Target the intersection of "high interest" and "affordable CPM".

Common pattern: a product shows 100 in Philippines and 45 in US. Philippines has lower CPMs and AOVs. Test strategy: launch in PH for cheap testing, then scale winners to US.

## Rising queries for ad copy and angle discovery

The `related_queries` output has two buckets: `top` (established) and `rising` (breakout).

- **`top`** queries show what terms the same audience already searches. Use these for keyword expansion, blog SEO, and wording in ad copy.
- **`rising`** queries with "Breakout" or 5,000%+ label are early signal. Use these to find sub-niches and test fresh angles before competitors notice.

Example: product is "posture corrector". Rising queries might include "posture corrector for office", "posture corrector women", "gym posture corrector". Each is a potential ad angle with lower competition than the main keyword.

## Running and caching

The production pattern (built into `scripts/fetch_trends.py`):

- 70-second minimum interval between requests (below this, 429 rate limits are near-certain)
- Outer exponential backoff: 60, 120, 300, 600, 1800 seconds
- SQLite cache via `requests-cache` with 30-day TTL for historical windows, 1-hour TTL for current-period data
- Never run this from AWS, GCP, or Azure IPs. They are effectively pre-banned. Run from user's home IP or residential proxy.

## The pivot-anchor technique (for comparing more than 5 keywords)

Google Trends limits each request to 5 keywords. To compare 10, 20, or more on the same scale:

1. Pick one common anchor keyword with mid-range volume.
2. Split the full list into batches of 4.
3. Query each batch with the anchor: [anchor, kw1, kw2, kw3, kw4], then [anchor, kw5, kw6, kw7, kw8], etc.
4. For each batch, rescale all values by `base_anchor_mean / this_batch_anchor_mean`.
5. Now all keywords are on the same normalized scale.

Implemented in `scripts/compare_products.py`.

## Manual CSV fallback (the unglamorous correct answer)

For 5 to 20 products per week, manual CSV is often the best option:

1. Visit `trends.google.com/trends/explore` with canonical query parameters bookmarked.
2. Click the four export buttons: Interest Over Time, Regional, Related Topics, Related Queries.
3. Four CSVs download to `~/Downloads/`: `multiTimeline.csv`, `geoMap.csv`, `relatedQueries.csv`, `relatedEntities.csv`.
4. Run `python scripts/ingest_manual_csv.py --watch` to auto-parse into SQLite.

This takes 20 to 30 minutes per week, has zero ban risk, and gets real (non-manipulated) data. For a solo dropshipper doing 5 to 20 weekly checks, this is genuinely better than automation.

## Do not

- Present Google Trends data as primary signal for product discovery. Always note it is confirmation.
- Claim a "breakout" label is a buy signal. Breakout just means over 5,000% growth, which is usually an artifact of starting from near-zero.
- Treat the current period's data point as real. It is partial and labeled with a dotted line in Google Trends UI. The scripts strip `isPartial = True` automatically; do not override.
- Report pytrends data as reliable. The library is archived and the former maintainer publicly warned Google now manipulates its response.
- Compare normalized scores across unrelated queries without a common anchor. A value of 100 for "phone case" does not represent the same volume as 100 for "yoga mat".
