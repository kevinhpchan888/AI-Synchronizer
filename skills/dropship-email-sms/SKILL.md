---
name: dropship-email-sms
description: >
  Full email and SMS playbook for a Meta-ads-only Shopify dropshipper in Singapore selling into US/UK/EU/AU. Chase Dimond level depth plus embedded copywriting doctrine (Stefan Georgi, Alex Cattoni, Joanna Wiebe, Kyle Milligan). Use whenever the user mentions email, Klaviyo, Postscript, Attentive, flow, welcome series, abandoned cart, post-purchase, winback, sunset, VIP, segmentation, deliverability, DKIM/SPF/DMARC, TCPA, sender reputation, open rate, click rate, revenue per recipient, subject line, preview text, SMS, abandoned cart SMS, opt-in, or any variant of "how do I set up email", "which ESP", "what goes in welcome", "Klaviyo vs Mailchimp", "why are my emails going to spam", "can I SMS EU customers". Covers email copywriting doctrine for dropship specifically.
---

# Email and SMS Skill

## Core principle

**Email is the only channel you own. Meta can ban you tomorrow; your list goes with you.** For a pre-winner dropshipper, email is the difference between first-order profit (breakeven, lucky) and LTV profit (30%+ of revenue from email at maturity).

This skill covers Klaviyo architecture, the 8 flows every dropshipper needs, segmentation that actually differentiates revenue, deliverability survival, SMS compliance, and copywriting doctrine specific to ecom email (not agency SaaS copy).

## 1. ESP selection: Klaviyo is the answer

**Klaviyo is the right ESP for a Shopify dropshipper.** Not Mailchimp (e-commerce features are thin), not Omnisend (cheaper but weaker segmentation), not ActiveCampaign (better for B2B/service).

Reasons:
- Deepest Shopify integration (auto-sync customers, orders, products, browse, cart events)
- Predictive CLV, predictive next-order-date, churn prediction models
- Strong SMS integration (Klaviyo SMS, not just third-party)
- Benchmarks published quarterly by industry, so you know what "normal" looks like
- Flow builder is visual and expressive; custom segments via drag-drop or SQL-like `klaviyo-ql`

**2026 pricing (verified klaviyo.com):**
- Free: up to 250 contacts, 500 email sends/month (fine for validation)
- Email only: starts at $45/month for 1,500 contacts, scales with list
- Email + SMS: starts at $60/month
- Typical solo operator at 5k contacts: $100-150/month

## 2. Klaviyo architecture setup

### Account setup for SG Pte Ltd selling globally

1. Sign up at klaviyo.com with business email (not personal)
2. Billing address: SG Pte Ltd registered address
3. Sending address: must be a real physical address (PO box OK in some jurisdictions, virtual office acceptable). This is printed in every email footer for CAN-SPAM compliance.
4. Connect Shopify (native integration, free, bidirectional sync)
5. Connect Meta (for ad audience sync)
6. Set up sender profiles and authentication (see next section)

### Sender identity: domain and subdomain strategy

**Do NOT send from your primary domain.** Send from a subdomain.

**Why**: if a sending IP or domain gets blacklisted, it affects deliverability for everything on that domain. Isolating transactional/marketing to a subdomain keeps your primary domain (used for Shopify checkout emails, customer service) safe.

**Typical setup:**
- `yourdomain.com`: primary (Shopify checkout, customer service replies)
- `mail.yourdomain.com`: marketing email (Klaviyo campaigns and flows)
- `em.yourdomain.com` or `send.yourdomain.com`: alternate naming

**In Klaviyo**: Account > Settings > Domains > Add Custom Sending Domain.

### DKIM, SPF, DMARC setup (critical for 2024+ Gmail/Yahoo requirements)

**Gmail and Yahoo February 2024 requirements** (enforced progressively through 2024-2026):

All senders who send 5,000+ messages per day to Gmail/Yahoo users **must**:
1. **Authenticate with SPF AND DKIM** (both, not either)
2. **Publish a DMARC record** with at least `p=none` for policy (enforcement at `p=quarantine` or `p=reject` preferred)
3. **Offer one-click unsubscribe** (List-Unsubscribe: header + RFC 8058)
4. **Keep spam complaints under 0.1%** (and ideally under 0.3% as a hard ceiling)

**Even if under 5,000/day, these are now best practice and required to hit Primary inbox consistently.**

### Setting up DKIM/SPF/DMARC for Shopify + Klaviyo

**In Klaviyo (for marketing email):**
1. Klaviyo > Settings > Domains > Add Custom Sending Domain
2. Klaviyo gives you 2 CNAME records to add to your DNS
3. Add them at your domain registrar (Namecheap, GoDaddy, Cloudflare)
4. Wait 24-48 hours for propagation
5. Klaviyo validates; status turns green

