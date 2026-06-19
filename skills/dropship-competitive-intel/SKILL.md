---
name: dropship-competitive-intel
description: >
  Competitive intelligence for dropshipping: ad spy tools, store teardown, creator/advertiser stalking. Use whenever the user mentions Kalodata, Winning Hunter, Minea, PiPiAds, Dropship.io, Shop Hunter, Koala Inspector, Commerce Inspector, PPSpy, Anstrex, BigSpy, Adheart, SimilarWeb, or any variant of "spy on competitors", "teardown this store", "what are my competitors doing", "how do I find winning ads", "what's saturating", "who are the big players in this niche". Also trigger for reverse-engineering a specific ad, store URL, or advertiser's funnel.
---

# Competitive Intel Skill

## Core principle

**The free stack is rich in 2026.** Paid spy tools (Kalodata, Winning Hunter, Minea, PiPiAds) are aggregators and filters on top of data that is mostly free if you know where to look. They save time, not deliver unique data. Pay for them only when time becomes the bottleneck.

Primary free sources:
- **Meta Ad Library** (facebook.com/ads/library): every active Meta ad, searchable by keyword, advertiser, date, country
- **TikTok Creative Center** (ads.tiktok.com/business/creativecenter): top ads, top products, trending hashtags
- **SimilarWeb** (free tier): store traffic trends
- **Shop Hunter Chrome extension**: Shopify store revenue estimates
- **Koala Inspector Chrome extension**: Shopify theme, apps, product count, best sellers

## Kalodata mastery

### What Kalodata is and is not

Kalodata is **TikTok Shop analytics**, primarily GMV (Gross Merchandise Value) data pulled from TikTok Shop's internal dashboards. It is NOT a Meta or Facebook ad spy tool. For a Meta-only dropshipper, Kalodata's value is **cross-platform arbitrage**: TikTok leads Meta by 2-8 weeks on consumer products, so TikTok Shop velocity signals future Meta demand.

### Pricing tiers (as of late 2025)

- Starter: around $49/month, limited filters
- Pro: around $99/month, all filters
- Enterprise: custom

Free trial is usually 7 days. The user already has access per their stated tooling.

### Key filters and workflows

**Top Products filter stack for dropship discovery:**
1. Category: filter to user's target niche or "All" if general store
2. Country: US for English-speaking test market
3. Time range: last 7 days for rising, last 30 days for stable
4. Sort by: Revenue growth (%) descending
5. Filter: Shop count 3+ (multiple sellers = validated)
6. Filter: Revenue $10k-$500k (not saturated yet, not too new)

**Influencer lookup:**
Paste a TikTok handle or search a product category to find creators already promoting similar products. These creators are warm UGC leads for your own product.

**Ad Library (TikTok):**
Kalodata's ad library shows TikTok Shop video ads with engagement data, run time, and advertiser. Filter by "running 30+ days" to find proven creatives, then adapt the angle for your Meta creative.

**Trend tracking:**
Save keywords in "My Tracks" to get weekly email updates on velocity changes. Useful for staying ahead of saturation curves.

### Known gotchas

- Kalodata data lags 24-48 hours behind actual TikTok Shop.
- "Revenue" is GMV (pre-discount, pre-return). True net revenue is 15-30% lower.
- Products with "Shop not available in your region" in TikTok Shop often still work on Meta. Don't filter them out automatically.
- Chinese sellers' English translations are sometimes misleading; cross-reference with AliExpress listing.

### Export workflows

Pro tier allows CSV export of Top Products and Ad Library results. Export weekly, dedupe against last week's list, surface what is new.

## Winning Hunter mastery

### What Winning Hunter is

Winning Hunter is a **Meta and TikTok ad spy tool** that indexes ads with engagement, spend estimates, ad age, and advertiser tracking. For a Meta-focused operator, it is closer to the primary tool than Kalodata.

### Key filters and workflows

**Ad age filter** (the most important):
- 7-14 days: test phase ads
- 14-30 days: ads that survived initial kill criteria
- 30+ days: validated scalers, worth deep teardown
- 60+ days: proven winners, study intensely

**Engagement-to-spend ratio**:
Winning Hunter estimates spend. Divide likes by estimated spend to get engagement efficiency. Ads with high engagement per dollar are either going viral organically or have strong creative. Study both.

**Saved folders and alerts:**
Create a folder per product category. Add ads that look promising. Winning Hunter alerts you when those ads get duplicated or new variants appear, signaling the competitor is scaling.

**Store Spy feature:**
Paste a competitor Shopify URL. Winning Hunter shows their active ads across Meta and TikTok, plus the creatives' run history. Build a target list of 5-10 competitor stores and monitor weekly.

**Product Spy:**
Reverse direction: paste a product keyword, get all advertisers running ads on it. Use this to map the competitive landscape before entering a niche.

### Chrome extension

