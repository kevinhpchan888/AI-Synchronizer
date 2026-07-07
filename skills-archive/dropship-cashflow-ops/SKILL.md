---
name: dropship-cashflow-ops
description: >
  Finance and cashflow operations for a Singapore-incorporated Meta-ads-only Shopify dropshipper. Use whenever the user mentions cashflow, working capital, payment lag, Stripe payouts, Shopify Payments, AMEX, business banking, Wise, Airwallex, Aspire, chargebacks, VAMP, P&L tracking, bookkeeping, Xero, A2X, 13-week forecast, Shopify Capital, Wayflyer, Choco Up, Funding Societies, financing, or any variant of "how do I fund ads between payouts", "what's my true margin", "should I take financing", "which bank", "how do I track this". Also trigger for exit valuation, Singapore tax obligations, source-of-income questions, and capital stack progression decisions. This is the money-in/money-out skill; for what-price-to-set use pricing-strategy.
---

# Cashflow Operations Skill

## Core principle

**The payment lag is what kills pre-winner dropshippers, not bad products.** A Singapore operator running $1k/day ad spend on Stripe T+7 has a $7-9k peak working-capital gap before seeing a cent. Understanding this lag and structuring around it (AMEX float, Wise/Airwallex USD accounts, selective SG financing) is more important than optimizing any single ad.

This skill covers: the mechanics of the gap, the SG-specific financing landscape, banking and FX routing, payment processing fee stacks, chargeback defense under 2026 VAMP rules, P&L tracking that beats Meta-reported ROAS, the Xero + A2X bookkeeping stack, and Singapore tax obligations the operator cannot delegate away.

## 1. The payment lag and how working capital gets squeezed

### Shopify Payments Singapore (verified at help.shopify.com)

**Shopify Payments IS available to SG-incorporated entities.** SGD payouts to SG bank accounts. Retail support via WisePad 3 launched 2023. 3-business-day rolling schedule. First payout after new-store activation held 5-7 business days for verification. Higher-risk accounts placed on 5-20 business-day custom schedules.

### Stripe Singapore

**Defaults to T+7 calendar days**, not the 2-day US standard. New accounts typically see first payout 7-14 calendar days after first successful charge. High-risk categories (supplements, CBD/nutra, dropship-from-China, subscription boxes) can be moved to 14-day rolling or manual payouts.

### Stripe rolling reserves

10-25% for 90-180 days on accounts flagged as high risk.

**Reserve reduction levers:**
- 6+ months of sub-0.75% dispute rate
- Stable refund rate under 5%
- Proactive supplier documentation uploads
- Trademarked brand
- Domestic-registered entity

### Meta Ads billing thresholds

Escalate through **$25, $50, $250, $500, $750** as account builds history. Parallel month-end sweep.

At $1,000/day spend: account crosses $750 ceiling every 18-24 hours. **Card charged ~30 times per month** before any Stripe payout arrives.

### Worked example: $1,000/day spend, 2.5x ROAS, SG Stripe T+7

```
Daily revenue: $2,500
COGS + shipping (35%): $875
Stripe fees (~3.6% blended): $90
Gross contribution pre-ad: $1,535
Net after ads: $535/day

Day 1 cash: -$1,000
Day 7 cash: -$7,000 (deepest)
Day 8+: day-1 net ($2,410) arrives, gap narrows

Peak working-capital gap: $7,000-$9,000
```

If supplier paid on shipment (not net 30), gap is **$13,000-$16,000**.

**Same spend on US Shopify Payments T+3:** gap shrinks to $3,000-$4,000.

**This is the single biggest cashflow argument for routing to Shopify Payments SG, opening a US/UK subsidiary, or pre-funding with AMEX Business Platinum 51-day float.**

## 2. Credit and financing: Singapore-specific options

**Most global ecommerce financing is unavailable to SG Pte Ltds:**
- Shopify Capital: US/UK/CA/AU only
- Wayflyer: US/UK/CA/AU/IE/BE + (DE/ES/NL/SE/DK at higher minimums). NOT Singapore.
- Clearco: post-restructure, US-only
- Ampla: acquired by FundThrough April 2025, standalone LOC no longer exists

### The two directly SG-relevant options

**Choco Up** (choco-up.com, SG HQ under UEN 202008457W, HK and AU offices):
- Revenue-based financing up to USD 5m
- Fast-track facilities to S$150,000
- Working capital to S$1.2m
- Accepts SG/HK/MY/AU incorporation
- One-time fee + revenue share. No interest, no equity, no collateral.
- Secured USD 30m credit facility from CHUAN April 2026 to expand SME lending.
- **Most directly relevant option for SG dropshipper.**

