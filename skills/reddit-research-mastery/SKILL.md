---
name: reddit-research-mastery
author: Donny (Kevin Chan)
version: 1.0.0
last_updated: 2026-04-28
description: Disciplined Reddit research methodology for voice-of-customer mining, pain-point extraction, JTBD discovery, ad-angle harvesting, and competitor sentiment for a Singapore-incorporated Meta-ads-only Shopify dropshipper. Use whenever the user mentions Reddit, subreddit, r/, voice of customer, VOC, pain points, JTBD, customer language, ad angles, market research, niche slang, sentiment, fake reviews, astroturf, social listening, "what do people think about X", "find pain points", "what are people saying", "how do people describe X", competitor reviews, or wants to harvest copy/hooks from real users. Treats Reddit as the gold-standard unfiltered-talk source for ad creative inputs and refuses to confuse upvotes with demand.
---

# Reddit Research Mastery

## What this skill is for

Reddit is the closest thing to a free focus group on the internet. People say things there that they would never say to a survey, a friend, or a YouTuber. For a dropshipper running Meta ads, Reddit answers three questions that no other source answers as cleanly:

1. **What words do real customers use?** (raw language for hooks, headlines, ad copy)
2. **What pain are they actually feeling?** (the JTBD beneath the product)
3. **What objections, fears, and skepticism will they bring?** (so the creative pre-empts them)

Reddit does NOT answer "is this product going to sell" — that is what Meta tests are for. Treat Reddit as a **language and pain-mining source**, not a demand-validation source.

## Core doctrine

### The Joanna Wiebe principle

Best-converting copy is not written, it is **mined**. Customers describe their problems in words that founders and marketers cannot invent from scratch. Your job on Reddit is to be a stenographer first and a writer second. The phrase you find in a 4-upvote comment buried in a r/skincareaddiction thread will outperform a clever line you wrote at your desk.

### The Schwartz "enter the conversation" principle

The customer is already having a conversation in their own head. Your ad either joins that conversation or interrupts it. Reddit lets you read the conversation verbatim before you write anything.

### The "n=3" rule

One Redditor saying something is an anecdote. Three Redditors in three different threads using the same phrasing is a signal. Never build a creative around a single comment. Triangulate.

### The astroturf assumption

Any product subreddit (r/<brand>, r/<niche>) with more than 50k subscribers has marketing inside it. Vendor accounts. Affiliate accounts. Mods who own competing stores. Treat enthusiastic posts about specific brands as suspect. Treat **complaints** as more reliable than praise — nobody pays people to complain.

## When to invoke this skill

| User says | Trigger |
|---|---|
| "I need ad angles for X" | Yes — mine pain language |
| "What do people complain about with Y?" | Yes — direct VOC question |
| "Is X trending?" | No — that's `googletrends-mastery` or `dropship-trends-intelligence` |
| "Should I sell X?" | No — that's `dropship-product-evaluation` |
| "Give me a hook for this product" | Yes — Reddit is where hooks come from |
| "What are reviewers saying?" | Maybe — Amazon reviews may be better; route via `community-research-mastery` |
| "What's the JTBD here?" | Yes |
| "Find me niche slang for X" | Yes |
| "Is this brand legit?" | Yes — Reddit reputation check |

## The research workflow

### Step 1 — Subreddit discovery

You are looking for the **3-7 subreddits where the actual customer lives**. Not the obvious one. The obvious one is usually too broad and too marketed-to.

Method:
1. Start with the obvious sub (e.g., for posture correctors → r/posture). This is your seed.
2. Read 20 posts. Note which OTHER subs are mentioned in comments ("I asked about this in r/X and they said…").
3. Use `site:reddit.com "<product category>"` Google search and look at which subs surface in the top 30 results.
4. Use `scripts/reddit_backend.py search "<query>"` to get a JSON dump of search hits across Reddit, then count subreddit frequency.
5. Look at niche-adjacent subs: r/AskReddit threads on the topic, r/BuyItForLife, r/<gender>fashion, r/<age-group>, r/AskOldPeople, r/AskWomen, r/AskMen.

Aim for the sub where people **already have the problem your product solves but don't know your product exists yet**. That sub is gold. The sub that is full of people debating which brand to buy is silver — they're already shopping.

