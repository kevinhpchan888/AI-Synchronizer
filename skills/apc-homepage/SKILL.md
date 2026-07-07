---
name: apc-homepage
description: "Manage the agingparent.care homepage: edit sections, swap images, update copy, push live. Trigger on APC homepage, any section by name (hero, products, caregiving arc, workbook preview, testimonials, newsletter, FAQ, final CTA, footer), update the hero, change the CTA, or /apc-homepage."

---

# APC Homepage Manager

Part of the **three-skill APC system**. Route tasks correctly:

| Task | Skill |
|------|-------|
| Homepage edits (this skill) | `apc-homepage` |
| Blog articles | `apc-article-ops` |
| Everything else (products, orders, emails, discounts, analytics) | `selldone` |

**Before writing ANY homepage copy**, read `~/.claude/skills/selldone/references/apc-content-rules.md` for voice/tone, banned words, and formatting rules.

**Before calling ANY Selldone API**, check `~/.claude/skills/selldone/references/api-quirks.md` — especially the CMS page content rule (must be JSON object, not string).

**For image uploads to Selldone CDN**, use the Dashboard API browser method documented in `api-quirks.md`, or the Higgsfield CDN pipeline in `apc-article-ops`.

Edit the agingparent.care homepage efficiently. This skill gives you the full structural map, the edit→push workflow, and the design system so you never have to re-discover the page architecture.

## Architecture

The homepage is NOT built with Selldone's native page builder components. It is a **single raw HTML file** injected into a Selldone CMS page via a Python push script.

```
Selldone Page 27869
  └─ XSection
       └─ XCode
            └─ data.code = <entire homepage_code.html>
```

### Key Paths

| What | Path |
|------|------|
| **HTML source** | `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\Website and Store\homepage_code.html` |
| **Push script** | `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\Website and Store\push-homepage.py` |
| **Images folder** | `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\Website and Store\Images\` |
| **Selldone page ID** | 27869 (shop 14492) |
| **API endpoint** | `PUT https://api.selldone.com/shops/14492/pages/27869` |

### Edit→Push Workflow

1. **Read** `homepage_code.html` (the single source of truth — ~720 lines, ~47KB)
2. **Edit** the HTML/CSS/JS directly using the Edit tool
3. **Push** by running `push-homepage.py` which:
   - Reads `homepage_code.html`
   - Wraps it in the XSection/XCode JSON structure
   - PUTs to the Selldone API
4. **Verify** by browsing `https://agingparent.care` in Chrome

**Critical push rule**: The `content` field in the API payload must be a Python dict (native JSON object), NOT a `json.dumps()` string. Double-encoding causes the page to break.

## Design System

### CSS Variables
```css
--slate: #4E6B7C;      /* Primary — nav, dark sections, buttons */
--gold: #C49A3C;        /* Accent — eyebrows, workbook card, bundle bar */
--charcoal: #1A1A1A;    /* Body text */
--warm-gray: #F5F3F0;   /* Page background */
```

### Typography
- **Body**: Inter (sans-serif)
- **Brand mark**: Source Serif 4 (serif) — "Aging Parent·Care"
- **Max width**: 1200px
- **Reading width**: 720px
- **Section padding**: 100px 40px (desktop), 60px 20px (mobile)

### Button Styles
- **Primary (slate)**: `background: var(--slate); color: white; border-radius: 8px;`
- **Primary (gold)**: `background: var(--gold); color: white;`
- **Ghost/outline**: `border: 2px solid white; background: transparent;`

### Eyebrow Pattern
All section eyebrows use: `text-transform: uppercase; letter-spacing: 3px; font-size: 0.75rem; color: var(--gold);`

## Section Map (12 Sections, Top to Bottom)

Use these CSS class selectors and section numbers when the user references a section by name.

| # | Name | CSS Selector | Background |
|---|------|-------------|------------|
| 1 | Nav | `.nav` | White (scrolled: white+shadow) |
| 2 | Hero | `.section.hero` | warm-gray gradient |
| 3 | Emotional Validation | `.section.emotional` | slate (dark) |
| 4 | Products | `.section.products` (id="system") | warm-gray |
| 5 | Caregiving Arc | `.section.journey` | warm-gray |
| 6 | Workbook Preview | `.section.workbook-preview` | warm-gray |
| 7 | Why Different | `.section.why-different` (id="about") | warm-gray |
| 8 | Testimonials | `.section.testimonials` | warm-gray |
| 9 | Newsletter | `.section.newsletter` (id="contact") | light blue-gray |
| 10 | FAQ | `.section.faq` | warm-gray |
| 11 | Final CTA | `.section.final-cta` | slate (dark) |
| 12 | Footer | `.footer` | charcoal |

### Section Details Quick Reference

