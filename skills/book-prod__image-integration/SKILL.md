---
name: image-integration
description: Prepares Kevin's NanoBanana Pro AI-generated images (PNG/JPG) for both print and digital distribution. Resizes to 300+ DPI, assigns sRGB color profile (or converts to CMYK via Ghostscript for IngramSpark), removes backgrounds with rembg, smart-crops for cover use, vector-traces line art with potrace, batch-processes folders, and writes a mandatory JSON metadata sidecar (source prompt, dimensions, color space, intended use, license) for every processed image. Use whenever Kevin mentions images, illustrations, NanoBanana, photos, artwork, background removal, upscaling, or DPI.
---

# Image Integration

## Procedure
1. Read `assets/source/` and identify all image files.
2. For each, run `scripts/process.py` which:
   a. Probes dimensions via `magick identify`.
   b. Rejects anything below 300 DPI for print intent (warn).
   c. Assigns sRGB ICC profile.
   d. Optionally removes background (`rembg i input.png output.png`).
   e. Generates derivatives: `_print.png`, `_web.jpg` (1600 px max), `_thumb.jpg` (400 px).
   f. Writes `<basename>.sidecar.json` per `_shared/schemas/image-sidecar.schema.json`.
3. Line art: `scripts/vectorize.ps1 input.png output.svg` runs `mkbitmap` then `potrace`.
4. CMYK conversion (IngramSpark only):
   `gswin64c -dSAFER -dBATCH -dNOPAUSE -sDEVICE=pdfwrite -sColorConversionStrategy=CMYK -dProcessColorModel=/DeviceCMYK -o out.pdf in.pdf`
5. Heavy upscaling: not local. Suggest cloud upscale + re-import.

## Sidecar example
```json
{
  "source_file": "lighthouse_v3.png",
  "source_prompt": "watercolor lighthouse on rocky coast",
  "generator": "NanoBanana Pro",
  "generated_at": "2026-04-30T14:22:11+08:00",
  "dimensions_px": [3072, 4096],
  "dpi": 300,
  "color_space": "sRGB",
  "intended_use": ["cover_front"],
  "license": "Kevin Sng / LumosBooks"
}
```