**In Shopify (for transactional):**
1. Shopify Admin > Settings > Notifications > Sender email
2. Enter `orders@yourdomain.com` or similar
3. Shopify provides a TXT record for verification; add to DNS
4. Propagate

**DMARC setup:**
1. Add a TXT record at `_dmarc.yourdomain.com`:
   ```
   v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com; pct=100; adkim=s; aspf=s;
   ```
2. Start with `p=none` to monitor without rejecting legitimate mail
3. After 30 days of clean DMARC reports, move to `p=quarantine`
4. After another 30 days clean, move to `p=reject` (strictest; best for deliverability)

**Tools for monitoring DMARC reports:**
- Postmark DMARC (free)
- Valimail Monitor (free for small senders)
- EasyDMARC (paid, visual dashboards)

### BIMI: worth it?

**Brand Indicators for Message Identification** shows your logo next to emails in Gmail/Apple Mail supporting senders.

**Requirements:**
- DMARC at `p=reject` or `p=quarantine` with pct=100
- Verified Mark Certificate (VMC) from DigiCert or Entrust (~$1,500/year)
- SVG logo in correct specifications

**Worth it when:**
- You have a real brand (not generic dropship store)
- Selling into US where Gmail adoption is highest
- Above $100k/year revenue justifying the $1,500

**Skip for pre-winner stores.** ROI is thin below $50k/month.

### List growth: what NOT to do

**Never:**
- Buy email lists. Instant spam complaints. Klaviyo will disable your account.
- Scrape contacts from LinkedIn or elsewhere
- Import your personal Gmail contacts
- Import any list you didn't collect via opt-in on YOUR site

**Growth sources that work:**
- Welcome popup on storefront (2-step with email+SMS opt-in)
- Checkout opt-in (pre-checked or unchecked depending on jurisdiction)
- Post-purchase subscribe prompt (already warm)
- Contest or giveaway (high risk: incentivizes freebie-seekers who unsubscribe)

## 3. Flow architecture: the 8 flows every dropshipper needs

### Flow 1: Welcome Series (3-5 emails)

Triggers when someone submits their email via popup, footer signup, or checkout opt-in.

**Structure (5-email version):**

| Email | Send delay | Purpose |
|---|---|---|
| 1 | Immediate | Deliver discount code (if offered), set expectation |
| 2 | +1 day | Brand story, founder voice (even if founder is "just you") |
| 3 | +3 days | Hero product showcase, social proof |
| 4 | +5 days | Objection-handle (shipping, quality, returns) |
| 5 | +7 days | Last reminder + discount expiry urgency |

**Discount code strategy:**
- 10% off first order: standard, good balance
- 15% off: if AOV is high and margin supports it
- Free shipping on first order: alternative to %-off; often higher perceived value
- Expiry: 7 days (urgency without hostile pressure)

**Critical principle: every email must have ONE job.** Email 1 delivers discount. Email 2 tells story. Don't overload.

### Flow 2: Abandoned Cart (3-5 emails)

Triggers when someone adds to cart, starts checkout, or reaches shipping-info page but doesn't complete.

**Klaviyo trigger events:**
- `Started Checkout` (strongest signal)
- `Added to Cart` (weaker, less intent)

**Structure (3-email version):**

| Email | Send delay | Content |
|---|---|---|
| 1 | +1-4 hours | Reminder, image of cart items, no discount |
| 2 | +24 hours | Urgency + social proof ("500 reviews"), still no discount |
| 3 | +48-72 hours | Discount offer (10-15%) with expiry |

**Discount escalation debate:**

**For discount escalation**: recovers more carts in short term.

**Against**: trains customers to abandon deliberately on future purchases. Kills margin at steady-state.

**Operator rule:** escalate for first-time cart abandoners, NOT for returning buyers who have purchased before. Use segmentation to split flows.

### Flow 3: Browse Abandonment

Triggers when someone views a product page without adding to cart.

**Worth turning on when:**
- Your site has 500+ daily visitors
- You have identified customers (email known from prior opt-in or purchase)
- Your PDP load is strong enough to warrant re-engagement

**Structure (2-email version):**

| Email | Send delay | Content |
|---|---|---|
| 1 | +4 hours | "Still thinking about X? Here's what others are saying" + reviews |
| 2 | +48 hours | Related products or objection-handle |

**Skip if** your site has under 500 daily visitors. Signal-to-noise is too weak.

### Flow 4: Post-Purchase Series

Triggers when an order is placed.

**Structure:**

