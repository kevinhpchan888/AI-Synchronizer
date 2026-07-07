---
name: dropship-pricing-strategy
description: >
  Pricing strategy for Meta-ads-only Shopify dropshipping from a Singapore operator selling globally. Use whenever the user mentions pricing, markup multiples (3x/5x/7x), psychological pricing, charm pricing, compare-at price, anchor pricing, bundles, upsell economics, free shipping thresholds, international pricing, currency rounding, discount framing, subscription pricing, or any variant of "what should I charge", "how do I price for AU/UK/EU", "is compare-at legal", "should I offer subscription", "what's my bundle discount floor". Also trigger for pricing compliance questions (EU Omnibus, UK DMCCA, FTC deceptive pricing, AU ACL two-price), pop-up discount strategy, and price A/B testing. Do not confuse with cashflow-ops (money in/out) or product-evaluation (should I test at all) - this skill is about WHAT PRICE to set and WHY.
---

# Pricing Strategy Skill

## Core principle

**At 2026 Meta CPMs, 3x markup is structurally broken on US Tier 1 traffic. 7x is the practical floor for low-ticket dropship, 5x works for mid-ticket, and pricing compliance across EU/UK/US/AU is non-trivial.** This skill answers two questions: what price will survive the ad-spend math, and what price is legally defensible in each of the operator's four target markets.

The user is Singapore-based selling into US/UK/EU/AU. Every pricing decision has four regulatory surfaces to check and four CPM realities to model.

## 1. Psychological price points: what the research actually supports

The left-digit effect is real, modest, and smaller than guru content implies.

- **Anderson & Simester (2003, Quantitative Marketing & Economics 1(1))**: US catalog field experiments found strongest cell lifted demand from 17.8% to 21.7% (3.9 pp absolute) by adding $9 ending. The "8% lift from $39 to $34" in business press is a loose paraphrase.
- **Thomas & Morwitz (2005, JCR 32(1))**: Effect depends on a change in the LEFTMOST digit. $2.99 vs $3.00 moves perception. $3.59 vs $3.60 does not.
- **Troll, Frankenbach, Friese & Loschelder 2024 meta-analysis (JCP, k=69, N=40,541)**: Small but significant positive effect on purchase decisions. **No significant effect on perceived product quality** in aggregate. The folk claim that .99 cheapens premium brands has weaker support than trade press asserts.

**When charm pricing works:**
- Low-consideration, impulse, unfamiliar items where price is the dominant cue
- Below $50 price points
- Cold Meta traffic (price-dominant decision)

**When it attenuates:**
- When a "Sale" signal is already present (Anderson & Simester: redundant low-price signals substitute)
- Feelings-based purchases where Wadhwa & Zhang (2015, JCR) found round prices feel "more right"
- Premium positioning intentionally countersignaling

### Regional endings diverge

- **US/UK/AU**: default .99. UK slightly less .99-addicted per Bray & Harris (2006).
- **Germany**: Hoffmann & Hackelbusch (2013) found .99 didn't raise sales outside of deep discounts on private labels. Test .90 or round.
- **Japan/China**: 8-ending dominates (Schindler 2009, Gorodnichenko 2024). If expanding there.
- **Israel**: Banned non-zero endings in 2014. Snir/Chen/Levy natural experiment confirmed .99 actively biases price recall downward.

**The "sweet spot" price points at $19.99, $29.99, $39.99, $49.99, $79.99** are folklore, not evidence. No peer-reviewed study isolates these as conversion plateaus. The only mechanism that survives scrutiny is the left-digit boundary at each $X0. Price at $X9.99 outperforms $(X+1)0.00 marginally; the specific dollar amount does not matter beyond that left-digit change.

### Practical rule for multi-market pricing

Configure Shopify Markets rounding rules per market, do not let auto-conversion produce $46.27 prices:
- **US/UK/AU**: force .99 endings
- **DE**: test .90 or round
- **FR/IT/ES**: .99 works, round also acceptable
- **Japan expansion**: 8-endings

## 2. Anchor pricing (compare-at) and the four-jurisdiction compliance perimeter

