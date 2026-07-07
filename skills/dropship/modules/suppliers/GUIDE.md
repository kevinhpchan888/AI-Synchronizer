
# Suppliers Skill

## Core principle

**A supplier is not a transaction, it's a relationship that determines whether you survive chargebacks, scale on a winner, or die in week 3.** The right supplier at the right stage: AliExpress for testing, sourcing agent (CJ/Zendrop/HyperSKU) for scaling a winner, Alibaba/1688 direct for private-label transition. Skipping stages or staying too long at one costs money.

This skill covers the full supplier arc, what to vet, what to negotiate, what to inspect, and when to move.

## 1. AliExpress as entry point

### When it's the right choice

- Testing 5-10 products in 30 days
- Under 10 orders/day on any single product
- You need zero-MOQ, pay-per-order
- You're okay with 10-15 day shipping to US/UK/EU, 10-20 to AU

### Supplier vetting (2026)

Before ordering from any AliExpress supplier:

**Green flags:**
- 3+ years on platform (store opening date)
- Feedback score above 95% positive
- **Trade Assurance** badge (Alibaba's escrow; protects you if supplier ships wrong item or doesn't ship)
- **Top Brand** or **Choice** badge (AliExpress premium tiers)
- Product listed for 6+ months (check "Added to AliExpress" date via browser inspect on older URL structure)
- Response time under 24 hours in store info

**Yellow flags:**
- Under 1 year on platform
- Very low prices vs category average (typically 30%+ below median = inferior quality or fake)
- Stock image only, no real product photos
- Reviews uniformly 5-star in perfect English on a Chinese-origin listing

**Red flags:**
- Won't accept Trade Assurance
- Refuses to share business license
- Pushes to WeChat/WhatsApp before any order placed
- Pricing 40%+ below market (almost certainly counterfeit or poor quality)
- Reviews show multiple complaints about "wrong item" or "broken on arrival"

### Reading reviews like an operator

Read the **1-star and 2-star reviews first, sorted by most recent**. Most sellers with 95%+ positive scores got there by volume, not quality. The negatives tell you the actual failure modes:

- "Received wrong color" = supplier has inventory chaos
- "Stopped working after 2 weeks" = QC problem
- "Never arrived" = shipping method issue (not always supplier's fault)
- "Item as described but smaller than expected" = misleading listing (your problem when you write PDP copy)

**Detecting fake reviews:**
- Look at the reviewer's profile (AliExpress shows it). Reviewer who has reviewed 200 products in 30 days, all 5 stars, all with generic photos: bot farm.
- Perfect English on Chinese-origin product: translation-bot or paid review.
- Reviews all within a 2-week window: review-gating ended.
- Text identical to text on competitor listings: copy-paste bot.

### Chinese holiday disruptions

Operator cannot plan around these; must know they exist:

- **Chinese New Year (Spring Festival)**: the big one. Factories close 5-10 days before and reopen 10-14 days after. Workers travel home; some don't return until Lantern Festival (15 days after CNY). Plan for 30-45 days of disruption.
  - 2026: CNY is **17 February**. Factories effectively closed 10 Feb to 10 March.
  - 2027: CNY is 6 February.
- **Golden Week (National Day)**: 1-7 October. Shorter disruption but significant.
- **Dragon Boat Festival**: early-mid June, 1-3 day holiday.
- **Mid-Autumn Festival**: September-October, 1-3 day holiday.
- **May Day**: 1-3 May.

**Operator prep:**
- 30-45 days before CNY: place larger orders to hold inventory via CJ or an agent with warehouse space
- Update shipping times on PDP and confirmation emails to reflect extended transit
- Email existing customers proactively (reduces chargebacks)
- Pause or slow Meta spend on products sourced directly from factory (vs those held in US/EU warehouse)

### Shipping options in 2026

**ePacket officially ended August 2020.** What replaced it:

- **AliExpress Standard Shipping**: default, 10-15 business days to US/UK/EU, 10-20 to AU. Trackable. This is what most sellers use.
- **Cainiao Standard**: Alibaba's own logistics arm. 10-20 days to major markets. Heavy subsidies make it cheaper than commercial equivalents.
- **YunExpress**: popular for sellers with higher volume. 7-12 days to US/UK with better tracking.
- **DHL / FedEx / UPS**: 3-7 days. Expensive. Used when dropshipper wants premium positioning.
- **Seller's Shipping Method (SSM)**: whatever the supplier ships with. Read reviews to assess reliability.

**For a SG operator selling into US/UK/EU/AU:**
- Test products on AliExpress Standard first
- Move to Cainiao or YunExpress once volume justifies
- Only use DHL/FedEx if your margin supports it (usually only on $100+ AOV)

### DSers as default automation tool

**DSers is the official AliExpress-to-Shopify automation tool** after Oberlo shut down in 2022. Pricing 2026:
- Free: up to 3 stores, 3,000 products
- Advanced: $19.90/month, 10,000 products, bulk order
- Pro: $49.90/month, 25,000 products, affiliate income
- Enterprise: $499/month

For solo SG operator testing products: **Free tier is sufficient for first 6 months.**

### When to move off AliExpress

**Signals:**
- 10-20 orders/day on a single product for 7+ consecutive days
- Shipping complaints climbing (you can't control it on AliExpress)
- Chargeback rate drifting above 0.5%
- You want custom packaging or brand inserts
- You want to negotiate unit cost

**Do NOT move prematurely.** Switching from $5 AliExpress to $8 agent cost on a product doing 5 orders/day eats your margin without proportional benefit.

## 2. Sourcing agents: the scale step

### CJ Dropshipping

- **Pricing**: no monthly fee. Pay per order (product cost + shipping + fulfilment fee). Prices typically 5-20% higher than AliExpress equivalent; sometimes lower if CJ has stock in their warehouse.
- **Warehouses**: China (Yiwu headquarters), US (multiple), UK, Germany, Thailand, Indonesia. **Critical for SG operator**: US warehouse products ship US-domestic in 2-5 days.
- **Catalog depth**: millions of SKUs sourced from 1688/Alibaba and their own factories. If product exists on AliExpress, CJ can usually quote it.
- **Branding**: custom packaging, branded inserts, private-label packaging. Request quote per SKU.
- **Known complaints**:
  - US warehouse stock sometimes runs out and defaults to China shipping without notice
  - Account management is transactional (you'll deal with many different agents)
  - Quality is supplier-dependent; they're a middleman, not a manufacturer
- **When it wins**: you need US-warehouse shipping on a validated product, or custom packaging without MOQ.

### Zendrop

- **Pricing tiers 2026**:
  - Free: limited features
  - Pro: ~$49/month
  - Plus: ~$79/month (auto-fulfil, private label)
- **Fulfilment**: primarily China-based with US warehouse option for some SKUs
- **Strength**: cleaner interface than CJ, better for solo operators who want less complexity
- **Weakness**: smaller catalog than CJ, pricing often 10-20% above CJ for same SKU
- **When it wins**: simplicity matters more than cost optimization; you're on Shopify and want an integrated auto-fulfil flow

### HyperSKU

- **Pricing**: no public tier structure; quotes per product
- **Strength**: China-based, claims faster shipping than AliExpress (5-10 days to US via their logistics partnerships)
- **Minimum**: no hard MOQ but pricing favours 50+ orders/month on a SKU
- **When it wins**: you're past testing stage, have one or two winners doing 30+ orders/day, and want faster shipping without CJ's US warehouse markup

### Spocket

- **Pricing**: Starter $39.99/month, Pro $59.99/month, Empire $99.99/month
- **Strength**: **US and EU suppliers**, not China. Ship from Miami, New Jersey, Berlin, etc. 2-5 day domestic shipping.
- **Weakness**: product catalog is small, prices are 2-3x higher than China-sourced equivalents
- **When it wins**: your margin supports US-domestic cost AND you're selling to US customers who demand fast shipping. Rare for pure Meta dropship.

### AutoDS

- **Pricing**: from $26.90/month (Starter) to $321.90/month (1000 Plan) with order limits per tier
- **Strength**: automation across multiple sources (AliExpress, Amazon, Walmart, own warehouse). Price and inventory monitoring.
- **Weakness**: Amazon-source dropshipping is **against Amazon ToS**; they can close your buyer account. Using AutoDS to arbitrage Amazon invites account-level risk on Amazon itself.
- **When it wins**: you want cross-source automation and can accept the complexity.

### DSers

Not a true agent, but the AliExpress automation layer. Use for stage 1 (AliExpress).

### Agent comparison shortcut

| Need | Best choice |
|---|---|
| US-warehouse shipping | CJ or Spocket |
| Cheapest per-order | CJ |
| Cleanest UX | Zendrop |
| Fastest China-direct shipping | HyperSKU |
| US/EU-based suppliers only | Spocket |
| Multi-source automation | AutoDS (with caveats) |
| AliExpress automation only | DSers |

### What to negotiate with an agent

Once you're at 10-20 orders/day on a product, quote it with 2-3 agents. What to ask for:

1. **Per-unit cost** (should be 10-30% below AliExpress at volume)
2. **Shipping SLA** (days to US, days to UK/EU/AU) with written commitment
3. **Custom packaging** (mailer bags with your logo, thank-you cards, inserts). Typical MOQ: 100 units for bags, 500+ for custom boxes.
4. **Branded inserts** (thank-you cards, discount codes, care instructions)
5. **Quality inspection before ship** (AQL 2.5 standard; pay extra S$0.50-$2/unit for this)
6. **Order volume discounts** (tiered: 10%/month discount at 1,000 orders, 15% at 5,000)
7. **Net 7 or net 15 payment terms** (usually only granted after 30 days of relationship and consistent volume)

**Red flags when choosing an agent:**
- Quote dramatically below AliExpress (30%+ lower without explanation)
- Refuses to show warehouse photos or video
- No business registration details shared
- Will only communicate via personal WeChat, not company email
- Can't or won't provide an English-language contract

## 3. Alibaba and 1688 direct sourcing

### The difference

- **Alibaba.com**: English-language, built for international B2B. MOQs typical 100-1,000 units. Suppliers often trading companies (middlemen), sometimes actual manufacturers.
- **1688.com**: Alibaba's domestic Chinese platform. Chinese-language only. 30-50% cheaper than Alibaba for same product. Suppliers mostly factories. MOQs vary, sometimes as low as 10 units.
- **Taobao**: C2C platform, also Chinese-only. Mostly finished goods, not source for bulk manufacturing.

### Alibaba supplier vetting

**Green flags:**
- **Verified Supplier** badge (third-party verified business license, production capacity)
- **Gold Supplier** (paid badge, means they've paid Alibaba; not a quality guarantee but filters out tire-kickers)
- **Trade Assurance** accepted (Alibaba's escrow; critical)
- Business registered 3+ years
- Response rate above 80%, response time under 12 hours
- Published production capacity (units/month)
- Certifications visible (CE, FCC, RoHS, BSCI, ISO 9001 depending on category)

**Manufacturer vs trading company:**
- Manufacturers have their own factory (ask for factory video/photos of production line)
- Trading companies source from multiple factories and resell at markup
- Manufacturers typically give 10-20% better pricing at volume; trading companies offer wider catalog
- For private-label with exclusivity, always go direct to manufacturer

### MOQs typical for dropship products

| Category | Typical Alibaba MOQ | 1688 direct MOQ |
|---|---|---|
| Small accessories (phone cases, jewelry) | 500-1,000 | 50-200 |
| Apparel | 300-500 per SKU/colour/size | 50-100 |
| Small electronics | 500-1,000 | 100-500 |
| Home goods (kitchen, decor) | 300-1,000 | 50-300 |
| Custom-printed items | 500-1,000 | 100-500 |

First PO target for private-label transition: **500-1,000 units**. Smaller orders exist but unit economics break.

### 1688 workarounds for non-Chinese operators

Because 1688 is Chinese-language and requires a Chinese payment method, operators use **sourcing agents** that buy on their behalf:

| Agent | Notes |
|---|---|
| **Superbuy** | Most established, English interface, per-order service fee |
| **CSSBUY** | Similar to Superbuy, competitive fees |
| **Sugargoo** | Strong in apparel and fashion sourcing |
| **Basetao** | Growing, strong reviews in 2024-2025 |
| **WeGoBuy** | Full-service, higher fees but white-glove |
| **Pandabuy** | **SHUT DOWN in 2024** after raids over counterfeit concerns. Do not use. |

**Typical agent fee structure:**
- Service fee: 5-10% of product cost OR flat fee per item
- Shipping: weight/volume-based to your destination
- Optional QC inspection: $5-20 per item
- Warehousing: free for 30-60 days, then per-day charges

**Workflow for 1688 direct via agent:**
1. Find product on 1688 (use Google Translate browser extension or 1688's image search after uploading from AliExpress listing)
2. Message agent with 1688 link + quantity + inspection requirements
3. Agent places order on 1688 on your behalf, receives to their warehouse
4. Agent does QC, consolidates with other orders if relevant
5. Agent ships to you (or 3PL/customer for dropship)
6. You pay product cost + agent fee + shipping

### Quality inspection services

For orders over 300 units, always inspect before ship:

| Service | Cost per inspection | Strength |
|---|---|---|
| **QIMA** (formerly AsiaInspection) | $299-$399 | Most established, strong China network |
| **SGS** | $300-$500 | Multinational, premium reputation |
| **Bureau Veritas** | $300-$500 | Multinational, good for EU compliance verification |
| **Intertek** | $300-$500 | Similar to BV |

**Inspection types:**
- **Initial Production Check (IPC)**: first 10-20% of order produced, catch issues early
- **During Production Inspection (DUPRO)**: mid-production, verify consistency
- **Pre-Shipment Inspection (PSI)**: most common, at 80-100% production complete

**AQL (Acceptable Quality Limit) standards:**
- **AQL 0.65**: critical defects (medical, automotive). Don't apply to most dropship.
- **AQL 1.5**: major defects (functional failures). Standard for electronics and goods with moving parts.
- **AQL 2.5**: minor defects (cosmetic flaws). **Standard for most dropship products.**
- **AQL 4.0**: very loose. Only for low-value commodity goods.

**Sample size rule of thumb for 1,000-unit order at AQL 2.5:**
- Sample ~80 units
- Reject order if more than 7 major defects or 10 minor defects found

### When direct sourcing justifies the effort

**Thresholds:**
- $10k+/month revenue on a single SKU sustained for 60+ days
- You want exclusivity (supplier won't sell same SKU to competitors)
- You want custom modifications (your logo, your colour, your packaging as default)
- Your margin is squeezed enough that 30-50% COGS reduction unlocks profitability

**Do NOT go direct if:**
- Product is still in testing phase (under 30 days of consistent sales)
- You haven't done sample orders from 2-3 candidate suppliers
- You don't have 90 days of working capital to fund first PO + shipping + inspection

## 4. Private-label transition

### When to stop dropshipping and hold inventory

Signals:
- Validated winner at 30+ orders/day for 60 days
- Margin compression from copycats (they're running your ads with the same product)
- Customer complaints about shipping time (10-15 days is hurting you)
- Want to charge premium price (hard without brand)
- Want repeat customers (impossible with generic product + 15-day shipping)

### 3PL selection for SG operator selling US/UK/EU/AU

| 3PL | Best for | 2026 pricing (typical) |
|---|---|---|
| **ShipBob** | US primary, secondary UK/EU warehouses available | $5-10 per order + storage $40/pallet/month |
| **ShipMonk** | US, good for complex SKU kits | Similar to ShipBob |
| **ShipHero** | Mid-market, better tech integrations | Similar |
| **Flowspace** | US, flexible on MOQ | Similar |
| **Deliverr** | Was acquired by Shopify, now part of Shopify Fulfillment Network | See SFN status |
| **Shopify Fulfillment Network** | US (formerly Deliverr) | Being wound down as of 2024-2025; verify status |
| **FBA (Amazon)** | Channel 2, NOT primary for Shopify store | Variable by size/weight tier |

**For SG operator starting US-focused private label:**
- Primary: ShipBob (US Midwest or East Coast warehouse)
- Expand to ShipBob UK once UK volume justifies
- Use FBA for Amazon channel only, not primary Shopify fulfilment

**Not viable:**
- 3PL in Singapore for US customers. Shipping SG to US costs S$15-30/package; kills margin.
- 3PL in China for US private-label. Defeats the purpose of private-label (fast shipping).

### Custom packaging design

| Vendor | Strength | Typical cost (1,000-unit MOQ) |
|---|---|---|
| **Packlane** | US-based, fast turnaround, wide product range | $1.50-$3 per mailer/box |
| **Arka** | US-based, sustainability focus | $1-$2.50 per mailer |
| **Noissue** | Global, strong sustainability branding (FSC paper, soy ink) | $1.50-$3 per item + tissue/inserts extra |
| **Alibaba custom packaging suppliers** | Cheapest, direct from China | $0.30-$1.50 per item |

**Insert strategy:**
- Thank-you card (branded, warm tone): adds 20-40% repeat rate per industry data
- Discount code for next purchase (10-15% off, 60-day expiry)
- Care instructions or "how to use" card (reduces returns)
- Request review card with QR code to Judge.me/Loox

**Cost typical at MOQ 1,000:** $1-3 per unit total packaging including inserts.

### Sample ordering process

**Non-negotiable before scaling:**
1. Order 3-10 samples from 2-3 candidate suppliers
2. Compare quality side by side
3. Test in your actual use case (wear it, use it, durability test)
4. Photograph for PDP and ad creative (this is your real product, not AliExpress stock images)
5. Only place first PO with the supplier whose samples passed

**Typical sample cost:** $50-$200 including shipping. Supplier often deducts this from first PO if order exceeds MOQ.

### Import logistics

**Air vs sea freight:**

| Mode | Speed | Cost per kg (China to US port) | When to use |
|---|---|---|---|
| Air (courier DHL/FedEx) | 3-7 days | $6-$12/kg | First PO, urgent restock |
| Air freight (forwarder) | 7-10 days | $4-$8/kg | Replenishment at moderate volume |
| Sea LCL (less-than-container) | 25-40 days | $0.80-$2/kg | Standard for 500kg+ shipments |
| Sea FCL (full container) | 25-40 days | $0.40-$1/kg | 15+ cubic metres |

**Incoterms:**
- **FOB (Free On Board)**: supplier delivers to port of origin. You handle ocean freight + destination clearance. Cheapest but most work.
- **CIF (Cost, Insurance, Freight)**: supplier handles freight to your port. You handle destination clearance.
- **DDP (Delivered Duty Paid)**: supplier handles everything including duty payment at destination. Easiest but most expensive (10-20% premium).

**For first-timer SG operator:** start with **DDP** for first 2-3 shipments while you learn. Move to FOB once you have a freight forwarder relationship.

**Customs brokers**: required for FOB/CIF. In US, brokers charge $150-$400 per shipment. In UK/EU, typically £50-£200.

**Harmonized tariff codes (HS codes):** every product has one. Your supplier knows it; confirm on commercial invoice. Wrong HS code = customs delay + potential penalty.

## 5. Supplier redundancy and quality control

### Why one supplier is a single point of failure

Real failure modes from 2024-2025:
- Factory fire (entire order lost, no insurance)
- Regulatory issue (product category banned in your country, supplier can't ship)
- Chinese New Year extended due to owner going back to hometown
- Supplier gets a bigger client and deprioritises you
- Quality silently deteriorates over months (supplier swaps components for cheaper alternatives)

### Redundancy rule

Once you're at $5k+/month on a product:
- Have 2 qualified suppliers for that product
- Order 70% from primary, 30% from secondary (keeps secondary warm and on price)
- If primary fails, secondary can scale in 2-4 weeks not 2-4 months

### Sample orders before every new product

**Non-negotiable.** Even on fast turnarounds. One $50 sample order prevents one $5,000 PO disaster. Photograph the sample from multiple angles in actual lighting; this becomes your PDP image library.

### Handling defective batches

**Negotiation scripts (in order of preference):**

1. **Replacement without additional cost**: "Batch 45 has 12% major defects per AQL 2.5 inspection. Please replace defective units in next shipment at your cost."
2. **Partial credit**: "Please credit 8% of this invoice against next PO."
3. **Refund on defective units only**: "Please refund $X for 120 defective units."

**Always:**
- Document with photos/video and inspection report
- Communicate within 7 days of receipt
- Reference your original specification or sample-approved-against

**Alibaba Trade Assurance** protects you for first 30 days. Beyond that, relationship management.

## 6. Communication and cultural context

### Primary channels

- **WeChat**: primary Chinese supplier communication channel. Most suppliers expect this. Install it.
- **WhatsApp**: secondary, some suppliers use it
- **Alibaba TradeManager**: use for contract conversations and Trade Assurance protection
- **Email**: for PO documents, commercial invoices, formal contracts

### Response time expectations

**24-48 hours is normal, not slow.** China is UTC+8 (same as Singapore). A message sent at 11pm SG time won't get a response until next day. Don't interpret silence as evasion.

During CNY / Golden Week: expect 7-14 day delays on any non-urgent message.

### Language barrier workarounds

- **DeepL** (deepl.com): better than Google Translate for business Chinese
- **ChatGPT / Codex**: translate complex or technical requests
- **Pictures over text**: send photo of exact product, colour swatch, packaging style. Faster than words.
- **Keep sentences short**: "I need 500 units. Black color. Ship by 15 May. Price?" beats long compound sentences.

### Cultural context: guanxi, deposits, gifts

**Guanxi (关系)**: relationship-based trust. Chinese suppliers give better pricing, faster response, and priority to operators with established relationships. Investment in relationship over years compounds.

**Deposits and payment norms:**
- Alibaba Trade Assurance: full payment held in escrow, released on supplier's meeting delivery terms
- Direct contract: typical 30% deposit / 70% balance on receipt. Never pay 100% upfront.
- Established relationship: some suppliers grant Net 7 or Net 15 terms

**Payment methods:**
- **Alibaba Trade Assurance**: preferred for first 3-6 months of relationship
- **Wire transfer (T/T)**: standard for ongoing orders
- **PayPal**: rare; some suppliers accept for small orders. Supplier absorbs 4%+ in fees, so pricing is higher.
- **Letters of Credit (LC)**: for very large orders (USD 50k+). Bank-guaranteed, complex paperwork.

**Chinese New Year gifts:**
- Not expected for transactional agent relationships
- Expected for key supplier relationships (3+ years, significant volume)
- Typical: small red envelope (hongbao) for key contacts, or premium food basket shipped to their office
- Equivalent cost: $50-$200

### Building long-term supplier relationships

Signals to a supplier that you're serious:
- Consistent orders month-over-month
- Pay on time
- Respond to their messages within 24 hours
- Visit in person at least once (even a single trip to Yiwu or Guangzhou changes the relationship)
- Refer other buyers (suppliers love this)

## 7. Red flags summary

Will not do business with a supplier who:

- **Won't accept Trade Assurance** on Alibaba (you have zero protection)
- **Refuses to share business license** (likely not a registered company)
- **Prices 30%+ below market** (almost always quality or counterfeit issue)
- **Uniformly 5-star English reviews on Chinese-origin listing** (fake or paid)
- **Pushes off-platform immediately** before any order (wants to avoid platform protection)
- **Won't provide factory photos or video** (may not have a factory)
- **Can only communicate via personal WeChat, not company email** (unprofessional or scam-adjacent)
- **Sends different product samples than what's listed** (bait and switch)
- **Disappears for 2+ weeks without CNY/holiday explanation** (unreliable)

## Supplier arc decision workflow

When the user asks "where should I source this from?":

1. **What stage?**
   - Testing (<10 orders/day): AliExpress + DSers
   - Validated (10-30 orders/day): move to agent (CJ or Zendrop)
   - Scaling winner (30+ orders/day): HyperSKU or negotiate directly with CJ for better rates
   - Private-label ready ($10k+/month on SKU): Alibaba or 1688 direct with QIMA inspection

2. **What timeline?**
   - Ship in 3-7 days to US: Spocket US, CJ US warehouse, or ShipBob post-PO
   - Ship in 10-15 days: AliExpress Standard or CJ China-direct
   - Ship in 25+ days (custom/brand transition): Alibaba/1688 direct with sea freight

3. **What margin?**
   - Under 30%: AliExpress only, find cheaper supplier
   - 30-50%: can afford agent markup
   - 50%+: can afford US-warehouse or fast shipping premium
   - Private-label-level (60%+): justified by volume

## Do not

- Stay on AliExpress past 20+ orders/day on a single SKU. You're leaving money on the table.
- Move off AliExpress before 10 orders/day. Agent costs don't make back the unit savings at low volume.
- Skip sample orders on any product going into first PO. Non-negotiable.
- Pay 100% upfront to any direct supplier outside Alibaba Trade Assurance. Never.
- Use Pandabuy. It's shut down.
- Arbitrage Amazon via AutoDS. Violates Amazon ToS; risks your Amazon buyer account.
- Expect 24-hour response over Chinese New Year. You will get 7-14 day silence. Plan around it.
- Negotiate on price before establishing relationship. Establish relationship first; price improvements come naturally at volume.
- Use Spocket as primary supplier if margin is under 50%. US/EU-sourced cost structure requires it.

## Cross-references

- Cashflow impact of supplier terms and POs: `dropship-cashflow-ops`
- Supplier legal contracts and dispute resolution: `dropship-legal-compliance`
- Packaging design doubles as brand investment: `dropship-brand-transition`
- Sample imagery for PDP and ads: `dropship-creative-engine` and `dropship-shopify-build`
