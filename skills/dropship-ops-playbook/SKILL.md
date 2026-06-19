---
name: dropship-ops-playbook
description: >
  Weekly and daily operations cadence for a Meta-ads-only Shopify dropshipping business. Use whenever the user mentions routine, cadence, schedule, daily workflow, weekly planning, KPIs, dashboards, what to do first, who to listen to, which guru to trust, or any variant of "what should I be doing today", "how do I structure my week", "is [named guru] legit", "is this ethical", "should I buy aged BMs". Also trigger for meta-questions about the dropshipping industry itself: success rates, longevity, when to quit, when to double down. This skill is the integration layer that references all other dropship-* skills.
---

# Operations Playbook Skill

## Core principle

Dropshipping in 2026 is **a creative-volume, unit-economics-discipline, policy-hygiene game**. The operators who survive past 18 months share five habits:

1. **Product-research muscle**: iterate 20-50 products per year, not 2-3. High test failure rate is normal.
2. **Creative iteration speed**: ship 10-20 variants per winning product per week.
3. **Financial discipline**: track contribution margin weekly, NOT daily ROAS.
4. **Cashflow management**: 30-60 day gap between ad spend and Shopify payout requires operating capital or credit.
5. **Meta policy agility**: one clean primary BM, one backup, learn what triggers rejections before they happen.

The operators who break in year one fail the mirror image: test one product too long, skip creative iteration, optimize ROAS not margin, underfund cashflow, run policy-adjacent claims.

## Realistic success rate (be honest with the user)

The often-cited "10-20% of dropship stores succeed" is the most generous framing and likely inflated. TrueProfit's industry data, from actual operators, puts it at **1-5% of stores making over $500k/year in profit**. About 90% of new dropshippers close within 3 months, primarily due to thin margins not absorbing 2026 Meta CPMs of $20-$40.

The user should know this. Not to discourage them, but so they size expectations correctly and build a business that can survive a 90-day test period losing money while finding the first winner.

## Weekly cadence

```
MON: Review and decide
  - Pull last week's numbers: CM, ad spend, CAC, AOV, contribution margin %
  - Kill underperformers using dropship-facebook-ads kill criteria
  - Flag winners for scaling this week
  - Use dropship-facebook-ads scripts/kill_criteria.py

TUE: Launch new creative tests
  - Ship 5-15 new creatives to ABO testing
  - Use dropship-creative-engine for hooks, angles, briefs
  - New UGC orders placed on Fiverr/Billo if needed

WED: Scale decisions
  - Deep-dive top ABO ad set from last week
  - Decide: scale to ASC at 2-3x, or let ABO run another cycle
  - Use dropship-facebook-ads scaling thresholds

THU: Audience and geo experiments
  - Test one new audience (broad vs lookalike vs interest)
  - Test one new geo based on dropship-trends-intelligence regional data
  - Monitor but don't over-tune active ad sets

FRI: Policy review + product research prep
  - Review next week's creative backlog for policy risk (dropship-facebook-ads compliance checklist)
  - Identify 2-3 new product candidates for weekend research

SAT: Product research block (60-90 min)
  - Run dropship-product-research full funnel: TikTok Creative Center, Amazon Movers, Meta Ad Library, eBay, Reddit
  - Produce 2-5 candidates for next week's evaluation

SUN: Light housekeeping or rest
  - Supplier check-ins (inventory, shipping time)
  - Customer service cleanup if not outsourced
  - OR rest. Operator burnout is a top-3 failure cause.
```

## Daily cadence (during active testing phase)

```
Morning (15-30 min):
  - Check yesterday's numbers in Shopify + Meta Ads Manager
  - If any ad set hit kill criteria during the night, kill it before it burns more
  - Respond to support emails (under 4-hour response is the standard)

Midday (10 min):
  - Check Klaviyo abandoned cart flow performance
  - Eyeball ad comments for trolls, policy triggers, refund requests

Evening (30-60 min):
  - Review today's performance once Meta attribution has settled (6-12 hours after event)
  - Prep tomorrow's creative or ad set duplications
  - If weekend: skip
```

