# Tooling Reference — Verified April 2026

**Author:** Donny (Kevin Chan)

This file documents the verified state of the Trends tooling ecosystem at the
time of skill authorship. It is not auto-updating. Re-verify annually.

---

## Python Trends Backends

### pytrends — DEAD
- Repo: github.com/GeneralMills/pytrends
- Status: **archived 2025-04-17**
- Final release: 4.9.2
- Maintainer warning (Issue #636): bot-detected requests get *silently altered data*
- **Verdict: AVOID in production.**

### trendspy — PRIMARY FREE BACKEND
- PyPI: trendspy
- License: MIT
- Maintainer: single developer
- Status: actively maintained as of early 2025; freshness borderline at time of writing
- Capabilities: full Trends API surface — interest_over_time, related_queries,
  trending_now_showcase_timeline, batch up to 500 keywords with independent normalization
- **Verdict: WRAP as primary. Pin minor version.**

### trendspyg — SECONDARY FREE BACKEND
- PyPI: trendspyg
- Repo: github.com/flack0x/trendspyg
- License: MIT
- Latest release: v0.4.2 (January 2026)
- Capabilities: RSS-based trending-now (~0.7s vs 10s for the explore endpoint),
  async batching, Selenium fallback via Camoufox, CLI export
- **Verdict: WRAP as secondary. Treat as alpha. Pin minor version.**

### gtab (G-TAB) — REFERENCE ONLY
- Repo: github.com/epfl-dlab/GoogleTrendsAnchorBank
- Snyk classification: Inactive
- Depends on archived pytrends → contaminated transitively
- Methodology (West, CIKM 2020) is the academic standard for cross-query absolute calibration
- **Verdict: REFERENCE the algorithm. Do not depend on the package.**

---

## Paid / Hosted Backends

### Google Official Trends API
- Announced: 2025-07-24 (developers.google.com/search/blog/2025/07/trends-api)
- Status as of April 2026: **still in alpha, application-only**
- Differentiator: "consistently scaled" data without per-query renormalization
- Endpoints: Interest Over Time, Top/Trending Searches, Related Queries
- Pricing: not public for alpha; GA timing unknown
- **Verdict: APPLY if data quality is non-negotiable.**

### SerpApi — google_trends engine
- Reliability: production-grade; status at serpapi.com/status/google_trends
- Pricing: $75/mo for 5,000 searches (~$0.015 each), $275/mo for 30,000 ($0.005)
- Cached and errored searches don't count
- Supported data_types: TIMESERIES, GEO_MAP, GEO_MAP_0, RELATED_TOPICS, RELATED_QUERIES
- Separate engine for trending_now
- **Verdict: WRAP as paid fallback. Best public scraping API.**

### DataForSEO Google Trends API
- Two modes: Standard queue $2.25/1k tasks (~45-min latency) or Live $9/1k
- 5 keywords/request, ≤100 tasks per POST, up to 2,000 calls/min
- Web data back to 2004-01-01
- Their separate "DataForSEO Trends API" adds age/gender demographics
- Daily platform cap ~500K
- **Verdict: WRAP for bulk historical pulls.**

### Glimpse
- enterprise.meetglimpse.com/v1/interest_enriched — flagship absolute volume estimation
- Vendor claim: 87–95% backtested forecasting accuracy (not independently audited)
- Pricing: free Chrome extension at 10 lookups/month; consumer ~$99/mo; Enterprise contact-sales
- **Verdict: REFERENCE. Calibration is convenient but vendor-black-box.**

### Exploding Topics
- Owned by Semrush
- API access on $249/mo Business tier
- ~779k+ trends, ML-driven scoring
- **Verdict: Use as discovery feed, not numerical truth.**

### trendsmcp.ai
- Hosted MCP service aggregating ~15+ trend sources
- Pricing: free tier 100 req/day
- **Verdict: Reasonable for LLM-agent workflows. Vendor lock-in risk.**

### Apify Trends actors
- Pay-per-result scraping at $0.0008–$0.05/keyword
- **Verdict: Use for one-off bulk jobs.**

---

## Triangulation Sources

### Wikipedia Pageviews — GOLD STANDARD
- REST endpoint: wikimedia.org/api/rest_v1/metrics/pageviews/per-article
- Free, no auth (User-Agent header required)
- Daily granularity since July 2015
- Multilingual: pull en + de + es + zh of the same topic for built-in geo triangulation
- Python wrapper: mwviews (aging but works) — or call directly with httpx
- **Verdict: PRIMARY corroboration source. Underused by most practitioners.**

### GDELT 2.0 DOC API
- alex9smith/gdeltdoc v1.12.0 (April 2025) — pandas-native wrapper
- Free, no auth
- 15-minute update cadence
- Article volume + average tone (VADER)
- **Verdict: WRAP. Best news-cycle confound check.**

### GitHub Stars + Activity
- star-history.com — SVG/badge embedding only, no JSON API
- OSSInsight REST API — free, 600 req/hr, no Python SDK (write thin httpx)
- Direct GitHub stargazers endpoint with `application/vnd.github.v3.star+json`
- **Verdict: Per-repo via PyGithub or ghapi for <40k stars.**

### YouTube
- google-api-python-client (official, maintenance mode but stable)
- vidIQ / TubeBuddy — 15–25% margin of error vs authenticated data
- **Verdict: Switch to YouTube Search filter inside Trends for creator decisions.**

### Reddit / HN
- PRAW (BSD-2, active through 2025) — handles rate limits automatically
- HN Algolia REST API — no auth, free, very stable
- **Verdict: Both safe to depend on.**

---

## What NOT to depend on

| Tool | Why |
|---|---|
| pytrends | Archived; serves altered data on detection |
| pytrends-async | Inherits pytrends issues |
| Commonists/pageview-api | Last update 2018-07-18; broken on Python 3.10+ |
| andrewlwn77/google-trends-mcp | Ships hardcoded shared RapidAPI key |
| cryptoken/GoogleTrendsMCP | Single-author prototype, no tests |
| donghai88/google-trends-mcp-server | Likely abandoned |
| UBiXY/google-trends-mcp | Naming collision, not real MCP |
| youtube-data-api / youtube-python | 2019-2020 era, stale |

---

## Verification Methodology

When this skill is updated, re-verify by:

1. Check archived/active status on GitHub (look for the archive banner)
2. Check PyPI for last release date (>12 months suggests staleness)
3. Search the maintainer's recent issues for disavowal posts
4. Try one canonical query end-to-end and inspect for plausible output
5. Update the table above with new dates
