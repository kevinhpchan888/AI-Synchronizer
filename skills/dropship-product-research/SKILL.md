---
name: dropship-product-research
description: >
  Product discovery for Meta-ads-only Shopify dropshipping. Use whenever the user wants to find winning products, evaluate a product idea, research a niche, scan TikTok Creative Center, check Amazon Movers and Shakers, spy on Meta Ad Library, look up eBay sold data, or ask variants of "is this product worth testing". Also trigger for "what should I sell", "find me a product", "is X saturated", or any product-category scanning. Use even when the user mentions only one of the source platforms (TikTok, Amazon, Facebook ads, AliExpress). This skill focuses on DISCOVERY; for scoring a specific product use dropship-product-evaluation, for trend confirmation use dropship-trends-intelligence.
---

# Product Research Skill

## Core principle

**Discovery is a funnel across multiple sources, not a single tool.** Google Trends is a lagging confirmation signal, not a discovery signal. The sources that actually predict winning dropshipping products in 2026 are TikTok Creative Center, Amazon Movers and Shakers, Meta Ad Library, eBay WatchCount, and Reddit velocity. Kalodata and Winning Hunter sit on top of these as paid aggregators.

Build the discovery funnel in this order:

```
Raw signal sources (free, primary)
    ↓
Cross-platform corroboration (at least 2 sources confirm)
    ↓
Scoring (hand off to dropship-product-evaluation)
    ↓
Unit economics clearance
    ↓
Test budget decision
```

## The discovery funnel

### Stage 1: Scan the raw signal sources

When the user wants product ideas, survey these in order:

**TikTok Creative Center** (free, no login for most features)
- URL: `ads.tiktok.com/business/creativecenter`
- Workflow: Top Products → filter by user's target geo (US, UK, AU, CA are the default English-speaking set) → sort by revenue growth or unit growth in 7 day window
- Cross-reference with Trend Discovery and Keyword Insights
- Primary signal: **products with rising unit velocity AND ad activity from 3 or more unique advertisers**
- Run the scraper in `scripts/scan_tiktok_cc.py` for structured output, or have the user paste the product list manually

**Amazon Movers and Shakers** (free, public, refreshes hourly)
- URL: `amazon.com/gp/movers-and-shakers`
- Workflow: pick categories matching user's store niche → products with over 300 percent sales rank gain in 24h
- Cross-reference with `/gp/new-releases` and `/gp/bestsellers` in the same category
- Primary signal: **real purchase velocity**, not search interest or ad activity
- Use `scripts/scan_amazon_ms.py`

**Meta Ad Library** (free, official, at `facebook.com/ads/library`)
- Workflow: keyword search for product term → filter to Active ads → filter by date range (last 30 days) → look for ads that have been running 30+ days with 5+ creative variations
- Primary signal: **long-running ads with multiple creatives converting** (advertisers only keep losing ads running if the funnel works)
- This data is what Minea, Dropispy, and PiPiAds repackage and charge 49 to 99 USD/month for. Skip the paid version unless scanning 100+ keywords per week.

**eBay WatchCount + Terapeak** (free)
- WatchCount.com: no login, shows most-watched and most-sold items over 90 days
- Terapeak (inside Seller Hub): free for all eBay sellers, shows average sold price and sell-through rate
- Primary signal: **completed purchase data**, the strongest validation type

**Reddit velocity** (free via PRAW, 100 queries/min on free tier)
- Track post velocity on product keywords across r/BuyItForLife, r/shutupandtakemymoney, r/INEEEEDIT, niche subs matching the user's store direction
- Primary signal: **organic conversation volume** (more durable than paid ad trends)

### Stage 2: Cross-platform corroboration

A product earns the right to be evaluated (hand off to `dropship-product-evaluation`) only when at least TWO of the above sources confirm demand. The strongest combinations:

- TikTok Creative Center rising + Meta Ad Library shows 30+ day old ads → confirmed cross-platform winner
- Amazon Movers and Shakers + Meta Ad Library long-runners → validated buyer demand with proven ad conversion
- TikTok Creative Center rising + Amazon new-releases hit → early demand curve, still runway

Weak or single-source signals that do NOT justify a test:

