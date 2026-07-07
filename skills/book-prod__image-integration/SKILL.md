---
name: image-integration
description: "Prepares NanoBanana Pro images for print and digital: 300+ DPI, sRGB or CMYK, background removal with rembg, smart crop, potrace vector line art, batch folders, mandatory JSON metadata sidecars. Trigger on images, illustrations, NanoBanana, artwork, background removal, upscaling, or DPI in book work."

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
