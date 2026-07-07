---
name: shopify-deliverable
description: "Packages finished books for Shopify Digital Downloads: optional watermarked PDF, product images sized for Shopify, LumosRead product copy, SKU and pricing suggestions, zipped under the 5 GB limit. Trigger on package, export, prepare for Shopify, or bundle a digital download."

---

# Shopify Deliverable

## Procedure
1. Read `out/<slug>-digital.pdf` and the cover JPG.
2. Optional watermark via `scripts/watermark.py`.
3. Optimize: `gswin64c -dCompatibilityLevel=1.7 -dPDFSETTINGS=/ebook -o digital-optimized.pdf in.pdf`.
4. Build product images: front-flat, 3D mockup, lifestyle. Resize to 2048×2048 max.
5. Generate product description from brief metadata + voice tokens (deterministic template, no LLM).
6. SKU: `LR-<contenttype>-<trim>-<seq>` (e.g. `LR-WB-85x11-001`).
7. Pricing: digital = paperback list × 0.4, rounded to .49 or .99.
8. Zip to `out/shopify/<slug>-shopify.zip`. Warn if any asset > 5 GB.

## Examples
- "Package the phonics workbook for Shopify."
- "Add a watermark and re-export."