**Hero** (#2): Eyebrow → H1 ("Caring for an aging parent is hard.") → italic H1 ("You should not have to figure it out alone.") → subtitle → 2 buttons → trust pills → 3D book mockups

**Emotional** (#3): Dark slate. Italic H2 ("If you are somewhere in the middle of this...") → 4-panel moments grid (parking lot, 3am call, hospital discharge, sibling fight) → body text → ghost CTA

**Products** (#4): Guide card ($39, slate) + Workbook card ($29, gold) + Bundle Bar ($54, slate). All link to `/product/680234`

**Caregiving Arc** (#5): 6 cards in 3x2 grid (01-06), each with stage number, chapter range, title, description

**Workbook Preview** (#6): Left: 3 stacked worksheet mockups. Right: pullquote + 6 bullet features + CTA

**Why Different** (#7): 6 cards (Plain English, Complete, Practical, Current, Honest, Designed for Adult Children)

**Testimonials** (#8): 4 cards (Margaret L., Robert K., Carol N., James T.) with 5-star ratings

**Newsletter** (#9): 4 resource pills + email input + submit button

**FAQ** (#10): 7 accordion items

**Final CTA** (#11): Dark slate. "Begin Here" → H1 → 2 price buttons ($54/$39) → trust line

**Footer** (#12): 4-column grid (brand, system links, company links, legal links) + disclaimer + copyright

## Illustration System

All illustrations follow the **Tomi Um** style. See `illustration_prompt_rules.md` in the AgentDonny project memory for the full prompt schema, text-prevention rules, banned phrases, and validation checklist.

### Generated Images (mapped to sections)

| File | Ratio | Section |
|------|-------|---------|
| APC_Hero_PorchTogether.png | 16:9 | Hero (#2) background |
| APC_Product_GuidesOnTable.png | 4:3 | Products (#4) |
| APC_CTA_TheBeginning.png | 16:9 | Final CTA (#11) background |
| APC_Email_Preparedness.png | 1:1 | Newsletter (#9) |
| APC_Arc01_WarningSigns.png | 1:1 | Arc card 01 |
| APC_Arc02_TheCrisis.png | 1:1 | Arc card 02 |
| APC_Arc03_TheNewNormal.png | 1:1 | Arc card 03 |
| APC_Arc04_TheLongMiddle.png | 1:1 | Arc card 04 |
| APC_Arc05_TheHardDecisions.png | 1:1 | Arc card 05 |
| APC_Arc06_TheOtherSide.png | 1:1 | Arc card 06 |
| APC_About_HomeOffice.png | 4:3 | Why Different (#7) |

### NanoBanana Pro Aspect Ratios (ONLY these 5)
16:9, 4:3, 1:1, 3:4, 9:16

## Common Operations

### Change section copy
1. Read `homepage_code.html`
2. Find the section by CSS class (see Section Map)
3. Edit the text content
4. Run `push-homepage.py`

### Add/swap an image
1. Ensure image is in the `Images\` folder (or upload to a CDN)
2. Edit `homepage_code.html` to add an `<img>` tag or CSS `background-image` in the target section
3. For background images: `background-image: url('IMAGE_URL'); background-size: cover;`
4. For inline images: `<img src="IMAGE_URL" alt="descriptive alt text" style="width:100%; border-radius:12px;">`
5. Run `push-homepage.py`

### Update pricing
Prices appear in 3 places — update ALL of them:
1. Products section (#4): Guide card, Workbook card, Bundle Bar
2. Final CTA (#11): Button text includes prices ("$54", "$39")
3. Bundle Bar: "Save $14 vs. separate" (recalculate if prices change)

### Add a new section
1. Write the HTML section in the appropriate position in `homepage_code.html`
2. Follow the existing pattern: `<section class="section new-section-name">` with `<div class="container">`
3. Add `.reveal` class to inner elements for scroll animation
4. Add responsive CSS in the existing `<style>` block
5. Run `push-homepage.py`

### Add/edit testimonials
Each testimonial card follows this structure:
```html
<div class="testimonial-card">
  <div class="stars">★★★★★</div>
  <div class="quote-icon">"</div>
  <p class="testimonial-text"><em>"Quote text here."</em></p>
  <div class="testimonial-author">
    <div class="author-avatar" style="background: var(--slate);">XX</div>
    <div>
      <strong>Name.</strong>
      <div class="author-role">Role description, Location</div>
    </div>
  </div>
</div>
```

### Add/edit FAQ items
```html
<div class="faq-item" onclick="this.classList.toggle('active')">
  <div class="faq-question">
    <span>Question text here?</span>
    <span class="faq-toggle">+</span>
  </div>
  <div class="faq-answer">
    <p>Answer text here.</p>
  </div>
</div>
```

## JS Features (in the HTML file)

- **Scroll progress bar**: `<div class="progress-bar">` updated on scroll
- **Nav scroll state**: Adds `.scrolled` class on scroll (shadow + solid bg)
- **IntersectionObserver**: Elements with `.reveal` class fade in on scroll
- **FAQ accordion**: Toggle `.active` class on click
- **3D book tilt**: `mousemove` event on hero creates perspective tilt

## Pre-Push Checklist

Before running `push-homepage.py`, verify:
- [ ] All links point to correct destinations (especially `/product/680234`)
- [ ] Prices are consistent across all 3 locations
- [ ] Images have proper `alt` text
- [ ] No broken CSS (check responsive styles)
- [ ] No accidental removal of the `<script>` block at the bottom
- [ ] Test in browser after push — the page is fully JavaScript-dependent for animations

## Cross-References

### Shared APC System References (in `~/.claude/skills/selldone/references/`)
- **`apc-content-rules.md`** — Voice/tone, banned words, illustration rules, em dash ban. **Read before writing any homepage copy.**
- **`api-quirks.md`** — CMS page content must be JSON object (not string), PowerShell corrupts JSON, image upload needs Dashboard API. **Read before any push or API call.**

### Sibling Skills
- **`selldone`** — Integration hub. 47 MCP tools, three API layers, all CRUD operations, page builder content model
- **`apc-article-ops`** — Blog article lifecycle, illustration CDN pipeline, Notion sync, article HTML structure
