# Facebook Research — VOC and demand signal

Facebook is multiple distinct sources under one URL. Use the right surface for the right question.

## The four FB surfaces

| Surface | Best for | Status in 2026 |
|---|---|---|
| Meta Ad Library | Competitor ad creative, spend signal, angle reverse-engineering | Public, free; primary tool |
| Facebook Groups | Demographic-specific VOC, niche complaints, parenting/hobby gold | Mostly closed but lurkable in public ones |
| Facebook Pages comments | Unfiltered reactions to competitor brand posts | Public, often unmoderated |
| Facebook Marketplace | Used-product turnover, regional demand, real-world price | Public, geo-targeted |

For Ad Library deep work see `dropship-competitive-intel` — this doc covers the other three.

## Facebook Groups

### Why they matter

Reddit is gender-skewed (male, US, tech). FB Groups are where the demographic that doesn't post on Reddit talks: women over 35, parents, retirees, hobbyists, regional buyers, faith communities, immigrant diasporas, plus-size apparel, specific health conditions.

For parenting, baby gear, plus-size, women's beauty, faith/spiritual products, regional taste niches — **FB Groups beat Reddit**.

### How to find the right group

1. Search Facebook for `<niche> group`
2. Filter to Public groups (Closed and Secret are off-limits without joining)
3. For Closed groups: request to join with a real-looking personal account, NEVER your business account, answer the screening questions honestly, lurk for 2 weeks before doing anything
4. Look for groups with 5k-50k members. Mega groups (200k+) are noise. Tiny groups (under 1k) are too thin.
5. Check post frequency: 5+ posts per day = active; sub-daily = dead

### What to mine

Same patterns as Reddit (see reddit-research-mastery's pain taxonomy):
- "Has anyone tried..."
- "Looking for a [product] that..."
- "Why does [brand] always..."
- "AITA for buying..." (yes, this is a goldmine for objection mapping)
- Show-and-tell posts where the comments ask "where did you get that"

### Admin-detection avoidance

- Never post from a business account
- Never share product links — admins ban on sight
- Never DM members offering deals
- Never use the group as an audience for cold targeting later
- Read-only is the only safe mode; the value is the language, not the leads

### Best categories for FB Groups specifically

- Parenting (Mommit cohort + much more): "<region> moms", "<baby age> parents", "twin moms", "single moms", etc.
- Plus-size apparel: "Plus size fashion finds", "PSF community", regional plus-size groups
- Faith/spiritual products: religious community groups (handle with care; do not target ads here)
- Pet-specific: breed groups (Frenchie owners, Pomeranian owners — high spend per member)
- Regional buyer groups: "Singapore mums", "London foodies", "Sydney expats"
- Health conditions: "fibromyalgia warriors", "PCOS support", chronic-condition support groups (extreme care: ad targeting on these is restricted by Meta — VOC mining only)
- Hobbies: knitting, crochet, gardening, RC cars, woodworking — these audiences spend more than they post about

## Facebook Pages comments

### What they give you

Comments under a competitor brand's organic posts and (visible) paid posts. Often less moderated than Amazon reviews. Honest sentiment + the "tag a friend who needs this" social-proof pattern.

### How to mine

1. Find competitor brand FB Page (search the brand name + "facebook")
2. Sort posts by Recent
3. On posts with 100+ comments, expand and read
4. Specific signals to extract:
   - "Tag a friend who..." comments → pain-language for hooks (the friend's affliction)
   - Negative replies → objections
   - "Where can I get this in <country>" → geo-demand signal
   - "$X is too much" → price objections at scale
   - Reaction breakdown (see below)

### Page reaction analysis

The reaction bar (Like / Love / Haha / Wow / Sad / Angry) is a public signal:
- **High Haha or Angry** on a competitor's product post = they're being mocked or boycotted
- **High Love** = aspiration/desire response, your hooks should match
- **Sad** on a problem-framing post = the pain is real and emotional
- **Wow** = curiosity, novelty signal — usually short-lived
- **Haha-bombing** an ad post = ad is failing publicly; the angle is dead

Visible in Meta Ad Library on active ads too — see `dropship-competitive-intel` for that workflow.

## Facebook Marketplace

### Why it matters

Marketplace is the closest thing to a free "what do people actually pay" data source for physical products. It also reveals:
- **Turnover** — fast-selling categories vs slow-rotting listings
- **Regional demand** — same product, different prices city-to-city
- **Used vs new spread** — if used Walmart-bought items resell at 60% of new, that's a strong demand signal for new
- **Bundling and DIY** — what people sell together, what hacks exist

### How to mine

1. Set location to your target market (US/UK/AU/EU city)
2. Search the product category
3. Filter: Sort by Date Listed (newest first)
4. Note:
   - Asking prices (range and median)
   - "Sold" tags appearing within 24-72h = high-demand category
   - "Listed for X days" = how slow the category turns
   - Description language — sellers often parrot brand copy when it converts; if everyone says "ergonomic", that's the niche language

### Cross-region demand check

A product hot in US Marketplace but rare in UK Marketplace = arbitrage opportunity for UK ads.
A product saturated in both = competition is high, margins will compress.
A product nonexistent in either = either too early or too dead. Cross-check Trends.

## Mod / TOS landmines

- Joining 5+ niche groups in one day on a fresh account = ban risk
- Posting product links anywhere on FB = near-instant Page restriction
- Scraping FB programmatically violates ToS and risks Page/account bans (use manual research)
- Targeting health-condition group members in ads is restricted; VOC mining is fine, ad targeting from those audiences is not

## Tooling

| Tool | Use |
|---|---|
| Manual: Facebook search | Group discovery, page discovery |
| Manual: Marketplace UI | Demand and price signal — no clean scraper exists |
| Meta Ad Library | Competitor ad spend, see `dropship-competitive-intel` |
| Browser bookmarks | Build a "watchlist" of 10-20 competitor Pages and 10 niche groups, lurk weekly |

No script in this skill — Facebook actively blocks automated access and the value-per-bot-risk ratio is bad. Manual research only.

## When FB beats Reddit

- Demographic skews older, female, parental, regional non-US
- Topic is socially awkward to post under a Reddit username (faith, divorce, infertility, finances)
- Niche is hobby-driven and Reddit subs are small (knitting, RC cars, specific pets)
- Geo-specific demand needed (use Marketplace + regional groups)

## When Reddit beats FB

- Demographic is younger, male, tech, US
- Topic benefits from anonymity (mental health, embarrassing problems, politically charged)
- You need search at scale (Reddit indexes; FB doesn't)
- You need historical/evergreen content (Reddit's archive > FB's feed)

## Briefing additions

When using FB sources, add to the standard VOC briefing:
- `fb_groups_mined` (list with member count, post frequency, public/closed)
- `fb_pages_comment_themes` (top 3 patterns from competitor pages)
- `fb_marketplace_signals` (price range, turnover speed, regional spread)
- `fb_reaction_pattern` (dominant reactions on competitor product posts)