**Avoid multiple check-ins per day on the same ad set.** Variance at sub-$100 daily spend is huge. Checking every hour leads to premature kills.

## Who to listen to (guru credibility assessment)

### Use as primary references (5/5 credibility)

- **Barry Hott** (Meta creative doctrine, ugly ads thesis)
- **Nick Shackelford** (Structured Agency, scaling math, testing frameworks)
- **Taylor Holiday** (Common Thread Collective, unit economics, contribution margin discipline)
- **Andrew Foxwell** (Foxwell Digital, Advantage+ and algorithm changes, 450+ operator community)

These are paid-media specialists who publish live account data. Lowest bullshit-to-signal ratio in the space.

### Use as secondary references (3.5-4.5/5)

- **Nick Theriot** (Theriot Solutions agency; solid on testing structure, creative analysis, ABO kill criteria)
- **Alex Fedotoff** (Ecommerce Scaling Secrets; CBO doctrine is dated but 2024-2025 LinkedIn is refreshed)
- **Depesh Mandalia** (7-Figure Facebook Ads framework, rigorous testing)
- **Chase Chappell** (TikTok + bridges to Meta)
- **Charley Tichenor IV** (Meta algorithm technical deep-dives)
- **Ben Heath** (beginner Meta tutorials, solid but leans basic)
- **Chase Dimond** (email, Klaviyo specifically)

### Use cautiously (2.5-3/5)

- **Ecom King (Kamil Sattar)**: free YouTube content is sensible and prolific; paid mentorship at $700-$10k is overpriced relative to what's public free. Use the free content, skip the coaching.
- **Sebastian Esqueda**: decent operator content, TikTok-primary so less directly useful for a Meta-only operation.
- **Hayden Bowles**: polished content, drifted into general "online business" territory, performance course includes antidetect/BM tactics that should be read as a signal.
- **Jordan Welch**: better storyteller than tactician; Viral Vault subscription has real support complaints.
- **Kevin Zhang**: good philosophical frame (build brands), overpriced delivery at $5k-$20k mastermind.

### Avoid paying them anything (1-2/5)

- **Ac Hampton (Supreme Ecom)**: BBB complaints, $5k course with poor mentorship, documented paid sponsored articles posed as organic features. Free YouTube content is OK beginner material, paid programs are not worth it.
- **Biaheza**: popular but drifted to lifestyle/stocks/crypto content. Not a current tactical reference.
- **Tan Choudhury**: revenue claims unverified, content is shallow. $67/month is cheap but there are better free references.

### The EcomWarts Elite program

The user is enrolled there. Honest assessment requires more information about what the program specifically teaches. Signals to watch for as the user progresses:

- If the program pushes **antidetect browsers and aged BMs as a growth strategy**, rather than as operational insurance, that's a red flag.
- If the program sells **preferred suppliers at inflated margins** or **required tools** with affiliate kickbacks, weight that context.
- If the mentor's own recent store results aren't shared with proof, their tactical advice is less credible.
- Positive signals: transparent P&L screenshots, teaches contribution margin not just ROAS, acknowledges policy compliance as the primary defense against bans, doesn't sell on FOMO.

The user should stay skeptical of any single guru or community, including EcomWarts, and cross-reference against the paid-media specialist list above.

## Mind-changes to internalize

The strongest credibility signal from any guru is publicly changing their mind. These are documented:

- **Alex Fedotoff** shifted from CBO doctrine to "traditional FB ads scaling is dead" in 2025, pivoting to creative-volume-driven ASC scaling.
- **Nick Theriot** moved from interest-stacking to broad-targeting ABO for testing + ASC for scaling post-iOS 14.5.
- **Barry Hott, Nick Shackelford, Taylor Holiday** all flipped from polished studio creative to "ugly ads"/UGC around 2021-2023.
- **Andrew Foxwell** correctly called ASC unification in early 2025 before most of the market.
- **Kevin Zhang** pivoted from general-store dropshipping to private-label branded ecommerce around 2022-2023.

