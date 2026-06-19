---
name: googletrends-mastery
author: Donny (Kevin Chan)
version: 1.0.0
last_updated: 2026-04-27
description: >
  Disciplined Google Trends research methodology. Use whenever the user mentions Google Trends, search trends, trend analysis, breakout queries, topic validation, "is X growing", "is X dying", trend forecasting, RSV (relative search volume), nowcasting, search interest over time, or any question that involves measuring attention to a topic over time. Also trigger for adjacent intents: validating a YouTube video topic, sizing a market, testing a startup thesis, hunting macro signals, or comparing the trajectory of two products/brands/categories. Trigger even on casual phrasings like "is everyone searching for X", "is X still a thing", or "what's blowing up right now". This skill encodes the mechanics, gotchas, tooling, validation pattern, and decision-grade briefing format for treating Google Trends as a noisy share-of-attention proxy rather than a magic crystal ball.
---

# Google Trends Mastery

**Author:** Donny (Kevin Chan) — Singapore, April 2026
**Mantra:** *Direction over magnitude. Triangulate or shut up.*

---

## 0. The One-Page Mental Model

Google Trends is **not** a search-volume meter. It is a **rounded, sampled, renormalized share-of-attention proxy** that measures how a query's share of total Google searches in a (time-window × geography) cell compares to its own peak in that cell. Three things follow immediately, and Codex must encode them as reflexes:

1. **Every value is relative to the chart Codex is currently looking at.** Add a term, remove a term, change the date range, change the geo, change the category — every number rebases. Two charts of "the same query" pulled five minutes apart with different settings are not comparable.
2. **Zero does not mean zero.** It means "below Google's privacy/sampling/rounding floor for this cell." The threshold is undocumented. Treat any 0 as missing data, not absence of interest.
3. **Two pulls of the same exact query return different numbers.** Google samples randomly per request. Single-pull conclusions are statistically indefensible. Average ≥4 pulls for tactical decisions, ≥12 for any quantitative claim (Eichenauer, Indergand, Martínez & Sax, *Economic Inquiry* 2022, showed ~90% variance reduction at n=12).

Beyond those three, Codex must remember: **the data has measurably degraded since 2023** — more zeros, more noise, AI Mode and AI Overviews queries are excluded, and Google deliberately leaves some bot traffic in the dataset to avoid signaling its detection. The pytrends maintainer publicly disavowed his own library in April 2025 with the warning that bot-detected requests get *silently altered data*. Healthy paranoia is the correct default.

---

## 1. The Twelve Gotchas (Memorize These)

| # | Gotcha | Consequence | Mitigation |
|---|---|---|---|
| 1 | 0–100 scale is window/geo/term-set relative | Adding any term renormalizes everything | Hold settings constant across a study; never compare two differently-scoped charts |
| 2 | Rounding floor (zeros mean below threshold) | Low-volume queries appear flat-zero even with real activity | Validate against Wikipedia pageviews (no rounding) |
| 3 | Per-request random sampling | Same query, different numbers each pull | Average ≥4 pulls; report coefficient of variation |
| 4 | 5 groups × up to 25 OR-combined terms | Comparing >5 cohorts breaks | Anchor-batch: include a stable high-volume reference term in every batch, rebase offline |
| 5 | Real-time (≤7d) and non-real-time use *separate* sample pools | Splicing them creates discontinuities | Never mix; pull each window cleanly |
| 6 | Time-window forces aggregation (hourly ≤7d, daily ≤270d, weekly ≤5y, monthly all-time) | Daily aggregated to monthly ≠ directly-pulled monthly | Pick one granularity per study and stick with it |
| 7 | `+` is OR, `"quoted"` is exact phrase, `-` excludes (no space), parentheses unsupported | Silent operator failures | Test operators on a known query before relying on them |
| 8 | Topic (Knowledge Graph entity, `/m/0XXX`) ≠ Search Term | Mixing them in one chart is meaningless | Use Topics for cross-language and longitudinal work; Search Terms for literal SEO |
| 9 | Categories restrict numerator AND denominator | Switching category dramatically changes "popularity" | Use category filtering deliberately; document it in the note |
| 10 | AI Mode and AI Overviews queries are excluded (2024+) | Any AI-related term may be undercounted | Cross-check against Wikipedia for AI topics |
| 11 | Algorithm dynamics (autosuggest, related searches) endogenously change input distribution | The Google Flu Trends failure mode | Re-validate any persistent model annually |
| 12 | Geo-IP attribution overweights urban POPs; Google share <50% in CN/KR/RU | Cross-country comparisons distorted | Use absolute Wikipedia counts as the multilingual triangulation point |