| Email | Send delay | Purpose |
|---|---|---|
| 1 | Immediate | Order confirmation (transactional, Shopify handles by default; augment with Klaviyo for branding) |
| 2 | +1 day | Order-is-on-its-way + "what to expect" |
| 3 | At delivery (Klaviyo predictive delivery estimate) | "Your order has arrived" + care instructions |
| 4 | +7 days post-delivery | Review request (trigger Judge.me / Loox) |
| 5 | +14 days | Cross-sell complementary product |
| 6 | +30 days | Replenishment reminder (if consumable) or new launch |
| 7 | +60 days | VIP invite or loyalty program mention |

**Most-missed opportunity:** email 4 (review request). Reviews are social proof for future buyers AND content for ads. Automate the ask.

### Flow 5: Winback Flow

Triggers when a customer hasn't purchased in X days (typical: 90 days past last purchase).

**Structure:**

| Email | Send delay | Content |
|---|---|---|
| 1 | 90 days since last purchase | "We miss you" + new products since last visit |
| 2 | +7 days | 15% off next order |
| 3 | +14 days | Last chance + final discount (20% or free shipping) |

**If no click/purchase after email 3**, move to sunset flow.

### Flow 6: Sunset Flow (critical for deliverability)

Triggers when a profile has not opened or clicked in 90-180 days.

**Structure:**

| Email | Send delay | Content |
|---|---|---|
| 1 | 90 days no open | "Want to keep hearing from us?" soft reactivation |
| 2 | +14 days | Final chance + exclusive offer to re-engage |
| 3 | +30 days | Auto-suppress from future sends |

**Why sunsetting matters:** Gmail/Yahoo spam placement is based on engagement signals. Sending to unengaged subscribers tanks your sender reputation and sends ALL your emails to spam.

**Rule:** after 180 days no open, suppress. These profiles stay in Klaviyo for segmentation but don't receive marketing sends. Saves your deliverability.

### Flow 7: VIP Flow

Triggers when a customer enters a VIP segment (typical: top 10% by LTV, or 3+ orders).

**Structure:**

| Email | Send delay | Content |
|---|---|---|
| 1 | On entry | "You're a VIP" + early access offer |
| 2 | Periodic (weekly/monthly) | Exclusive product drops, higher discounts (15-20%) |

**Not high priority for pre-winner stores.** Set up once you have 500+ repeat customers.

### Flow 8: Birthday / Anniversary (optional)

**Honest answer: usually not worth it.** Requires collecting birthday in popup (friction), sends once a year, low ROI. Skip unless your brand is specifically celebratory (e.g., gift products).

## 4. Segmentation: the real differentiator

Bad segmentation: "all subscribers." Good segmentation: behavior-based, engagement-based, predictive.

### Behavior segments

- **VIP**: top 10% by LTV, or 3+ orders in 365 days
- **Repeat buyer**: 2+ orders
- **One-time buyer**: 1 order, 30+ days ago
- **Cart abandoner (recent)**: started checkout in last 7 days, no order
- **Browser (recent)**: viewed product in last 30 days, no cart
- **Unengaged**: no open in 60 days

### Engagement segments

- **Engaged (30 days)**: opened in last 30 days
- **Engaged (90 days)**: opened or clicked in last 90 days
- **At risk**: no open in 60-90 days (before sunset)
- **Inactive**: no open in 180+ days (sunset candidate)

### Source segments

- **Acquired via Meta**: UTM source = facebook or meta
- **Acquired via organic**: direct/search
- **Acquired via email**: email referral
- **Acquired via giveaway**: specific campaign

**Why this matters:** Meta-acquired subscribers behave differently (lower engagement at first, higher rebound with good welcome series). Source segmentation lets you tune content.

### Product category interest

From Klaviyo's `Viewed Product` and `Placed Order` events. Tag subscribers with category interest:
- "Home decor interested"
- "Gadgets interested"
- "Beauty interested"

Lets you send category-relevant campaigns without blasting all products to all subscribers.

### Predictive segments (Klaviyo native)

- **Predicted CLV**: Klaviyo's model estimates lifetime value
- **Predicted next order date**: when subscriber likely to buy again
- **Churn risk**: likelihood of not returning

Use predictive CLV to identify VIPs earlier; use churn risk to trigger winback.

## 5. Campaign strategy

### Cadence

- **2-3 campaigns per week** is the benchmark for ecom
- Under 1/week: you're leaving revenue on the table
- Over 5/week: fatigue, unsubscribes spike, complaint rate rises

### A/B testing priorities

Rank order of what to test:
1. **Subject line** (biggest impact on open rate)
2. **Send time** (Klaviyo Smart Send Time: pros and cons below)
3. **Preview text**
4. **CTA copy**
5. **Hero image or banner**
6. **Body length**

**Klaviyo Smart Send Time**: analyses individual engagement times, sends to each subscriber at their optimal time. **Pros:** real engagement lift. **Cons:** breaks "send all at once" for flash sales where urgency is the point. Use for evergreen content, not time-sensitive promos.