Shopify's compare-at is a single numeric field. When compare-at exceeds price, the theme renders strikethrough plus a "Sale" badge. **Shopify does not store a 30-day price history natively**, which is the single biggest EU Omnibus compliance gap. Per-market compare-at requires CSV upload.

### Theme behavior

- **Dawn and forks** (Sense, Refresh, Craft, Studio, Horizon): inherit the same `price.liquid` snippet, render strikethrough identically
- **Impulse (Archetype)**: exposes "Saved" label, supports `unit_price_measurement` for EU PID compliance
- **Prestige (Maestrooo)**: downplays percent-off badges for luxury
- **Broadcast (Invisible Themes)**: ships countdown timer section, now explicitly dangerous under UK DMCCA 2024 if not tied to real campaign end

### EU Omnibus Directive is the strictest baseline

**Directive 2019/2161** inserted Article 6a into Price Indication Directive 98/6/EC. Any announcement of a price reduction must reference the **lowest price applied during at least the preceding 30 days**. Enforcement began 28 May 2022.

Fines: at least **4% of annual turnover in Member States concerned**, with **EUR 2m floor** where turnover can't be established.

German Bundesgerichtshof I ZR 85/23 (November 2024) confirmed percentage "savings" must calculate against the 30-day lowest, not strikethrough. France (Ordonnance 2021-1734), Netherlands (Act 23 Feb 2022), DGCCRF and ACM have run coordinated sweeps through 2023-2024.

### US 16 CFR § 233.1

Former price must have been "a bona fide price at which the article was offered to the public on a regular basis for a reasonably substantial period". Inflated reference prices are prohibited. Section 5 civil penalties inflation-adjusted to **$53,088 per violation** in 2024. The FTC Rule on Unfair or Deceptive Fees (16 CFR Part 464) took effect 12 May 2025. California SB 478 Honest Pricing Law effective 1 July 2024.

### UK DMCCA 2024

Digital Markets, Competition and Consumers Act 2024 commenced 6 April 2025 with CMA direct enforcement powers. **Fines up to 10% of global turnover**. Section 230 requires total price inclusive of mandatory fees in any invitation to purchase. Schedule 20 bans fake countdown timers and false urgency per se.

### AU ACL

Sections 18 and 29 prohibit misleading pricing. ACCC two-price rules require higher price was genuinely charged for a reasonable period with substantiating records. Recent: Bloomex $1m (2024), Webjet $9m (July 2025), Emma Sleep June 2025 admission on 58 of 74 products.

### Practical workflow for a SG operator

1. **Export Admin API `/products/{id}/variants.json` daily to Google Sheet**, retain ≥90 days. This is your price history for Omnibus compliance.
2. **Disable compare-at on evergreen SKUs**, use checkout-side Shopify Discount Codes for time-boxed promotions. This materially reduces regulatory surface because no "announcement of price reduction" is rendered on PDP.
3. **Never leave compare-at permanently set**. A "sale" running >30 days is prima facie evidence of inflated reference price in all four jurisdictions.
4. **Avoid countdown timers that reset on refresh**. Per-se banned under DMCCA Schedule 20, deceptive under FTC 2022 Dark Patterns report.

## 3. Bundle math: the 25% contribution margin floor

Stremersch & Tellis (2002, Journal of Marketing 66(1)) separate:
- **Pure bundling**: bundle only, no individual components sold
- **Mixed bundling**: bundle plus individual components (most flexible)
- **Mixed-leader bundling**: hero SKU at full price with discount on attached accessory

**For dropship, mixed-leader is usually right** because it leaves full-price discovery paths intact and lets the hero carry the ad spend.

### Worked example

3-unit bundle, $30 retail/unit, $9 COGS, $6 combined outbound shipping, 3.5% payment fees, target 25% contribution margin:

```
Revenue (3 units): $90
COGS: $27
Shipping: $6
Payment fees: $3.15
Target contribution: $22.50 (25% of revenue)
Target bundle price: $90 - allowable discount
Solve: minimum viable price $47.73
```

