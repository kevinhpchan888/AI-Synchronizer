---
name: dropship-legal-compliance
description: >
  Legal and compliance for a Singapore-incorporated Shopify dropshipper selling into US/UK/EU/AU. Use whenever the user mentions ACRA, IRAS, Pte Ltd, sole prop, GST, US sales tax, UK VAT, EU IOSS, AU GST, PDPA, GDPR, CCPA, FTC, FTC Endorsement Guides, ASA, CMA, DMCCA, EU Omnibus, ACL, ACCC, trademark, IPOS, USPTO, UKIPO, EUIPO, IP Australia, Madrid Protocol, CE marking, UKCA, FCC, RCM, CPSIA, EN 71, cookie consent, privacy policy, terms of service, or any variant of "do I need a company", "which entity", "do I need US LLC", "sales tax threshold", "is my compare-at legal", "trademark my brand", "product compliance for EU". Covers Meta ad compliance at policy level (not creative-specific). Does NOT cover tax-efficiency strategies (see dropship-cashflow-ops for SG source-of-income) or pricing compliance tactics (see dropship-pricing-strategy).
---

# Legal and Compliance Skill

## Core principle

**Compliance is not optional. It's the cost of doing business across four regulatory jurisdictions (SG home + US/UK/EU/AU target markets).** Most dropshippers operate in legal grey zones until a complaint, chargeback, or enforcement action surfaces. This skill surfaces the obligations upfront so the operator is deliberate, not accidentally non-compliant.

Important: I am not a lawyer. This skill provides operator-grade orientation. Engage an actual SG corporate lawyer (typical fee S$300-600/hour) before significant decisions like entity setup, multi-jurisdiction structuring, or a legal dispute.

## 1. Singapore business setup

### Sole proprietorship vs Pte Ltd

**Sole proprietorship (individual or partnership):**
- **Liability**: unlimited personal liability. Your home, car, personal assets on the line if customer sues or supplier sues.
- **Tax**: business income flows to your personal income tax return (0-24% progressive)
- **Setup**: simpler, ACRA registration S$115-175
- **Credibility**: low with suppliers, banks, payment processors (Stripe is reluctant to onboard sole props in some jurisdictions)

**Pte Ltd (Private Limited Company):**
- **Liability**: limited to company assets. Your personal assets protected (unless you sign personal guarantees)
- **Tax**: 17% corporate tax with partial exemptions (effective 4-8% on first $200k)
- **Setup**: ACRA ~S$315 filing + corporate secretary (mandatory within 6 months, S$600-1,500/year)
- **Credibility**: standard for payment processors, suppliers, banks

**For cross-border B2C ecommerce**: **Pte Ltd. Always.** Unbounded chargeback, supplier dispute, and customer claim exposure makes sole prop structurally wrong.

### ACRA registration for Pte Ltd (2026)

1. **Name reservation** via BizFile (acra.gov.sg): S$15, 15-minute turnaround if name is clear
2. **Incorporation**: S$300 standard filing fee
3. **Director requirements**: at least 1 local resident director (SG citizen, PR, or EntrePass holder). **If founders are non-resident**, hire a nominee director service (S$2,000-$5,000/year typical).
4. **Shareholder**: minimum 1 shareholder (can be the director)
5. **Paid-up capital**: minimum S$1 (realistically start at S$1,000-S$10,000 for credibility)
6. **Registered address**: physical SG address (virtual office services S$300-800/year)
7. **Corporate secretary**: mandatory appointment within 6 months. S$600-1,500/year.

**Total first-year setup cost:**
- DIY resident founder: S$400-500
- With nominee director + virtual office + secretary: S$3,500-7,500

### GST registration threshold and strategy

**Mandatory registration** at **S$1M taxable turnover** (looking back over 12 months OR forward next 12 months).

**Taxable turnover** for dropshipper selling abroad:
- Zero-rated exports still COUNT toward threshold (many operators miss this)
- A SG Pte Ltd shipping S$1.2M to US customers is over threshold even with $0 SG sales