---

## 2. The Tooling Landscape (April 2026)

Codex must know which tools are alive, dead, or dangerous. **As of April 2026:**

| Tool | Status | Use it for | Caveat |
|---|---|---|---|
| **pytrends** | Archived 2025-04-17 | Legacy code only | Maintainer warns bot-detected requests get silently altered data. Avoid. |
| **trendspy** | Active (single maintainer) | Primary free Python backend | Pin version; expect periodic breakage when Google changes layout |
| **trendspyg** | Active (Jan 2026 release) | RSS trending-now, async batching | Treat as alpha; pin minor versions |
| **gtab (G-TAB)** | Inactive (depends on archived pytrends) | **Reference only** for the calibration methodology | Don't depend on the package; replicate the algorithm |
| **Google official Trends API** | Alpha (announced 2025-07-24) | Best data quality if accepted | Application-only, no public pricing, GA timing unknown |
| **SerpApi** | Production | Most reliable paid backend | $75/mo for 5k searches, $0.015 each at low tier |
| **DataForSEO** | Production | Bulk historical pulls | $2.25/1k tasks (queue) or $9/1k (live); ~500k daily cap |
| **Glimpse** | Production | Absolute volume estimates (proprietary calibration) | Vendor black box; enterprise-only API |
| **Exploding Topics** | Production | Discovery feed | Better as inspiration source than numerical truth |
| **trendsmcp.ai** | Production hosted MCP | LLM-agent workflows aggregating ~15 sources | Vendor lock-in; verify claims |
| **Apify Trends actors** | Production | Pay-per-result scraping | $0.0008–$0.05 per keyword |

**Backend abstraction is mandatory.** Any free Trends scraper can be killed by Google in a quarter. Design every Trends consumer with a swappable `TrendsBackend` interface so backend swaps are configuration, not refactor. See `scripts/trends_backend.py` in this skill.

---

## 3. The Triangulation Stack

Trends alone is never enough. Codex must instinctively pair it with at least one corroborating source per investigation. The stack, in priority order:

1. **Wikipedia pageviews** — *the gold standard*. Free, absolute counts (no rounding), deterministic, daily granularity since July 2015, multilingual. If Trends spikes and Wikipedia is flat, the spike is a SERP event, not category emergence. Endpoint: `wikimedia.org/api/rest_v1/metrics/pageviews/per-article/{project}/{access}/{agent}/{title}/{granularity}/{start}/{end}`. Wrap with `mwviews` or call directly with `httpx`.

2. **GDELT 2.0 DOC API** — news volume and tone, updated every 15 min. High GDELT + Trends spike = press cycle, not organic interest. Wrap with `gdeltdoc` (alex9smith, v1.12.0 Apr 2025).

3. **GitHub stars + commit activity** — for any tech term. star-history.com (capped ~40k stars), OSSInsight REST API (free, no auth, 600 req/hr), or direct GitHub stargazers endpoint with `application/vnd.github.v3.star+json` Accept header.

4. **YouTube Studio Research tab** — highest-fidelity creator signal, but only for the user's own channel. Fall back to vidIQ/TubeBuddy estimates (15–25% margin of error) for other channels.

5. **Reddit (PRAW) + HN (Algolia REST)** — qualitative pain-point and adoption signals.

6. **Crunchbase / CB Insights / NFX Signal** — funding momentum for B2B/SaaS terms where buyers don't search.

**The triangulation rule:** never publish a magnitude claim from Trends alone. Quote direction (sign of YoY delta, slope of STL trend component, weeks above 26-week MA) without cross-source confirmation; quote magnitude only when ≥1 corroborating source agrees within an order of magnitude.

---

## 4. The Three Use Cases

### 4a. Content / YouTube topic validation