Install the extension, browse Meta Ad Library normally, and Winning Hunter overlays ad age and engagement data inline. Massive time-saver vs clicking through each ad.

### Known limitations

- Spend estimates are rough (plus or minus 50%); directional only.
- Coverage skewed toward English-speaking geos.
- Alerts can false-positive when Meta re-indexes an ad as "new".
- Advertiser change-tracking misses some page renames.

## Store teardown workflow

Given a competitor Shopify URL, systematically extract:

### 1. Tech stack (via Koala Inspector or Commerce Inspector)
- Theme (paid themes like Shella, Booster, Minimog signal serious operator)
- Apps installed (Judge.me, Loox, Klaviyo, ReConvert, etc.)
- Product count (one-product store vs general)
- Best-seller section (their actual winners)

### 2. Traffic and growth (via SimilarWeb free tier)
- Monthly visits trend (3-month direction)
- Traffic sources (high paid social % = Meta or TikTok focus)
- Top geos (where they're running ads)
- Engagement (bounce rate, pages per session)

### 3. Ad creative (via Meta Ad Library)
- How many active ads
- Oldest ad age (30+ days = confirmed funnel)
- Creative format mix (UGC vs static vs carousel)
- Hook patterns and angles used

### 4. Product page anatomy
- Hero (video or image; most winners use video in 2026)
- Headline and sub-headline
- Benefit bullets (usually 3-5)
- Trust badges (free shipping, money-back, review count)
- Reviews (count, photos, Q&A)
- Upsells (pre-cart and post-cart)
- Urgency elements (stock counter, timer, social proof popup)
- Price anchoring (compare-at price)

### 5. Checkout flow
- Add to cart experience
- Cart upsell offers
- Express checkout options (Shop Pay, Apple Pay)
- Post-purchase upsell (ReConvert, AfterSell patterns)

### 6. Email capture
- Popup offer (X% off for email)
- Flow triggered after abandoned cart (usually 3-5 emails over 7 days)

## Teardown output template

```
COMPETITOR: [store URL]

TECH STACK:
- Theme: [name]
- Apps: [list key revenue-driving ones]
- Product count: [N]
- One-product or general: [type]

TRAFFIC (SimilarWeb):
- Monthly visits: [number]
- 3-month trend: [up/flat/down]
- Top geo: [country]
- Paid social %: [estimate]

ADS (Meta Ad Library):
- Active ads: [N]
- Oldest ad: [days]
- Format mix: [UGC X%, static Y%, carousel Z%]
- Key angles: [list]
- Hook patterns: [list]

PRODUCT PAGE:
- Hero: [video/image, description]
- Price: [X], compare-at [Y]
- Review count: [N, avg X stars]
- Key trust elements: [list]
- Upsells: [pre/post cart offers]

WHAT TO STEAL:
- [Specific element 1]
- [Specific element 2]

WHAT TO AVOID:
- [Anything that signals desperate dropship, e.g. fake scarcity]
```

## Chinese and SEA operator signals

Some of the most advanced dropshipping operators are Chinese and SEA teams running multi-product stores with heavy Meta spend. Signs you're looking at a serious operator vs a beginner:

- Chinese-sounding store name + .com domain + US-styled copy = often a big operator
- Shopify URL with customized checkout = paid plus plan ($2k/mo), indicates $50k+/mo revenue minimum
- 10+ creative variations on a single product ad = serious budget
- Fulfilled via CJ Dropshipping, HyperSKU, or ZenDrop = validated supplier chain, worth supplier-side reverse-engineering
- Response time to DM or email under 4 hours = VA team, operational maturity

Learn from them. Adapt their angles. But remember: their creative volume and VA operations are 10x yours if you're solo.

## Red flags to avoid copying

Competitors making these mistakes are losing money. Do not replicate:

- Fake countdown timers that reset on page reload (trust-killing, illegal in some geos)
- Fake "X people viewing this now" popups when you can check the source and see they're scripted
- Before/after imagery in health categories (Meta will ban, just a matter of time)
- Reviews with obviously AI-generated text
- Stock images passed off as product photos
- "Limited stock! Only 2 left!" on generic AliExpress items

## Do not

- Assume Kalodata data = Meta performance. TikTok Shop and Meta are different funnels. Use Kalodata as demand signal, not Meta prediction.
- Pay for Winning Hunter and Minea and PiPiAds and Kalodata simultaneously. Pick one ad spy + Kalodata for TikTok signal. Stack is redundant.
- Copy a competitor's creative verbatim. Meta's algorithm penalizes near-duplicates. Steal the angle, not the frames.
- Teardown a store and recreate every element. Most competitors have 2-3 things worth stealing and 5-10 things they got wrong.

## Cross-references

- Converting competitive signal into a test candidate: `dropship-product-research`
- Scoring a candidate before testing: `dropship-product-evaluation`
- Building the creative after finding the angle: `dropship-creative-engine`
- Building the store that matches competitor-level polish: `dropship-shopify-build`
