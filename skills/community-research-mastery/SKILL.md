---
name: community-research-mastery
author: Donny (Kevin Chan)
version: 1.0.0
last_updated: 2026-04-28
description: Voice-of-customer research across Amazon reviews, YouTube and TikTok comments, Quora, forums, and Facebook Groups, Pages, and Marketplace. Trigger on VOC, customer research, pain mining, JTBD, social listening, review mining, demographic or regional demand, what customers complain about, or what sells on marketplace. Defers to reddit skills for Reddit and googletrends-mastery for trends.

---

# Community Research Mastery

## Purpose

Reddit is the gold standard for unfiltered VOC, but it is one source. For some niches Reddit is thin. For others, the most honest customer language lives in 1-star Amazon reviews, in YouTube tutorial comment sections, in TikTok comment threads, on Quora answers, or in tiny subject-specific forums.

This skill is the routing layer. It tells Donny **which source to mine for which question**, runs the multi-source extraction, and produces a unified VOC briefing.

## Source hierarchy

Ranked by signal density for ad-creative VOC mining:

| Tier | Source | Best for |
|---|---|---|
| 1 | Reddit | Pain language, JTBD, niche slang, fake-detector culture |
| 1 | Amazon 1-3 star reviews | Specific product complaints, post-purchase regret, return reasons |
| 2 | YouTube comments under tutorial videos | Pain framed as "I came here because…", workflow context |
| 2 | TikTok comments under viral product videos | Buying-intent objections, FOMO, social proof patterns |
| 3 | Quora | How-to-do-X questions, JTBD made explicit |
| 3 | Niche forums (Reverb, Etsy reviews, AliExpress reviews, gear-specific forums) | Long-tail nichey vocabulary |
| 4 | Facebook (Groups + Pages comments + Marketplace) | Demographic VOC, competitor brand reactions, real-pay demand signal — see `references/facebook_research.md` |

## When to use which source

| Question | Primary source | Secondary |
|---|---|---|
| "What language do customers use for pain X?" | Reddit | Amazon reviews |
| "What goes wrong with this category of product?" | Amazon 1-2 star reviews | Reddit complaint threads |
| "What's the JTBD?" | Quora + Reddit | YouTube comments under tutorial videos |
| "Why do people return this?" | Amazon reviews | Reddit |
| "What objections come up at point of purchase?" | TikTok comments under product ads | Reddit "should I buy" threads |
| "What workflow context do they have?" | YouTube tutorials' comments | Niche forums |
| "What does the demographic actually call this?" | Reddit demographic subs | Niche forums |
| "Is this product getting talked about more this year?" | googletrends-mastery, NOT this skill | — |

## The routing decision tree

```
Is the question about specific product complaints (a specific item, not a category)?
├── YES → Amazon reviews FIRST (search ASIN), then Reddit thread search
└── NO → Continue
    │
    Is the question about pain language / "how do they describe it"?
    ├── YES → reddit-research-mastery (delegate fully)
    └── NO → Continue
        │
        Is the question about how-to / what-to-do-when?
        ├── YES → Quora + YouTube tutorial comments
        └── NO → Continue
            │
            Is it about purchase-moment objections?
            ├── YES → TikTok comments + Amazon Q&A + Reddit "should I buy" threads
            └── NO → Multi-source: run all four (Reddit, Amazon, YouTube, Quora) in parallel
```

## The triangulation protocol

One source = anecdote. Two sources = pattern. Three sources = signal.

Donny does NOT greenlight a creative angle, ad hook, or product test from a single-source finding. Cross-reference before betting budget:

1. **Find the theme on Reddit.**
2. **Confirm in Amazon reviews** — is the same complaint or pain in the 1-3 star reviews of competing products?
3. **Confirm in trend data** — is search interest for the language rising? Use `googletrends-mastery`.

If 2 of 3 confirm → Medium confidence, can test small.
If 3 of 3 confirm → High confidence, can test at scale.
If only 1 confirms → Low confidence, keep researching.

## Tooling