**Voluntary registration often pencils because:**
- All exports zero-rated (you don't charge customers GST)
- All input tax on Meta/Shopify/Klaviyo/apps is **recoverable** (9% back)
- Business sits in net refund position with IRAS

**Worked example (voluntary registration, S$500k revenue, S$100k input tax):**
- Output GST: $0 (all exports)
- Input GST recoverable: S$9,000 (9% of S$100k)
- Net refund from IRAS: S$9,000/year

**Cost of voluntary registration:**
- Quarterly GST returns (F5)
- InvoiceNow mandatory from 1 November 2025 for new voluntary registrants (PEPPOL-based e-invoicing)
- Professional fees if outsourced: S$200-500/quarter

**Rule of thumb:** voluntary registration pays off if input tax exceeds S$3,000/year. For any ad-spending ecommerce operator, this is crossed quickly.

### Corporate tax

- **Headline**: 17% on chargeable income
- **Partial Tax Exemption (PTE)** (all SG Pte Ltds):
  - 75% exempt on first $10,000
  - 50% exempt on next $190,000
  - Total S$102,500 exempted on first S$200,000
- **Start-Up Tax Exemption (SUTE)** (first 3 YAs, qualifying):
  - 75% exempt on first $100,000
  - 50% exempt on next $100,000
  - Total S$125,000 exempted

**SUTE eligibility:**
- SG-incorporated
- SG tax-resident for that YA
- ≤20 shareholders with at least one individual holding ≥10%
- Not investment holding / property development

**Budget 2026**: announced 40% CIT rebate capped at $30,000 + minimum S$1,500 Cash Grant. Verify against IRAS primary.

**Effective tax rate on first S$200k (after PTE/SUTE/rebate)**: typically 4-8%. Below global averages.

### Annual filings

**To ACRA:**
- AGM within 6 months of financial year end (can be exempted if all shareholders agree)
- Annual Return filing (within 7 months of FY end)

**To IRAS:**
- Estimated Chargeable Income (ECI) within 3 months of FY end (waived if revenue ≤S$5M and ECI is nil)
- Form C-S / C-S (Lite) / C e-filing by **30 November**
  - Form C-S (Lite): revenue up to S$200k
  - Form C-S: revenue up to S$5M meeting conditions
  - Form C: otherwise

**GST returns** (if registered): quarterly F5 filings, due 1 month after quarter end.

### Corporate secretary requirement

Mandatory for all Pte Ltds within 6 months of incorporation. Role: statutory compliance, maintaining registers, filing ACRA documents.

**Providers:**
- **Sleek**: S$600-1,500/year bundled with other services
- **Osome**: similar pricing
- **BoardRoom**, **TMF Group**: enterprise; overkill for solo
- **DIY**: if director-founder is a qualified SG secretary (rare)

## 2. US sales tax nexus

### Economic nexus post-Wayfair (2018)

**South Dakota v Wayfair** (2018 Supreme Court) established states can require remote sellers to collect sales tax once **economic nexus** thresholds are met.

**Typical state thresholds:**
- **$100,000 in sales** in the state OR
- **200 transactions** in the state
- (Some states use only revenue, some use only transactions, some use either)

**Over 45 states** have economic nexus laws since Wayfair.

### When a SG seller has US nexus

**Economic nexus**: triggered per state once thresholds met. Example: SG Pte Ltd ships $120k to California in a year → California nexus → must register for California sales tax.

**Physical nexus**: triggered if you have inventory in a US warehouse (ShipBob, FBA), a US employee, or a US office.

**Key**: a SG operator using a US 3PL (ShipBob) triggers **physical nexus in the warehouse state immediately**. That alone is reason to register in that state.

### How to register and collect

**Manual**: register in each state individually. Painful at multi-state scale.

**Automated**:
- **TaxJar** (Stripe-owned): $19-$99/mo. Sales tax automation, registration services available.
- **Avalara AvaTax**: enterprise, $1,000+/year typical.
- **Numeral**: newer, competitive pricing.
- **Shopify Tax** (native): free, auto-collects based on nexus setup. Basic compared to TaxJar.

**Shopify Tax auto-collect**:
- Turn on in Admin > Settings > Taxes
- Configure nexus states manually (Shopify doesn't register for you)
- Collects tax at checkout
- You remit quarterly or monthly to each state

**For SG operator:**
- **Under $100k/year US revenue**: Shopify Tax native + manual remittance. Register only in states where you've hit threshold.
- **$100k+ US revenue**: TaxJar for automation.
- **$500k+ US revenue**: consider Stripe Atlas US C-corp to simplify.

### Marketplace Facilitator laws

If you sell via Amazon, Walmart, or eBay, those platforms collect and remit sales tax on your behalf (marketplace facilitator laws). **Not relevant for Meta-only + Shopify operator** since Shopify is not a marketplace.

## 3. UK and EU VAT

### UK VAT post-Brexit

**Critical**: UK has separate VAT regime post-Brexit.

**For non-UK-established sellers (SG Pte Ltd):**
- **No £85k threshold**: you must register for UK VAT from your first sale into the UK.
- **Under £135**: charge UK VAT at point of sale (20% standard, 5% or 0% on some categories)
- **Over £135**: customer pays import VAT on arrival (no VAT registration required)

**Register at**: HMRC online (gov.uk). Process: **Non-established taxable person (NETP)** scheme.

**Filing**: quarterly VAT returns.

**Tools:**
- **Taxamo** (Vertex-owned): UK VAT registration and filing service, ~£50-150/month
- **Avalara**: similar
- **DIY**: register and file directly with HMRC if volume is low

### EU VAT and IOSS

**Pre-July 2021 rule**: sales under €22 were VAT-exempt (low-value consignment relief).

**Post-July 2021**: all imports subject to VAT regardless of value.

**IOSS (Import One-Stop Shop)**:
- Single registration for VAT across all 27 EU member states
- Simplifies compliance for non-EU sellers
- Only applies to B2C consignments **under €150**
- **Non-EU sellers must appoint an IOSS intermediary** (mandatory)

**Intermediary options (2026):**
- **Taxamo** (part of Vertex): IOSS registration + filing, €75-300/month
- **Avalara**: similar
- **Eurora**: IOSS-focused, competitive pricing
- **EAS (European Association of Shopify merchants)**: member-driven option
- **hellotax**: SME-focused, ~€79+/month

**Without IOSS**: customer pays VAT + handling fees on delivery, massive checkout friction, high refusal rate. Effectively non-viable for B2C.

**Over €150 consignments**: IOSS doesn't apply. Customer pays at import, or seller uses regular import process (DDP).

**OSS (One-Stop Shop)**: for B2C services within EU (digital services, etc). Typically **not relevant for physical-product dropship**.

**Country-specific extras:**
- **Germany**: Packaging Act (VerpackG) requires LUCID registration for any seller putting packaging into the German market. Register at verpackungsregister.org. Annual fee ~€250-800 via service provider, plus packaging license fees (~€0.30-1/kg).
- **France**: DEEE (WEEE) for electronics, EPR for textiles. Separate registrations.
- **Italy, Spain**: similar EPR regimes emerging.

**For SG operator**: IOSS via Taxamo or Eurora is the practical starting point. Add country-specific (LUCID, DEEE) once you're scaling DE or FR specifically.

### UK VAT threshold reminder

**UK-ESTABLISHED businesses**: £85k threshold before VAT registration required.

**Non-UK-established (SG Pte Ltd)**: **£0 threshold**. Register from first UK sale.

This trips many operators because they assume £85k applies to them. It doesn't.

## 4. Australia GST

### Threshold

**A$75,000/year** of turnover (forecast or actual) into Australia triggers mandatory GST registration.

### Low Value Imported Goods (LVIG)

Since **1 July 2018**, non-resident merchants selling goods ≤**A$1,000** to Australian consumers must register for GST if over the A$75k threshold.

### Registration

- Register with **Australian Taxation Office (ATO)**
- Get an ABN (Australian Business Number) via simplified GST registration for non-residents
- **GST rate: 10%**
- Quarterly or monthly BAS filing

**Tools**: Shopify Markets handles AU GST calculation if nexus configured. Avalara, Taxamo as alternatives.

**Luxury Car Tax (LCT)**: relevant only if selling vehicles above threshold. Not typical for dropship.

## 5. Data protection compliance

### Singapore PDPA

**Personal Data Protection Act 2012, last amended 2020.**

Requirements:
- Obtain consent before collecting personal data
- Privacy policy outlining what data is collected and why
- Data Protection Officer (DPO) required for most organizations (can be a director)
- Respond to data subject access requests within 30 days
- Register with Do-Not-Call Registry (DNC) before sending marketing to SG numbers

**Fines**: up to S$1M per breach.

### EU GDPR

Applies to any business processing EU residents' personal data, regardless of where the business is located.

Key obligations:
- **Lawful basis** for processing (consent, contract, legitimate interest)
- **Cookie consent** with granular opt-in (not pre-ticked)
- **Data subject rights**: access, deletion, portability, rectification (must respond within 30 days)
- **Privacy policy** disclosing data flows
- **Data breach notification** within 72 hours to relevant authority
- **DPO** required if systematic monitoring or large-scale processing

**Fines**: up to €20M or 4% of global turnover (whichever higher).

**For SG dropshipper selling into EU**: EU GDPR applies. You process EU personal data (emails, addresses, purchase history).

### UK GDPR post-Brexit

Essentially same as EU GDPR, maintained as UK law. ICO (Information Commissioner's Office) is the regulator. Fines up to £17.5M or 4% global turnover.

### California CCPA and CPRA

**California Consumer Privacy Act** (CCPA, 2020) + amendments by **California Privacy Rights Act** (CPRA, effective 1 Jan 2023).

Thresholds for applicability:
- $25M annual gross revenue OR
- 100,000+ California consumers' data OR
- 50%+ revenue from selling/sharing consumer data

**Most dropshippers below thresholds** until significant scale.

**If applicable**: privacy notice, do-not-sell mechanism, consumer rights, data deletion.

### Practical steps

**Privacy policy tools:**
- **Termly**: free basic + paid $15/mo. Auto-updates for jurisdiction changes.
- **iubenda**: €27-99/year+. Strongest EU coverage.
- **Termageddon**: $10/mo+. US-focused, auto-updates.
- **Shopify native generator**: basic, acceptable at launch. Upgrade within 6 months.

**Cookie consent banners:**
- **Cookiebot**: strong GDPR compliance, free up to 100 pages.
- **OneTrust**: enterprise.
- **Klaro**: open-source, self-hosted.
- **Shopify Customer Privacy API** (built into checkout): baseline cookie consent for EU.

**For SG operator: set up Termly privacy + Cookiebot consent before EU launch.**

## 6. Consumer protection by market

### US: FTC

**FTC Endorsement Guides updated 2023:**
- Material connections must be disclosed (affiliates, paid partnerships, employee endorsements)
- #ad, #sponsored, "in partnership with" in clear, conspicuous placement
- Before-and-after claims require substantiation
- Testimonials should represent typical consumer experience

**FTC substantiation requirement**: any claim in ads must be substantiated with evidence BEFORE the claim is made. No "we'll have evidence later."

**Civil penalties**: $53,088 per violation (inflation-adjusted 2024).

**Class action risk**: real. Consumer class actions on pricing, shipping, product claims are common in US. Settlements $500k-$10M+.

### UK: ASA and CMA

**Advertising Standards Authority (ASA)** administers the CAP Code:
- Ads must not mislead, offend, cause harm
- Substantiation required for all factual claims
- Before-and-after, testimonials require typical-result disclaimer
- Subscription "free trials" heavily regulated (must be clear about auto-renewal)

**Competition and Markets Authority (CMA)**:
- Consumer protection enforcement
- Post-April 2025: **Digital Markets, Competition and Consumers Act 2024 (DMCCA)** gives CMA direct enforcement powers
- **Fines up to 10% of global turnover**
- Section 230: total price must include mandatory fees upfront
- Schedule 20: bans fake urgency (countdown timers not tied to real deadlines) per se

**Practical implications for dropship**:
- Countdown timers that reset = automatic violation
- Fake scarcity ("only 3 left") = violation
- Hidden shipping fees at checkout = violation

### EU: Consumer Rights Directive + Omnibus

**Consumer Rights Directive 2011/83/EU:**
- 14-day withdrawal right (customer can return without reason)
- Pre-contractual information disclosure
- No pre-ticked checkboxes (consent must be active)
- "Order with obligation to pay" button clearly labeled

**EU Omnibus Directive 2022** (2019/2161):
- 30-day lowest price rule for any "reduction" advertised
- Fines up to **4% of turnover in member states concerned**, minimum **€2M**

Covered in detail in `dropship-pricing-strategy`.

### Australia: ACL and ACCC

**Australian Consumer Law** (Schedule 2 of Competition and Consumer Act 2010):
- **Consumer guarantees** (mandatory, cannot be contracted out):
  - Goods must be of acceptable quality
  - Goods must match description
  - Repair, replace, or refund for major failures
- **Misleading conduct** prohibited (s18): broad rule, easily invoked
- **False/misleading representations** (s29): specific examples including pricing

**ACCC enforcement**: aggressive on pricing and subscription traps. Recent penalties:
- Bloomex $1M (2024) - false pricing
- Webjet $9M (July 2025) - misleading pricing
- Emma Sleep June 2025 admissions - fake compare-at

**Practical implications**:
- 14-day cooling-off if claimed but not legally required in AU (UK/EU require; AU doesn't by law but customer expects)
- Repairs/replacements for major defects (your supplier won't cover; you absorb)
- Can't disclaim consumer guarantees in ToS (law overrides)

## 7. Intellectual property

### Trademark your own brand

**File in home market first**: IPOS Singapore.

**Then file in target markets:**
- **USPTO** (United States): ~$250-350/class filing fee, plus attorney fees if using one (~$800-1,500 total including attorney)
- **UKIPO** (United Kingdom): £170/class online filing
- **EUIPO** (European Union): €850/class (covers all 27 EU members)
- **IP Australia**: A$250+/class

**Madrid Protocol**:
- Single international application via WIPO
- Cost-efficient for multi-country protection
- **Singapore is a signatory** (since 2000)
- Base application filed in SG; then extend to member countries via single form
- Total cost for SG base + US + UK + EU + AU: typically S$3,000-5,000

**Trademark classes that matter for dropship:**
- **Class 3**: cosmetics, toiletries
- **Class 9**: electronics, software
- **Class 18**: leather goods, bags
- **Class 21**: household items, kitchenware
- **Class 25**: clothing, apparel
- **Class 28**: toys, sporting goods
- **Class 35**: retail/ecommerce services

**Register in 2-3 most relevant classes for your products + Class 35 (retail services).**

### Defending against Chinese brand squatting

**China uses first-to-file system**: whoever files first gets the mark.

**If your supplier is in China**: they or an opportunist can file YOUR brand name in China and force you to:
- Buy it back (extortion)
- Stop using Chinese suppliers
- Fight through Chinese courts (expensive, slow)

**Defense**: file your trademark in **CNIPA (formerly CTMO)** before beginning significant manufacturing in China. ~RMB 300-1,000 per class filing fee + service provider markup.

Include Chinese character transliteration of your brand (simplified Chinese). Squatters often file the phonetic or translated version to extort you.

### Trademark clearance searches

Before filing, check if the mark is already registered:

- **USPTO TESS**: uspto.gov/trademarks/search
- **EUIPO eSearch**: euipo.europa.eu/eSearch
- **Madrid Monitor**: wipo.int/madrid/monitor
- **IPOS Search**: ipos.gov.sg/online-services
- **UK IPO**: gov.uk/search-for-trademark

**For deep clearance (recommended before spending $5k+ on branding)**: hire a trademark attorney. US firms ~$500-1,500 for a clearance opinion.

**Common rejection reasons:**
- Similar mark already registered in same class
- Merely descriptive ("FastDryer" for hair dryers)
- Geographically misdescriptive
- Likelihood of consumer confusion

## 8. Product compliance

### CE marking for EU

**Mandatory for many categories** entering EU market:
- Electronics, electrical
- Toys (EN 71)
- Machinery
- Medical devices
- Personal protective equipment

**Requires:**
- **Declaration of Conformity** (DoC) listing applicable directives and standards
- **Technical file** (product specs, test reports)
- CE mark on product or packaging
- For high-risk categories: **Notified Body** assessment (expensive, for medical/machinery)

**Responsible person**: non-EU sellers must appoint an EU-based authorized representative (who handles compliance queries from authorities).

**For dropshipper**: your supplier typically provides CE documentation. Verify it's real (not forged). Ultimate legal responsibility sits with the seller (you), not the supplier.

### UKCA post-Brexit

Replaces CE for Great Britain (England, Scotland, Wales). Northern Ireland still uses CE.

**Requirements**: mirrors CE structure. Transition period extended to 2025; verify current deadline.

**For dropshipper**: supplier-provided CE often doesn't cover UKCA. Extra documentation burden for UK market.

### FCC (United States)

**Federal Communications Commission** compliance for electronics that emit radio frequencies:
- Most consumer electronics (phones, wireless devices, chargers)
- Part 15 certification for unintentional radiators
- Part 22/24/27 for intentional radiators (Bluetooth, WiFi)

**Requires:**
- Testing at FCC-accredited lab (~$2,000-$10,000)
- FCC ID assigned to product
- Compliance statement in user manual

**For dropshipper**: supplier should provide FCC ID. Verify at fcc.gov/oet/ea/fccid search.

### RCM (Australia)

**Regulatory Compliance Mark** for electrical and telecommunications products in Australia.

**Requires:**
- Product compliant with Australian standards
- Responsible supplier registered with ACMA
- RCM mark on product

Less stringent than CE in practice, but still mandatory for regulated categories.

### Category-specific rules

**Cosmetics:**
- **US**: FDA Modernization Act (2022) increased oversight. Requires registration, product listing, adverse event reporting.
- **EU**: Cosmetic Regulation (EC) 1223/2009. Extensive safety assessment, notification on CPNP (Cosmetic Products Notification Portal). Serious barrier to entry; most dropshippers don't comply.
- **UK post-Brexit**: separate registration on UK SCPN portal.

**Supplements:**
- **US FDA**: DSHEA framework. Requires labelling, manufacturing in GMP-certified facility. FDA actively issues warning letters for unsubstantiated claims.
- **EU**: supplements regulated as food. EFSA notifications required for novel ingredients.
- **Claim language critical**: any disease/health claim without substantiation = violation. "Supports immune health" (vague) is safer than "treats cold" (specific health claim).

**Children's products:**
- **US**: Consumer Product Safety Improvement Act (CPSIA). Lead testing, tracking labels, small parts warnings.
- **EU**: EN 71 (toy safety standards). Chemical migration, flammability.

**Electronics/batteries:**
- **EU**: WEEE (Waste Electrical and Electronic Equipment) registration required in each member state
- **EU**: RoHS (Restriction of Hazardous Substances)
- **US**: various state laws on battery disposal

### How a dropshipper realistically handles compliance

**Honest approach:**
1. Request supplier's compliance documentation (CE, FCC, etc.)
2. Verify it's real (check regulator databases)
3. Keep documentation on file
4. If enforcement action: you're the seller of record, legally on the hook

**Risky approach (common):**
- Assume supplier docs are valid
- Don't verify
- Rely on low-volume, low-detection probability

**Reality**: enforcement on solo dropshipper is rare until scale or complaint triggers investigation. Most dropshippers operate in grey zone. This is not a recommendation, it's an observation.

**Exception**: EU market surveillance is increasingly aggressive. EU Digital Services Act + expected Product Liability Directive updates will hold online sellers more accountable. Factor in for EU-focused operators.

## 9. Terms and privacy

### When Shopify native templates are enough

**Launch**: Shopify's generated policies are adequate baseline for Refund Policy, Privacy Policy, Terms of Service, Shipping Policy.

**Customize**:
- Set refund timeline (14 days for EU minimum, 30 days US standard)
- Specify shipping times honestly (10-15 days for China-sourced)
- Include contact email and response time commitment

### When to upgrade to dedicated tools

Within 6 months of launch:

**Termly** ($15/mo pro):
- Auto-updates for CCPA, GDPR, CalOPPA, Virginia CDPA changes
- Cookie consent management included

**iubenda** (€27-99/year+):
- Strongest EU compliance
- Multi-language support
- Attestation documents

**Termageddon** ($10/mo+):
- US-focused
- Automatic updates
- Privacy policy generator strong

### When to engage a lawyer

- **Pre-private-label transition**: supplier contracts, manufacturing agreements, trademark strategy
- **$100k+/year revenue**: custom ToS that actually protects you
- **Any legal dispute**: chargeback escalation, customer lawsuit, platform account termination appeal
- **Multi-jurisdiction structuring**: if considering US LLC, SG-HK dual structure, etc.

**SG corporate lawyer rates**: S$300-600/hour. Initial advice package ~S$2,000-5,000.

### Supplier contracts

For direct sourcing (Alibaba, 1688 post-private-label):

- **Purchase Order (PO)**: unit specs, pricing, quantity, delivery terms, payment terms
- **Master Purchase Agreement (MPA)**: for ongoing relationship
- **Exclusivity clauses** (optional): supplier won't sell this SKU to other operators in your markets
- **Defect liability**: who pays for defects, replacement timeline
- **IP clause**: you own the designs, moulds, tooling

**Alibaba provides basic contract templates**; upgrade to lawyer-reviewed for PO above $50k.

### Influencer agreements

For any influencer collaboration (even micro-influencers):

- **Scope**: platforms, number of posts, content requirements
- **FTC disclosure requirement**: #ad or #sponsored clearly
- **IP usage rights**: can you reuse their content in ads?
- **Exclusivity**: can they promote competitors?
- **Payment terms**: flat fee, per-post, performance-based

**Simple template**: Upwork has templates; lawyer-reviewed for influencers above $5k engagement.

### VA contracts

Independent contractor agreements. Include:
- Confidentiality
- IP assignment (work product is yours)
- Termination terms
- Payment schedule
- Scope of work

**For Philippines VAs via OnlineJobs.ph**: their platform has template contracts.

## 10. Meta advertising compliance

### Platform-level

Meta's own ad policies (facebook.com/business/help):
- No misleading claims
- No fake reviews or testimonials without disclosure
- No before/after for certain categories (weight loss, skin)
- No targeting attributes based on personal characteristics (race, religion, sexual orientation, health)
- Special Ad Categories (housing, credit, employment) have stricter targeting rules

**Review**: `dropship-facebook-ads` for Meta policy deep-dive.

### FTC Endorsement Guides

For all UGC and influencer ads:
- Material connection disclosure (#ad, #sponsored)
- "Clearly and conspicuously" placed (not buried at bottom)
- Applies to Stories, Reels, carousel, feed, every placement

### GDPR consent for EU retargeting

- Explicit opt-in for tracking pixels (Cookiebot or similar)
- Respect user's consent choice (don't fire pixel if consent declined)
- Document consent (platform provides this)

**Shopify Customer Privacy API** integrates with Meta Pixel to respect consent.

## 11. Accounting and filings

Cross-reference `dropship-cashflow-ops` for tax treatment details.

### Annual returns

**To ACRA:**
- Annual Return: within 7 months of FY end
- AGM: within 6 months (or written resolution exemption)
- Filing fee: free if filed on time, S$50-300 late fee

**To IRAS:**
- ECI: 3 months after FY end (waived if ≤S$5M revenue and nil ECI)
- Form C-S / C-S Lite / C: 30 November
- GST F5 (quarterly): 1 month after quarter end

### When US LLC makes sense for SG operator

**Almost never.**

Reasons US LLC is usually wrong:
- US has no DTA with Singapore (double tax risk if PE arises)
- Adds US filing burden (Form 5472 required for foreign-owned single-member LLCs, $25,000+ penalty for non-filing)
- Sales tax nexus still applies
- SG territorial tax + US federal + state tax on same income

**When US LLC could make sense:**
- You're raising US investment capital
- You're in a market where US operator credibility materially matters (rare)
- Specific tax strategy with US tax advisor's opinion

**Default: stay SG Pte Ltd.**

## 12. Dispute resolution

### Chargebacks as de facto dispute mechanism

Most customer disputes in ecommerce never reach courts. They become:
- Refund request via customer service
- Chargeback via credit card

**See `dropship-cashflow-ops` for chargeback defense tactics.**

### Small claims in target markets

Rare for B2C ecommerce. Customer suing SG operator across borders is impractical (jurisdiction issues, cost of filing in SG, enforcement).

### EU Online Dispute Resolution

**EU ODR platform**: ec.europa.eu/consumers/odr/
- Required link in EU-facing ecommerce (Regulation 524/2013)
- Alternative dispute resolution before court

**Practical**: include link in Terms of Service and checkout. Customer rarely uses.

### Supplier disputes

**Alibaba Trade Assurance**: escrow-based, handles most low-value disputes.

**Beyond Trade Assurance** (higher value):
- Mediation via Alibaba
- Chinese courts (expensive, slow)
- ICC arbitration (international)

**Practical**: build supplier relationships that avoid dispute. Pay on time, communicate early on quality issues, don't chargeback aggressively (kills relationship).

## Compliance decision workflow

When user asks "do I need to comply with X?":

1. **What market is the customer in?** (Determines which regulator)
2. **What's the product category?** (Determines which category-specific rules)
3. **What's the revenue threshold?** (Determines if you've crossed registration triggers)
4. **What's the practical enforcement risk?** (Some rules are strict but rarely enforced; others aggressive)
5. **What's the cost of compliance vs cost of non-compliance?** (Pure risk management call)

## Do not

- Run a sole proprietorship for cross-border B2C ecom. Unbounded liability.
- Wait for S$1M GST threshold if input tax on Meta/Shopify is material. Voluntary registration often pays back.
- Assume UK's £85k VAT threshold applies to SG Pte Ltd. It's £0 for non-UK-established.
- Skip IOSS intermediary for EU sales. Without it, customer refuses delivery.
- File a US LLC without specific tax-advisor reason. Usually adds filings and tax, no benefit.
- Rely on supplier-provided CE/FCC documentation without verification. Legal responsibility is yours.
- Ignore Chinese trademark filing if sourcing from China. Squatters will extort.
- Use countdown timers that reset. UK DMCCA Schedule 20 banned per se; FTC Section 5 violation.
- Claim health benefits without substantiation. FTC has $53k/violation penalty.
- Post unsourced before/after photos. FTC Endorsement Guides require typical-result disclaimer.
- Assume PDPA is enough when selling to EU. GDPR has extraterritorial reach; applies to you.
- Charge sales tax in every US state. Only states where you have nexus.
- Disclaim consumer guarantees in AU ToS. ACL overrides; can't contract out.

## Cross-references

- Pricing compliance (EU Omnibus, UK DMCCA, AU ACL tactics): `dropship-pricing-strategy`
- SG tax obligations (source-of-income ruling, DTAs, personal tax): `dropship-cashflow-ops`
- Supplier contracts and dispute mechanisms: `dropship-suppliers`
- Ad platform-level compliance (Meta policies, disclaimers): `dropship-facebook-ads`
- Trademark search before branding investment: `dropship-brand-transition`
- Privacy tools setup (Termly, iubenda, Cookiebot): `dropship-shopify-integrations`