Mathematically allows 47% visible discount. **In practice, cap at 20-25%** to leave headroom for Meta CAC (15-20% of AOV on cold US T1 traffic) and 2% refund/chargeback reserve.

### Bundle apps verified April 2026

| App | Entry | Notes |
|---|---|---|
| **Shopify Bundles** (native) | Free | Handles fixed bundles and multipacks. **Incompatible with native Shopify Subscriptions.** |
| **Fast Bundle** | ~$15/mo | Adds mix-and-match and BOGO |
| **Rebolt** | $19.99/mo (third-party listings show $14/$29/$49) | Verify in-app |
| **PickyStory/Amplify** | $29.50/mo <$30k rev, $299.50/mo above | Merchant complaints about attribution inflation |
| **Bold Bundles** (Shop Circle) | Usable | Documented display conflicts when native multi-currency enabled |

**Recommendation for launch:** Shopify Bundles native. Upgrade to Fast Bundle if mix-and-match needed.

## 4. Upsell stack economics under Checkout Extensibility

### Vendor-claimed AOV lifts (self-reported, treat as upper bounds)

- Pre-cart Frequently Bought Together: 10-20%
- Cart drawer: 5-15%
- Post-purchase one-click: 10-15% (some vendors claim 30%)

**Cold Meta traffic typically realizes ~half the claimed lift** because post-checkout engagement is thinner than warm-cohort benchmarks.

### Checkout Extensibility is mandatory

`checkout.liquid` sunset:
- **13 August 2024**: Plus Information/Shipping/Payment pages
- **28 August 2025**: Thank You and Order Status pages

Any upsell app still referencing `checkout.liquid` without migrating to Checkout UI Extensions, app blocks, or Shopify Functions is **dead software in 2026**.

### Stacking rule

One pre-cart/cart widget plus one post-purchase app. Running ReConvert + AfterSell + Zipify simultaneously = three subscriptions, one post-purchase slot. Waste.

### App comparison (verified April 2026)

| App | Entry | Ceiling | Revenue share |
|---|---|---|---|
| ReConvert | Free plan | Scales with orders/upsell rev | Variable |
| **AfterSell (Rokt)** | $34.99/mo (up to 500 orders) | Contact sales enterprise | Rokt Thanks: $0.30-0.50/order kickback |
| Zipify OneClickUpsell | $35/$95/$195 | $195 + 1% upsell rev | 1% |
| **Honeycomb Upsell** | Free/$49.99/$99.99/$149.99 | Flat, no rev share | **None** |
| Cartly (CartHook PP) | Free 0-100 orders +1%; $40/mo 501-1000 +1% | Scales | 1% |
| Rebuy Engine | Starter $99/mo | Scale $249/Pro $499/Grow $749 | Volume-based |

**The hidden cost is revenue share.** At $50k/mo upsell revenue, 1% is $500/mo on top of the $195 OCU tier.

### Recommended starter stack for SG operator (non-Plus)

- **Honeycomb Silver ($49.99)** for cart upsell
- **AfterSell ($34.99)** post-purchase

Upgrade to Rebuy only above ~$30k/mo blended ad spend.

## 5. Free shipping threshold: cross-border reality check

**Viability formula**: `(MCV - AOV) × GPM - ASC ≥ 0`

Where MCV = minimum cart value to unlock free shipping, AOV = current average order value, GPM = gross profit margin, ASC = average shipping cost.

### Worked example

AOV $40, GPM 55%, ASC $8:
- MCV $55: $(55-40) × 0.55 - 8 = $0.25. Barely viable.
- MCV $60: $(60-40) × 0.55 - 8 = $3. Working.

**The consensus 20-30% above AOV rule understates cost for SG-to-US dropshippers.** Cross-border shipping from SG or China 3PL to US makes it too aggressive. **Model 40-50% above AOV** with a viability test using actual cross-border rates.

### Free-always vs threshold

**Free-always wins** for sub-$40 commodity items where shipping is 15-20% of price. Simplifies Meta creative. Removes the single largest cart-abandonment driver (Baymard: **48% of non-browse abandonments cite extra costs too high**).