**Funding Societies** (fundingsocieties.com, MAS-licensed CMS100572):
- SEA's largest P2P SME platform, over S$2b deployed regionally
- SG SME loans up to S$4m
- 48-hour disbursement
- Headline "from 0.8%/month" on working capital = **effective ~17-18% APR**
- Start-Up Financing product accepts newly incorporated Pte Ltds
- One of few viable SG options for businesses under 6 months old

### APR honesty check

Factor rates hide true cost:
- Shopify Capital factor 1.15 over 6-month payoff = **~30% APR, not 15%**
- Funding Societies 0.8%/month flat = **17-18% EIR**
- Choco Up revenue-share math typically lands in **20-30% APR-equivalent** depending on payback speed

### When financing is rational

- Validated winner at 2.5x+ blended ROAS
- Constraint is purely working-capital gap between ad spend and Stripe payout

### When it's a trap

- Taking advance to cover a losing product
- Broken funnel
- Personal drawdown
- Remittance is fixed % of daily gross; stalled business cannot shrink burden by scaling down

**Do not accept a Capital offer unless implied APR is under 25% AND 13-week forecast survives a 30% sales drop without missing the remittance.**

## 3. Banking and FX for Singapore operator

### FX cost comparison on $100,000/month USD payout

| Route | Markup | Cost on $100k USD→SGD |
|---|---|---|
| OCBC/DBS/UOB retail spread | 1.0-1.5% | S$1,340-2,010 |
| Wise Business | ~0.35% | S$469 |
| Airwallex | ~0.5% | S$670 |
| **Aspire Premium** (first S$13k free, then ~0.22%) | ~0.22% | S$190-250 |
| Revolut Grow (free to plan cap, then 0.6%) | mixed | ~S$700 |

### The right pattern

**USD-denominated Wise or Airwallex account as Stripe payout destination.** Hold USD until:
- USD ad-spend card bills settle
- USD suppliers get paid
- Convert to SGD only at month-end for tax and drawings

Avoids round-tripping USD→SGD→USD twice.

**Aspire Premium is cheapest for initial S$13k/mo FX free allocation.** Shopify Payments SG pays SGD to SG bank natively; for USD, the merchant holds a USD account (Wise, Airwallex, Aspire all supply US routing/account numbers that Stripe accepts per support.stripe.com/questions/receiving-usd-payouts-for-singapore-and-hong-kong-users).

### Traditional banks still matter

For credit lines and SGD operational runs:
- **OCBC Business Growth Account**: S$10/mo (waived first 2 months) with multi-currency add-on
- **DBS Business Multi-Currency**: S$10-40/mo depending on avg balance, 13+ currencies native
- **UOB eBusiness**: similar fall-below structure

Opening requires: ACRA BizFile, MyInfo Business, directors' IDs. Online completion 2-5 business days.

### FX gains and losses are taxable (IRAS e-Tax Guide Fifth Edition)

**"Income Tax Treatment of Foreign Exchange Gains or Losses for Businesses"**:

- **Realised FX differences on trade receivables, trading stock, revenue-nature bank accounts**: taxable/deductible
- **Unrealised revenue-nature FX differences**: taxable/deductible by default since YA 2004 (unless pre-2004 election made)
- **Designated Bank Accounts** (used only for capital-nature items): FX differences stay capital

**Holding USD rather than converting at each payout creates larger unrealised/realised tracking requirement.** Most operators pick:
(a) Convert at payout via Wise fixed rate, book everything in SGD
(b) Hold USD and book USD transactions at monthly average rate

## 4. Payment processing: the cross-border fee stack

### SGD card rates by Shopify plan (April 2026)

Triangulated from Wise SG, GemPages, Avada, Shopify community:

| Plan (SGD/mo annual) | SG card online | Intl/Amex online | 3rd-party gateway fee |
|---|---|---|---|
| Basic S$39 | 3.2% + S$0.50 | 3.6% + S$0.50 | 2.0% |
| Grow S$132 | 3.1% + S$0.50 | 3.5% + S$0.50 | 1.0% |
| Advanced S$531 | 3.0% + S$0.50 | 3.4% + S$0.50 | 0.5% |

### The structural cost pain

Most SG dropshipper volume = US/UK/EU/AU cards = **non-domestic to SG acquiring contract**, hit international rate (3.4-3.6% + S$0.50) + 2% FX spread when Shopify converts USD→SGD.

