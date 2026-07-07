---
name: dropship-product-evaluation
description: >
  Evaluate a specific dropshipping product candidate with a weighted scoring rubric and unit economics math. Use this after dropship-product-research surfaces a candidate, or any time the user asks "should I test this product", "is this worth it", "what's my margin look like", "what CPA can I afford", "do the numbers work", or pastes a product URL for analysis. Also trigger for markup questions (3x vs 5x debate), break-even CPA calculations, return risk assessment, and supplier reliability scoring. The skill refuses to greenlight products that fail unit economics even if the user pushes.
---

# Product Evaluation Skill

## Core principle

A product passes evaluation only when **both** the qualitative scorecard (score above 3.8/5) **and** the unit economics math (20+ percent net margin at realistic 2026 Meta CPMs) clear. Either one alone is insufficient. A wow-factor product with thin margin dies on scale. A fat-margin product with no hook never gets the clicks to prove the funnel.

## Scoring rubric (weighted)

Score each criterion 1 to 5. Multiply by weight. Sum. Gate at 3.8.

| Criterion | Weight | What 5 looks like | What 1 looks like |
|---|---|---|---|
| Wow factor | 25% | Stops scroll in under 1 second, answers "what is that?" | Generic commodity, blends in |
| Margin at target markup | 20% | 4x+ clears with $15+ gross after COGS, shipping, processing | Below 3x, margin sub-$10 |
| Mass-market size | 15% | 5M+ addressable buyers in target geo | Hyper-niche under 100k |
| Supplier reliability | 15% | 95%+ positive, 3+ verified suppliers, under 10 day ship | Under 90%, single source, 20+ day |
| Creative ease | 10% | Can shoot 5-sec demo on phone, UGC accessible on Fiverr/Billo | Requires studio, license, or props |
| Competition depth | 10% | Under 20 distinct advertisers on Meta, fresh angles open | 50+ advertisers, all angles burned |
| Policy safety | 5% | No medical claims, no IP exposure, no restricted category | Medical, weight loss, IP clone |

### Decision thresholds

- **Score 4.3 and up**: green light. Proceed to unit economics math.
- **Score 3.8 to 4.2**: conditional. Fix the weakest criterion before testing.
- **Score below 3.8**: pass. Do not test.

### Weakest criterion matters most

A product with 5/5 on everything except 1/5 wow factor still fails in practice. Meta ads without a stopping hook get no impressions cost cheap enough to convert. When a criterion scores 2 or below, it is a veto.

## Unit economics math

The 3x vs 5x markup debate is the wrong question. The right question is: **what break-even CPA does the landed cost leave me, and is that CPA achievable at 2026 Meta CPMs?**

### Formula

```
Retail price         = R
Landed cost (COGS + shipping to customer + packaging)  = C
Payment processing (Shopify + Shop Pay ~3.5%)  = P = 0.035 * R
App costs per order (avg subscription load / monthly orders)  = A
Expected refund rate * gross margin  = refund_loss
Contribution margin  = R - C - P - A - refund_loss

Break-even CPA       = Contribution margin
Target CPA           = Contribution margin * 0.6 (to leave 40% net profit)
Required landing page conversion rate
  = Target CPA / (CPM / 1000 / CTR)
  = Target CPA * CTR * 1000 / CPM

Assume 2026 Meta baseline: CPM = $25, CTR = 1.5% on good creative.
```

### Worked example

Product: $39.99 posture corrector. Landed cost $7.50. Kleen single SKU.

```
R = 39.99
C = 7.50
P = 0.035 * 39.99 = 1.40
A = 0.50 (apps divided across monthly volume)
refund_loss = 0.05 * (39.99 - 7.50) = 1.62
Contribution margin = 39.99 - 7.50 - 1.40 - 0.50 - 1.62 = 28.97

Target CPA = 28.97 * 0.6 = 17.38
Required LP conversion rate at CPM $25, CTR 1.5%:
  = 17.38 * 0.015 * 1000 / 25 = 10.43%
```

