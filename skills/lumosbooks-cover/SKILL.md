---
name: lumosbooks-cover
description: Designs complete book covers (front, spine, back) for KDP paperback and ebook from a brief that supplies title, subtitle, author, blurb, page count, trim size, paper type, brand tokens, and optional NanoBanana-generated artwork. Computes KDP wraparound dimensions exactly using KDP's spine formula (page_count × 0.002252 in for white paper or × 0.0025 in for cream paper, plus 0.06 in cover thickness, plus 0.125 in bleed each side) and generates 3 distinct concepts per request (typographic-led, image-led, hybrid). Outputs KDP wraparound PDF (300 DPI, RGB, embedded fonts), ebook front-cover JPG (1600×2560 minimum, sRGB, under 50 MB), and Shopify product mockup set. Use whenever Kevin asks to design, create, generate, or refresh a book cover, jacket, wrap, or product image.
---

# LumosBooks cover design

You compute KDP cover geometry and render 3 concepts.

## Spine math (verbatim from KDP, 2026-05-03)
- White paper: `spine_in = (page_count × 0.002252) + 0.06`
- Cream paper: `spine_in = (page_count × 0.0025)   + 0.06`
- Hardcover (case-laminate): no `+0.06`; add 0.591 in wrap each side, 0.236 in top hinge.
- Total cover width  = bleed (0.125) + back trim_w + spine + front trim_w + bleed (0.125)
- Total cover height = trim_h + 0.25
- Spine text only when `page_count >= 79`; min spine text margin 0.0625 in.

Use the calculator at `~/.Codex/skills/book-prod/cover-design/scripts/spine.py`:
```bash
PY="$HOME/.Codex/skills/book-prod/_install/venv/Scripts/python.exe"
"$PY" "$HOME/.Codex/skills/book-prod/cover-design/scripts/spine.py" --pages 60 --paper white --trim-w 8.5 --trim-h 11
```

## Three concepts per request
1. **Typographic** — display type fills front, no image, gold rule on navy.
2. **Image-led** — Kevin's art at ~70% of front, title in top third, brand mark bottom-right.
3. **Hybrid** — full-bleed image, color-block panel for title.

## Procedure
1. Compute geometry → store as `<project>/build/cover-geometry.json`.
2. For each concept, render a Typst cover doc into `<project>/out/concepts/cover-<concept>.pdf`.
3. Extract front-only at 1600×2560 to ebook JPG via `magick "<wrap.pdf>[0]" -crop ... -density 300 ebook.jpg`.
4. Generate mockups (front-flat, 3D angled, lifestyle) via ImageMagick distort + shadow.
5. Save concepts to `<project>/out/concepts/` and present thumbnails.

## Examples
- "Design a cover for LumosRead phonics workbook, 8.5×11, 60 pages, white paper."
- "Make 3 cover concepts using the watercolor lighthouse art."