**Effective all-in on USD 50 US-card order: ~5.4-5.6% + fixed fee.**

This is the single biggest structural cost disadvantage of a SG Shopify Payments stack vs incorporating in a target market.

Operators sometimes use **Stripe Atlas (US C-corp)** once US volume exceeds ~USD 30,000/mo, where fee savings pay for incorporation and US compliance.

### Stripe Singapore detail

Base 3.4% + S$0.50 domestic + **0.5% for international cards** (since 15 Oct 2023, not 1-2% as commonly cited) + 2% currency conversion on non-USD accounts. Dispute fee S$15 non-refundable.

### PayPal Singapore

3.9% + S$0.50 domestic (last updated 9 Feb 2026). **+ 0.5-1.5% cross-border surcharge** depending on country. **+ 3-4% currency conversion** over PayPal's base rate.

**Effective rate on US customer settled to SGD: 4.4% + fixed fee + 3-4% FX.**

SG dropshipper shipping 14-21 days from China faces high "not received" loss rate on PayPal because Buyer Protection window is 180 days and tracking-to-shipping-address is the gating document.

### Restricted categories matter

Stripe doesn't prohibit dropshipping outright but requires merchant of record with controlled fulfilment. **Long China-transit dropshippers regularly get flagged at 0.5-1% dispute rate.**

**Supplements, nutraceuticals, CBD, skincare with efficacy claims**: routinely de-platformed. Skincare dropshipper must keep copy strictly cosmetic (moisturise, soften, refresh), never therapeutic (anti-aging cure, acne treatment, hair regrowth).

### Wallets and BNPL

**Shop Pay**: exclusive to Shopify Payments, free at underlying card rates. Shopify's commissioned study claims up to 50% conversion lift vs guest checkout (typical 9%, 18% for returning customers). Independent summaries (Platter.com) cite more modest 1.72% average.

**Shop Pay Installments** (Affirm-powered):
- US since 2021
- Canada rollout 2025
- UK launched October 2025
- **NOT available in EU/AU/SG**

**BNPL merchant fees**: 4-6% per transaction. Sensible only for AOV >$100-150 in fashion/beauty/home/furniture.

**Regulatory tightening:**
- UK FCA regulating Deferred Payment Credit (BNPL) from **15 July 2026** under Consumer Duty + FOS access
- Australia regulates BNPL as Low Cost Credit Contract under ASIC since **10 June 2025**

### Stripe Radar and Chargeback Protection

- **Stripe Radar**: bundled at standard pricing. Radar for Fraud Teams: +$0.02/screened transaction
- **Stripe Chargeback Protection**: 0.4% per eligible transaction. **Does NOT cover "product not received" or "not as described"** (the dominant chargeback reasons for China-transit dropship). USD 25,000 annual reimbursement cap (EUR 20,000 Europe). Limited value.
- **Shopify Protect**: US-only, SG merchants cannot access

### 3DS is non-negotiable for EU/UK traffic

PSD2 SCA mandatory in EU since full enforcement 31 Dec 2020. UK enforcement completed 14 Mar 2022. Both Shopify Payments and Stripe handle 3DS natively with smart routing. **3DS shifts liability on fraud chargebacks to the issuer.**

## 5. Chargeback defense: documentation as product

Stripe's disputes documentation: "Even in the most favorable cases, it's very difficult to overturn a disputed payment."

### Industry win rates

| Reason category | Win rate | Critical evidence |
|---|---|---|
| Fraudulent without 3DS (Visa 10.4) | 8-12% | 3DS ECI if available; otherwise near-impossible |
| Fraudulent with 3DS liability shift | 70%+ | Automatic |
| Product not received (Visa 13.1/MC 4855) | 25-40% w/delivery confirmation; <10% without | Tracking to shipping address, signature above USD 750 |
| Not as described (Visa 13.3/13.5/MC 4853) | 30-45% | Product photos, specs, PDP screenshot, ToS acceptance |
| Duplicate / credit not processed / subscription cancelled | 50%+ | Refund records |
| Unrecognized (Visa 10.3) | 15-25% | Clear billing descriptor |

### Visa Compelling Evidence 3.0 (active since 2023)

Shifts liability BACK to issuer on Visa 10.4 disputes if merchant supplies **two prior undisputed transactions from same cardholder using same IP, device ID, shipping address, or account within 120-365 days**. Stripe auto-checks eligibility.

### 2026 chargeback threshold landscape changed materially

