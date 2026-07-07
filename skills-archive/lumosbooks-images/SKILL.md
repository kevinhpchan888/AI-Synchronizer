---
name: lumosbooks-images
description: Prepares Kevin's NanoBanana Pro AI-generated images (PNG/JPG) for LumosBooks print and digital distribution. Resizes to 300+ DPI, assigns sRGB color profile (or converts to CMYK via Ghostscript for IngramSpark), removes backgrounds with rembg, smart-crops for cover use, vector-traces line art with potrace, batch-processes folders, and writes a mandatory JSON metadata sidecar (source prompt, dimensions, color space, intended use, license) for every processed image. Use whenever Kevin mentions book images, illustrations, NanoBanana, photos, artwork, background removal, upscaling, DPI, sidecar, or batch image processing for a book.
---

# LumosBooks image integration

You normalize Kevin's source art for print and digital.

## Procedure
1. Identify all PNG/JPG/JPEG in `<project>/assets/source/`.
2. Run the batch processor via Bash:
   ```bash
   PY="$HOME/.claude/skills/book-prod/_install/venv/Scripts/python.exe"
   "$PY" "$HOME/.claude/skills/book-prod/image-integration/scripts/process.py" \
     --src "<project>/assets/source" --out "<project>/assets/processed" --intent interior
   ```
   This generates `_print.png` (300 DPI), `_web.jpg` (1600 px), `_thumb.jpg` (400 px), and a `<basename>.sidecar.json` per image.
3. For background removal: `rembg i <in.png> <out.png>` (uses venv).
4. For line-art vector trace: `magick <in.png> <tmp.pbm>` then `potrace <tmp.pbm> -s -o <out.svg>`.
5. For CMYK (IngramSpark only):
   ```
   gswin64c -dSAFER -dBATCH -dNOPAUSE -sDEVICE=pdfwrite \
     -sColorConversionStrategy=CMYK -dProcessColorModel=/DeviceCMYK \
     -o cmyk.pdf in.pdf
   ```
6. Warn (do not fail) if any source image is below 300 DPI for print intent.

## Sidecar schema
`~/.claude/skills/book-prod/_shared/schemas/image-sidecar.schema.json`. Fields: source_file, source_prompt, generator, generated_at, dimensions_px, dpi, color_space, intended_use, license.

## Examples
- "Process the cover art at ~/Downloads/lumos-phonics-cover.png for KDP."
- "Remove the background from this illustration."
- "Convert this PDF to CMYK for IngramSpark."