### Content types

Rotate through:
- Product feature (new or showcase)
- Educational (how-to, tips)
- UGC / customer story
- Social proof (reviews aggregation)
- Sale / promotion
- Holiday / event tie-in
- Behind-the-scenes (brand voice)

### List cleaning cadence

Every 60-90 days:
- Suppress profiles in inactive segment (180+ days no open)
- Move "at risk" (60-90 days no open) into sunset flow if not already
- Review and delete hard-bounced addresses

## 6. Revenue attribution

### Klaviyo's $X per recipient benchmark

**2026 benchmarks for ecommerce:**
- Average: $0.25-$0.75 per recipient per campaign
- Top decile: $1-$3 per recipient

**Flow benchmarks (single email within flow):**
- Welcome: $1-3 per recipient
- Abandoned cart: $3-10 per recipient
- Post-purchase cross-sell: $1-2 per recipient

### Attributed vs true incremental

Klaviyo attributes purchases made within 5-day click window or 5-day open window. **This overlaps with Meta attribution.** A user who clicked a Meta ad and then bought after reading a Klaviyo email gets attributed to BOTH. Counted in both reports, not both channels' actual contribution.

**For incrementality:** segment your metrics. Blended MER (total revenue / total ad + email spend) is the honest number. Platform-specific ROAS + Klaviyo attributed revenue summed together overstates.

### Meta CAPI + Klaviyo integration

**Correct setup:**
- Meta Pixel + Conversion API on Shopify (server-side)
- Klaviyo Pixel on Shopify
- Do NOT send Klaviyo conversions into Meta as events (double-counts)

### Getting to 20-30% of revenue from email

This is the benchmark for "mature email program." Requirements:
- 10,000+ engaged subscribers
- All 8 flows running smoothly
- 2-3 campaigns/week with solid segmentation
- 12+ months of list building
- Email-captured discount codes differentiated from ad-campaign codes for tracking

**Typical trajectory:**
- Month 1-3: 5% of revenue from email
- Month 6: 10-15%
- Month 12: 15-25%
- Month 18+: 20-30%

## 7. Deliverability: the survival metric

### Inbox vs Promotions vs Spam

**Gmail tabs:**
- Primary: best placement, high engagement
- Promotions: acceptable for marketing (most ecom emails land here)
- Spam: death

**How to diagnose where you land:**
- Send to test inboxes (your own Gmail, Yahoo, Outlook, iCloud)
- Use GlockApps or MailGenius for multi-ISP inbox testing ($99-$299/month)
- Monitor Google Postmaster Tools for spam rate trends

### Engagement-based warming for new sending domains

**Week 1-2:**
- Send only to most engaged segment (opened in last 30 days)
- Daily send volume under 1,000
- Focus on content that WILL get opened

**Week 3-4:**
- Expand to 90-day engaged
- Increase volume gradually

**Week 5+:**
- Full list, full cadence
- Monitor deliverability weekly

### Pruning unengaged: specific rules

- 90 days no open: move to sunset flow
- 180 days no open AND no click: auto-suppress
- Hard bounce: auto-suppress (Klaviyo does this automatically)
- Complaint/spam report: auto-suppress

### Monitoring tools

**Free:**
- **Google Postmaster Tools** (gmail.postmaster.google.com): spam rate, IP reputation, delivery errors by Gmail. **Mandatory setup.**
- **Microsoft SNDS** (sendersupport.olc.protection.outlook.com): Outlook/Hotmail delivery data

**Paid:**
- **GlockApps**: inbox placement testing across ISPs
- **MailGenius**: similar
- **Return Path / 250ok** (acquired by Validity): enterprise

**Benchmark targets:**
- Spam rate (Gmail Postmaster): under 0.1% (red zone at 0.3%)
- Domain reputation: High or Medium (Gmail Postmaster)
- IP reputation: High (though less important now that Gmail weights domain over IP)

### Spam trigger phrases to avoid (2026 updated)

Phrases that still trigger filters (though less deterministically than 2015):
- "Free" (in subject line, not body)
- "Act now", "Limited time" (overused, depersonalized)
- "Buy now", "Click here" (CTA-first, no context)
- Excessive capitalization or exclamation marks (!!!)
- Currency symbols cluster ($$$ or £££)
- "100% guaranteed"
- "No risk"
- "Earn money" / "Make money fast"
- "Weight loss" / "Lose weight"
- "Pharmacy" / "Viagra" (obvious)

**Gmail's modern filters are engagement-based, not keyword-based.** A well-engaged list can send "FREE" and get Primary placement. An unengaged list can send "Quick question" and get Spam. Engagement > keywords.

### 2024 Gmail/Yahoo sender requirements (post Feb 1, 2024)