**Visa's legacy VDMP and VFMP replaced by Visa Acquirer Monitoring Program (VAMP)** effective 1 April 2025. Advisory period through 30 September 2025. **Enforcement fines from 1 October 2025.**

VAMP ratio = (TC40 fraud reports + TC15 non-fraud disputes) / total settled transactions. **Double-counts fraud events**, pushing typical merchants higher than under VDMP.

Merchant thresholds apply where monthly combined events >1,500.

**Effective 1 April 2026: Merchant Excessive threshold dropped from 2.2% to 1.5%** in US/CA/EU/APAC. **USD 8 per event fees above threshold.** Acquirer-tier thresholds (0.5-0.7% above standard) mean your processor is pushed well before you are. **Expect Stripe or PayPal action long before you hit the 1.5% Visa merchant line.**

### Mastercard Excessive Chargeback Program

Triggers at 100-299 chargebacks and CTR 1.5-2.99%. Fines escalate:
- Month 2: $1,000
- Month 3: $2,000
- Through to $100,000/month from month 19+

12+ months non-compliant risks acquirer termination and **MATCH list placement** (5-year blacklist for opening new MIDs).

### Processor-specific thresholds

- **Stripe internally engages at ~0.75% dispute rate**, action at 1%
- Supplements, skincare-with-claims, China-dropship verticals often see stricter internal limits of 0.5%
- **PayPal**: begins High Volume Dispute Fees above 1.5% with 100+ sales in prior 3 months. Restricts accounts above ~1%

### Chargeback automation tooling

- **Chargeflow**: Shopify-native, success-based 25% of recovered chargebacks, no monthly fee, SOC 2 Type II, integrates Stripe/Shopify Payments/PayPal/Braintree/Recharge. **Practical primary for solo SG dropshipper** (no fixed cost, unifies alerts + responses)
- **Disputifier**: 12-20% of won chargebacks, opaque alerts pricing
- **Justt, Chargebacks911**: mid-market, contact-sales pricing typically 25-30% of recovered

### Preemption matters more than response

Ranked by impact for China-transit dropship:
1. Shipping windows stated longer than 95th-percentile transit (10-21 business days to US, 12-25 to UK/EU, 10-20 to AU)
2. Automated shipping updates at each leg
3. Customer service under 24 hours
4. Returns policy linked from footer, checkout, confirmation email
5. Billing descriptor matching store name EXACTLY (not "SHOPIFY*XXX")
6. Order confirmation within 60 seconds with shipping window in bold
7. 3DS on all EU/UK traffic

### Pre-chargeback alerts

Via **Ethoca (Mastercard)** and **Verifi RDR/OI (Visa)**. Intercept disputes before they post. Direct contracts require volume; solo operators go through resellers (Chargeflow Alerts, Disputifier, Kount).

Per-alert costs USD 5-40 + refund itself. Breaks even vs dispute fee (SGD 15-20) + disputed amount + threshold risk at any chargeback rate above ~0.3%.

## 6. P&L tracking: why Meta ROAS lies and what to do

**Meta's reported ROAS overstates profitability for four structural reasons:**
1. Default 7-day-click/1-day-view attribution credits Meta for anything a user clicked in prior week
2. No deduplication against organic, email, or direct
3. `purchase_value` is gross revenue, not margin
4. Post-iOS 14.5 modelled conversions inflate vs actual Shopify orders

**Meta's own Conversion Lift studies typically find "incremental conversions" are 50-70% of attributed conversions.**

### True contribution margin per order

```
Revenue
- Product COGS
- Supplier shipping
+ Shipping revenue
- Payment fees
- Refund/chargeback reserve
- Variable ad spend attributed
- Transaction/app fees tied to order
= Contribution margin
```

Anything above this is overhead.

**Blended MER** (Net revenue / Total ad spend) is the honest metric because platform ROAS overlaps across channels.

### Monday morning ritual

Pull prior week:
- Shopify gross revenue by currency
- Refunds
- Net revenue
- Meta ad spend (use "Amount spent", not "Results × CPR")
- Google/TikTok spend
- Product COGS from supplier invoices
- Shipping cost
- Payment fees from processor statements
- Apps/variable fees
- Contribution margin $ and %
- Blended MER
- Blended CAC (total ad spend / first-time Shopify customers)
- Meta-specific CPA for comparison

Reconcile currencies to SGD at week's average rate. **Do not mix currencies in the CM line.**

### Per-SKU P&L is mandatory

Blended CM can hide SKU-level losses where winners subsidise losers. Any SKU with negative CM% across 30 days on 50+ orders: **kill or re-price.**

