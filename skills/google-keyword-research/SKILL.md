---
name: google-keyword-research
author: Kevin Chan (AMVPC)
version: 1.0.0
last_updated: 2026-06-17
description: L1 keyword-demand layer for APC SEO using free Google autocomplete (SerpApi or DataForSEO optional). Trigger on keyword research, autocomplete, People Also Ask, long-tail keywords, search demand, striking distance, content gap, rank this article, or planning any APC article. Feeds briefs to apc-article-ops; pairs with reddit-mcp and googletrends-mastery.

---

# Google Keyword Research — the L1 demand layer

**Mantra:** *Demand decides what to write. Truth (GSC) decides what to fix.*

This skill is the missing **L1** that `apc-article-ops` (article-playbook §0a)
already expects: tools `expand_autocomplete`, `extract_paa_related`,
`cluster_and_score`, `keyword_research_full`. It is the demand half of the loop.
Never ship L1 without L2 (volume with no language) or L2 without L1 (language
with no demand).

## The three-layer ranking loop

| Layer | Source | Question it answers | How to run |
|---|---|---|---|
| **L1 demand** | Google autocomplete (free) / SerpApi / DataForSEO | What do people type? What FAQ wording? | `keyword_backend.py` (this skill) |
| **L2 voice** | reddit-mcp + reddit-research-mastery | What words/objections do real caregivers use? | MCP, agent-driven (seed r/AgingParents, r/CaregiverSupport, r/eldercare; n=3) |
| **L3 direction** | googletrends-mastery | Is the topic rising, evergreen, or dying? | skill, agent-driven (>=4 pulls, CV<10%) |

Then `brief.py` fuses the three into an article-opportunity brief with the
`google_signal:` / `reddit_signal:` / `trend_signal:` frontmatter and the
Four-Test Title scorecard that `apc-article-ops` upserts to Selldone.

And separately, the ranking-TRUTH loop: `gsc_striking_distance.py` reads Google
Search Console to find articles already ranking on page 1-bottom / page 2. On an
established site that is the single highest-ROI move — refresh those, don't spin
new ones.

## Files

```
google-keyword-research/
  scripts/
    keyword_backend.py        # L1 engine: expand -> cluster -> score (FREE, no key)
    brief.py                  # L1(+L2+L3 notes) -> apc-article-ops brief
    gsc_striking_distance.py  # ranking-truth: page-2 articles to refresh (needs GSC creds)
  references/
    backends.md               # free vs paid backend tradeoffs + upgrade path
```

## The standard workflow (run this for any new or refreshed article)

1. **L1 — mine demand (free, now):**
   ```
   python scripts/keyword_backend.py "guardianship vs conservatorship" --geo US --json > kw.json
   ```
   Reads the top clusters + FAQ-ready questions. The **primary keyword** and the
   FAQ block come from here.

2. **L2 — mine voice (reddit-mcp):** seed the known caregiver subs, fetch comment
   trees, triangulate n=3. The **hook** comes from the verbatim trigger; body
   objections and FAQ from the points. Capture the permalink (no URL, no finding).

3. **L3 — confirm direction (googletrends-mastery):** is the topic rising or
   evergreen? A dying topic is a skip. >=4 pulls, CV<10%, triangulate vs Wikipedia.

4. **Fuse into a brief:**
   ```
   python scripts/brief.py kw.json \
     --reddit "verbatim hook; n=3 across subs" --reddit-url "https://reddit.com/..." \
     --trend "rising/evergreen, CV<10%" --category 7926
   ```
   Hand the brief to `apc-article-ops`. The title still must score 4/4 on
   Hook/Specificity/Action/SEO before publish — the brief only guarantees the
   primary keyword is front-loaded and the FAQ wording is real.

5. **Refresh what already ranks (weekly):**
   ```
   python scripts/gsc_striking_distance.py --site https://agingparent.care/ --days 28
   ```
   Take each striking-distance query, re-mine it in step 1 for the long tail the
   live article is missing, and update that article. Do not create a duplicate.

## Backends (free first, pay only when you need numbers)

- **`google-suggest` (default, free, no key)** — real phrasing + long tail + FAQ
  wording. No search volume. This covers ~80% of article-planning need.
- **`serpapi`** — adds true People-Also-Ask trees and Related Searches. Set
  `SERPAPI_API_KEY`. Modeled on `chukhraiartur/seo-keyword-research-tool`.
- **`dataforseo`** — the only backend with **real search volume + difficulty**.
  Set `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`. Wire when you need to rank
  topics by actual volume, not the demand-shape heuristic.

Swapping is one flag: `--backend serpapi`. Same discipline as
`googletrends-mastery/trends_backend.py` — composition over dependency, because
any free scraper can be killed in a quarter.

## Hard rules

- **The score is a heuristic, not search volume.** It blends cluster breadth and
  decision/commercial intent. Say so. For real volume, use `dataforseo`.
- **Never ship L1 alone.** Demand without caregiver language produces academic
  articles that bounce. Pair with reddit-mcp every time.
- **Use the verbatim question wording** from autocomplete/PAA in FAQ blocks —
  those are literal searches and feed featured snippets / AI Overviews.
- **On an established site, refresh beats publish.** Run the GSC striking-distance
  loop before writing anything new.
- **All output is APC prose.** Briefs feed `apc-article-ops`, which enforces the
  writing-well -> human-prose -> human-pro pipeline and the banned-words list.
```