Bulk senders (5,000+ daily to Gmail/Yahoo) must:
1. SPF + DKIM aligned authentication
2. DMARC `p=quarantine` or `p=reject` (not just `p=none` once enforcement tightens)
3. One-click unsubscribe via List-Unsubscribe header
4. Spam complaint rate under 0.3% (0.1% strongly preferred)
5. Forward alignment (sending domain matches From domain)

**Klaviyo handles most of this automatically**, but you must set up your custom sending domain correctly.

## 8. SMS specifically

### Platform comparison

**Postscript:**
- 2026 pricing: starts ~$100/month minimum, usage-based on top
- Shopify-native, strong integrations
- US-focused; international SMS via their network (adds cost)

**Attentive:**
- Enterprise pricing, typically $500+/month minimum
- Best segmentation and AI copy tools
- For larger operators ($100k+/month)

**Klaviyo SMS:**
- Integrated with Klaviyo email (single platform)
- Same segments and flows for email/SMS
- Best value for solo operator already on Klaviyo

**Recommendation for SG solo operator: Klaviyo SMS.** Don't add a second platform unless you've already maxed out Klaviyo.

### Compliance by jurisdiction (critical)

**US: TCPA (Telephone Consumer Protection Act)**
- **Express written consent required** for marketing SMS
- Violation: $500-$1,500 per unauthorized message
- **Double opt-in best practice** (after signup, send confirmation SMS; reply YES to confirm)
- Include "STOP to opt out" in every message
- Include "HELP for help" accessible
- Include sender identification
- Quiet hours: no sends 9pm-8am recipient local time
- **Class action risk is real.** TCPA lawsuits routinely $1M+.

**EU/UK: GDPR + PECR hybrid**
- Opt-in explicit and granular (separate checkbox, not pre-ticked)
- Right to be forgotten (deletion within 30 days of request)
- Data Protection Officer required if systematic large-scale processing

**Singapore: PDPA + Spam Control Act**
- Consent required for marketing
- Do Not Call Registry must be checked for SG numbers
- Include clear identifier and opt-out

**Australia: Spam Act 2003**
- Consent required (express or inferred in limited cases)
- Include sender identification
- Include functional unsubscribe
- Fines up to AUD 2.1 million for repeat offenders

### International SMS costs and complexity

| Destination | Cost per message (Klaviyo SMS 2026) |
|---|---|
| US | $0.015 |
| Canada | $0.03 |
| UK | $0.04 |
| Germany/France | $0.08-$0.12 |
| Australia | $0.05 |
| Singapore (domestic) | $0.05 |

**Delivery rates:** US/Canada/UK/AU near 98%. EU varies (95% in Germany, lower in Italy/Spain). Tier 3 countries unreliable.

**Short codes vs long codes:**
- **Short code** (e.g., 84600): 5-6 digits, higher throughput, looks professional. Costs $500-$3,000/month leased. US-only.
- **Long code / 10DLC** (e.g., 888-555-1234): standard phone number. Cheaper. Registration required for US (A2P 10DLC since 2023).
- **Toll-free**: mid-tier option.

**For SG operator just starting SMS:** use Klaviyo's pooled short codes or 10DLC. Don't lease your own short code until $500+/month SMS spend justifies.

### When SMS beats email

- Flash sale notifications (time-sensitive)
- Abandoned cart urgency (SMS recovery beats email by 2-3x in speed)
- Order shipping updates (if you want branded experience)
- Restocks of sold-out items

### When email wins

- Educational / long-form content
- Product stories
- Cross-sell detail
- Newsletters
- Anything needing images or design

### Opt-in flows

**Two-step popup (industry best):**
1. Email-only form (low friction)
2. After email submit, upsell to SMS ("Plus get SMS alerts for 15% off" or similar)

**Checkout opt-in:**
- Unchecked by default in EU (GDPR)
- Can be checked-by-default in US (varies by state; California CPRA tightens)
- Always checked-by-default is risky; favor unchecked with clear value prop

## 9. Pop-ups and signup forms

### Platforms

- **Klaviyo Forms** (native): free, good enough for most
- **Justuno**: $39/month+, advanced targeting, A/B testing
- **Privy**: acquired by Attentive, still available
- **OptinMonster**: $9-$49/month, strong exit-intent

**Recommendation**: Klaviyo native unless you have specific advanced needs.

### Trigger rules

- **Time delay**: 10-30 seconds after landing (most common)
- **Scroll depth**: 30-50% of page (signals engagement)
- **Exit intent**: mouse moves to close tab/browser (high conversion but intrusive)
- **Returning visitor**: 2nd+ visit (higher intent)

### Gamified forms (spin-to-win)

**Conversion lift: real, typically 2-3x baseline.**