Ad-spend attribution by SKU, ranked by accuracy:
1. One-product-per-campaign Meta structure (best)
2. Shopify UTM + campaign mapping via Triple Whale or Lifetimely
3. Rough allocation by revenue percentage (worst; masks problems)

### Cadence

- **Daily**: MER and conversion check (5 minutes)
- **Weekly**: full ritual Monday AM (45 minutes)
- **Monthly**: full Shopify-Xero-bank reconciliation (2-3 hours)
- **Quarterly**: unit economics and LTV cohort review

## 7. Bookkeeping stack: Xero Premium + A2X, nothing more

### Xero Singapore Premium: S$95/month

Verified from xero.com/sg/pricing-plans/update, effective 1 November 2025.

**Multi-currency support is Premium-only in SG.** Dropshipper on Xero Standard at S$70/mo CANNOT handle USD/GBP/EUR/AUD payouts correctly and will break reconciliation.

Xero is on IRAS's Seamless Filing for Form C-S list and is InvoiceNow-ready. **IRAS requires new voluntary GST registrants from 1 November 2025 to transmit invoices via InvoiceNow (PEPPOL)** per IMDA/IRAS joint announcement.

Hubdoc included at Standard+ tiers.

### QuickBooks Online SG

Still available despite APAC pullback rumours (intuit.com/sg). SG accountant ecosystem materially thinner than Xero's. PSG grant coverage favours Xero. **Not recommended for new SG Pte Ltd unless operator already entrenched.**

### Wave

Free but US/CA-focused. No SG GST codes, no F5 return support, no IRAS integration. **Will create non-compliance risk once GST-registered.**

### A2X for Shopify

a2xaccounting.com/shopify/pricing. Shopify-to-Xero/QBO reconciliation layer. **Prevents the single most common ecommerce bookkeeping mistake: booking Shopify payouts as revenue.** Payouts are net (after refunds, fees, taxes, adjustments); revenue is gross.

**Actual 2026 Shopify tier names:**

| A2X Shopify | USD/mo | Orders/mo | Stores | COGS |
|---|---|---|---|---|
| Mini | 29 | 200 | 1 | No |
| **Basic** | **45** | **500** | **1** | **Yes** |
| Professional | 79 | 2,000 | 1 | Yes |
| Premium 5k | 115 | 5,000 | 5 | Yes |
| Premium 10k | 159 | 10,000 | 5 | Yes |
| Premium 20k | 289 | 20,000 | 5 | Yes |

### Alternatives

- **Link My Books**: from ~$21/mo for 200 orders. Scales cheaper than A2X at similar volumes. Built-in VAT handling for UK/EU.
- **Synder**: overkill for pure Shopify at $65-275/mo. Multiple Capterra/G2 reviewers flag annual-contract billing issues.

### Minimum defensible stack for SG Pte Ltd

Accrual basis, multi-currency:

```
Xero Premium (S$95/mo)
+ A2X Basic (USD 45/mo ≈ S$60)
+ Hubdoc (bundled)
= ~S$155/month
```

**Below this, GST compliance and FX tracking break.**

## 8. Dropship accounting specifics under SFRS

Pte Ltd prepares accounts under **SFRS or SFRS for Small Entities**. Both substantially converged with IFRS.

**Accrual basis required** under Companies Act 1967 and SFRS framework.

### SFRS(I) 15 / FRS 115 (Revenue)

Revenue recognises when control transfers, typically **delivery for DTC dropship**. COGS matches revenue recognition, so for pure dropship with supplier invoiced per order, COGS books at fulfilment.

### SFRS(I) 1-2 (Inventories, IAS 2 equivalent)

**LIFO is prohibited.** Only FIFO or weighted average permitted. Irrelevant for pure dropship (no inventory asset). Mandatory when transitioning to private-label with 3PL stock.

For private-label transition: storage, inbound freight, duties, non-recoverable import VAT are **capitalised into inventory cost**. Outbound fulfilment is **period expense**.

### Output GST/VAT/sales tax is a liability, not revenue

COGS does not include recoverable input tax.

**If SG GST-registered:**
- GST charged on Shopify fees, Meta ads (via OVR since 2020), SG-based app subscriptions is **recoverable input tax**
- **Export sales to US/UK/EU/AU customers are zero-rated under GST Act s.21(6)**
- Destination-country obligations separate: UK VAT registration at £0 threshold for non-UK sellers, EU IOSS <€150 B2C consignments, US sales tax by state (Wayfair), AU GST on LVIG once A$75k turnover