Any guru still teaching 2020-era tactics (polished studio creative, stacked lookalikes, aggressive interest targeting, ROAS optimization without contribution margin) is selling old content.

## Ethical grey zones (flag honestly, don't moralize)

### Ban-resistance infrastructure
- **Legitimate**: one clean primary BM + one backup on a real second identity, with residential proxies for isolation.
- **Grey**: 3-10 aged BMs to survive Meta's false-positive bans.
- **Red flag**: 20+ accounts to arbitrage policy-violating products. This is fraud-adjacent.

### Fake urgency / scarcity
- **Legitimate**: real low-stock display when inventory is actually low, real shipping cutoff timers.
- **Red flag**: countdown timers that reset on refresh, fake "X people viewing" popups, fake "only 2 left" on unlimited supply products. Builds short-term conversion, destroys trust long-term, triggers chargebacks.

### Review practices
- **Legitimate**: importing AliExpress reviews with clear labeling, requesting reviews from real customers.
- **Grey**: importing AliExpress reviews and presenting as your store's reviews without disclosure. Standard practice in the industry but technically deceptive.
- **Red flag**: buying fake reviews, AI-generated review farms, bribing customers for 5-star reviews.

### Product claims
- **Legitimate**: marketing benefits supported by the supplier's specifications or third-party studies.
- **Red flag**: medical, cure, weight-loss, or income claims without substantiation. Meta will ban, FTC can follow up.

### Dropshipping as a business model
- **Legitimate**: clear shipping times disclosed, honest return policy, responsive customer service.
- **Red flag**: hiding 15-21 day shipping times, "lost package" excuse mills, suppressing refunds.

Honest practice is sustainable. Deceptive practice scales to a cliff.

## When to quit vs when to double down

### Signals to quit or pivot:
- 6 months of active testing, 20+ products tried, zero product has broken even over a 2-week window.
- Ongoing family or financial stress from the capital commitment.
- The user hates the daily work (ads, customer service, supplier issues). Dropshipping is grindy; hating it predicts failure.
- No signs of creative iteration skill improvement despite 50+ creatives shipped.

### Signals to double down:
- One product has achieved 2+ weeks of positive contribution margin at $100+/day spend.
- Creative CTR is trending up over weeks (skill developing).
- Supplier relationship is solid (consistent 7-14 day shipping, low defect rate).
- The user can articulate WHY the winner is winning (not just "I got lucky").

## Integration across skills

When a user has a question that touches multiple areas, route like this:

- "Should I test this product?" → `dropship-product-research` (discovery confirm) + `dropship-product-evaluation` (scoring + unit economics)
- "My ads aren't working" → `dropship-facebook-ads` (kill criteria) + `dropship-creative-engine` (creative diagnosis)
- "What's my margin on this?" → `dropship-product-evaluation` unit economics script
- "Is this trending?" → `dropship-trends-intelligence` (NOT as discovery, as confirmation)
- "Teardown this competitor" → `dropship-competitive-intel`
- "Theme and app recommendations" → `dropship-shopify-build`
- "What should I do this week?" → this skill (ops-playbook)
- "Is [guru] legit?" → this skill (guru assessment section)

## Do not

- Let the user skip unit economics because "the guru said it works". Run the math every time.
- Pretend the success rate is higher than it is. 1-5% of stores making meaningful profit is the honest number. 90% close within 3 months.
- Endorse any single guru uncritically. Every operator has blind spots. Cross-reference.
- Tell the user to keep trying when 20+ product tests in 6 months have all failed. At that point the creative or product-selection muscle needs rebuilding or the business needs a pivot.
- Present ban-resistance infrastructure as a growth strategy. It's insurance at best.

## Final note

Dropshipping at the 2026 bar requires: creative skill, financial discipline, product-research muscle, policy agility, and cashflow runway. Gurus who sell any ONE of those five as "the secret" are selling an oversimplification. The honest answer is that all five matter, and building them takes 12-24 months of consistent work.

The user's mentor, the EcomWarts program, and every YouTube channel including the ones on our 5/5 credibility list, are inputs. The operator is the one who has to do the work.