- **Switch to YouTube Search filter inside Trends** before drawing any creator conclusion. Web-search interest and video-search interest can diverge sharply.
- **Lead-time fingerprints** for memetic trends are 2–6 weeks from first signal to Trends peak (Roman Empire, Moo Deng, Demure, ChatGPT all fit this band). Publish 2–4 weeks ahead of predicted peak, not at peak.
- **The 48–72 hour rule:** trend videos published within 48 hours of velocity spike get 3.8–5× more views than +2-week uploads (Tubular Labs).
- **Evergreen vs spike heuristic:** pull 5-year history. Flat or rising = evergreen. Repeating annual peaks = seasonal evergreen. Single tall spike + decay = fad. Stable baseline + event-driven spikes = hybrid.
- **Top creators don't lead with Trends.** MrBeast watches "the most viewed videos every day" as his neural-network training set. Spotter Studio's Outliers feature scans 2B+ videos for channel-baseline outperformers. Trends is a tactical SEO tool for how-to/education niches, not a thesis-generation tool.

### 4b. Market and startup research

- **High search interest ≠ business viability.** Clubhouse peaked Feb 2021 and lost 92% of downloads in 90 days; a16z led the Series C at the exact peak. NFTs, Metaverse, Web3 — same pattern. Memorize this as the "peak Trends = peak fundraising = onset of collapse" anti-pattern.
- **Category-vs-brand divergence:** when category search precedes brand search, a category is emerging. When brand exceeds category, the brand has captured the category (Zoom > "video conferencing", March 2020).
- **Geographic emergence:** US coastal cities, Singapore, Israel, Stockholm typically lead the rest by weeks-to-months. Track spatial spread velocity.
- **The Ozempic case** is the strongest documented success: exponential RSV growth from March 2018, Spearman 0.96 with prescribing volume by 2026, visible Q4 2021 — well before the institutional Novo Nordisk thesis crystallized.
- **B2B SaaS buyers don't search.** Trends is unreliable for enterprise procurement categories. Use Crunchbase, BuiltWith, and earnings transcripts instead.

### 4c. Investment / macro signal hunting

- **Choi & Varian (2009/2012)** is the canonical recipe: AR(1) baseline + category-level Trends covariates (not raw keywords) as growth rates, evaluated by rolling one-step-ahead MAE vs baseline. Reported 13–18% MAE reduction for unemployment claims and motor-vehicle retail sales.
- **Use Topics or Categories, never single keywords.** OECD's Weekly Tracker uses 215 Trends categories explicitly to avoid the Flu Trends failure mode.
- **Preis et al. (2013)** "326% from 'debt' searches" is an in-sample artifact; Google's renormalization injects look-ahead bias, and out-of-sample replication post-2011 collapses. Don't quote it as alpha.
- **Always benchmark against TWO baselines:** seasonal-naive AND recency-naive ("next week = this week"). Katsikopoulos et al. 2022 showed the recency baseline beat Google Flu Trends over its full run.

---

## 5. The Google Flu Trends Autopsy (Required Reading)

Every Codex response that uses Trends for prediction must implicitly answer the four Lazer-Kennedy-King-Vespignani (2014) questions. **GFT timeline:** Nov 2008 launch in *Nature*; missed H1N1 spring 2009; overshot CDC by ~140% in 2012–2013; *Science* 2014 paper showed it beat CDC in only 8 of 108 weeks from Aug 2011; Google retired it Aug 2015. The four pillars of failure:

1. **Big-data hubris** — treating 50M-query feature pools as a substitute for traditional surveillance rather than a supplement.
2. **Algorithm dynamics** — Google's own autosuggest (2008+), related searches (2011), and health-search redesign (2012) endogenously altered the input distribution.
3. **Overfitting** — selecting 45 of 50M candidate terms against ~1,150 weekly observations guarantees spurious correlations. Some selected terms had no medical relevance ("high school basketball").
4. **Lack of model maintenance and transparency** — annual retraining, undisclosed query lists, near-impossible replication.

**Operational consequence:** any persistent Trends-driven model needs annual re-validation, transparent term lists, and benchmarking against simple recency baselines, or it will silently degrade into noise.

---

## 6. The Validation Pipeline (10 Steps)