### Foreign exchange under SFRS(I) 1-21 / FRS 21

**Functional currency for SG Pte Ltd with SG operations/directors is usually SGD.** Document the determination.

Foreign-currency revenue translates at spot on transaction date (or period-average approximation). Monetary items retranslate at closing rate with differences to P&L.

**IRAS positions:**
- Realised FX on revenue-account items: taxable/deductible
- Realised FX on capital-account items: capital, not taxable/deductible
- Unrealised FX on revenue-nature items: taxable/deductible by default since YA 2004

Keep bank accounts clean by currency to simplify.

## 9. Cashflow forecasting: 13-week rolling direct forecast

**13 weeks matches Stripe/Shopify cycle plus ad-cycle buffer.**

### Rows

Starting cash across all bank and wallet balances, then:

**Weekly inflows:**
- Shopify payouts lagged 3 days (US entity) or 7 (SG Stripe)
- Stripe payouts
- Refund reversals
- AMEX statement credits

**Weekly outflows:**
- Meta billed ~daily at $1k+ spend
- Google/TikTok
- Supplier COGS net 0 or 15/30 depending on terms
- Shipping and 3PL
- Shopify + app stack ~S$400-1,500/mo
- Payroll/director draw
- Corporate tax provisioning 17% of taxable profit
- GST provisioning 9% if registered
- Financing repayments

**Trigger**: ending cash minimum buffer = 30 days of ad spend.

### Tools (2026)

- **Float.com** (~£49-169/mo): connects to Xero. **Right answer for solo SG operator running <$500k annual revenue.**
- **LiveFlow** (historically USD 159-499/mo SMB): overbuilt below $2m
- **Jirav**: mid-market FP&A at USD 500+/mo
- **Pulse**: USD 29-89/mo, simple cashflow
- **Well-built Google Sheet**: perfectly adequate below $50k/mo revenue

## 10. Capital stack progression: bootstrap to exit

### Stage 1: Bootstrap S$4,000-14,000

- Pte Ltd incorporation (ACRA ~S$315 + corp sec S$600-1,500)
- 30 days of sub-$100/day ad testing
- First supplier batch
- **Test 3-5 products before external capital**

### Stage 2: Revenue-based financing at S$5-10k/mo

**Viable SG options:**
- Choco Up Upfront/Uplift
- Funding Societies Start-Up Financing (accepts newly incorporated Pte Ltds, S$100k-500k working capital)
- 8fig subscription plans

**Skip Shopify Capital/Wayflyer/Clearco unless operating under US/UK subsidiary.**

### Stage 3: AMEX for ad-spend float

SG AMEX business lineup (verified April 2026):

| Card | Annual fee | Interest-free window |
|---|---|---|
| AMEX SIA Business Credit (HighFlyer) | S$350/yr | 22 days, 2.5 HF points/S$1 on Amex merchants |
| **AMEX Business Platinum** | **~S$1,736/yr** | **51 days** |
| AMEX Business Gold | [verify current terms] | [varies] |

**MCC 7311 (Advertising Services)** is how Meta/Google/TikTok code ad spend. AMEX SG treats as standard earn, not bonus. Lift is pure float, not multiplier.

**AMEX Business Platinum's 51-day window structurally offsets SG Stripe T+7 lag:**
- Ads billed day 1 settle day 51
- Stripe revenue from those ads arrives day 8 onward
- **Net working-capital swing on S$30k/mo ad spend: ~S$50k free float**

**UOB Preferred Platinum Visa** (4 mpd contactless online) and **DBS Woman's World Card** (4 mpd online) are personal cards with higher miles-per-dollar on ad spend but carry director-guarantee and accounting-treatment consequences.

### Stage 4: Business line of credit at S$25k+/mo revenue

Verified April 2026:
- **OCBC Business Overdraft**: up to S$200,000 unsecured, prime-linked effective 8-11%
- **DBS Business Loan**: up to S$500,000 under Enterprise Financing Scheme at 7.5-9%
- **UOB BizMoney**: up to S$350,000, quoted flat rates translating to 10-13% EIR
- **Enterprise Financing Scheme SME Working Capital Loan**: up to S$500,000, 50% gov risk share, ~7-9%
- **GXS Biz Loan**: from 4.99% headline, EIR from 9.32%

All rates move with SORA. Verify directly at time of draw.

### Stage 5: Exit realistically

**Flippa** (late 2024): median ecom profit multiple stabilised at **3.98x** for general ecom. 10% success fee typical (tiered).

