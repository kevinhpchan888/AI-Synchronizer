# Color Systems Guide

## Building a Brand Palette

### Primary Palette (3-5 colors)
Every brand needs at minimum:
1. **Primary brand color** -- the dominant color associated with the brand
2. **Accent color** -- draws attention to CTAs, highlights, key elements
3. **Neutral / text color** -- for body copy and UI elements

### Extended Palette
Derive from the primary palette:
- **Dark variant** -- 15-20% darker, for hover states and depth
- **Light variant** -- 15-20% lighter, for secondary accents
- **Wash / tint** -- very light (90-95% toward white), for backgrounds and cards
- **Charcoal** -- near-black for body text (#1A1A1A or #2D2D2D, not pure #000000)
- **Warm gray** -- off-white for page backgrounds (#F5F3F0 or #F8F7F5)

### Generating Tints and Shades

From a base hex color:
- **Tint (lighter):** Mix with white. 10% tint = 90% base + 10% white
- **Shade (darker):** Mix with black. 10% shade = 90% base + 10% black
- **Tone (muted):** Mix with gray. Reduces saturation

In CSS, use `color-mix()` for modern browsers:
```css
--color-light: color-mix(in srgb, var(--color-base) 80%, white);
--color-dark: color-mix(in srgb, var(--color-base) 80%, black);
```

## WCAG Contrast Requirements

| Level | Normal Text (<24px) | Large Text (>=24px or >=19px bold) |
|-------|--------------------|------------------------------------|
| AA | 4.5:1 minimum | 3:1 minimum |
| AAA | 7:1 minimum | 4.5:1 minimum |

### Contrast Ratio Formula

```
L1 = luminance of lighter color
L2 = luminance of darker color
Contrast = (L1 + 0.05) / (L2 + 0.05)
```

Relative luminance: `L = 0.2126 * R + 0.7152 * G + 0.0722 * B`
(where R, G, B are linearized from sRGB)

### Quick Contrast Reference

| Combination | Typical Ratio | Passes |
|------------|--------------|--------|
| Black on white | 21:1 | AAA |
| #1A1A1A on white | ~16.8:1 | AAA |
| #1A1A1A on #F5F3F0 | ~14.2:1 | AAA |
| White on #4A6274 | ~4.6:1 | AA large text |
| White on #344654 | ~7.2:1 | AAA |
| #C4943D on white | ~2.8:1 | Fails -- decorative only |
| #C4943D on #1A1A1A | ~5.9:1 | AA |

### Practical Rules

- **Brand colors often fail contrast on white.** That's OK for decorative use (dots, borders, backgrounds). Never use low-contrast brand colors for body text.
- **Use your charcoal (#1A1A1A) for all body text.** It passes AAA against white and most light backgrounds.
- **For text on brand-color backgrounds,** test both white and charcoal. Pick whichever gets above 4.5:1.
- **Gold/amber accent colors almost never pass** as text on white. Use them for buttons (with white text), decorative elements, and icons -- not inline text.

## Color Extraction from Reference Images

When you can't use a color picker tool, estimate colors by:
1. Identifying the color family (blue-gray, warm gold, etc.)
2. Estimating saturation (muted? vivid?)
3. Estimating lightness (how close to middle gray?)
4. Providing your best hex guess
5. **Always ask the user to confirm** -- mention that you estimated

Common brand color families:
- Slate blue: #4A6274 to #5A7A8E range
- Navy: #1B2A4A to #2C3E6B range
- Warm gold: #C4943D to #D4A84E range
- Teal: #2A7B88 to #3D9AA8 range
- Forest green: #2D5F3F to #3D7A52 range
- Coral: #E07A5F to #F09070 range