For any Trends-based claim Codex makes, the response should reflect this pipeline implicitly. Walk the user through it explicitly when they ask "how confident are you?":

1. **Replicate** — ≥4 pulls, report coefficient of variation, fail if CV > 10% on any displayed bin.
2. **Anchor-calibrate** — G-TAB methodology or known-volume anchor term in every cohort.
3. **Decompose** — STL via `statsmodels.tsa.seasonal.STL` (period=52 for weekly, robust=True). Report trend slope, seasonal amplitude, residual std.
4. **Change-point check** — `ruptures` library, PELT for retrospective, BOCPD for live monitoring.
5. **Persistence check** — does the signal survive at +4w, +12w, +26w? Real categories survive 26 weeks; news spikes don't.
6. **Multi-geo replication** — require ≥2 of {US, UK, AU, CA} (or comparable independent geos for non-English topics) to show parallel movement.
7. **Cross-source corroboration** — at least one of Wikipedia / GDELT / Reddit / GitHub / Amazon / YouTube agrees in direction.
8. **Ground-truth backtest** — vs seasonal-naive AND recency-naive baselines.
9. **Direction over magnitude** — quote magnitude only after anchor calibration on terms above ~1k monthly searches with cross-source agreement within an order of magnitude.
10. **Document caveats explicitly** — source-quality limitations, sample size, alternative explanations considered.

---

## 7. The ICD 203 Briefing Format

Every decision-grade Trends output Codex produces must follow this structure. Borrowed from US Intelligence Community Directive 203 (analytic standards) and Heuer's Analysis of Competing Hypotheses.

```
SUBJECT: [BLUF — bottom line up front, one sentence, the conclusion or required action]

KEY JUDGMENT: [What Codex concludes]
  Likelihood: [almost no chance 1-5% / very unlikely 5-20% / unlikely 20-45% /
               roughly even 45-55% / likely 55-80% / very likely 80-95% /
               almost certain 95-99%]
  Confidence: [LOW / MODERATE / HIGH] based on [source quality, corroboration, methodology depth]

EVIDENCE (3 MECE points):
  1. [Trends finding with replication count and CV]
  2. [Cross-source corroboration]
  3. [Persistence/geographic/baseline validation]

ALTERNATIVE EXPLANATIONS CONSIDERED:
  - Reverse causality: [ruled in/out, why]
  - Algorithmic artifact: [ruled in/out, why]
  - Sampling noise: [ruled in/out, why]
  - News-cycle confound: [ruled in/out, why]

SO WHAT: [Implication for the user's actual decision]
NOW WHAT: [Specific next data point or trigger]

SOURCES & CAVEATS:
  - Trends pulls: [N pulls, dates, geos, windows]
  - Triangulation sources: [list with verdicts]
  - Known limitations: [enumerate honestly]
```

**Likelihood and confidence are different and must never be conflated.** Likelihood is about the world; confidence is about Codex's analysis. "Very likely" with "low confidence" is a valid and important combination.

---

## 8. The Three Internalization Layers

This skill exists to make Trends knowledge stick across three tiers:

**Layer 1: Structured research notes.** Every non-trivial Trends investigation produces a YAML-frontmatter note using the template in `references/note_template.yaml`. The template captures query stack, baseline/anomalies, hypothesis (preferred + alternatives + null in Heuer ACH form), validation sources, decision/action with ICD 203 confidence, and follow-up trigger.

**Layer 2: Durable mental models.** Six models earn permanent space in working memory:
- *The interest stack* — every focal query lives in a constellation of related terms; the stack's shape carries more information than any single term.
- *Category vs brand* — emerging category leads the brand; mature category sees brand exceed category.
- *Seasonality fingerprint* — every query has a characteristic annual pattern; deviations from the fingerprint, not levels, are the signal.
- *Long tail of Related Queries* — early-COVID "loss of smell" lived in the long tail before the headline term.
- *Geographic emergence* — coastal/early-adopter geos lead by weeks to months.
- *Topic over keyword* — Topics aggregate synonyms, translations, morphological variants and survive autosuggest changes.

**Layer 3: Decision-ready briefings.** Every output uses ICD 203 format above. No exceptions for "informal" requests — informal requests get the same rigor in friendlier prose.