**Empire Flippers**: quotes 25-35x monthly profit (roughly **2.1-2.9x annual**). 15% fees under $700k, sliding to 2% above $10m.

**Pure dropship discounted to 1.5-2.5x annual profit** because of:
- Supplier concentration
- No owned IP
- Reliance on paid Meta traffic that does not transfer to buyer

**Branded ecom with owned SKUs**: achieves 3-4x multiples. Generic dropship rarely does.

A $10k/month-profit dropship should expect listed price **~$240k-$300k, not $500k**.

**Exit prep:**
- 12 months clean P&L
- Stripe/Shopify exports
- Supplier relationship transferability documented
- SOPs
- **SG Pte Ltd share transfer** = cleanest exit vehicle (asset sales trigger GST + IRAS scrutiny)

## 11. True unit economics and incrementality

### Per-SKU profitability dashboard

Track:
- Units sold
- Revenue
- COGS
- Supplier shipping
- Payment fees allocated by revenue %
- Refund rate
- Ad spend attributed
- CM$ per order
- CM%
- CAC per new customer whose first SKU was this one
- Payback days

### Cohort LTV and tooling (April 2026)

- **Lifetimely, now at useamp.com** after AMP acquisition. Free plan + paid from ~$49/mo small, $149/mo medium.
- **Triple Whale**: ~$129/mo scaling with revenue. Brands above $1m commonly pay $400+/mo.
- **Peel Insights Essentials**: $499/mo
- **Polar Analytics**: custom $300-1,000+/mo
- **TrueProfit**: $25-75/mo (budget choice for solo operators)

**Start on Lifetimely free or TrueProfit. Upgrade to Triple Whale only when blended ad spend exceeds USD 30-50k/mo.**

### Blended CAC