**Threshold wins** when catalogue is bundle-friendly and AOV can be lifted materially.

### Recommended app: Hextom Free Shipping Bar

Default for multi-market SG operator. Geotargets, integrates with Shopify Markets. Lets you show "Free shipping over US$75" to US, "Free shipping over £60" to UK visitors from the same storefront.

## 6. Shipping as profit center vs trust killer

Handling-fee tactic ($4.95-$7.95 shipping when margin covers free): lifts revenue per order, hurts conversion. Worth a structured A/B test, not a default.

### EU law is explicit

**CRD Article 6(1)(e)** requires trader to disclose total price inclusive of taxes and all freight/delivery/postal charges BEFORE contract. **Article 8(2)** requires consumer to be made aware clearly and prominently, directly before placing the order, with explicit "order with obligation to pay" button.

**UK CCR 2013 Schedule 2(f) and (g)** replicate this. **DMCCA Section 230** is stricter.

### Shipping insurance apps: legal grey zone

- **Route**: licensed insurance producer in US states
- **Navidium**: self-funds, explicitly disclaims insurance status

Route sued Navidium's founder (D. Utah 2:22-cv-00291-TS-JCB) alleging self-fund model is unlicensed insurance. Commercial-disparagement claims dismissed August 2023 but underlying state-law question is **unsettled**. California DOI and several state DOIs historically treat fee-for-claims-payout as insurance requiring a license.

**A SG operator offering toggled shipping protection at US checkout is exposed to US state unauthorized-insurance statutes.** The 2-5% AOV uplift is not worth the exposure across four jurisdictions. If offered at all, use a licensed underwriter (Route, Seel), not self-fund.

### Honest shipping times (required on PDP, cart, confirmation email)

- China to US: 7-15 days standard
- China to UK: 7-15 days
- China to EU: 7-15 days
- China to AU: 7-20 days
- Add 7-14 days during Chinese New Year

Understating transit is an ACCC s29(1)(m) misrepresentation (a count in the Bloomex $1m penalty) and violates EU CRD Article 6(1)(g).

## 7. International pricing: Shopify Markets and the Australia premium

### Shopify Markets modes (2026)

1. **Standard Shopify Markets** (free): 1.5% currency conversion fee baked into converted prices. Supports fixed prices per market via CSV.
2. **Markets Pro** (merchant-of-record via Global-e): handles duties, taxes, fraud, DHL shipping. **October 2025 fee revision**: 3.5% transaction + 1.5% conversion (3.25% transaction for Plus), down from 6.5% + 2.5%. **US-only for merchant entity**: SG Pte Ltd cannot activate directly.

### The Australia premium is real

2013 Australian Parliamentary "At What Cost" report found digital goods up to 88% above US equivalents. Electronics/cosmetics/apparel commonly carry **20-30% AU premium after GST**, driven by:
- 10% GST
- A$1,000 low-value import threshold
- Import Processing Charge (A$68.15 air/A$102.60 sea above threshold)
- Higher last-mile costs
- Higher CPMs

EU typically runs 10-15% above US on DTC consumer goods (19-23% VAT + higher CPMs in DE/FR/IT).

### Currency rounding is critical

**Converting $29.99 USD at spot into AU$46.27 is the worst possible price**: non-round, reads as AU$46, breaks all charm conventions.

Configure Market rounding rules:
- AU$49 (charm, higher margin) or AU$44 (charm, lower margin)
- **£24.99** or **£29** for GB
- **€29.99** or **€34.99** for EU

### Do NOT install Bold Multi-Currency

Shop Circle acquired Bold's suite in 2024. Shopify's own docs flag display conflicts when Bold runs alongside native multi-currency. Native Shopify Payments multi-currency is sufficient for USD/GBP/EUR/AUD.

### Tax display is legally prescribed

- **EU PID Article 2(a)**: tax-inclusive display mandatory for consumer sales
- **UK VATA 1994 s19(2) + HMRC Notice 700/7**: tax-inclusive
- **Australian CCA s48**: tax-inclusive
- **US**: tax-exclusive (exception)

