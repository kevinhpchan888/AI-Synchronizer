# Prompt Construction Formulas

Platform-adapted prompt formulas. Same creative intent, different output format per tool.

---

## Universal Formula

Every prompt answers these questions, in order:

1. **How are we looking at this?** (shot type, camera movement, lens)
2. **Who/what is on screen?** (subject, appearance, state)
3. **What are they doing?** (physical action, specific and precise)
4. **Where is this happening?** (environment, time, atmosphere)
5. **What does it feel like?** (lighting, color, mood, style)
6. **What do we hear?** (dialogue, SFX, ambient — if platform supports it)

---

## Image Prompts

**Formula:** `[Subject + Action] + [Location] + [Composition] + [Lighting] + [Style] + [Camera/Lens] + [Color grading]`

**Rules:**
- Lead with the subject — make the first sentence count
- Use positive framing — describe what IS there, not what isn't
- Specify lighting explicitly — it sets emotional tone
- Use camera and lens language to control depth and framing
- Define materiality and texture for objects, clothing, environments
- End with a style signature: film stock, art movement, render style

**Example:**
```
A weathered fisherman in his 60s, deep-set eyes, calloused hands, staring 
out at the sea from a rugged coastal cliff. Overcast sky, distant fog. 
Medium close-up, rule of thirds, subject left-framed. Flat diffused 
overcast light, no harsh shadows. Documentary photography, shot on Kodak 
Portra 400. Desaturated, lifted shadows, slightly cool grade.
```

---

## Single-Shot Video Prompts

### Seedance Format
See `seedance-rules.md` for full details. Key points:
- Timestamped `[0:00-0:04]` segments
- 2500-3000 characters
- No dialogue/speech direction
- Quality constraints at end
- Separate camera from subject movement

### Gemini Omni Format
Natural language, all in one block:
- State duration upfront: "Generate a 10-second vertical (9:16) video..."
- Describe scene and character naturally
- **Embed dialogue in quotes**: `She says: "text here"`
- Direct emotional arc in plain English: "For the first five seconds... In the middle... In the final seconds..."
- End with style notes and exclusions
- Reference image uploaded alongside (not embedded in prompt)

**Example:**
```
Generate a 10-second vertical (9:16) video of a woman in her early 40s 
with wavy brown hair, walking slowly along a park path at golden hour...

She speaks directly to the camera and says: "dialogue here"

Her delivery is warm and conversational — like a trusted friend sharing 
advice. For the first five seconds, her expression carries conviction...

Golden-hour sunlight, shallow depth of field, warm color grading. 
Cinematic UGC realism. No text or graphics on screen.
```

### Higgsfield Format
More concise, cinematic shorthand:
- Lead with shot type and camera
- Strong physical action description
- Leverage Higgsfield's physics simulation strength
- Can go up to 16 seconds — describe a fuller arc
- Less micro-expression detail needed (model interprets well from context)

**Example:**
```
Medium close-up, steadicam follow. A woman in a blue-grey blouse walks 
a sunlit park path, speaking to camera with warm conviction. Golden hour 
backlighting, shallow depth of field, lens flare as she passes through 
tree shade. She gestures naturally with one hand while holding a selfie 
stick in the other. The mood shifts from confident to reflective as she 
walks. Cinematic, warm color grade, 9:16 vertical.
```

### Artlist Studio Format
Structured fields — character is created separately, then you direct the scene:
- Character: Created in their character builder (appearance + personality)
- Background: Selected from options or described
- Camera frame: Selected (wide, medium, close-up)
- Scene action: Describe what happens — focus on action and emotion, not technical camera language

**Example (scene action field only):**
```
Sarah stands in a hospital corridor, filming herself with her phone at 
arm's length. She speaks with quiet urgency, her eyes slightly tired but 
warm. She looks like someone who just stepped out of her parent's room 
and needed to say this. Her voice is steady but weighted. She shakes her 
head gently when listing impossibilities, nods slowly when validating the 
viewer. Her free hand rests at her side, occasionally lifting in small 
contained gestures.
```

---

## Multi-Shot Sequences

For any platform. Four required sections:

### Section 1: Scene Header
```
SCENE: [Name]
TONE: [2-3 words]
DURATION TARGET: [total seconds]
PLATFORM: [target platform or "multi-platform"]

CHARACTERS:
- [Name]: [Physical description, clothing — 2 sentences max]

SETTING: [Location, time of day, weather, atmosphere]
AUDIO CONCEPT: [Music style, dialogue tone, key SFX]
```

### Section 2: Shot Sequence
```
[00:00–00:08] SHOT TYPE — Brief label
Camera: [movement + framing]
Action: [precise physical description]
Subject: [who, what state]
Context: [environment detail]
Audio: [dialogue / SFX / ambient]
```

Mark the HERO SHOT with ★. Vary shot types deliberately.

### Section 3: Audio Map
Timeline view of audio across the full sequence:
- Music cue start/stop points
- Dialogue lines with timestamps
- Key SFX moments
- Audio continuity notes

### Section 4: Director's Notes
- Generation order (which clips first and why)
- Reference images needed
- Iteration tips (what to retry if consistency breaks)
- Consistency flags (clothing, lighting, time of day must match)
- Platform-specific notes (if adapting for multiple tools)

---

## Adaptation Workflow

When the user says "same thing but for [other platform]":

1. Identify what changes between platforms (prompt format, length, audio support)
2. Keep the creative intent identical
3. Reformat to match the target platform's prompt DNA
4. Note any capabilities lost or gained (e.g., Seedance → Gemini gains speech, loses micro-expression control)