- Only Google Trends shows a rise (late signal, already saturated on TikTok and Meta)
- Only AliExpress "Hot Products" (this is supplier-side, not buyer-side; can be manufactured by suppliers gaming the platform)
- Only a guru or course mentions it (assume 10,000+ other students saw the same video)

### Stage 3: Saturation check

Before recommending a product for testing, scan saturation:

- Meta Ad Library: if more than 50 distinct advertisers run ads on the same angle, the creative ceiling is already low. Look for a fresh angle or a different ICP.
- Amazon: if top 3 listings have 2,000+ reviews and Amazon's Choice badges, the price-and-review arbitrage window is closed.
- Dropship store scan: paste 2 or 3 competitor URLs from Meta Ad Library into `similarweb.com`. If traffic is decelerating over the last 3 months, the trend is dying, not starting.

### Stage 4: Red flags that kill a product regardless of signal

Never recommend testing a product that matches any of these:

1. **IP or trademark risk**: Marvel, Disney, licensed sports (NFL/NBA/MLB/NHL/FIFA), Nintendo, Apple silhouette, Nike swoosh. Meta bans fast, legal follow-up is real.
2. **Medical or weight-loss claims**: Meta policy on Personal Health and Unapproved Health Claims triggers on ad copy, not product. Skip entirely or consider only products where the angle can be reframed as lifestyle.
3. **Dangerous goods**: batteries over 100Wh, pressurized cans, anything flammable. Air freight restrictions kill fulfillment speed.
4. **Fragile items**: breakage rate above 5 percent burns margin through replacements and refunds.
5. **Cheap electronics below $30**: margin cannot absorb 2026 Meta CPMs of $20 to $40.
6. **Fake-review-farm listings**: suspiciously uniform 5-star English reviews on a Chinese AliExpress listing. Supplier reliability collapses at scale.
7. **Weight or volume that kills fulfillment**: over 1kg or dimensional weight that pushes shipping past 12 USD without extraordinary AOV.

## Scripts in this skill

- `scripts/scan_tiktok_cc.py`: structured scrape of TikTok Creative Center Top Products (Playwright based, run headful from home IP).
- `scripts/scan_amazon_ms.py`: HTML scrape of Amazon Movers and Shakers with category filter.
- `scripts/scan_meta_ad_library.py`: keyword search on Meta Ad Library, flag long-running ads.
- `scripts/scan_watchcount.py`: eBay WatchCount most-watched by keyword.

If the user does not have Python or Playwright installed, walk them through each source manually in a browser and collect the signals by hand. The framework works either way.

## Output format for a product research session

When producing a research summary, structure the output like this:

```
PRODUCT: [name]
ANGLE: [ICP + pain point + promise]
SIGNAL SOURCES (minimum 2 required):
  - TikTok Creative Center: [status, units, advertisers]
  - Meta Ad Library: [oldest ad age, advertiser count, creative variation count]
  - Amazon: [BSR, review count of top listing]
  - Other: [optional]
SATURATION: [low / medium / high] + evidence
RED FLAGS: [list or "none identified"]
RECOMMENDATION: [TEST / PASS / RETHINK ANGLE]
NEXT: Hand off to dropship-product-evaluation for scoring and unit economics.
```

## Do not

- Treat Google Trends as the primary discovery signal. It lags by 2 to 8 weeks. Route those questions to `dropship-trends-intelligence` for confirmation only.
- Recommend paying for Minea, PiPiAds, Dropship.io, or Sell The Trend until the user has a documented winning product. Free sources are richer in 2026.
- Recommend products that match any red-flag category even if the user pushes. Say no and explain why.
- Confuse "trending on TikTok" with "will convert on Meta". TikTok signals are discovery; Meta conversion still requires a testable funnel with 4x+ markup.

## Cross-references

- Trend confirmation: `dropship-trends-intelligence` and `googletrends-mastery`
- Scoring a specific candidate: `dropship-product-evaluation`
- Voice-of-customer for the niche (pain language, JTBD, customer slang): `reddit-research-mastery` for Reddit-deep, `community-research-mastery` for multi-source. Run these after a candidate surfaces and before writing creative briefs — VOC mining is what separates a tested product from a tested-and-converting one.
- Competitor teardown: `dropship-competitive-intel`
