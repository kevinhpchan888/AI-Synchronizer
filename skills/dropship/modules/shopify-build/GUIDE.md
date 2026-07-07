
# Shopify Build Skill

## Core principle

A Shopify store for Meta-ads-driven dropshipping has one job: **convert cold ad traffic at 1.5% to 3% landing page rate**. Everything in the build serves that job. Anything that doesn't (brand storytelling, blog, social feed embed) is distraction.

The 2026 winning pattern is a **branded one-product page** (or a focused general store with 5-10 hero products), ugly-honest design, and aggressive upsell stack. NOT a polished boutique brand site.

## Theme selection

### Free themes (sufficient for launch)

- **Dawn** (Shopify default): clean, fast, uses Online Store 2.0 sections. Good baseline. Customize heavily.
- **Sense**: similar to Dawn, slightly more visual-forward.
- **Refresh**: modern, bold type, works for lifestyle products.

**Recommendation for most users:** start with Dawn. Do not pay for a theme until you have a documented winning product.

### Paid themes worth considering (after first winner)

- **Shella ($79)**: versatile, mobile-first, good for one-product pages. Popular among 2024-2026 operators.
- **Booster Theme ($247 one-time)**: built explicitly for high-conversion dropshipping, includes urgency/scarcity blocks. Heavier, uses more CSS.
- **Minimog ($89-$139)**: modern, solid section library, mobile-optimized.
- **Empire**: if building multi-product brand later.

**Debutify:** do not recommend. Free tier is stripped down, paid tier at $39-$199/month is excessive for what it delivers. Booster or Shella are better one-time purchases.

### Theme decision rule

If the user's store is launching in the next 7 days: use Dawn.
If the user has one validated winner and $100+ budget: Shella or Booster.
Never pay monthly theme subscriptions (Debutify, Ecomsolid) for a dropshipping store under $30k/month revenue.

## Product page anatomy (2026 winning pattern)

Sections in order:

1. **Hero video** (9:16 or 1:1), auto-play muted. UGC-style demo, 10-30 seconds. Looping.
2. **Headline**: benefit-driven, under 10 words. Example: "Finally, posture correction that actually sticks."
3. **Sub-headline**: 1 sentence, adds credibility or specificity. Example: "Designed with physical therapists. 30-day comfort guarantee."
4. **Price + compare-at price**: $39.99 (was $79.99). Compare-at price is for visual anchoring, not lying. Do not set compare-at that the product never actually sold at.
5. **Primary CTA**: bold, above the fold on mobile.
6. **Trust badges row**: Free shipping • 30-day returns • 24/7 support • Secure checkout. Simple SVG icons, no animated GIFs.
7. **Benefit bullets**: 3-5 items, each 1 sentence. Benefits, NOT features. "Relieves back tension in 2 weeks" not "Made of 85% nylon".
8. **Product demo video or image carousel**: second video or image gallery showing product in use.
9. **Social proof 1**: review summary ("4.8 stars, 2,341 reviews") + 2-3 verified reviews with photos.
10. **How it works**: 3-step visual (Step 1 → Step 2 → Step 3).
11. **Comparison table**: "us vs them" (vs drugstore alternatives, vs competitors). Use sparingly; too promotional if overdone.
12. **FAQ**: 6-10 questions pulled from actual Amazon and AliExpress negative reviews.
13. **More social proof**: UGC photo grid from Judge.me or Loox.
14. **Secondary CTA**: sticky ATC bar on mobile is standard in 2026.
15. **Guarantee**: 30-day money back. Clearly stated.

## App stack (the essential ones, priced as of 2026)

### Reviews (pick ONE)

| App | Cost | Best for |
|---|---|---|
| **Judge.me** | $15/mo Awesome plan | Best value for 2026, photo reviews, Q&A, import from AliExpress |
| Loox | $9.99-$299/mo | Photo/video reviews focus, nicer default styling |
| Yotpo | Free-$79/mo | Bigger brands, more features, overkill for dropship |
| Okendo | $19-$249/mo | Polished enterprise feel |

**Recommendation:** Judge.me Awesome. Import 20-30 AliExpress reviews (photos, dates, names) on day 1 as social proof. Replace with real reviews as customers come in.

### Email and SMS

| App | Cost | Notes |
|---|---|---|
| **Klaviyo** | Free up to 250 contacts, then $45-$1,700/mo | Standard. Abandoned cart flow, welcome series, post-purchase. |
| Omnisend | $16-$59/mo | Klaviyo alternative, cheaper at scale |

Klaviyo abandoned cart flow alone recovers 10-15% of cart-abandoners in a properly tuned funnel. Non-negotiable.

### Upsells (pre-cart and post-cart)

| App | Cost | Notes |
|---|---|---|
| **ReConvert** | Free-$29.99/mo | Post-purchase thank-you page upsells, 5-15% AOV lift |
| AfterSell | $7.99-$29.99/mo | Checkout upsells, similar function |
| Zipify OneClickUpsell | $35-$200/mo | More features, heavier |
| Honeycomb | $49.99-$149.99/mo | Premium, overkill for most |

**Recommendation:** ReConvert on free tier initially, upgrade to $29.99 when stable.

### Page builders (only if the default theme can't do it)

