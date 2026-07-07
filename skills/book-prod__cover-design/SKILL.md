---
name: cover-design
description: Designs full KDP covers (front, spine, back) from a brief; computes exact wraparound dimensions with KDP's spine formula and produces 3 concepts (typographic, image-led, hybrid). Outputs print-ready wraparound PDF, ebook cover JPG, and Shopify mockups. Trigger when Kevin asks to design or refresh a cover, jacket, wrap, or product image.

---

# Cover Design

## Spine math (verbatim from KDP)
- White paper: `spine_width = (page_count × 0.002252) + 0.06` inches
- Cream paper: `spine_width = (page_count × 0.0025) + 0.06` inches
- Hardcover (case-laminate): omit the +0.06; add 0.591 in wrap on each side and 0.236 in top hinge
- Total cover width = bleed (0.125) + back trim_w + spine + front trim_w + bleed (0.125)
- Total cover height = trim_h + 2 × bleed (0.125)
- Spine text only allowed when page_count ≥ 79; minimum spine text margin 0.0625 in

## Concept generation
1. **Typographic** — display type fills the front, no image, gold rule, navy ground.
2. **Image-led** — Kevin's NanoBanana art occupies 70% of front, title in top third, brand mark bottom-right.
3. **Hybrid** — full-bleed image, color-block panel for title.

## Procedure
1. Validate brief against `_shared/schemas/cover-brief.schema.json`.
2. Compute dimensions via `scripts/spine.py`.
3. For each concept, render `assets/templates/typst/cover-{concept}.typ`.
4. Export wraparound PDF: `typst compile cover.typ out/cover-wrap.pdf --input concept=hybrid`.
5. Generate ebook JPG: extract front-only at 1600×2560 with `magick`.
6. Generate mockups via ImageMagick distort and shadow filters.
7. Save concepts to `out/concepts/`.

## Examples
- "Design a cover for LumosRead phonics workbook, 8.5×11, 60 pages, white paper."
- "Make 3 cover concepts using the watercolor lighthouse art."