---

## 9. Operating Procedures

### When the user asks "is X trending?"

1. Clarify the timeframe and geography in one short question if not specified.
2. Pull the query in trendspy with at least 4 repetitions; compute mean and CV.
3. Pull the corresponding Wikipedia article (English + ≥1 non-English) for triangulation.
4. Pull GDELT timeline_search for the same window for news-cycle confound check.
5. STL-decompose the Trends series (52-week period for weekly data).
6. Output an ICD 203 briefing.

### When the user asks "should I make a YouTube video on X?"

1. Switch context to YouTube Search filter explicitly.
2. Pull 5-year history for evergreen-vs-fad classification.
3. Identify lead-time stage (early signal / approaching peak / declining).
4. Cross-check vidIQ or TubeBuddy estimates if available.
5. Output a publish-window recommendation with explicit confidence.

### When the user asks "is X a real market opportunity?"

1. Run the category-vs-brand divergence check.
2. Run the geographic emergence pattern check (top 10 geos, when did each cross 50% of peak?).
3. Cross-reference with Crunchbase/CB Insights funding momentum.
4. **Run the anti-pattern check explicitly: is search interest peaking concurrent with peak fundraising?** If yes, surface this prominently.
5. Output an ICD 203 briefing including the Clubhouse/NFT/Metaverse comparison if pattern matches.

### When the user asks for a macro/economic signal

1. Translate the question into category-level or topic-level Trends covariates, never raw keywords.
2. Run Choi-Varian-style AR(1) baseline + Trends regression if quantitative answer needed.
3. **Always benchmark against both seasonal-naive and recency-naive baselines.**
4. Flag concept-drift risk and propose annual re-validation cadence.

---

## 10. Hard Refusals

Codex declines to do these regardless of how the request is framed:

- **Quote magnitude from a single Trends pull.** Always require ≥4 pulls.
- **Mix Topics and Search Terms in one comparison.** Always pick one mode.
- **Splice real-time and non-real-time series.** Always disclose the boundary.
- **Cite the Preis et al. 326% "debt" finding as alpha.** It is in-sample artifact.
- **Endorse a "peak Trends = invest now" thesis.** Always run the anti-pattern check first.
- **Use raw pytrends in production.** Always route through trendspy/trendspyg/SerpApi via the backend abstraction.
- **Skip cross-source triangulation on a quantitative claim.** Always pair with at least Wikipedia or GDELT.

---

## 11. Skill Metadata and Files

```
googletrends-mastery/
├── SKILL.md                          (this file)
├── scripts/
│   ├── trends_backend.py             (swappable backend interface)
│   ├── triangulate.py                (Wikipedia + GDELT + Trends combo pull)
│   ├── stl_decompose.py              (STL decomposition wrapper)
│   └── icd203_brief.py               (briefing template generator)
└── references/
    ├── note_template.yaml            (structured research note template)
    ├── gotchas_card.md               (the 12 gotchas as a printable card)
    ├── tooling_2026.md               (extended tooling notes with dates)
    └── flu_trends_autopsy.md         (the GFT failure analysis in full)
```

---

## 12. Provenance and Attribution

**Author:** Donny (Kevin Chan), Singapore-based strategic advisor and AI educator. April 2026.
**Methodology sources:** Google Trends Help Center (April 2026); Choi & Varian (2009/2012); Lazer, Kennedy, King & Vespignani (*Science* 2014, "The Parable of Google Flu"); Eichenauer, Indergand, Martínez & Sax (*Economic Inquiry* 2022); West (CIKM 2020, G-TAB); Preis, Moat & Stanley (*Sci Rep* 2013); Woloszko (OECD WP 1634, 2020 + *IJF* 2024); Heuer & Pherson, *Structured Analytic Techniques* (2014); ODNI Intelligence Community Directive 203.
**Tooling verification:** April 2026 (pytrends archived 2025-04-17; trendspyg v0.4.2 Jan 2026; gdeltdoc v1.12.0 Apr 2025; Google official Trends API alpha announced 2025-07-24, still alpha as of April 2026).

This skill is opinionated by design. Where it disagrees with vendor marketing, trust the skill.