Turn on Shopify's "Include or exclude tax based on your customer's country" toggle in Markets Preferences. Fixed prices per market must already include local VAT/GST.

### Registration thresholds

- UK: **£0 threshold for non-UK established sellers** (not £85k)
- EU IOSS: handles B2C consignments under €150
- AU: register for GST at A$75k forecast turnover

## 8. Markup math: why 3x dies at 2026 US T1 CPMs

### 2026 Meta CPM benchmarks

Sources diverge 30-50% (Superads, Triple Whale, Lebesgue, AdAmigo) by sampling frame and Advantage+ mix:

- **US T1 ecommerce**: $19.76-$28.36, median ~$21.95
  - Q4 peaks 6-15% above Q1
- **UK**: $10-$15 (25-40% below US T1)
- **AU**: $10-$18
- **EU Tier 2 (DE/FR/IT/ES)**: $6.50-$12
- **Beauty/health vertical**: $12.46 on Lebesgue 2026

### Break-even math at $22 US T1 CPM, 1.5% CTR, 2.0% LP conversion

```
Clicks per 1,000 impressions = 15
CPC = $1.47
Purchases per 1,000 impressions = 0.30
CPA = $73
```

**3x markup ($30 on $10 COGS)**:
Net pre-ad contribution ~$12 after COGS, shipping, fees, apps.
CPA $73 = **loss of $61/order**.
**3x is structurally broken on US T1.**

**5x markup ($50)**:
Net pre-ad ~$31.50.
Still losing against $73 CPA.
Hitting 20% CM target requires CPA $21.50 = **5% CTR or 6.8% LP conversion**. Top-decile creative territory.

**7x markup ($70)**:
Net pre-ad ~$50.
Break-even in reach at benchmark performance.
20% CM feasible with CTR ~2% and LP conversion ~3%. **Competent operator can hit.**
**7x is the practical floor for Meta-funded US T1 low-ticket dropship in 2026.**

### The "3x rule" is historical artifact

Dates from 2016-2019 when CPMs ran $6-$10. Now physics-false.

- UK/AU CPMs $12-$15: 5x pencils
- EU Tier 2 CPMs $7-$10: 4x can work with competent creative
- **Low-ticket $20-40**: structurally unprofitable on Meta US T1 without breakeven-first-order + LTV via email/SMS
- **Mid-ticket $40-80**: dominant winner band, 5-7x markup, 25-35% CM. One creative fatigue cycle tips to loss.
- **High-ticket $100+**: easier per-order math but lower LP conversion (0.5-1.5%), longer consideration cycles. Solo operators without retargeting burn cash on mid-funnel.

### Anton Kraly's high-ticket dropshipping doctrine

Drop Ship Lifestyle, since 2013. Teaches $300-$3,000 US-supplier-sourced items on Google Ads, not Meta.

**Legitimate merits:**
- Better unit economics
- Faster shipping
- Search-intent traffic converts 2-3x better on considered purchases

**Real limitations:**
- Program pricing $1,497-$10,497
- Supplier-approval friction acute for SG operator (tax-ID-gated approvals from US suppliers)
- Google high-ticket CPCs now $5-$15 common
- Nearly all positive reviews online are affiliate-contaminated

## 9. Discount framing, loyalty economics, dark-pattern perimeter

### Percent vs dollar framing

**Chen, Monroe & Lou (1998, Journal of Retailing)**:
- **Dollar-off** reads larger on high-ticket ($1,000 off a $20,000 car)
- **Percent-off** reads larger on low-ticket (50% off a $0.50 can of cola)

Berger's "Rule of 100" ($100 threshold) is practitioner synthesis, not empirical finding.

**DelVecchio, Krishnan & Smith (2007, Journal of Marketing)**: Percent frames produce higher post-promotion reference prices, meaning they erode brand pricing less than dollar-off framing.

### First-order popup benchmarks (Wisepops 2023 via Klaviyo April 2026)

- Average: 3.80%
- Top decile: 23.67%
- Multi-step: 5.64% vs single-step: 3.07%
- 10% or $20 off first-order popup: typically 7-10% signup

