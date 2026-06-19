---
name: dropship-shopify-integrations
description: >
  Shopify integration stack beyond basic store setup for a Meta-ads-only Shopify dropshipper. Use whenever the user mentions Shopify apps, Shopify AI Toolkit, MCP, Gorgias, Re:amaze, Zendesk, Tidio, customer service, VA, Xero integration, A2X, Triple Whale, Polar Analytics, Lifetimely, Peel, TrueProfit, reviews apps (Judge.me, Loox, Yotpo, Okendo), Loop Returns, AfterShip, Translate & Adapt, Weglot, Shopify Flow, Mechanic, Zapier, Signifyd, NoFraud, Riskified, PageSpeed, app audit, or any variant of "what apps do I need", "which analytics platform", "how do I handle customer service", "which reviews app", "when do I add Triple Whale", "app bloat slowing my site". Covers the critical "less is more" principle for app stack management. Does NOT cover suppliers (see dropship-suppliers), basic theme setup (see dropship-shopify-build), or pricing/financial apps (see pricing-strategy/cashflow-ops).
---

# Shopify Integrations Skill

## Core principle

**Every app is a performance cost, security risk, and recurring fee.** The starter stack at launch is different from the scaling stack at $30k/month revenue which is different from the mature stack at $300k/month. Adding apps before you need them adds cost without revenue, slows your site (kills conversion), and creates integration debt when you eventually replace them.

This skill covers: the Shopify AI Toolkit and MCP integration (new April 2026), customer service stack, analytics beyond Shopify native, reviews and returns, translation/currency, workflow automation, fraud, and the critical app audit discipline.

## 1. Shopify AI Toolkit and MCP integration

### What it is (April 2026)

Shopify launched an **AI Toolkit with Model Context Protocol (MCP) integration** in April 2026. This lets Codex (and other MCP-capable tools) interact with a Shopify store via natural language.

**Capabilities:**
- Product CRUD (create, read, update, delete) via conversation
- Order lookup and status queries
- Inventory sync across locations
- Analytics queries (sales by period, top products, customer segments)
- Theme edits via Shopify CLI (already existed; MCP wraps it)
- Collection management
- Draft order creation for B2B or custom sales

### Security model