Total ad spend / new customers (Shopify's "first-time customer" flag) on 30-day rolling.

**First-order CM$ should cover CAC for dropship.** If not, business depends on repeat purchases most dropship SKUs cannot deliver.

### Incrementality

Separates Meta's claimed ROAS from what ads actually drove:

- **Meta Conversion Lift**: RCT via Ads Manager Experiments. ~5,000 users/cell for statistical power. Since 2024-2025 more widely self-serve.
- **Meta GeoLift**: pause ads in matched control regions. More accessible to mid-size advertisers.
- **Meta Incremental Attribution** (2024-2025): uses internal lift-study data + ML. Claims 20%+ improvement over last-click. Self-reported, not independently audited.

**For solo SG operator below Conversion Lift minimums:**
- Single-geo pause test (pause AU alone for 2 weeks, observe)
- Split AU from NZ if volume permits
- **Trust blended MER trend over platform ROAS**. If MER holds flat as ad spend scales, Meta is likely incremental at margin. If MER collapses, not.

### Rule-of-thumb targets (category-dependent)

- Blended MER 3.0-4.0+ at 30% gross margin
- Contribution margin 15-25%+
- Payback within first order

**The MER-over-ROAS framework** is associated with Nik Sharma (Sharma Brands) and Taylor Holiday (Common Thread Collective). Primary sources are podcasts and content marketing. Practitioner framework, not peer-reviewed standard.

## 12. Singapore tax obligations: the source-of-income question is critical

### Corporate income tax: 17% headline (ITA s.43)

**Partial Tax Exemption (PTE)** for all SG-incorporated companies:
- 75% on first $10,000 chargeable income
- 50% on next $190,000
- Total $102,500 exempted on first $200,000

**Start-Up Tax Exemption (SUTE)** for first 3 YAs of qualifying new companies:
- 75% on first $100,000
- 50% on next $100,000
- Total $125,000 exempted

**SUTE eligibility:**
- SG-incorporated
- SG tax-resident for that YA
- No more than 20 shareholders with at least one individual holding 10%+
- Not an investment holding or property development company

**Budget 2026**: announced 40% CIT rebate capped at $30,000 + minimum S$1,500 Cash Grant for active companies with local staff. Verify against IRAS Budget primary before final filings.

### Filing deadlines

- **Estimated Chargeable Income (ECI)**: within 3 months of financial year end. Waived if annual revenue up to S$5m AND ECI is nil.
- **Form C-S/C-S (Lite)/C e-filing: 30 November**
- Form C-S (Lite): revenue up to S$200k
- Form C-S: revenue up to S$5m meeting conditions
- Form C: otherwise

### GST: 9% since 1 January 2024

**Mandatory registration at S$1m taxable turnover** (retrospectively or prospectively).

**Zero-rated exports count toward the S$1m test.** A dropshipper exporting S$1.5m to US/EU/UK/AU is above threshold even with no SG sales.

**Voluntary registration often pencils** because:
- All exports are zero-rated
- All input tax on Meta/Shopify/apps is recoverable
- Business sits in net refund position

Since 1 January 2020, Meta/Google/TikTok/Shopify/Klaviyo charge SG GST at 9% on invoices to SG customers under **Overseas Vendor Registration (OVR)** regime. **If not GST-registered, that 9% is sunk cost.**

### The critical source-of-income ruling

Singapore uses modified territorial system; foreign-sourced income taxable only when remitted. **BUT IRAS's direct guidance for online sellers is explicit:**

*"Where the online activities are carried out through a platform based overseas, the income you derive is considered Singapore-sourced and taxable in Singapore if the business operations supporting the online activities are based in Singapore."*

**For a SG Pte Ltd dropshipper with founder in SG identifying products, running ads, managing Shopify, coordinating supplier orders, handling customer service from SG:**

**All ecommerce income is taxable in SG as SG-sourced**, regardless of where customers are. Section 10(25) remittance relief does not apply because income was never foreign-sourced to begin with.

The operations test (following Yamaha Motor v CIT and Hang Seng Bank principles): place where profit-generating operations are carried on is decisive, not where customers or hosting infrastructure sit.

### Personal tax

Under one-tier system, dividends from SG Pte Ltd **not taxed again at shareholder level.**

- **Director salary (executive)**: deductible at company, taxable at progressive personal rates 0-24% for YA 2024+. Attracts CPF for SG citizens/PRs.
- **Director's fees (non-executive)**: deductible, taxable personally, **no CPF**.
- **Dividends**: not deductible at company, tax-free to shareholder.

### Planning pattern

1. Pay enough director salary to cover living expenses (plus CPF if PR/citizen)
2. Retain remaining profit in company (effectively **4-8% tax on profits under $200,000** after SUTE/PTE/rebate)
3. Distribute excess as tax-free dividends

### DTAs

Singapore has 90+ comprehensive DTAs.

**The US has no comprehensive DTA with Singapore**, only limited shipping/aircraft agreement + FATCA IGA.

**Meaningful gap**: if operations ever route through a US 3PL or US-based dependent agent, **US permanent establishment risk arises without treaty relief**, triggering full federal + state taxation on effectively connected income. Form W-8BEN-E may be requested by US payment processors.

For pure B2C ecommerce with no local office or dependent agent, **no PE typically arises and DTAs are not triggered**. Destination sales/VAT/GST are unrelated to DTAs.

### "Partner structure" clarification

Likely interpretation: **two-person Pte Ltd with multiple shareholders/directors**. Corporate tax 17% with PTE/SUTE, limited liability, tax-free dividends under one-tier.

**General partnership** (Business Names Registration Act, flow-through to personal income tax 0-24%, unlimited joint-and-several liability, Form P filing): **wrong for cross-border B2C ecommerce** because chargeback, supplier, and customer exposure is unbounded.

**Limited Liability Partnership** (LLP Act 2005): sits between the two but uncommon for ecommerce.

**Default to Pte Ltd.** If operator has actually set up a general partnership, flag it immediately as structural problem.

## Do not

- Present Meta ROAS as profit. Convert to blended MER and true contribution margin before scale decisions.
- Accept a financing offer with implied APR above 25%. Do the math, not the headline rate.
- Skip voluntary GST registration if export volume is material. Input tax on Meta/Shopify/apps is recoverable.
- Convert USD to SGD immediately on every payout if you have USD expenses. Round-trips cost FX spreads twice.
- Use Xero Standard in SG. Multi-currency is Premium-only. FX and GST will break.
- Ignore the SG source-of-income rule. All ecommerce income for a SG-based founder is SG-taxable regardless of customer location.
- Run general partnership structure for cross-border B2C. Unbounded liability. Pte Ltd is the default.
- Use AMEX personal cards for business ad spend. Director-guarantee and accounting issues.
- Rely on Stripe Chargeback Protection for dropship disputes. Doesn't cover "not received" or "not as described" (your dominant dispute reasons).

## Cross-references

- Pricing that impacts cashflow: `dropship-pricing-strategy`
- Product economics before pricing: `dropship-product-evaluation`
- Legal and tax registrations: `dropship-legal-compliance`
- Kill criteria that protect cashflow: `dropship-facebook-ads`
