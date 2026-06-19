# Print Specifications

## Pantone Color Matching

Pantone colors ensure consistent reproduction across different printers and materials. Always provide Pantone values for primary brand colors.

### Common Brand Color to Pantone Mappings

**Blues / Slate:**
| Hex | Pantone | Description |
|-----|---------|-------------|
| #4A6274 | 5405 C | Muted slate blue |
| #344654 | 7545 C | Dark slate |
| #5A7A8E | 5415 C | Medium slate |
| #1B365D | 534 C | Navy blue |
| #003366 | 289 C | Deep navy |
| #2C5F8A | 7692 C | Ocean blue |

**Golds / Ambers:**
| Hex | Pantone | Description |
|-----|---------|-------------|
| #C4943D | 7407 C | Warm gold |
| #D4A84E | 7408 C | Bright gold |
| #A57A2B | 1255 C | Dark gold |
| #B8860B | 7555 C | Dark goldenrod |
| #DAA520 | 124 C | Golden yellow |

**Greens:**
| Hex | Pantone | Description |
|-----|---------|-------------|
| #2D5F3F | 3435 C | Forest green |
| #3D7A52 | 7733 C | Medium green |
| #006B3F | 340 C | Deep green |

**Reds / Corals:**
| Hex | Pantone | Description |
|-----|---------|-------------|
| #E07A5F | 7416 C | Coral |
| #C75B3A | 7580 C | Rust |
| #B22222 | 7622 C | Fire brick |

**Neutrals:**
| Hex | Pantone | Description |
|-----|---------|-------------|
| #1A1A1A | Black 6 C | Near black |
| #333333 | 446 C | Dark gray |
| #666666 | 424 C | Medium gray |
| #F5F3F0 | 7527 C | Warm white |

## CMYK Conversion

CMYK values for process (4-color) printing. These are approximations -- always do a print proof.

### Conversion from Common Hex Values

| Hex | CMYK (C, M, Y, K) |
|-----|-------------------|
| #4A6274 | C60 M30 Y15 K25 |
| #344654 | C65 M35 Y20 K40 |
| #C4943D | C5 M30 Y75 K10 |
| #D4B06A | C5 M20 Y60 K5 |
| #A57A2B | C10 M40 Y85 K20 |
| #1A1A1A | C0 M0 Y0 K95 |
| #FFFFFF | C0 M0 Y0 K0 |

### Rules for Print

1. **Rich black for large areas:** Don't use K100 alone for large black areas. Use C40 M30 Y30 K100 for a richer black.
2. **Total ink coverage:** Keep the sum of CMYK values under 300% for coated stock, 260% for uncoated.
3. **Minimum line weight:** 0.25pt for positive (dark on light), 0.5pt for reversed (light on dark).
4. **Bleed:** Add 0.125 inches (3mm) bleed on all sides for full-bleed print.
5. **Safe area:** Keep critical elements 0.25 inches from trim edge.

## When to Use Which Color System

| Context | Color System | Notes |
|---------|-------------|-------|
| Spot color printing (business cards, stationery) | Pantone | Most accurate brand color matching |
| Full-color (CMYK) printing (brochures, posters) | CMYK | Provide both Pantone and CMYK |
| Digital screens | Hex / RGB | Primary delivery format |
| CSS / web development | Hex or HSL | Hex for tokens, HSL for programmatic variants |
| Design tools (Figma, Sketch) | Hex | Native format |
| Large format / signage | Pantone + CMYK | Depends on vendor capability |

## DPI Requirements

| Use | Resolution |
|-----|-----------|
| Web / screen | 72-96 DPI (SVG is resolution-independent) |
| Office printing | 150 DPI minimum |
| Professional print | 300 DPI minimum |
| Large format (>24 inches) | 150 DPI at final size |
