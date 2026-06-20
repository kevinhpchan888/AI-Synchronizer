# /apc-illustrations

Generate APC editorial illustrations in the Tomi Um style. Trigger: any request for APC illustration prompts, article illustrations, or Starter Kit/Guide/Workbook art.

## SIGNATURE — NON-NEGOTIABLE (every illustration, no exceptions)

**Every APC illustration must carry the calligraphic APC signature at the bottom-right before it is used anywhere (CDN upload, article body, page, social).** This is NOT part of the generation prompt — the prompt says "no watermark/logo" on purpose so the model doesn't fake one. The real signature is composited in post by the ONE canonical tool:

- Tool: `skills/apc-article-ops/scripts/sign_illustrations.py` (the only sanctioned signer).
- Spec: signature = **10% of image width**, padding **1.5%** of width, gravity **SouthEast** (bottom-right), output JPEG q82. Asset: `…/brand/APC Signature Transparent.png`.
- Sign: `python sign_illustrations.py --in <raw_folder> --sig <signature.png> --out <signed_folder>`
- **Gate (mandatory before any CDN upload):** `python sign_illustrations.py --check <signed_folder>` must exit 0. Signed files carry an embedded `APC-SIG-v1` marker; the upload step MUST refuse anything the gate flags. No image reaches the CDN unsigned.

## Style System

**Reference artist**: Tomi Um (warm editorial illustration)
**Generator**: NanoBanana Pro
**Quality**: 4x
**Valid aspect ratios**: 16:9, 4:3, 1:1, 3:4, 9:16 (ONLY these five, no others exist in NanoBanana Pro)

### Prompt Schema (every illustration)

```
Warm editorial illustration in the style of Tomi Um. [SCENE]. Hand-drawn warm sienna and sepia ink linework, painterly watercolor washes on warm cream paper. Soft honey, warm amber, and sage green palette with cream highlights, gentle natural tones. No visible text, no lettering, no legible words anywhere in the image.
```

### Negative Prompt (always include)

```
no text, no watermark, no logos, no lettering, no writing, no words, no readable text, no photographic realism, no flat vector clip-art, no 3D render, no plastic skin, no oversaturated colors, no distinct facial features
```

Drop "no distinct facial features" from the negative prompt ONLY when the user explicitly requests visible expressions (smiles, emotions on faces).

## Figure Direction Rules

All human figures must have NO DISTINCT FACIAL FEATURES by default. Achieve this through:
- Seen from behind
- High-angle/overhead (no faces visible)
- Silhouetted
- Hands-only compositions
- Three-quarter turned away

Exception: when the user requests visible expressions, allow partial face visibility and remove "no distinct facial features" from the negative prompt.

## Text Prevention

No readable text surfaces anywhere. Use:
- Closed folders, sealed envelopes
- Face-down papers, blank pages
- Screen-off phones, face-down phones
- Blurred/out-of-focus signage
- Calendars with nothing written on them

## Scene Composition

Illustrations capture pause-moments, not action sequences. The emotional center is stillness, weight, quiet resolve. Look for:
- The moment before or after, not during
- Environmental storytelling (objects tell the story)
- Light as mood (late afternoon, early morning, lamplight, window light)
- Physical distance or closeness between figures as emotional signal

## Color Palette

- Warm sienna and sepia ink linework
- Painterly watercolor washes
- Cream paper background
- Soft honey, warm amber, sage green
- Cream highlights, gentle natural tones
- NEVER: oversaturated colors, neon, cool blue tones, high contrast

## Article Illustrations

Two per article, always a complementary pair:
1. **Starting illustration**: Emotional opening, the weight of the situation
2. **Midpoint illustration**: Shift toward agency, resolve, forward motion

Never duplicate the same composition or angle across the pair.

## Batch Variety (MANDATORY on any multi-article batch — stops the "desk + pills" sameness)
Across a batch, illustrations must show the full range of caregiving life, not the same scene retitled. Hold the visual language constant (warm Tomi Um, sienna/sepia ink, honey/amber/sage on cream, text-free, faces never centered) but deliberately SPREAD:
- **Setting** — rotate widely: kitchen, living room, garden/backyard, park, walking path, café, car, front porch, clinic/consult room, community center, market, pool, workshop/hobby, place of worship, bedroom, doorway/threshold, hallway. No single setting more than ~twice per 10 images.
- **Activity** — not just paperwork/pills/hunched-at-a-desk: walking, exercising (tai chi, stretching, balance), gardening, cooking, sharing a meal, music, cards, a video call, a hug, a hand on a shoulder, a hobby, a tour.
- **Subject & energy** — vary who's centered (the parent, active and vital; the caregiver; both; a community; multi-generational with grandchildren) and the emotional register. **At least a third of any batch must show vitality, connection, dignity, or joy — not only burden.** Starting images may carry the weight; midpoints should lean into agency and life.
- **Distance, time, light** — mix close hands, mid, wide environmental, overhead, over-the-shoulder, silhouette, through-a-window; mix dawn / golden afternoon / dusk / lamplight.

Before finalizing a batch, scan the set: if two scenes share setting+activity+subject, change one. Range of life, one consistent look.

## Delivery Format (MANDATORY)

When generating illustration prompts, ALWAYS deliver in this exact format with isolated code blocks. Never mix descriptions or commentary inside the code blocks. The user needs clean copy buttons.

### Format:

1. Brief description of the scene (1-2 sentences, plain text, NOT in a code block)

2. **Filename** (its own code block, alone):
```
descriptive_filename.png
```

3. **Prompt + Negative prompt** (ONE code block, prompt first, then a blank line, then negative prompt):
```
Warm editorial illustration in the style of Tomi Um. [Full scene description]. Hand-drawn warm sienna and sepia ink linework, painterly watercolor washes on warm cream paper. Soft honey, warm amber, and sage green palette with cream highlights, gentle natural tones. No visible text, no lettering, no legible words anywhere in the image.

Negative prompt: no text, no watermark, no logos, no lettering, no writing, no words, no readable text, no photographic realism, no flat vector clip-art, no 3D render, no plastic skin, no oversaturated colors, no distinct facial features
```

4. **Settings** (plain text): NanoBanana Pro, [aspect ratio], 4x quality

### Rules
- Prompt and negative prompt are ALWAYS in the SAME code block. Never separate them.
- Filename is ALWAYS its own separate code block.
- NEVER embed commentary or explanations inside a code block.
- NEVER combine filename with prompt.

## Reference Files

- Style guide source: `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\Website and Store\Images\moment_illustration_prompts.txt`
- Content rules: `C:\Users\Kevin Chan\.claude\skills\selldone\references\apc-content-rules.md`
- Brand style guide: `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\brand\brand-style-guide.md`
