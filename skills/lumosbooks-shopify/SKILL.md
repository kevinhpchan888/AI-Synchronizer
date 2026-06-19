---
name: lumosbooks-shopify
description: Packages finished LumosBooks outputs for direct-to-customer sale on Shopify Digital Downloads. Produces an optionally watermarked digital PDF, product image set sized for Shopify (2048×2048 max recommended, JPG under 20 MB per image), product description copy in the LumosRead voice, suggested SKU and pricing, and zips everything within Shopify's 5 GB per-file limit. Use whenever Kevin asks to package, export, prepare for Shopify, bundle a digital download, or ship a book to the store.
---

# LumosBooks Shopify deliverable

You bundle the finished outputs into a Shopify-ready package.

## Procedure
1. Read `<project>/out/<slug>-digital.pdf` and the front-cover JPG.
2. Optional watermark via Bash:
   ```bash
   PY="$HOME/.Codex/skills/book-prod/_install/venv/Scripts/python.exe"
   "$PY" "$HOME/.Codex/skills/book-prod/shopify-deliverable/scripts/watermark.py" \
     --pdf "<project>/out/<slug>-digital.pdf" --text "Licensed to {{customer}}" \
     --opacity 0.08 --out "<project>/out/<slug>-digital-wm.pdf"
   ```
3. Optimize file size: `gswin64c -dCompatibilityLevel=1.7 -dPDFSETTINGS=/ebook -o <project>/out/<slug>-digital-opt.pdf <input>.pdf`
4. Build product images at 2048×2048 max: front-flat, 3D mockup, lifestyle (ImageMagick distort + shadow).
5. Generate product description from `brief.yaml` + LumosRead voice tokens (deterministic template, no LLM hallucination).
6. SKU pattern: `LR-<contenttype>-<trim>-<seq>` (e.g. `LR-WB-85x11-001`).
7. Pricing: digital tier = paperback list × 0.4, rounded to .49 or .99.
8. Zip everything to `<project>/out/shopify/<slug>-shopify.zip`. Warn if any single file exceeds 5 GB.

## Examples
- "Package the phonics workbook for Shopify."
- "Add a watermark and re-export."