**10% is the sweet spot.** 15% lifts signup but anchors price lower, compounding repeat-margin problems.

### Abandoned cart email benchmarks

Klaviyo 2025-2026 aggregate:
- Default single-email: 5-8% recovery
- Properly sequenced flows: 10-15%
- Top decile: 15-25%
- Revenue per recipient: $3.65 avg, $28.89 top 10%

**Conventional 3-email structure** (idiomatic, not empirically derived):
1. T+1-4h: reminder, no discount
2. T+24h: urgency, optional 5%
3. T+48-72h: meaningful 10-15% offer

Escalating discounts train repeat customers to abandon intentionally. **Do not apply to returning buyers.**

### Loyalty apps are premature for pre-winner stores

Verified 2026 pricing:
- **Smile.io**: Free (200 orders cap), Starter $49/mo, Growth $199/mo (VIP gated here), Pro $599/mo, Plus $999/mo
- **LoyaltyLion**: $159/mo Small Business, $399/mo entry more commonly quoted
- **Yotpo Loyalty Pro**: $199/mo caps 500 orders, $0.20/order overage. 1,500-orders/mo store actually pays $399

**Every loyalty platform is worth $0 until repeat purchase rate >15-20%.** Under $30k/mo revenue, Klaviyo post-purchase flow with 10% next-order coupon outperforms $199-$399/mo loyalty app on ROI.

### The quality-price correlation

**Rao & Monroe (1989, JMR) meta-analysis**: Positive price-quality correlation. Aggressive discounting erodes perceived quality when price is a quality cue (which it is for unfamiliar dropship categories).

Compare-at inflation ($99.99 "was" on product that sells at $49.99) is both a quality-signal problem AND, if systematic, a violation of FTC/UK CPRs-DMCCA/EU UCPD.

### Dark-pattern perimeter

- **FTC Staff Report "Bringing Dark Patterns to Light"** (15 September 2022, P214800): countdown timers on non-time-limited offers, fake "almost sold out" = Section 5 violations. **Civil penalties $53,088/violation.**
- **EU Digital Services Act Article 25** (in force 17 February 2024): prohibits deceptive interfaces. **First DSA fine 5 December 2025: €120m against X.**
- **EU Digital Fairness Act** (consultation 2025-2026): will extend deceptive-design prohibitions to B2C services including solo ecommerce.

Countdown timers must reflect real deadlines. Stock scarcity must reflect real inventory (hard in dropshipping where suppliers have ample stock). Compare-at must reference real past selling price, not MSRP.

## 10. A/B testing pricing: when it matters, when it's noise

### Shopify Rollouts (Winter '26 Edition)

First native split-testing feature in admin. **Price Testing listed as Beta** per Think Commerce 25 Feb 2026. Handles theme-level A/B tests and scheduled storefront rollouts. Does not match third-party for element-level, audience segmentation, MDE calculators, multivariate checkout experiments.

For solo SG operator at pre-winner stage: Rollouts sufficient for theme tests. Stress-test Price Testing Beta on low-stakes product before relying.

### Third-party apps (April 2026)

- **Intelligems**: $49/mo paid tier (free URL-redirect-only for <3,000 orders, max 2 concurrent tests). Scales to $999/mo. Migrated to Shopify Cart Transform Function after Checkout Scripts deprecation.
- **Dexter**: Narrower, cheaper, price-A/B focused. Opaque "free to install with additional charges".
- **Visually.io**: Free and Free-trial plans. Paid "contact sales". Aggregators place mid-market at $200-$1,500/mo.

**Recommended for solo operator: Intelligems $49/mo.**

### Statistical reality

At 80% power, α=0.05, baseline 2% conversion, detecting a **10% relative lift** requires **~8,000 sessions/variant (16,000 total)**.

At 1% baseline: double that.
RPV tests: 1.5-2x variance.
5% relative lift (more realistic): quadruples sample requirement.

**Minimum practical threshold: 1,000 sessions/variant/week, or ~$2,000-$5,000 weekly revenue per variant.**