**Brand dilution risk: also real.** Spin-to-win frames your brand as "discount-first", trains customers to expect constant promos.

**Use when:**
- Generic store (not premium brand)
- First 6-12 months of list growth
- You need volume to run email program

**Skip when:**
- Premium positioning
- You care about steady-state margins over list size

### Multi-step vs single-step

Klaviyo 2025-2026 data:
- Single-step: 3.07% conversion
- Multi-step (email → SMS → discount): 5.64% conversion

**Multi-step wins almost always.** First step (email) is low friction; subsequent steps capture more info/consent.

### Mobile interstitial penalty

**Google penalizes full-screen popups on mobile** (Page Experience signals since 2017, reinforced in 2024). Exceptions:
- Age verification
- Cookie/legal notices
- Login prompts

**Marketing popups on mobile must:**
- Not cover more than ~50% of the viewport
- Be dismissible within 2 taps
- Appear after user interaction (scroll, time), not on initial page load

## 10. Benchmarks for dropshipping (2026)

**Email:**
- Open rate: 20-25% good, 30%+ top decile (after Apple MPP inflation factored)
- Click rate: 2-5% good, 5%+ top decile
- Conversion rate (from click to order): 0.5-2% good, 2%+ top decile
- Revenue per recipient: $0.25-$0.75 avg, $1-$3 top decile
- **Target: 20-30% of total revenue from email at maturity (12+ months)**

**SMS:**
- Delivery rate: 95%+ (US/UK/AU), varies for EU
- Click rate: 15-25% (much higher than email because immediate)
- Conversion rate: 2-5%
- Revenue per recipient per campaign: $2-$8

## 11. Chase Dimond doctrine: what he actually teaches

Chase Dimond runs Boundless Labs, an email agency focused on ecommerce. Active across X/Twitter, YouTube, newsletter.

### His "Email Marketing Strategy" framework

1. **Foundation** (the 8 flows above, set up correctly)
2. **Segmentation** (past engagement + behavior + source)
3. **Campaigns** (2-3/week, tested subject lines)
4. **Growth** (popup + checkout opt-in)
5. **Retention** (VIP, winback, sunset)
6. **Optimization** (iterate subject lines, send times, content)

### Distinctive teachings

- **"The welcome flow is the most important flow."** More than abandoned cart. Sets tone for entire relationship. Allocate disproportionate effort here.
- **"Test subject lines, not campaigns."** Subject line is 80% of the open rate. The campaign body is secondary.
- **"Send more emails, not fewer."** Contrarian to "don't spam" advice. Chase's data: brands sending 2-3/week outperform those sending 1/week or less by 2-3x.
- **"Abandoned cart should NOT always include a discount."** If you discount every cart, you train customers to abandon. First email = reminder only; only escalate to discount by email 3.
- **"Post-purchase is the most underused flow."** Most operators set up email 1 (thank you) and nothing else. 5-7 email post-purchase series drives 80% of repeat revenue.

### Free resources

- Twitter/X (@ecomchasedimond): daily tactical threads
- YouTube: breakdowns of email flows, agency case studies
- Newsletter: "Chase's Daily" (daily tips)
- Templates: Boundless Labs shares welcome/AC templates publicly (search "Chase Dimond welcome series")

### What he teaches that's distinctive

Most email educators teach abstract principles. Chase shows actual Klaviyo flow screenshots, actual subject lines from agency accounts, actual revenue attribution. Specificity over theory.

## 12. Other modern email voices

**Jimmy Kim (Sendlane founder)**: teaches deliverability deeply. Sendlane is Klaviyo alternative; Jimmy's content is platform-agnostic and high-signal on inbox placement.

**Val Geisler (pre-Klaviyo acquisition)**: taught "customer journey mapping" and VOC research applied to email. Her Copyhackers articles from 2018-2022 are still foundational.

**Rob and Kennedy (Klaviyo education partners)**: teach entertainment-first email. Focused on personality and storytelling in a typically transactional channel. Their "Daily Email" approach is controversial but effective for certain brands.

**Ezra Firestone**: old-school guru (Smart Marketer). His flows are dated aesthetically but the fundamentals are sound. His "post-purchase upsell" approach was formative for much of modern ecom email.

## 13. Email and SMS copywriting doctrine

Email copy is its own discipline. Below is the folded-in copywriting section drawn from Georgi, Cattoni, Wiebe, Milligan.

### Foundational principle: write to one reader

**Joanna Wiebe (Copyhackers)**: the single most important writing principle is writing as if to one specific person. Not "our customers" but "Sarah, 38, just abandoned cart on our ceramic diffuser, lives in Ohio, found us via Instagram."

When you write to the segment of one, the copy becomes specific, conversational, and direct. When you write to "everyone who subscribed", it becomes generic and corporate.