### Step 2 — Post selection

Not every post is signal. Filter brutally:

**High signal:**
- "I've been struggling with X for years and finally…" (long-form pain narrative)
- "Why does X always Y?" (the rant — pure pain language)
- "Looking for advice on X" (JTBD made explicit)
- "Update: X year later" (long-term outcome — informs guarantee/risk-reversal copy)
- Comments under highly-upvoted posts (less curated than top-level posts)

**Low signal:**
- "Look at my X" (show-and-tell, no pain)
- News articles, mod posts, meme posts
- Anything with "[OC]" in the title (creator self-promo)
- Posts with vendor accounts in the comments (check user history)

### Step 3 — Pain pattern extraction

Hunt for these linguistic patterns. Use `scripts/pain_extract.py` to bulk-extract them from a comment dump:

| Pattern | What it gives you |
|---|---|
| "I hate when…" / "I can't stand…" | Pure pain — the visceral language that hooks |
| "I wish there was a…" | Unmet need — the JTBD made explicit |
| "I tried X and Y and Z and none of them…" | Failed alternatives — your differentiation |
| "It's like / it feels like…" | Metaphors — the gold for headlines |
| "Has anyone else…" | Validation-seeking — fear and isolation language |
| "I'm so tired of…" | Frustration — emotional intensity, scaling readiness |
| "Why does no one talk about…" | Hidden problem — opportunity for a category-defining angle |
| "If only…" | Desired state — your post-purchase promise |
| "Don't waste your money on…" | Negative review distilled — defensive copy fodder |

### Step 4 — Objection mining

Reddit is also where you find **what will kill your conversion rate before it happens**. Hunt for:

- "I almost bought X but then I found out…" (the dealbreaker)
- "Looks like a scam because…" (trust signals you'll need)
- "$X for that? You can get the same thing on AliExpress for $Y" (the price objection — pre-empt with framing, not discount)
- "Does this actually work?" / "Is this another gimmick?" (skepticism — pre-empt with proof)
- "What about [side effect / risk]?" (compliance and disclaimer fodder)

Every objection you find on Reddit should have a corresponding answer on your product page or in your ad creative.

### Step 5 — Language harvest

For each thread you mine, extract three categories:

1. **Hook phrases** — opening lines that could become ad hooks. 3-12 words. Keep verbatim.
2. **Metaphors and analogies** — "it feels like sandpaper", "it's like a hug for my back", "like trying to read with sunglasses on at night"
3. **Specific nouns** — the actual brand names, product types, anatomical terms, slang the customer uses (NOT the marketer-speak version)

Save these in the briefing format (see `references/note_template.yaml`).

### Step 6 — Triangulate before deploying

A pattern you found on Reddit should be cross-referenced before you bet creative budget on it:

- **Google Trends** — is search interest for the pain language rising? Use `googletrends-mastery`.
- **Amazon reviews** — do reviews of competing products echo the same complaint? Use `community-research-mastery`.
- **YouTube comments** — under tutorial videos for the problem, do commenters use the same words?

One source = anecdote. Two = pattern. Three = signal worth testing.

## Subreddit taxonomy quick map

See `references/subreddit_taxonomy.md` for the full list. The short version:

- **Pain-rich subs:** r/AskReddit, r/AskWomen, r/AskMen, r/AskOldPeople, r/Adulting, r/socialskills, r/relationships
- **Niche-specific subs:** find these per product category
- **Buying-decision subs:** r/BuyItForLife, r/whatisthisthing, r/HelpMeFind, r/findfashion
- **Skeptic subs:** r/scams, r/dropship (yes, customers read this), r/Anticonsumption
- **Demographic subs:** r/Tall, r/petite, r/AsianBeauty, r/<country>, r/<age>

## Mod rules and self-promo line

Donny does NOT promote on Reddit. Period. Reddit's mods will detect and shadowban any account that posts links to a Shopify store, and the value of Reddit as a research tool collapses if your accounts get banned.

Allowed:
- Read-only research with no account, or with a research-only account that never posts
- Asking genuine questions on a research account if needed (no product mentions)

Not allowed:
- Posting product links
- Recruiting UGC creators in subs
- Replying to "what should I buy" threads with your product
- Anything that could be detected as marketing — mods are aggressive and other Redditors will dox you

If you want to be in the conversation, build a real brand presence later (post-product-market-fit, after `dropship-brand-transition`). For now, listen only.

## Fake review / astroturf detection

Before treating a glowing post as signal, check the user:
1. Account age (under 6 months = suspect)
2. Total karma (under 1000 = suspect)
3. Post history (only posting in product subs = suspect; only positive comments = suspect)
4. Comment cadence (same product mentioned in 5+ subs = vendor account)
5. Username patterns (Word_Word_4digits, FirstNameLastName123 = often farmed)

If a sub has unusually positive sentiment about a specific brand, look at the mod list — sometimes the mods own the brand.

## Output: the briefing format

Every research session produces a structured note. Use `references/note_template.yaml` as the schema. Minimum fields:

- Product / niche
- Subs mined (with sub size and date)
- Pain themes (3-7, ranked by frequency)
- Hook phrases (10-30, verbatim with thread links)
- Metaphors (5-15)
- Objections (5-10, with the proof needed to answer each)
- JTBD statement (one sentence: "When [situation], I want to [motivation], so I can [outcome]")
- Astroturf flags (any suspect activity noted)
- Triangulation notes (Trends + Amazon + YouTube cross-checks)
- Confidence (Low / Medium / High based on volume, recency, source diversity)

This is the deliverable Donny hands to `dropship-creative-engine` for ad-angle development.

## Gotchas

See `references/gotchas_card.md` for the full list. The big ones:

1. **Old vs new posts** — sort by `top` and `all time` for evergreen pain; sort by `new` for current frustrations. Default `hot` is mostly noise.
2. **Comment trees** — the gold is often 5+ levels deep, not in the top reply
3. **Deleted comments** — `[deleted]` sometimes hides the most useful content; check archive.org or removeddit equivalents
4. **Vote manipulation** — controversial sorting reveals where the brigade hit; sometimes the downvoted comment is the most honest one
5. **Age of subreddit culture** — r/<niche> in 2026 is a different community than in 2019; recent threads only
6. **AskReddit threads about your product category** — these are unfiltered gold and often more useful than the niche sub itself

## Tooling

| Tool | Use |
|---|---|
| `scripts/reddit_backend.py` | Hits `<reddit-url>.json` endpoints, no auth, ~60 req/min |
| `scripts/pain_extract.py` | Regex + LLM extraction of pain patterns from comment dumps |
| `scripts/triangulate.py` | Cross-reference Reddit signal against Trends and Amazon |
| Manual: `site:reddit.com "<phrase>"` Google search | Best discovery tool, period |
| Manual: `old.reddit.com/r/<sub>/search?q=<query>&restrict_sr=on` | In-sub search, more reliable than new Reddit |
| Manual: `redditsearch.io` (if alive), `camas.unddit.com` | Backup search when Reddit's own search is broken |

When the script gets rate-limited or returns 429, fall back to manual `site:reddit.com` Google searches and paste the relevant threads back to Donny for analysis.

## What this skill refuses to do

- Generate fake Reddit posts or comments
- Plan vote manipulation or brigading
- Write affiliate disclosure-free product recommendations on behalf of the user
- Treat upvote count as proof of demand
- Treat one viral comment as a green-light for a campaign
- Recommend buying old Reddit accounts for shilling

## Adjacent skills

- `googletrends-mastery` — quantitative trend confirmation of Reddit-found themes
- `community-research-mastery` — broader VOC across Amazon, YouTube, TikTok, Quora when Reddit alone is thin
- `dropship-product-research` — discovery; this skill validates the language
- `dropship-creative-engine` — consumes the briefing this skill produces
- `dropship-competitive-intel` — competitor monitoring; overlap on brand sentiment
- `ebook-research` — different rigor level; that's for book-grade depth, this is for ad creative

## Voice

Singapore operator, no em-dashes, terse. State pain themes plainly. Do not soften customer language for the briefing — the value is the rawness. If a Redditor says "this product made me cry on the bus", the briefing says "this product made me cry on the bus", not "users report strong emotional responses".