- OAuth-based auth with scoped permissions
- API keys scoped to specific operations (don't grant write to everything)
- **Never grant full admin** to any MCP server. Principle of least privilege.
- Audit log of MCP-initiated actions

**Risks:**
- Misconfigured MCP scope = overprivileged automation
- Code-gen errors in MCP calls (deleting wrong products, updating wrong prices)
- Always dry-run destructive operations first

### Common use cases for a solo dropshipper

1. **Bulk product updates**: "Update the price of all products in the 'summer' collection to $29.99"
2. **Analytics queries**: "Show me top 10 products by revenue last 30 days"
3. **Order investigation**: "Find orders from customer X in the last 90 days"
4. **Inventory reconciliation**: "List all products out of stock that had sales last week"
5. **Metadata management**: "Add 'winter-ready' tag to all products with 'coat' in title"

### Alternative: Shopify CLI and Admin API direct

If MCP feels like overkill or over-abstracted:
- **Shopify CLI**: theme dev, app scaffolding, theme push/pull
- **Admin API (GraphQL)**: programmatic control over everything
- **Admin API (REST)**: legacy but widely supported

For solo operator: MCP is the right layer for conversational ops; CLI for dev.

## 2. Customer service stack

### Platform comparison (2026)

| Platform | Entry price | Strength | Weakness |
|---|---|---|---|
| **Gorgias** | $10/mo (50 tickets) → scales to $350+/mo | Deepest Shopify integration, AI assistance (Gorgias Auto Respond) | Pricing scales fast once volume hits |
| **Re:amaze** | $29/mo (per agent) | Good Shopify integration, simpler than Gorgias | Less powerful AI, fewer integrations |
| **Zendesk** | $55+/mo per agent | Enterprise-grade, multi-channel | Overkill for solo operator, cost high |
| **Tidio** | Free tier, $29+/mo | Live chat focused, simpler | Ticket management weaker than Gorgias |
| **Intercom** | $74+/mo | Best for SaaS, not ecom | Expensive; not Shopify-first |
| **Shopify Inbox** | Free | Native, minimalist | Chat-only, not a ticketing system |

**Recommendation progression:**
- **Launch - $10k/month**: Shopify Inbox (free) + email via standard email client
- **$10k-$50k/month**: Gorgias Starter tier, or Re:amaze
- **$50k+/month**: Gorgias Pro or Re:amaze Plus
- **$500k+/month**: Zendesk or Gorgias Enterprise

### Ticket volume math

Typical ecom ratio: **1 ticket per 20-40 orders.** So:
- 100 orders/day = 3-5 tickets/day
- 500 orders/day = 15-25 tickets/day

Solo operator handles up to ~20 tickets/day (2 hours at 6 min each). Above that, VA required.

### Template library for common dropship tickets

**Where is my order (WISMO)** - 40-50% of tickets
```
Hi [Name],

Thanks for reaching out. Your order #[X] shipped on [date] and is expected to arrive by [date]. You can track it here: [tracking link].

Because we ship from our partner warehouses, some orders take 10-15 business days to arrive. We'll send you updates as your order moves.

Let me know if you have any other questions!

[Name]
[Brand] Customer Care
```

**Defective or damaged** - 10-15% of tickets
```
Hi [Name],

I'm so sorry to hear that. Let's make this right.

Could you send me:
1. A photo of the defective/damaged item
2. A photo of the shipping package
3. Your order number

Once I have these, I'll process a replacement (or full refund if you prefer) within 24 hours.

Really sorry for the trouble.

[Name]
```

**Refund request** - 15-20% of tickets
```
Hi [Name],

No problem at all, I've processed your refund for $[X] to your [payment method]. You should see it in 3-5 business days.

If you have feedback on what didn't work for you, I'd love to hear it. We're always trying to improve.

Thanks for giving us a try.

[Name]
```

**Shipping delay / lost package** - 5-10% of tickets
```
Hi [Name],

Thanks for flagging this. Let me investigate.

Looking at tracking, it seems [describe status]. I've reached out to the carrier to get more info and will update you within 24 hours.

In the meantime, I'd like to offer you [replacement if delayed 20+ days / refund if package confirmed lost]. Let me know which works best.

[Name]
```

**Wrong item received** - 3-5% of tickets
```
Hi [Name],

That's on us, I'm sorry. Let me get the right one to you.

Could you send a photo of what you received? I'll have the correct item shipped express at no cost, and you can keep the wrong item (no need to return).

Expect the replacement within [X] days.

[Name]
```

**Size exchange** - varies by category
```
Hi [Name],

Absolutely. Here's how size exchanges work:

1. Reply with the size you'd like (and photo of item if you have it)
2. I'll send you the new size within 24 hours
3. You can keep or donate the original (returning to China isn't practical)

This way you get what you want and we skip the shipping cost back.

[Name]
```

### SLA setting

- **24-hour first response**: industry standard. Customers rate "fast response" highest in post-purchase surveys.
- **4-hour first response for VIPs**: if you have a VIP segment, they expect it.
- **Resolution time**: varies. WISMO = resolved in first reply. Refund = 24 hours. Replacement = 3-5 days + shipping time.

### VA outsourcing to Philippines/Pakistan

**Why it works:** native English speakers (Philippines) at S$4-$10/hour vs SG labor at S$25+/hour. Pakistan also strong but more time-zone variability.

**Platforms:**
- **OnlineJobs.ph**: Philippines-focused, $70/month (Employer Pro), direct hire model
- **Upwork**: global, hourly/project based, Upwork takes 10%
- **Indeed Philippines**: newer but growing
- **Referrals from existing operators**: best quality

**Typical VA rates 2026:**
- Entry-level (customer service): $3-$5/hour USD
- Mid-level (CS + some ops): $5-$8/hour
- Senior (CS + light design/admin): $8-$12/hour

**Training approach:**
1. SOPs first: document your ticket templates, response times, escalation rules
2. Loom videos: screen-record yourself handling 10-20 tickets of each type
3. Shadow period: VA watches, then handles tickets under supervision
4. QA: spot-check 10% of VA tickets weekly for first month

**Hours to target:**
- Solo operator at $10k/month: 10-15 hours/week VA support
- $30k/month: 20-30 hours/week (one full-time VA equivalent)
- $100k/month: 2 VAs or a small team

## 3. Reviews syndication

### Platform comparison (2026)

| Platform | Entry | Strength | Weakness |
|---|---|---|---|
| **Judge.me** | Free tier (6 products limit); Awesome $15/mo | Best free option, photo reviews, Q&A, **AliExpress review import** | Looks less polished than Loox/Yotpo |
| **Loox** | $9.99/mo (up to 100 orders) → $599/mo | Photo/video focus, polished UI | Pricier than Judge.me, less feature-depth |
| **Yotpo** | Free + paid tiers ($19/mo+) | Enterprise feel, SMS integration | Overkill for small store, sales-heavy |
| **Okendo** | $29/mo+ | Highly polished, strong premium brands | More expensive, overkill for dropship |
| **Stamped.io** | Free + paid ($19/mo+) | Solid mid-tier | Less momentum than alternatives |

**Recommendation for solo SG dropshipper:**
- **Launch**: Judge.me Awesome ($15/mo). Import reviews from AliExpress with caution (quality control).
- **$30k+/month**: Loox if visual focus matters (fashion, beauty)
- **$100k+/month**: Yotpo if building broader loyalty/rewards stack

### Review syndication to ad platforms

- **Judge.me to Google Shopping**: native
- **Loox to Facebook Shops**: native
- **Yotpo to multiple channels**: native at Yotpo Growth+ tier

### AliExpress review import best practices

**Caution**:
- Judge.me imports are unverified (can't distinguish real from bot)
- Reviews written in broken English signal dropshipping to buyers
- Shopify may flag fake reviews (newer policy)

**Do**:
- Import selectively: only 5-star reviews with real photos
- Edit grammar (import-then-clean, not import-raw)
- Mix imported with real reviews (don't rely only on imports)

**Don't**:
- Import en masse (100+ reviews appearing simultaneously = red flag)
- Import 1-star reviews (why would you)
- Rely on imported reviews once real reviews start coming in (remove imports after 6 months)

### Review presentation rules

- Display on PDP (prominently, above the fold on mobile)
- Filter by rating and keyword
- Show photo reviews first if available
- Allow sorting by most helpful / most recent
- Don't cherry-pick: show both positive and negative for credibility

## 4. Returns and RMA

### Platform comparison

| Platform | Entry | When to use |
|---|---|---|
| **Loop Returns** | $29-$299/mo | Fashion/apparel brands with high return rates |
| **Returnly** | Acquired by PayPal (Affirm), ongoing | Similar to Loop |
| **AfterShip Returns Center** | Free tier; paid $11-$239/mo | Integrates with AfterShip tracking, good value |
| **Shopify native returns** | Free | Basic only; manual processing |

### For a dropshipper specifically

**Returns infrastructure is minimal until volume justifies.**

**Reasons:**
- Returning to China supplier is impractical (cost > product value)
- Most dropship "returns" = refund without return
- Shipping cost of return absorbs any recovery value

**Practical approach:**
1. For defective/wrong item: refund + customer keeps item (don't require return)
2. For buyer's remorse: 14-day return window, customer pays return shipping, refund on receipt to a local address
3. For SG operator: accept that 3-5% refund rate is part of dropship cost structure

**Only install dedicated returns app when:**
- Return rate exceeds 8% (costly to manage manually)
- Category has high return rates inherently (fashion, shoes)
- Post-private-label transition with actual 3PL inventory

## 5. Analytics beyond Shopify native

### Platform comparison (2026)

| Platform | Entry | When to add |
|---|---|---|
| **Shopify Analytics (native)** | Free | Always on; sufficient under $30k/mo |
| **TrueProfit** | $25-$75/mo | Add at $10k/mo; shows true net profit |
| **Lifetimely (useamp.com)** | Free + paid from $49/mo | Add at $30k/mo for LTV cohorts |
| **Triple Whale** | $129/mo + | Add at $30-50k/mo for attribution + MMM |
| **Polar Analytics** | $299-$799/mo custom | Alternative to Triple Whale |
| **Peel Insights** | $499/mo Essentials | Overkill under $100k/mo |
| **Northbeam** | $1,000+/mo | Multi-touch attribution for $500k+/mo |
| **Daasity** | Enterprise | Data warehouse; $1m+/mo brands |

### The "when to add" framework

**Under $10k/month revenue:**
- Shopify Analytics (free)
- Meta Ads Manager (free)
- Spreadsheet for manual P&L weekly
- **Total stack cost: $0**

**$10k-$30k/month:**
- Add TrueProfit ($25/mo) for true net profit tracking
- **Total stack cost: $25/mo**

**$30k-$100k/month:**
- Upgrade to Lifetimely (paid tier) for LTV and cohort analysis
- OR Triple Whale starter tier for attribution modeling
- **Total stack cost: $50-$200/mo**

**$100k+/month:**
- Triple Whale full tier
- Optional: Peel Insights for deeper analytics
- **Total stack cost: $500-$1,500/mo**

### What each tool actually does

**TrueProfit:**
- Pulls Shopify orders
- Subtracts COGS (you upload per-SKU)
- Subtracts shipping
- Subtracts Shopify/Stripe/PayPal fees
- Subtracts Meta/Google/TikTok ad spend (via API)
- = Net profit (true, not ROAS)

**Lifetimely (now useamp.com):**
- Cohort LTV analysis (users who bought in Jan 2025, their 90-day LTV)
- Repeat purchase rate
- Time-to-second-order
- Best-performing products by LTV (not just first-order revenue)

**Triple Whale:**
- Multi-channel attribution (Meta + Google + TikTok + email)
- Server-side tracking
- Creative performance by platform
- Pixel+API hybrid

### When it's not worth it

**Under $30k/month**: Meta Ads Manager + Shopify Analytics + TrueProfit gives you 90% of the insight for $25/mo. Don't pay $400/mo for Triple Whale.

**Over $100k/month**: the attribution fog is costing you more than Triple Whale. Worth it.

## 6. Translation and localization

### Platforms

| Platform | Entry | Strength |
|---|---|---|
| **Shopify Translate & Adapt** | Free (native) | Up to 20 languages, auto-translate with human edit, market-aware |
| **Langify** | $17.50/mo | Older alternative, less polished |
| **Weglot** | $17/mo (10k words) → $99/mo (200k words) | AI-powered, polished, integrates with Shopify |

### For SG operator selling into EU

English is fine for UK and some EU countries (Netherlands, Nordics). For serious EU volume:

- **Germany**: 88% of buyers prefer native language. DE translation essential for DE revenue scaling.
- **France**: 80% native preference. FR translation for significant FR volume.
- **Italy/Spain**: similar to France.

**Recommendation:**
- **Launch-$50k/month**: English only. Focus on US/UK/AU.
- **$50k+/month EU volume**: Shopify Translate & Adapt (free, native)
- **If Translate & Adapt feels limited**: Weglot

### Auto-translate quality

Auto-translate (Shopify's or Weglot's) is 80-90% correct. The last 10% matters:
- Product names sometimes translate literally ("Cool Coat" → "Kühler Mantel" = refrigerator coat in German)
- Marketing copy loses nuance
- Always have native speaker review key pages (PDP, homepage, checkout flow)

**For solo operator**: use Upwork or Fiverr for native-speaker review at ~$50-$150 per page.

## 7. Shipping integration and tracking

### Platform comparison

| Platform | Entry | Purpose |
|---|---|---|
| **Shopify Shipping** | Free (native) | US/CA/AU/UK; creates labels, picks up | 
| **ShipStation** | $9.99/mo+ | Multi-carrier, multi-channel; for private-label | 
| **AfterShip** | Free tier; $11+/mo paid | **Primary tracking recommendation** | 
| **Parcel Panel** | Free tier; paid $9-$399/mo | Branded tracking pages, good free tier |
| **Track123** | Free tier; paid $9-$129/mo | Similar to Parcel Panel |

### For dropshipper specifically

**Tracking apps matter more than shipping apps** (supplier handles shipping; you handle customer tracking experience).

**Why tracking apps matter:**
- Reduce WISMO tickets by 40-60% (customer sees status without emailing)
- Build trust during 10-15 day shipping window
- Opportunity for upsell on tracking page ("While you wait, here's 15% off your next order")
- Review the tracking page as a customer; it represents your brand

**Recommendation:** AfterShip free tier (up to 50 shipments/month) to start. Upgrade to $11/mo tier at scale.

## 8. Subscription billing

Covered in depth in `dropship-pricing-strategy`. Quick reference:

- Shopify Subscriptions (native): free, incompatible with Shopify Bundles
- Seal Subscriptions: free under 150 subs, good starter
- Appstle: $10/mo+, good budget scale
- Recharge: market leader, expensive ($99/mo+ + 1.25% transaction)
- Skio: premium, $599/mo entry

## 9. Legal page generators

| Tool | Pricing | When to use |
|---|---|---|
| **Shopify native** | Free | Launch: good enough for first 3 months |
| **Termly** | Free (basic); $15/mo (pro) | Adds cookie consent + dynamic legal |
| **Termageddon** | $10/mo+ | Strong for privacy policies, monthly updates |
| **iubenda** | €27-99/year+ | Most polished, GDPR focus, strong for EU |

**Recommendation progression:**
- **Launch**: Shopify native policies
- **Pre-EU launch**: Termly or iubenda (GDPR compliance)
- **Post-private-label**: Lawyer-drafted policies ($500-$2,000)

## 10. Workflow automation

### Shopify Flow (native, free)

**When to use:** any if-this-then-that automation in Shopify.

Examples:
- Tag VIP customers automatically (3+ orders = VIP tag)
- Auto-cancel high-risk orders (risk > 75%)
- Email supplier when order placed (auto-forward to Alibaba contact)
- Add "fragile" tag to orders containing specific SKU
- Notify Slack when order exceeds $500

### Mechanic

$9-$99/mo. More powerful than Flow but requires Liquid code knowledge. Worth it for operators hitting Flow limits.

### Zapier integration

$20-$50/mo+. Connects Shopify to 5,000+ apps.

Examples:
- New Shopify order → create row in Google Sheet → post to Slack
- Low inventory → email supplier
- Refund processed → alert team

**For solo operator:** Shopify Flow is enough until you need to connect to non-Shopify tools. Then Zapier.

## 11. Security and fraud

### Shopify native fraud analysis

Free, built-in. Risk score on each order:
- Low (green): no action
- Medium (yellow): review manually for high-value orders
- High (red): consider cancelling

**Accuracy:** okay for obvious fraud (mismatched billing/shipping, AVS fail, high velocity). Misses sophisticated fraud.

### Paid fraud tools

| Platform | Entry | Purpose |
|---|---|---|
| **Signifyd** | Mid-market ($500+/mo) | Chargeback insurance (they pay if fraud slips through) |
| **NoFraud** | Similar | Alternative to Signifyd |
| **Riskified** | Enterprise | Large brands ($5M+/year) |
| **Shopify Fraud Filter (app)** | Free/paid | Adds custom rules on top of native |

### For dropshipper specifically

**Fraud matters less than chargebacks.** Most chargebacks for dropship are:
1. "Item not received" (shipping window issues, not fraud)
2. "Not as described" (expectation misalignment)
3. "Unrecognized charge" (customer forgot they ordered)

Signifyd/NoFraud handle actual fraudulent orders (stolen cards). Worth it if:
- You're in high-fraud category (electronics, luxury, jewelry)
- Chargeback rate exceeds 1%
- Revenue exceeds $30k/month

For typical dropship: Shopify native + clear shipping communication + good customer service handles 95% of the chargeback problem.

## 12. Performance and speed

### Why speed matters

Google Core Web Vitals affect ad quality score. Slow sites get higher CPMs.

**Benchmarks:**
- LCP (Largest Contentful Paint): under 2.5s = good
- FID (First Input Delay): under 100ms = good
- CLS (Cumulative Layout Shift): under 0.1 = good

### Measuring tools

- **Shopify's built-in speed report**: Admin > Online Store > Speed
- **Google PageSpeed Insights** (free)
- **GTmetrix** (free)
- **WebPageTest** (free, technical)

### Common slowdowns

1. **Too many apps**: each app adds JS. Audit quarterly.
2. **Unoptimized images**: hero images should be under 200KB
3. **Custom code in theme.liquid**: slow theme.liquid = slow everything
4. **Third-party scripts**: Meta Pixel, Klaviyo, Judge.me, etc. all add load
5. **Non-optimized fonts**: 10+ font weights = slow

### Optimization apps

- **Hyperspeed**: $12-$96/mo, lazy-loading, image optimization
- **TinyIMG**: $19.99/mo, image compression, SEO
- **Plug in Speed**: $9.99/mo, script optimization
- **Built-in**: Shopify's native image CDN is already fast; external apps add marginal value

**Honest take:** the best speed optimization is fewer apps, not an optimization app. Install a speed optimizer only after auditing and removing unused apps.

## 13. The critical "less is more" principle

### App bloat is a killer

Typical bloated dropship store:
- 25+ apps installed
- 10+ running on every page load
- 4-6 seconds load time
- 40-50% bounce rate
- CPMs 20-30% above category benchmark

Typical lean dropship store:
- 6-10 apps installed
- 3-5 running on every page
- 2-3 seconds load time
- 25-35% bounce rate
- CPMs at or below benchmark

### Starter stack (launch to $10k/month)

**Core:**
1. **DSers** (AliExpress automation, free)
2. **Klaviyo** (email + SMS, free under 250 contacts)
3. **Judge.me Awesome** ($15/mo, reviews)
4. **AfterShip** (free tier, tracking)
5. **Honeycomb Upsell** ($49.99/mo) OR **AfterSell** ($34.99/mo)

**Total: ~$50-100/month**

### Scaling stack ($10k-$50k/month)

Add:
6. **TrueProfit** ($25/mo, P&L tracking)
7. **Hextom Free Shipping Bar** ($9.99/mo)
8. **Gorgias Starter** ($50/mo once VA is handling tickets)
9. **Shopify Flow** (free, automate VIP tags)

**Total: ~$150-250/month**

### Mature stack ($50k-$300k/month)

Add:
10. **Triple Whale** ($129/mo, attribution)
11. **Lifetimely** ($149/mo, LTV)
12. **Weglot** ($99/mo, if EU localization)
13. **Hyperspeed** or similar ($30/mo, speed)
14. **Chargeflow** (free + 25% of recovered, chargeback automation)

**Total: ~$500-800/month**

### App audit cadence

Every 90 days:
1. List all installed apps (Admin > Apps)
2. For each: "Did I use this feature in the last 30 days?"
3. If no: uninstall. Migrate data first if needed.
4. Measure site speed before and after (PageSpeed Insights)

**Typical outcome of first audit: 30-40% app reduction.**

## 14. MCP-specific integration patterns

Since this skill includes Shopify AI Toolkit / MCP (April 2026), some patterns for solo operator use:

### Pattern 1: Daily ops review via Codex + Shopify MCP

```
Morning: "Summarize yesterday's orders, revenue, and any CS tickets flagged urgent."
Afternoon: "Any out-of-stock alerts? Show top 5 products by revenue."
Evening: "Pull weekly P&L from Shopify + Meta spend."
```

### Pattern 2: Product updates at scale

```
"Update all products in 'winter' collection: add 'winter-ready' tag, set compare-at to 1.5x price."
```

**Always dry-run first:** "Show me which products would be affected" before "execute."

### Pattern 3: Customer service escalation

Via Gorgias MCP (if available): "Show me CS tickets from VIPs waiting over 4 hours."

### Pattern 4: Inventory sync

"Check product X inventory on CJ Dropshipping. If below 10, mark as 'backorder' on Shopify."

### MCP security checklist

- Each MCP server gets scoped API key (not full admin)
- Read-only for most operations
- Write scoped to specific resource types (products, not orders)
- Dry-run any destructive operation
- Audit log review monthly

## Do not

- Install Triple Whale at $10k/month. Premature. Overkill.
- Skip tracking app setup. WISMO tickets will overwhelm you.
- Ignore site speed. Every second over 3s costs you 5-10% conversion.
- Buy Gorgias Pro when Starter handles your volume. Upgrade based on ticket count, not hope.
- Import AliExpress reviews en masse. Dropship signal to buyers.
- Trust auto-translate without native-speaker review on PDP and checkout.
- Grant full Shopify admin to any MCP server. Scope principle.
- Run Loyalty app under $30k/mo revenue. No repeat volume to justify.
- Install fraud tools under 1% chargeback rate. Shopify native is sufficient.
- Keep apps you haven't used in 30+ days. Audit quarterly.

## Cross-references

- Pricing app stack (subscriptions, bundles, upsells): `dropship-pricing-strategy`
- Email/SMS deep dive: `dropship-email-sms`
- PDP apps (reviews, trust signals): `dropship-shopify-build`
- Shipping provider choice feeds tracking: `dropship-suppliers`
- Analytics tools feed into cashflow ops: `dropship-cashflow-ops`
- Fraud and chargeback strategies: `dropship-cashflow-ops`