**Application:** before drafting any email, write the customer you're imagining. Keep it visible while writing.

### Voice of customer (VOC) research

**Joanna Wiebe's method**: mine real customer language from:
- Product reviews (yours and competitors')
- Support tickets
- Social media comments
- Amazon Q&A sections
- Reddit threads in your category

Look for:
- Problem language: "I couldn't find X anywhere"
- Desire language: "I just want something that actually works"
- Objection language: "I wasn't sure if it would fit"
- Transformation language: "It's changed how I sleep"

Use this language verbatim in subject lines and body copy. Customer language converts better than copywriter language.

### Stefan Georgi RMBC method (for longer-form sales emails)

RMBC = Research, Mechanism, Brief, Copy

**Research**: VOC + competitor teardown + product mechanism understanding
**Mechanism**: the unique "how does this work" story that justifies claims (especially for supplements, skincare)
**Brief**: single-page doc summarizing target, promise, proof, unique mechanism
**Copy**: written with the brief on the screen

**For email:** RMBC is overkill on most sends but valuable for long-form sales emails (product launches, Black Friday, winback).

### Alex Cattoni conversational copy

**Core doctrine:** email should read like a friend wrote it, not a marketing team.

Specific techniques:
- **Bucket brigades**: short phrases that pull the reader down the page. "Here's the thing." "But wait." "Let me explain."
- **Contractions**: write "you're" not "you are", "don't" not "do not". Contractions signal conversation.
- **Pattern interrupts**: ask a question mid-email. "Does that make sense?" "Ever feel this way?"
- **One-sentence paragraphs**: standard for email. Long blocks kill reading.

### Kyle Milligan sales page breakdowns

Kyle teaches structure of 7-figure direct response sales pages. For email, the takeaway:
- **Leads structure**: every email has an opening that either hooks on curiosity, specificity, urgency, or identity
- **Proof first, claim second**: in a credibility-starved market, prove before you promise
- **Future pace**: show the reader their life after using the product

### Subject line frameworks

**Curiosity gap**: "The #1 mistake ecom stores make with..."
**Number**: "7 ways to..."
**Social proof**: "Why 3,481 customers love..."
**Question**: "Are you making this mistake?"
**Personal**: "I have to tell you something..."
**Urgency**: "Last call"
**Negative framing**: "Don't buy X until you read this"
**Identity**: "For people who..."

### Subject line rules

- Length: 30-50 characters (fits mobile preview)
- Lowercase feels personal; Title Case feels corporate
- Numbers beat no-numbers slightly (1-4% open rate lift per Klaviyo data)
- Emojis: test. Some lists love them, some hate them.
- Avoid: "newsletter", "announcement", "update" (reads as skippable)

### Preview text

The line immediately after subject in inbox preview. Most brands waste it with "View in browser" or default Klaviyo text.

**Use it to:**
- Extend curiosity from subject ("...and here's why it matters")
- Add second hook ("Plus 15% off for 48 hours")
- Tease content ("Inside: our Black Friday picks")

### Welcome email first line

**Most-read line in any email you'll ever send.** New subscriber, high attention, skeptical.

Rules:
- Confirm their action ("Thanks for joining" or "Your code is below")
- Deliver on the promise immediately (if you offered 10% off, show it in line 1, not line 5)
- Set expectation ("You'll hear from us 2-3 times a week" or "Expect..." )

### Body structure

**Short lines.** Most ecom emails are read on mobile. Long paragraphs get scrolled past.

**One primary CTA per email.** You can have a secondary link in footer (social, policy) but primary conversion goal is one link. Test link placement: middle of email often beats bottom.

**Bucket brigade flow example:**

```
Subject: The problem with [category]

Here's the thing.

Most [category] products don't work.

Why?

Because they focus on [weak attribute] instead of [real attribute].

We built [product] differently.

[Proof point]

[Soft CTA]
```

### SMS length and tone

**160 characters forces discipline.** SMS is text message, not press release.

Rules:
- No "Dear customer". Nobody texts like that.
- Include brand name (required for compliance)
- Include link
- Include "STOP to opt out" (required)
- Voice: casual, like a friend texting

**Example:**
```
Hey it's Mel from Lemioo! Your favorite just got restocked. Grab it before it goes again: [link]. Reply STOP to opt out.
```

### Holiday and event email angles

For dropship, the main events are:
- Black Friday / Cyber Monday
- Christmas / Boxing Day
- Valentine's Day (depending on category)
- Mother's/Father's Day
- Back-to-school
- New Year / January "new me" angle

**Angle framework:**
- Don't announce the holiday (subscribers know it's Black Friday)
- Announce YOUR take: "Our biggest sale of the year" or "Thank you gift for our list"
- Early access to list subscribers before public sale (creates VIP feeling)
- Countdown emails (day before, morning of, final hours)

