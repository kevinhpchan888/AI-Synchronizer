
# Facebook Ads Skill

## Core doctrine (2026 consensus among operator-educators)

The old dropshipping ads playbook is dead. What actually works in 2026:

1. **ABO for testing, ASC for scaling.** The ABO-vs-CBO debate is largely resolved. ABO isolates creative performance; ASC (Advantage+ Sales Campaigns) absorbs the scaling phase with Meta's AI doing the bidding work.
2. **Broad targeting beats interest-stacking.** Post-iOS 14.5 signal degradation, Meta's algorithm converts better on broad than on stacked interests for accounts above $500/day. Interest targeting is a cold-start or geo-niche fallback, not a primary lever.
3. **Creative volume is the dominant variable.** Seven-figure operators ship 15 to 40 new creatives per week per product. Winning creative lifespan has collapsed from 30-90 days (2020) to 7-21 days (2026).
4. **Server-side CAPI is non-negotiable.** iOS 17 broke client-side pixel tracking. Without CAPI, the algorithm optimizes on garbage signal.
5. **Contribution margin is the real metric, not ROAS.** Meta-reported ROAS is 20-40% inflated vs true P&L because of attribution overlap. Track contribution margin weekly.

## Account structure

### Testing phase (ABO)

**Campaign level:** one campaign per product, objective = Sales (conversion event = Purchase).

**Ad set level:** 3 to 5 ad sets per campaign, each with:
- Budget: $20 to $50/day per ad set
- Targeting: broad (no interests) OR one broad 1% lookalike
- Placements: Advantage+ Placements (let Meta decide)
- Optimization: Purchase (not ATC, not ViewContent)
- Attribution: 7-day click

**Ad level:** 2 to 4 creative variants per ad set. Different hooks, not different fonts.

**Why broad?** Interest targeting carves out audiences that Meta's algorithm can already find on broad. In 2026, overly narrow targeting starves the algorithm of learning data and raises CPMs.

### Scaling phase (ASC or CBO)

Once an ABO ad set clears the kill criteria (below) over a 3-day window:
1. Capture the post ID of the winning ad (`post_id` scaling, preserves social proof).
2. Create a new ASC campaign at 2 to 3x the original ad set's budget.
3. Use existing post ID; do NOT rebuild as fresh creative.
4. Let ASC run 7 to 14 days before intervening.
5. Scale budget by 50-100% jumps (ASC absorbs shock better than manual bidding).

If ASC underperforms, CBO with 3 broad ad sets at $100-$300/day each is the fallback.

## Kill criteria

Kill an ad set when ANY of these hit:

| Trigger | Threshold |
|---|---|
| Zero purchases | 3x daily break-even CPA spent ($51 at $17 break-even) |
| CTR below 1.0% | After $50 spent |
| CPC above 1.5x category average | After $30 spent |
| CPM above 1.5x benchmark for geo | After $50 spent |
| ROAS below 1.2 | After 3 days at steady spend |
| Landing page conversion below 0.8% | After 200 clicks |

Do NOT keep an ad set alive past these thresholds hoping it "turns around". The test is decisive. If it failed, the creative or product is the problem, not the algorithm.

## Creative testing cadence

**Minimum viable operation:** 5 new creatives per product per week.
**Scaling operator:** 15 to 40 new creatives per product per week.

Test priority (higher variance first):
1. Hooks (3-10x variance on performance)
2. Angles (2-5x variance)
3. CTAs (1.3-2x variance)
4. Format/aspect ratio (1.2-1.5x variance)

Run 2 to 4 creative variants per ad set, never 1. Meta learns faster with variety.

Rotate creatives when CTR drops 30% from launch CTR. That is the practical "ad fatigue" threshold.

## Pixel and Conversions API

### Minimum viable tracking stack (under $1k/day)

- Shopify native Meta channel (handles basic CAPI)
- Meta pixel on all pages (standard Shopify install)
- Event deduplication via event_id (Shopify does this automatically)

### Above $1k/day, add:

- **Elevar** ($49-$199/mo) for deeper event granularity and server-side accuracy
- OR **Trackify** ($19-$99/mo) if Meta is the only channel

### Attribution tools (only when needed)

- **$30k+/month revenue:** Triple Whale ($129-$499/mo) for unified dashboard
- **$250k+/month ad spend:** Northbeam ($1k+/mo) for true multi-touch
- **Below $30k/month:** Shopify native + Meta pixel is sufficient. Triple Whale is signaling cost, not decision-improving.

### Common pixel failure modes

1. Event deduplication broken: pixel and CAPI double-firing. Fix via hashed email matching.
2. Checkout event on a subdomain that's not tracked. Test every funnel step in Meta Events Manager.
3. iOS 17 privacy: at least 30% of events won't attribute client-side. CAPI recovers most of that.