| Tool | What it does |
|---|---|
| `scripts/amazon_reviews.py` | Pulls reviews for a given ASIN via lightweight scraping |
| `scripts/youtube_comments.py` | YouTube Data API v3 wrapper for video comment threads |
| Manual: `quora.com/search?q=<query>` | Quora is anti-scraping; manual review and paste back |
| Delegate: `reddit-research-mastery` `scripts/reddit_backend.py` | Reddit deep dive |
| Delegate: `googletrends-mastery` `scripts/trends_backend.py` | Quantitative trend check |
| Manual: TikTok comments | TikTok actively blocks scraping; use the app/web UI directly |

For sources without scripts (Quora, TikTok, FB Groups), the methodology is pure: run the queries manually, paste relevant content back to Donny for analysis.

## Source-specific gotchas

### Amazon reviews
- The 5-star reviews are noise (often incentivized or vague)
- The 1-2 star reviews are gold (specific, angry, return-trigger language)
- The 3-star reviews are the most balanced and articulate
- Filter by "Most Recent" not "Most Helpful" — old reviews describe a product version that may no longer be sold
- "Verified Purchase" filter is a must
- Vine reviews (look for "Vine Voice" badge) are biased toward positive
- Look at "reviews mentioning [keyword]" on the listing — Amazon's own NLP highlights themes

### YouTube comments
- Top comments are usually engagement-bait, not signal
- Sort by "Newest first" for current sentiment
- Comments under TUTORIAL videos for the problem are richer than comments under product review videos
- Ignore comments that just praise the creator
- The "Read more" gold is in pinned creator replies and the long answer threads under specific questions

### TikTok comments
- Cannot search comments programmatically at scale
- Manual: bookmark the viral video, scroll comments, copy the high-engagement ones
- Look for comments with replies (those got further engagement = the real conversations)
- Watch for "🥺" "💀" "this is so me" — shorthand for emotional resonance

### Quora
- Top answers are written by SEO-driven people, not customers
- The comments under top answers are often more honest than the answer itself
- Quora's quality has degraded post-AI; recent answers are slop. Sort by date and prefer pre-2024 organic content
- Search for `<problem> site:quora.com` on Google for cleaner results than Quora's own search

### Facebook Groups (read-only)
- Mostly closed; cannot scrape; manual only
- For demographic-specific niches (parenting, hobbyist, etc.) groups are richer than Reddit
- DO NOT POST in groups as a research account — admins ban marketers ruthlessly

### Niche forums
- Reverb (musical instruments), TalkBass, EveryGuyGym, MyFitnessPal forums, Garden Web, etc.
- Older internet, more verbose, fewer marketers
- Often the highest signal-to-noise of any source for hobby niches
- Search: `site:<forum>.com "<problem>"` on Google

## Output format

Produces a `VOC briefing` matching the structure in `reddit-research-mastery/references/note_template.yaml`, but with extra fields:

- `sources_used` — which platforms contributed
- `per_source_findings` — pain themes ranked per platform (so you can see if Reddit-only or cross-platform)
- `confidence_overall` — based on triangulation rule above

Save the briefing to `~/research/voc/<niche>-<YYYY-MM-DD>.yaml`. Hand to `dropship-creative-engine` for ad-angle development.

## Source matrix quick reference

See `references/source_matrix.md` for the full lookup table by product category, and `references/cross_reference_protocol.md` for the triangulation discipline.

## Voice

Same as reddit-research-mastery: Singapore operator, no em-dashes, terse. Quote customers verbatim — never sanitize the language. The grit is the value.

## What this skill refuses to do

- Greenlight a creative angle from a single-source finding
- Treat one viral TikTok comment as proof of demand
- Generate fake reviews on any platform
- Plan brigading or vote manipulation
- Recommend buying review packages or fake-comment services
- Skip triangulation because "the Reddit signal looked strong"

## Adjacent skills

- `reddit-research-mastery` — the deep specialist; this skill delegates Reddit-specific work to it
- `googletrends-mastery` — the quantitative confirmation source for any pain theme
- `dropship-product-research` — discovery; this skill validates the language post-discovery
- `dropship-product-evaluation` — scoring; VOC findings feed objection-and-proof analysis
- `dropship-creative-engine` — consumer of the VOC briefing
- `dropship-competitive-intel` — overlap on brand sentiment and competitor reputation
- `ebook-research` — different rigor level; book-grade depth lives there
