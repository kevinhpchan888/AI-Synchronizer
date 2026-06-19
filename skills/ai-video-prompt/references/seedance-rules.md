# Seedance 2.0 Prompt Rules

Battle-tested rules from production use. Follow these exactly when writing Seedance prompts.

---

## Hard Constraints

1. **Character count**: 2500–3000 characters. Under 2500 = not enough detail. Over 3000 = gets ignored or truncated.
2. **Duration**: 4s or 8s clips only (Seedance native durations)
3. **Resolution**: 720p (720x1280 vertical for 9:16, 1280x720 for 16:9)
4. **Audio**: Seedance generates gibberish audio — it will be replaced by sync-3. Do NOT try to direct speech.
5. **Reference image**: Always use one for character consistency. Upload via MuaPi media system.

---

## Prompt Structure

Use this exact structure:

```
[0:00-0:04] First half description — subject actions, expressions, environment.
Camera: movement and framing for this segment.

[0:04-0:08] Second half description — action progression, expression shifts, environment changes.
Camera: same or evolving framing.

Style: [quality constraints and anti-artifact instructions]
```

### Timestamp rules:
- For 8s clips: `[0:00-0:04]` and `[0:04-0:08]`
- For 4s clips: `[0:00-0:02]` and `[0:02-0:04]`
- Each segment gets its own paragraph with full description

---

## Writing Rules

### DO:
- **Separate camera movement from subject movement**: "She walks forward slowly" is subject. "Camera tracks laterally at walking pace" is camera. Never combine them.
- **Use degree adverbs**: "slightly," "gently," "barely perceptible," "almost imperceptibly." These control intensity.
- **Describe micro-actions for faces**: "Her brow softens," "a slow deliberate blink," "the corners of her mouth lift just slightly," "her lips press together briefly."
- **Specify lighting with direction**: "Golden-hour sunlight from camera-left," not just "warm lighting."
- **Layer the environment**: Background elements, bokeh quality, wind effects, light patterns.
- **Put quality constraints at the END** of the prompt (Style section).

### DON'T:
- **Don't mention speech or dialogue** — Seedance can't generate intelligible speech
- **Don't use brand names** — "DJI microphone" → "small plain black wireless lapel microphone"
- **Don't request text** — Always include "no visible text or lettering on any object"
- **Don't over-choreograph body movement** — Seedance handles walking/gestures naturally. Over-specifying causes artifacts.
- **Don't describe fast or complex actions** — Seedance excels at slow, deliberate movement. Fast action = artifacts.

---

## Quality Constraints Block (always include at end)

```
Style: cinematic UGC realism, natural [lighting type] daylight, soft shallow depth 
of field, warm color grading. Stable camera movement, no distortion, no morphing, 
no visible text or lettering on any object, high detail. Keep facial features 
unchanged, no face drift, maintain identity consistency throughout. 
Vertical 9:16 framing. The mood is [mood description].
```

Adapt the lighting, color grading, and mood per scene. The anti-artifact instructions (no distortion, no morphing, no face drift, maintain identity consistency) should always be present.

---

## Character Description Template

When introducing the character in the first clip, use full description. For subsequent clips, use abbreviated version.

### Full (first appearance):
```
The woman with wavy brown hair and warm brown eyes in the blue-grey button-up 
blouse [action]. A small plain black wireless lapel microphone with a grey fuzzy 
windscreen clipped near her collar, no visible branding or text on the device. 
Her [selfie stick / posture / position] [details].
```

### Abbreviated (subsequent clips):
```
The woman in the blue-grey blouse continues [action]. The lapel microphone 
visible at her collar. [New details for this clip].
```

---

## Pipeline Context

Seedance clips are always post-processed:

1. **Generate silent video** via MuaPi (Seedance 2.0)
2. **Generate TTS audio** via ElevenLabs (matching duration)
3. **Lip sync** via fal.ai sync-3 (replaces Seedance gibberish + mouth animation)
4. **Concat** via ffmpeg with crossfade transitions

### Audio splitting rules:
- Each audio chunk must be ≤ video clip duration (8s max)
- Split at silence points (use ffmpeg silencedetect)
- sync-3 caps output at video length — if audio > video, audio gets truncated

### sync-3 API notes:
- Submit to: `https://queue.fal.run/fal-ai/sync-lipsync/v3`
- Poll status at: `https://queue.fal.run/fal-ai/sync-lipsync/requests/{id}/status` (NO /v3)
- Get result at: `https://queue.fal.run/fal-ai/sync-lipsync/requests/{id}` (NO /v3)

---

## Example: UGC Park Scene (8s clip)

```
[0:00-0:04] The woman with wavy brown hair and warm brown eyes in the blue-grey 
button-up blouse walks slowly along the paved park path, her body swaying gently 
with each unhurried step. A small plain black wireless lapel microphone with a 
grey fuzzy windscreen clipped near her collar, no visible branding or text on the 
device. Her left hand holds a selfie stick steady at arm's length. Her expression 
carries quiet conviction — eyebrows slightly raised, the look of someone stating 
a truth everyone knows. She makes direct eye contact with the lens. A subtle nod. 
The golden-hour sunlight wraps her face from camera-left, casting warm amber tones 
across her skin. The park background shows tall trees with lush green foliage in 
soft bokeh, dappled light filtering through the canopy. Camera: fixed selfie-stick 
angle, front-facing, natural walking sway, no independent camera movement.

[0:04-0:08] She continues her slow walk. Her expression shifts to something more 
reflective — her brow softens, her eyes become slightly distant for a moment. She 
blinks slowly, deliberately. Her lips press together briefly between thoughts. 
Then her gaze returns to the lens with renewed warmth. The corners of her mouth 
lift into a gentle, genuine micro-smile that reaches her eyes. The breeze picks 
up slightly, moving strands of hair across her forehead. The fabric of her blouse 
moves softly with her stride. The golden light shifts as she passes through 
alternating patches of shade and sun. Camera: same fixed selfie-stick angle, 
gentle walking motion, stable framing throughout, no zoom, no cuts.

Style: cinematic UGC realism, natural golden-hour daylight, soft shallow depth of 
field, warm color grading. Stable camera movement, no distortion, no morphing, no 
visible text or lettering on any object, high detail. Keep facial features 
unchanged, no face drift, maintain identity consistency throughout. Vertical 9:16 
framing. The mood is warm conviction giving way to quiet reflection.
```
