# Keyword backends — free vs paid, and the upgrade path

Verified reachable from APC cloud sessions: the free Google suggest endpoint
(`suggestqueries.google.com/complete/search`) returns JSON with no key. That is
the default backend and needs nothing wired.

| Backend | Key/env | Gives you | Does NOT give | Cost | When to use |
|---|---|---|---|---|---|
| `google-suggest` (default) | none | Real phrasing, long tail, FAQ-shaped questions | Search volume, true PAA trees | Free | Default. ~80% of article planning. |
| `serpapi` | `SERPAPI_API_KEY` | True People-Also-Ask + Related Searches | Search volume | ~$75/mo / 5k searches | When you want the real PAA question tree, not the autocomplete proxy. |
| `dataforseo` | `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD` | **Real search volume + difficulty**, related keywords | — | ~$ per 1k tasks | When ranking topics by actual volume matters (priority calls, content calendar sizing). |

## Why backend abstraction (not just a script)

Same reasoning as `googletrends-mastery/tooling_2026.md`: every free scraper can
be throttled or killed by Google in a quarter, and several public "keyword MCP"
repos ship hardcoded shared RapidAPI keys (blacklisted there). Coding every
consumer against the `KeywordBackend` interface means a source swap is one flag,
not a refactor, and we never depend on someone else's leaked key.

## Repos evaluated (June 2026)

- **chukhraiartur/seo-keyword-research-tool** — Autocomplete + PAA + Related
  Searches in one tool. Clean, but SerpApi-paid after the trial key. Used as the
  model for the `serpapi` backend's PAA call. Good reference, not a free runtime.
- **GSC striking-distance pattern** (Search Engine Journal / SEOTesting) — the
  basis for `gsc_striking_distance.py`. Read-only Search Console API, positions
  ~8-20, rank by impressions x position gap.
- **Rejected:** any repo with a hardcoded/shared RapidAPI key, single-author
  prototypes with no tests, and raw-HTML PAA scrapers that break monthly. The
  free autocomplete endpoint is more durable than all of them.

## Network note (cloud/web sessions)

If a future session can't reach `suggestqueries.google.com`, add it to the
environment's allowed network hosts (same place the reddit MCP host is allowed,
per `MCP-SETUP.md`). The endpoint was reachable at skill-authoring time.
