---
name: shopify-deliverable
description: Packages the finished book outputs for direct-to-customer sale on Shopify Digital Downloads. Produces a watermarked digital PDF (optional), product image set sized for Shopify (2048×2048 max recommended, JPG under 20 MB per image), product description copy in the LumosRead voice, suggested SKU and pricing, and zips everything within Shopify's 5 GB per-file limit. Use whenever Kevin asks to package, export, prepare for Shopify, or bundle a digital download.
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