A 10.43 percent landing page conversion rate is unrealistic for dropshipping. Typical benchmark is 1.5 to 3 percent. This product fails unit economics at $39.99 even though on paper 5x+ markup.

Fix options: raise price to $49.99 or $59.99 (stress-test that the market will pay), bundle two units for $69.99 to lift AOV, or find a lower COGS supplier. If none work, skip.

### The 2026 CPM reality

Meta CPMs by geo (honest operator benchmarks):
- US Tier 1: $25 to $45 on cold broad
- US Tier 1 + iOS device targeting: $30 to $55
- UK, AU, CA: $20 to $35
- Western Europe non-English: $15 to $28
- LATAM, SE Asia: $5 to $15 (but smaller AOV)

Plug the realistic CPM for the target geo into the math. Do not use the $10 CPM example from 2020-era guru courses.

## Validation checklist before spending $1 on ads

Even a product that passes scoring and unit economics needs these checks:

1. **Order one unit yourself.** Non-negotiable per Ecom King doctrine. Verify product quality, packaging, shipping speed, supplier communication.
2. **Check top 3 Amazon listings** for review count. Over 2,000 reviews + Amazon's Choice = arbitrage closed.
3. **Teardown 3 competitor Shopify stores** from Meta Ad Library. Note their hero, benefits, price, upsells, review count, trust signals.
4. **Read 20 negative reviews** on AliExpress and Amazon. These become objection-handling points in ad copy and FAQ.
5. **Verify supplier redundancy.** One supplier is a single point of failure. Have at least 2 quoted before scale.
6. **Trademark check.** USPTO TESS search on product name and any branded keywords. EUIPO if selling EU. Chinese brand squatting is real.
7. **Policy rehearsal.** Write the ad copy. Run it through Meta's text overlay check. If it contains "you will", "lose weight", "cure", or any before/after imagery, rework.

## Returns and chargebacks by category

Build this into the refund_loss variable above:

| Category | Return rate | Chargeback rate | Notes |
|---|---|---|---|
| Electronics and accessories | 8-15% | 1-3% | Worst combo. Build 15% reserve. |
| Apparel | 15-25% | under 1% | High returns, low chargebacks |
| Jewelry | 10-20% | 1-2% | Fit and disappointment returns |
| Home goods (non-fragile) | 3-7% | under 1% | Safest dropship category |
| Novelty and gifts | 3-8% | under 1% | Seasonal spike risk |
| Health and beauty (non-regulated) | 5-12% | 1-2% | Skin reactions drive returns |
| Pet products | 4-8% | under 1% | Passionate buyers, forgiving |

## Output format

When evaluating a specific product, always produce:

```
PRODUCT: [name, price, supplier]
SCORECARD:
  Wow factor: X/5: reasoning
  Margin: X/5: reasoning
  Mass market: X/5: reasoning
  Supplier: X/5: reasoning
  Creative ease: X/5: reasoning
  Competition: X/5: reasoning
  Policy: X/5: reasoning
  WEIGHTED SCORE: X.X/5

UNIT ECONOMICS:
  Retail: $X
  Landed cost: $X
  Contribution margin: $X
  Break-even CPA: $X
  Target CPA (40% net): $X
  Required LP conversion at $X CPM, X% CTR: X%
  REALISTIC? [yes/no + reasoning]

VALIDATION STATUS:
  [ ] Ordered personal sample
  [ ] Competitor teardown complete
  [ ] Supplier redundancy confirmed
  [ ] Trademark clear
  [ ] Policy-safe ad copy drafted

DECISION: [TEST / HOLD / PASS]
REASONING: [one paragraph]
```

## Do not

- Accept "but the guru said 3x is enough" as a counter-argument. 3x markup in 2026 Meta CPMs usually fails break-even math. Show the numbers.
- Approve products scoring under 3.8, regardless of how excited the user is. The weighted rubric exists specifically to override hype.
- Assume a 5 percent conversion rate when the industry benchmark is 1.5 to 3 percent. The math needs pessimistic inputs to be honest.
- Ignore return rate by category. Electronics at 12 percent returns erase margin if the reserve is not baked into COGS.
