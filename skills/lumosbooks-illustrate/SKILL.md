---
name: lumosbooks-illustrate
description: Generates book illustrations locally via ComfyUI (FLUX, SDXL, or installed image models) using the LumosBooks imprint's brand prompt prefix and style notes from brand-tokens.json. Bridges Kevin's NanoBanana workflow with on-machine generation when he wants iteration speed, deterministic seeds, or no per-image API cost. Outputs land in <project>/assets/source/ in the same shape lumosbooks-images expects, so the rest of the pipeline (sidecar, 300 DPI normalize, CMYK convert) runs unchanged. Use whenever Kevin asks to generate, illustrate, draw, render, or AI-create an image, illustration, character, scene, page art, cover art, or coloring-page line art for a book — and external NanoBanana isn't required.
---

# LumosBooks illustrate

You generate book-page illustrations via ComfyUI using the imprint's brand voice.

## When to invoke
Triggers: "illustrate the alphabet pages", "generate cover art for the phonics workbook", "draw a watercolor lighthouse for the cover", "AI-create line art for these coloring pages", "render 26 letter mascots for LumosRead".

## Skip when
Kevin explicitly says "use NanoBanana" or "I'll drop the art myself" — in that case do nothing and let `lumosbooks-images` process whatever he drops.

## Procedure
1. Confirm ComfyUI is running:
   ```bash
   curl -s http://127.0.0.1:8188/queue | head -1 || echo "ComfyUI not running"
   ```
   If down, tell Kevin and stop. Don't try to start it.
2. Read the imprint tokens at `~/.claude/skills/book-prod/brand-system/assets/imprints/<imprint>.tokens.json` and pull `illustration.prompt_prefix`, `illustration.style_notes`, `illustration.do_not`, plus the primary/secondary hex colors.
3. Compose the final prompt: `<prompt_prefix> <user-supplied subject>, <style_notes>` + negative `<do_not>`.
4. Pick a workflow template under `~/.openclaw/workspace/ComfyClaw/workflows/` (or `~/Documents/ComfyUI/`). Defaults: `text2img-flux.json` for full art, `lineart.json` for coloring pages.
5. Submit via the ComfyClaw CLI (delegate to the `comfyclaw` skill if more guidance needed):
   ```bash
   comfyclaw run <workflow> --prompt "..." --negative "..." --seed <fixed> --out <project>/assets/source/<basename>.png
   ```
6. **Always set a fixed seed** so the same input + workflow produces the same image (book reproducibility).
7. After generation, hand off to `lumosbooks-images` to produce derivatives + sidecar.

## Brand-aware prompt example (LumosRead phonics)
- prefix: `"Children's book illustration, soft watercolor with clean ink line, diverse friendly characters, warm light, simple background, navy and gold accents,"`
- subject: `"a friendly red apple with a smiling face, A is for Apple"`
- negative: `"no photorealism, no text in the image, no Disney pastiche"`

## Resolution rules
- Cover full art: 2048×3072 minimum (300 DPI for 8×10 + bleed).
- Interior page art: 1500×1500 minimum (covers up to 5 in @ 300 DPI).
- Coloring-page line art: 2000×2600 grayscale, then run `lumosbooks-images` → `gen_coloring.py` to potrace.

## Memory & cost
Local generation is free per image but slow (~30 s per FLUX image on this GPU). For batch jobs (>20 images), warn Kevin about wall time and ask before kicking off.

## Reference
- ComfyUI install: `~/Documents/ComfyUI/`
- ComfyClaw workflows: `~/.openclaw/workspace/ComfyClaw/workflows/`
- Memory `feedback_sdxl_text.md`: never put text inside SDXL/FLUX renders — composite text programmatically in `lumosbooks-cover` / `lumosbooks-interior`.
