# Logo Variants Specification

## Required Variants

### 1. Primary Logo
- **File:** `logo-primary.svg`
- **Layout:** Stacked (multi-line wordmark with accent element)
- **Colors:** White text + accent on brand background
- **Aspect ratio:** Typically 2:1 to 3:1 (landscape)
- **SVG viewBox:** Match the natural content bounds + padding
- **Use:** Hero banners, title slides, print headers, merchandise

### 2. Horizontal Logo
- **File:** `logo-horizontal.svg`
- **Layout:** All elements on a single line
- **Colors:** White text + accent on brand background
- **Aspect ratio:** 5:1 to 8:1 (very wide)
- **SVG viewBox:** Fit content tightly with consistent padding
- **Use:** Website nav bar, email signature, LinkedIn banner
- **Sizing:** Design at ~60px text height; minimum usable width 180px

### 3. Stacked / Square Logo
- **File:** `logo-stacked.svg`
- **Layout:** Each word on its own line, centered
- **Colors:** White text + accent on brand background
- **Aspect ratio:** 1:1 to 4:5 (square or near-square)
- **Use:** Social media profile photos, app store icons, square ad units
- **Target sizes:** 400x400, 170x170, 110x110

### 4. White on Transparent
- **File:** `logo-white-on-transparent.svg`
- **Layout:** Same as primary but NO background rectangle
- **Colors:** White text + accent (gold/colored dot stays colored)
- **Use:** Overlaid on dark photography, dark UI sections, video watermarks

### 5. Dark on Light
- **File:** `logo-dark-on-light.svg`
- **Layout:** Same as primary but NO background rectangle
- **Colors:** Brand primary color for text, accent stays its color
- **Use:** Light web pages, documents, print on white paper, letterhead

### 6. Dark on Light Horizontal
- **File:** `logo-dark-on-light-horizontal.svg`
- **Layout:** Single-line, no background
- **Colors:** Brand primary color for text, accent stays its color
- **Use:** Light-background nav bars, document headers, footer

### 7. Monochrome Black
- **File:** `logo-monochrome-black.svg`
- **Layout:** Same as primary, no background
- **Colors:** All elements in #1A1A1A (near-black)
- **Use:** Single-color print, fax, newspaper, rubber stamps, embossing

### 8. Monochrome White
- **File:** `logo-monochrome-white.svg`
- **Layout:** Same as primary, no background
- **Colors:** All elements in #FFFFFF
- **Use:** Dark merchandise, screen printing on dark fabric, dark overlays

### 9. Icon / Lettermark
- **File:** `logo-icon-only.svg`
- **Layout:** Brand initials (1-3 letters) + accent element
- **Background:** Brand color with rounded corners (border-radius: 12-16% of width)
- **Aspect ratio:** 1:1 (square)
- **Target sizes:** 512x512 (app icon master), 192x192, 128x128
- **Use:** App icons, browser bookmarks, avatar placeholders, watermarks

### 10. Favicon
- **File:** `logo-favicon.svg`
- **Layout:** Simplified lettermark, minimal detail
- **Background:** Brand color with slight rounding (border-radius: ~12%)
- **Target size:** 32x32 primary, 16x16 minimum
- **SVG viewBox:** `0 0 32 32` or `0 0 64 64`
- **Use:** Browser tab icon
- **Rules:** At 16px, remove any element smaller than 3px. Simplify aggressively.

### 11. Social Card / OG Image
- **File:** `logo-social-card.svg`
- **Layout:** Centered logo on brand background, generous padding
- **Dimensions:** 1200x630 (Open Graph standard)
- **Use:** Link previews on Facebook, Twitter/X, LinkedIn, Slack, Discord
- **Rules:** Logo should fill ~60% of the horizontal space. Leave breathing room.

## Social Media Dimensions Quick Reference

| Platform | Asset | Dimensions | Recommended Variant |
|----------|-------|-----------|-------------------|
| Open Graph (Facebook, LinkedIn) | Link preview | 1200x630 | social-card |
| Twitter/X | Card image | 1200x675 | social-card (crop safe) |
| Twitter/X | Profile | 400x400 | stacked or icon |
| Facebook | Profile | 170x170 | stacked or icon |
| Instagram | Profile | 110x110 | icon |
| LinkedIn | Profile | 400x400 | stacked or icon |
| LinkedIn | Banner | 1584x396 | horizontal (centered on banner bg) |
| YouTube | Channel icon | 800x800 | stacked |
| Favicon | Browser tab | 32x32, 16x16 | favicon |

## Clear Space Rules

Define clear space using a **reference unit** from the logo itself. Good reference units:
- The height of the accent element (dot, icon, mark)
- The x-height of the wordmark font
- A fixed fraction (e.g., 1/4) of the logo's total height

**Minimum clear space = 1x the reference unit on all sides.**

No text, images, page edges, or other graphics should enter this zone. For co-branding or partner logos, increase to 1.5x-2x.

## Minimum Size Rules

| Variant | Digital Minimum | Print Minimum |
|---------|----------------|---------------|
| Primary | 200px wide | 1.5 inches |
| Horizontal | 180px wide | 1.5 inches |
| Stacked | 120px wide | 1 inch |
| Icon | 32px | 0.375 inches |
| Favicon | 16px | N/A |

Below minimum size, switch to the icon/lettermark variant. Never scale the full wordmark below its minimum -- it becomes illegible.
