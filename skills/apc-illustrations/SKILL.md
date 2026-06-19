# /apc-illustrations

Generate APC editorial illustrations in the Tomi Um style. Trigger: any request for APC illustration prompts, article illustrations, or Starter Kit/Guide/Workbook art.

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