## 14. Copywriting templates and swipe file

### Welcome email 1 subject lines (swipe)

- "Welcome! Here's 10% off"
- "Your code is inside"
- "Thanks for joining, [Name]"
- "I'm so glad you're here"
- "Your 10% off code"
- "Quick question..."
- "Before you shop, read this"

### Abandoned cart subject lines (swipe)

- "You left this behind"
- "Still thinking about [product]?"
- "Your cart is about to expire"
- "[Name], about your cart..."
- "Forget something?"
- "We saved it for you"
- "Before you go..."

### Post-purchase subject lines (swipe)

- "Your order is confirmed"
- "It's on the way"
- "Unboxing your [product]"
- "Something for you"
- "[Name], a quick favor?"
- "How's your [product]?"
- "One month later..."

### Winback subject lines (swipe)

- "We miss you"
- "[Name], where have you been?"
- "Come back for 15% off"
- "You left us hanging"
- "What happened?"

### Email CTA copy (swipe)

Instead of "Shop Now" (generic):
- "Get mine"
- "Count me in"
- "Show me the collection"
- "Try it today"
- "See the reviews"
- "Unlock 10% off"

### Pop-up copy (swipe)

Headline:
- "Get 10% off your first order"
- "Unlock your welcome gift"
- "Join the list, get the perk"

Button:
- "Send my code"
- "I want 10% off"
- "Yes, send it"

Low-friction decline:
- "No thanks, I'll pay full price" (guilt frame)
- "Maybe later"

### SMS templates (swipe)

**Welcome:**
"Hey! Thanks for joining [Brand]. Here's 10% off: CODE10. Shop now: [link]. Reply STOP to opt out."

**Abandoned cart:**
"Hey [Name], saw you were checking out [product]! Here's 10% off if you finish your order in the next hour: [link]. Reply STOP to opt out."

**Flash sale:**
"Flash sale ending tonight at midnight! 25% off everything with code FLASH25: [link]. Reply STOP to opt out."

**Back in stock:**
"Good news! [Product] is back in stock. Grab yours before it sells again: [link]. Reply STOP to opt out."

**Shipping update:**
"Your [Brand] order has shipped! Track it here: [link]. Reply STOP to opt out."

### Objection-handling scripts (for flow emails)

**"Too expensive":**
- Break cost per day ("$30 for a year of use = $0.08/day")
- Compare to alternative ("$30 product lasts 3 years vs $8/month subscription = save $258")
- Show proof of value (reviews, transformation photos)

**"Will it fit me":**
- Size chart with real measurements
- "If it doesn't fit, we'll replace free"
- Reviews filtered by size/body type

**"Shipping takes too long":**
- Set expectation upfront: "Arrives in 10-15 days"
- Explain why (quality sourcing, small-batch)
- Offer express upgrade for urgency

**"I'm skeptical of quality":**
- 30-day guarantee
- Reviews aggregated
- Money-back assurance
- Founder story (real person, accountable)

### Voice-of-customer extraction template

When mining reviews for VOC:

| Phrase category | Example from reviews | Use in email |
|---|---|---|
| Problem | "I couldn't find one that fit a 40oz bottle" | Subject: "Finally, a sleeve that fits your big bottle" |
| Desire | "I just wanted something that wouldn't spill" | Body: "You just want something that doesn't spill. We get it." |
| Objection | "I was skeptical because of the price" | Body: "We know the price raises eyebrows. Here's why it's worth it." |
| Transformation | "It changed my morning routine" | Subject: "How Sarah changed her morning routine" |

## Do not

- Buy email lists. Ever. Instant death for your Klaviyo account.
- Send without SPF/DKIM/DMARC. 2024 Gmail/Yahoo requirements are enforced.
- Ignore sunset flows. Sending to unengaged subscribers tanks sender reputation.
- Discount in every abandoned cart email. Trains customers to abandon deliberately.
- Send SMS to US numbers without express written consent. TCPA is $500-1500/violation.
- Use your primary domain for marketing sends. Subdomain only.
- Expect 20-30% of revenue from email in month 1. That's a 12-18 month maturity curve.
- Skip the welcome flow. Most important flow. Most underinvested.
- Write in corporate voice. "Dear valued customer" kills email.
- Send more than 3 campaigns per week without engagement data supporting it.

## Cross-references

- Pricing within discount emails: `dropship-pricing-strategy`
- Ad copy doctrine (same writers, different channel): `dropship-creative-engine`
- PDP copy (Wiebe/Cattoni principles applied on-site): `dropship-shopify-build`
- Post-purchase SMS tied to supplier shipping times: `dropship-suppliers`
- Revenue attribution conflicts with Meta CAPI: `dropship-cashflow-ops`