## Policy and compliance

### The compliance-first rule

If your creative or product is policy-safe, you don't need "ban resistance" infrastructure. Most account bans are creative-driven, not infrastructure-driven.

### Common policy triggers (memorize)

| Violation | Rule |
|---|---|
| Personal attributes | No "you are", "your body", "your pain" that implies a characteristic |
| Medical claims | No "cure", "treat", "heal", "lose weight", "clinically proven" without FDA-level evidence |
| Before/after | Banned in weight loss, health, cosmetic surgery |
| Shock tactics | No graphic injury, gore, medical imagery |
| Restricted products | Supplements, CBD, firearms, tobacco, adult, political (each has own ruleset) |
| Trademark | No branded imagery, logos, celebrity likeness |

### Compliant angle reframing

- "Lose 10 lbs in 30 days" → "Support your wellness goals with..."
- "Cures back pain" → "Designed to promote good posture"
- "Stop hair loss" → "Supports healthy hair"
- "You're overweight" → "Discover a routine thousands love"

### Account warmup

New business manager + ad account:
1. Days 1 to 3: run $5 to $10/day traffic campaign to a safe page (blog, informational). No conversion events.
2. Days 4 to 7: $15 to $25/day traffic campaign with the real product landing page but no purchase events yet.
3. Day 8+: launch conversion campaigns at $20-$50/day.

Skipping warmup is the most common cause of first-week bans on new BMs.

### The ban-resistance ecosystem (honest take)

The user's mentor has pushed aged business managers and antidetect browsers. Honest assessment:

**Legitimate use cases:** agencies managing 50+ client BMs, operators running multiple geos with distinct payment methods, teams with VAs needing isolated credentials.

**Crutch use cases:** solo operators buying aged BMs to keep running policy-violating products. This is almost always a symptom, not a solution.

**The honest operator view** (Barry Hott, Nick Shackelford, Taylor Holiday, Andrew Foxwell): if your creative and product are compliant, 90% of ban issues disappear. Infrastructure redundancy is insurance, not strategy.

**If the user insists** on infrastructure redundancy:
- One clean primary BM on their real identity with full business verification.
- One legitimate backup BM, also verified, on a partner/spouse identity.
- Residential proxy isolation from one clean antidetect browser (AdsPower free tier, Multilogin if willing to pay).
- Do NOT run 10+ accounts as a growth hack. That is fraud risk, not operational insurance.

## Attribution math

Meta's reported ROAS is inflated. Use this conversion to get true ROAS:

```
True ROAS ≈ Meta ROAS × 0.65 to 0.80
```

The multiplier depends on your channel mix. If Meta is your only channel, use 0.75. If you have email and organic driving 20%+ of revenue, use 0.65.

Contribution margin per order (real profitability metric):
```
CM = Revenue - COGS - Shipping - Payment fees - App costs - True ad spend per order - Refund reserve
```

Track weekly, not daily. Daily CM is noisy.

## Scaling thresholds

| Revenue | Action |
|---|---|
| $0 to $500/day | Stay in ABO testing. Do not scale one winner; find a second winner. |
| $500 to $2k/day | Move winner to ASC. Keep testing in ABO on the side. |
| $2k to $10k/day | ASC + CBO in parallel. Add lookalike stacking as an experiment. |
| $10k+/day | Multi-product ASC campaigns, dedicated media buyer or agency, Northbeam-level attribution. |

## Weekly rhythm

- **Monday:** review last week's contribution margin, kill underperformers
- **Tuesday:** launch 5+ new creative tests
- **Wednesday:** deep-dive top ad set for scale decision
- **Thursday:** audience/geo experiments
- **Friday:** policy review of next week's creative backlog
- **Saturday:** product research for next candidate
- **Sunday:** rest or light housekeeping

## Do not

- Scale an ad set on day 1 just because it has 2 purchases. Data variance at low volume is huge. Wait for 3-day window.
- Run interest-stacked ABO as your primary structure in 2026. Broad beats stacks at scale.
- Skip CAPI because "Shopify handles it". Default Shopify CAPI misses 15-30% of events. Audit in Events Manager monthly.
- Present Meta-reported ROAS as profit. Convert to true ROAS and contribution margin before making scale decisions.
- Recommend antidetect browsers as a growth hack. Teach creative compliance first.

## Cross-references

- Creative production and hooks: `dropship-creative-engine`
- Competitor ad spy and teardown: `dropship-competitive-intel`
- Store conversion and checkout hygiene: `dropship-shopify-build`
- Weekly operations cadence: `dropship-ops-playbook`