**Under $5,000/mo store revenue, price tests almost never reach significance in 4-6 week window.** Running underpowered tests and acting on noise is a common reason pre-winner stores drift into worse prices.

Rules:
- Single-variable tests only
- 7-14 day minimum windows (captures weekday/weekend)
- Never peek and stop early
- Segment by country after the test (CPM, LP conversion, AOV differ by geo)

## 11. Subscription pricing (for consumable dropship only)

Subscription makes sense for consumables only: supplements, pet food, coffee, skincare refills, cleaning products, razor blades. **Do not attempt on fashion, accessories, home decor, one-time gifts.**

Meta creative must promise recurring benefit (save X%, never run out), not novelty. For general dropship catalogue, loyalty program does retention work more cheaply.

### Subscribe-and-save pricing

Industry consensus: **10-15% off**. Below 10% fails to convert. Above 15% erodes margin without conversion lift. Vendor-reported 18-25% conversion of eligible one-time buyers at 10-15% off is self-reported.

**Involuntary churn (failed payments)**: up to 50% of total churn. Stripe Smart Retries and Shop Pay card-updater reduce failures materially.

### Subscription app comparison (April 2026)

| App | Entry | Transaction fee | Notes |
|---|---|---|---|
| Shopify Subscriptions (native) | Free | None | **Incompatible with native Bundles** |
| **Seal Subscriptions** | Free <150 subs; paid $4.95+/mo | 0% | Best starter |
| **Appstle Subscriptions** | Free <$500/mo sub rev; Starter $10/mo | 0% most plans | Best budget scale |
| Awtomic | $49+/mo | Varies | Mid-market |
| Bold Subscriptions | Free 90 days, Launch $24.99/mo + 2% | 1-2% | Weaker vs alternatives |
| Loop | $99-$399/mo Growth + Enterprise | No explicit per-order | Mid-market |
| Recharge (new installs post 9 Feb 2026) | $25/mo 25-50 subs; Standard $99/mo + 1.25% + $0.19 | 1.25% Standard, 1% Pro | Market leader, expensive |
| Skio | $599/mo entry | 1% + $0.20/txn | Premium, expensive |

**Recommendation for SG dropshipper**: start Seal free or Appstle Starter to validate. Move to Recharge/Skio only after $50k/mo subscription revenue where transaction fees matter more than monthly fees. Starting on Skio at $599/mo before math works is a common first-year mistake.

## Pricing decision workflow

When user asks "what should I price this at?":

1. **Identify target geo** (US T1? UK? EU? AU?)
2. **Pull CPM benchmark** for that geo
3. **Compute break-even CPA** at realistic CTR (1.5%) and LP conversion (2.0%)
4. **Work backward to required markup multiple** to hit 20% CM target
5. **Round to charm ending** for that geo (.99 for US/UK/AU, .90 or round for DE)
6. **Set per-market fixed price** in Shopify Markets
7. **Verify compare-at compliance** (30-day history maintained, not permanent)
8. **Model bundle/upsell lift** if unit price insufficient

## Do not

- Recommend 3x markup for US T1 traffic. The math is broken. Show CPA vs break-even evidence.
- Accept fake compare-at prices. EU Omnibus + UK DMCCA + AU ACL all penalize. **Compliance is mandatory, not optional.**
- Install Bold Multi-Currency. Conflicts with native Shopify Payments.
- Let Shopify auto-convert produce non-charm prices like AU$46.27. Always configure rounding rules.
- Recommend Skio or Recharge subscription apps before $50k/mo subscription revenue. Seal or Appstle first.
- Run price A/B tests under $5,000/mo store revenue. Underpowered, noise-driven.
- Use countdown timers that reset. DMCCA Schedule 20 banned. FTC Section 5 violation.
- Sell shipping insurance via Navidium self-fund at US checkout. Unauthorized insurance exposure.

## Cross-references

- Break-even CPA math: `dropship-product-evaluation` (unit economics calculator)
- Working capital math behind discount decisions: `dropship-cashflow-ops`
- PDP copy for price presentation: `dropship-shopify-build`
- Email discount sequencing: `dropship-email-sms`