| App | Cost | Notes |
|---|---|---|
| **GemPages** | $29-$199/mo | Most feature-rich, solid mobile builder |
| PageFly | $24-$199/mo | Similar, slightly cheaper |
| Replo | $39-$499/mo | React-based, developer-friendly |
| Shogun | $39-$499/mo | Older, stable |

**Recommendation:** skip entirely for launch. Customize Dawn sections. Only add a page builder if you have a specific layout need the theme can't handle. Page builders slow page speed, which hurts Meta ad quality score.

### Urgency and scarcity (use ethically or skip)

Avoid: fake countdown timers, fake low-stock warnings, fake "X people are viewing".

Use: real low-stock ("only 12 left in stock" if true), honest shipping cutoff ("order in 4 hours for today's shipping"), social proof popup showing real recent purchases (Proofy, Fomo).

Apps: Hurrify, Vertex, Proofy. Mostly $5-$30/mo. Evaluate each for whether they let you set honest data or force fake urgency.

## Checkout optimization

### Shop Pay + express checkout
Enable Shop Pay (free, Shopify native). Enable Apple Pay, Google Pay, PayPal Express. These convert 10-20% better than standard card checkout for returning buyers.

### Checkout upsells
Shopify Plus allows custom checkout. On non-Plus, use ReConvert for post-purchase upsell.

### Cart page vs direct-to-checkout
A/B test: some products convert better skipping cart, going straight to checkout on ATC. Test with `/cart` redirect rules.

### Shipping configuration
- Free shipping over a threshold ($35+ is typical), paid below. Raises AOV by nudging people over the threshold.
- OR free shipping always (simpler for ads, but margin must absorb).

## Trust signal pages (required)

These pages build trust and help Meta's algorithm trust the domain. Every winning store has all of these:

- **About Us**: short brand story, ideally with a founder photo (AI-generated is OK, but use one consistent AI image, not several). 200-400 words.
- **Contact**: real email (contact@yourdomain.com, NOT a gmail address). Form. Response time commitment.
- **Shipping Policy**: honest shipping times (7-21 days if from China). Do NOT claim "2-day shipping" if it's 15.
- **Returns and Refunds**: 30-day return window is standard. Refund process clearly stated.
- **Privacy Policy**: Shopify's template is adequate. Must be GDPR-compliant for EU traffic.
- **Terms of Service**: boilerplate is fine. Must exist.
- **FAQ**: 10+ questions. Reduces support load.

Generate these via Shopify's policy generator, then customize with product-specific language.

## Custom domain email

Do not run a serious store with a Gmail contact address. Set up `support@yourdomain.com` via:

- Shopify email forwarding (free, forwards to Gmail)
- Google Workspace ($6/mo per user, full Gmail UI on your domain)
- Zoho Mail (free tier for 1 user)

Gmail forwarding is the minimum viable. Google Workspace is worth it once you're over $5k/month revenue.

## Page speed (affects Meta ad quality score)

Target: under 3 seconds first contentful paint on mobile.

Enemies of page speed:
- Heavy themes (Booster, Minimog can run slow without optimization)
- Unoptimized hero video (keep under 5MB, use MP4/H.264)
- Page builders (add 1-3 seconds easily)
- Too many apps (each injects scripts)

Tools:
- Shopify's built-in speed report
- PageSpeed Insights
- GTmetrix

## Mobile-first checklist

Over 80% of dropship traffic is mobile. Before launch, test on a real phone:

- [ ] Hero video auto-plays muted
- [ ] Sticky ATC bar visible on scroll
- [ ] All trust badges readable without zoom
- [ ] No horizontal scroll
- [ ] Images don't cause layout shift
- [ ] CTA buttons are thumb-friendly (min 44x44px)
- [ ] Checkout loads in under 3 seconds
- [ ] Form fields don't require zoom to tap

## Launch checklist

Before driving paid traffic:

- [ ] Product page has all 15 sections above
- [ ] Reviews imported (20-30 minimum)
- [ ] Email popup configured (10-15% off for email)
- [ ] Abandoned cart flow live in Klaviyo
- [ ] All 7 trust pages published
- [ ] Custom domain email active
- [ ] Shop Pay and express checkouts enabled
- [ ] Shipping rates tested with real address
- [ ] One test order placed and fulfilled by yourself
- [ ] Meta pixel firing on View, ATC, InitiateCheckout, Purchase events (verify in Events Manager)
- [ ] CAPI enabled
- [ ] Mobile tested on iOS and Android

## Do not

- Launch a store with a free Gmail contact email. Signals amateur. Meta penalizes.
- Pay for a custom theme before validating one product. Dawn wins at launch.
- Install 15+ apps on day 1. Each app = script weight. Start minimal, add only on specific need.
- Use fake scarcity or fake live-viewer counters. Trust decays, returns climb, chargebacks follow.
- Skip the abandoned cart email flow. It's 10-15% of potential revenue.
- Build a complex brand story page when you have no brand. Focus on the product page.

## Cross-references

- Driving traffic to this store: `dropship-facebook-ads`
- Designing the creative that matches the store: `dropship-creative-engine`
- Evaluating which products belong on this store: `dropship-product-evaluation`
