# Typography Guide

## Font Weight Scale

| Weight | Name | Typical Use |
|--------|------|-------------|
| 100 | Thin | Decorative display only |
| 200 | ExtraLight | Large display text |
| 300 | Light | Subheadings, pull quotes |
| 400 | Regular | Body text, default |
| 500 | Medium | UI labels, captions, nav links |
| 600 | SemiBold | Buttons, emphasized body text |
| 700 | Bold | Headings H2-H4 |
| 800 | ExtraBold | Logo wordmarks, H1 headlines |
| 900 | Black | Impact display, hero text |

## Logo Typography Rules

**Wordmark weight:** Use 700-900 for wordmarks. 800 (ExtraBold) is the sweet spot for most sans-serif logos -- bold enough to command attention, not so heavy that counters close up at small sizes.

**Letter-spacing in logos:** Tighten tracking for large display text. General rules:
- Display (>48px): -1px to -3px tracking
- Heading (24-48px): -0.5px to -1.5px
- Body (14-18px): 0 to 0.2px (leave alone or slightly open)
- Small/caps (<14px): +0.5px to +1px (open up for legibility)

**Line height in logos:** Use `line-height: 1` or `1.05` for stacked logo text. Body text needs 1.5-1.7 for readability, but logos are display text where tight leading creates visual unity.

## Modular Type Scales

Pick a ratio and a base size (usually 16px for web). Multiply the base by the ratio for each step up.

| Ratio | Name | Feel | Scale from 16px base |
|-------|------|------|---------------------|
| 1.125 | Major Second | Subtle, conservative | 16, 18, 20, 23, 26 |
| 1.200 | Minor Third | Balanced, versatile | 16, 19, 23, 28, 33 |
| 1.250 | Major Third | Clear hierarchy | 16, 20, 25, 31, 39 |
| 1.333 | Perfect Fourth | Strong contrast | 16, 21, 28, 38, 50 |
| 1.500 | Perfect Fifth | Dramatic | 16, 24, 36, 54, 81 |
| 1.618 | Golden Ratio | High-end, editorial | 16, 26, 42, 68, 110 |

**Recommendation:** Use 1.200 (Minor Third) or 1.250 (Major Third) for most brand systems. They create enough visual hierarchy without extreme jumps that make small sizes too small.

## Font Pairing Principles

For brand systems, one font family is usually enough. Variable fonts like Inter, Plus Jakarta Sans, or Outfit cover the full weight range (400-900) and handle both display and body text.

If pairing two fonts:
- **Contrast in structure, harmony in proportion.** Pair a geometric sans with a humanist serif, or a slab serif with a grotesque sans.
- **Match x-height.** Fonts with similar x-heights sit comfortably together in mixed layouts.
- **Limit to two families.** One for headings, one for body. A third font adds complexity without value in most brand systems.

## Recommended Sans-Serif Fonts for Logos

| Font | Weights | Character | Google Fonts |
|------|---------|-----------|-------------|
| Inter | 100-900 | Clean, neutral, highly legible | Yes |
| Plus Jakarta Sans | 200-800 | Friendly, geometric, modern | Yes |
| Outfit | 100-900 | Contemporary, geometric | Yes |
| Manrope | 200-800 | Semi-rounded, approachable | Yes |
| DM Sans | 400-700 | Geometric, compact | Yes |
| Space Grotesk | 300-700 | Technical, distinctive | Yes |
| Sora | 100-800 | Geometric, open | Yes |

## Kerning Adjustments for Common Letter Pairs

When building SVG logos with manual positioning, watch for these pairs that often need tightening:

- **AV, AW, AT, AY** -- kern tighter (diagonal meets vertical)
- **To, Tr, Ta, Te** -- kern tighter (T crossbar creates space)
- **LT, LV, LY** -- kern tighter (L's horizontal creates gap)
- **PA, WA, VA** -- kern tighter

Most Google Fonts handle optical kerning well at CSS level (`font-kerning: auto`), but in SVGs with manual `x` positioning, you must account for these yourself.

## Responsive Typography

For web implementations, use `clamp()` for fluid sizing:

```css
h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.5rem, 3.5vw, 2.5rem); }
body { font-size: clamp(1rem, 1.5vw, 1.125rem); }
```
