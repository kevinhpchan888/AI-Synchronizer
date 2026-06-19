# UGC (User-Generated Content) Video Patterns

Specialized patterns for direct-to-camera talking-head content. Used for campaign reels, social media ads, and authentic-feeling content.

---

## The UGC Formula

UGC video looks like a real person filmed themselves on their phone. The prompt must create this illusion:

```
[POV Setup] + [Character + Wardrobe] + [Mic/Tech Details] + [Dialogue + Delivery] + 
[Emotional Arc] + [Environment] + [Anti-AI Guardrails]
```

---

## POV Setup

The camera is held by the subject (selfie-stick or phone at arm's length):

```
She holds a selfie stick at arm's length in her left hand, filming herself 
as she walks. The camera angle is fixed and front-facing, with natural 
walking sway — no independent camera movement, no zoom, no cuts.
```

Key details:
- Specify which hand holds the stick/phone
- "Fixed and front-facing" — the camera doesn't move independently
- "Natural walking sway" — the camera moves WITH the subject's body
- "No independent camera movement" — reinforces POV authenticity

---

## Lapel Microphone (Standard Description)

Use this exact description. Never mention brand names:

```
A small plain black wireless lapel microphone with a grey fuzzy windscreen 
clipped near her collar, no visible branding or text on the device.
```

This description is battle-tested across Seedance, Gemini, and Artlist. It produces consistent results without generating branded text artifacts.

---

## Dialogue + Delivery Direction

### For platforms WITH native speech (Gemini Omni, Veo 3.1):
Embed dialogue directly in quotes:
```
She speaks directly to the camera and says: "Nobody teaches you how to 
take care of your aging parents. There's no class for it — no manual."

Her delivery is warm, gentle, and conversational — like a trusted friend 
sharing important advice over coffee. Her pace of speech is calm and unhurried.
```

### For platforms WITHOUT speech (Seedance, Higgsfield):
Describe the FEELING of speaking without specifying words:
```
Her expression carries the energy of someone sharing something personal 
and important. Her lips move naturally, her jaw relaxed. She makes direct 
eye contact with the lens, occasionally looking away briefly in thought 
before returning her gaze.
```

---

## Emotional Arc Direction

Break the clip into time segments with distinct emotional states:

```
For the first five seconds, her expression carries quiet conviction — 
eyebrows slightly raised, the look of someone stating a truth everyone 
knows but nobody talks about. She gives a subtle nod.

In the middle section, her tone shifts to something more reflective. Her 
brow softens, her eyes become slightly distant — as if remembering her 
own experience. She blinks slowly. Her lips press together between thoughts.

In the final seconds, her expression becomes more urgent and empathetic. 
Her eyes widen slightly. Her right hand lifts in a small open-palm gesture.
```

### Micro-expression vocabulary:
- "Brow softens" — concern, empathy
- "Slow deliberate blink" — processing, emotional weight
- "Lips press together briefly" — holding back emotion, transitioning
- "Corners of mouth lift just slightly" — genuine warmth (not a full smile)
- "Eyes become slightly distant" — remembering, reflecting
- "Barely perceptible head shake" — disbelief, exhaustion
- "Subtle nod" — validation, agreement, "I understand"
- "Eyes widen slightly" — emphasis, urgency
- "Head tilts to the left" — vulnerability, openness

---

## Anti-AI Guardrails

Include these phrases to push output toward authenticity:

```
She is NOT performing or presenting. This feels like a real person talking 
to one specific person, not an audience.
```

```
The mood is intimate and real — a real human being speaking to another 
real human being about something that matters.
```

```
The video should feel authentic and emotionally honest — a real moment 
captured on a walk, not a produced advertisement.
```

Adapt the specific wording per context, but always include at least one anti-performance directive.

---

## Environment Patterns for UGC

### Park / Outdoor walk (default for warmth + authenticity)
```
A gently curving paved path lined with tall mature trees with lush green 
foliage, rendered in soft shallow-depth-of-field bokeh. Golden-hour 
sunlight from camera-left. Dappled light filtering through the canopy. 
A gentle breeze moves the foliage and occasionally lifts strands of her hair.
```

### Hospital corridor (urgency + emotional weight)
```
A hospital corridor stretching behind her, slightly out of focus. 
Fluorescent lighting, neutral walls. Maybe a nurse or another person 
passing far in the background. The environment adds urgency — she looks 
like someone who just stepped out of a difficult room.
```

### Home / living room (intimacy + relatability)
```
A warm, lived-in living room behind her, slightly out of focus. Soft 
lamplight, a couch with throw pillows, bookshelves. Evening. The environment 
feels personal and safe — this is someone sharing from their own space.
```

### Car (raw, spontaneous confession)
```
Sitting in the driver's seat of a parked car. Phone propped on the 
dashboard or held up. Natural daylight through the windshield. The 
confined space creates intimacy. She looks like someone who just sat 
down after a hard day and needed to process.
```

---

## Character Templates

### Sarah (Aging Parent Caregiving Campaign)
**Full description:**
```
Woman in her early 40s. Wavy brown hair that falls just past her shoulders. 
Warm brown eyes. Fair to medium skin tone, natural look. Blue-grey button-up 
blouse with the top button undone. Small plain black wireless lapel microphone 
with grey fuzzy windscreen clipped near her collar.
```

**Personality/delivery:**
```
Warm, empathetic, grounded. Speaks like a trusted friend — calm, unhurried, 
genuine. Has the energy of someone who has been through caregiving and come 
out with wisdom. Not preachy, not performative, not salesy. Gentle humor, 
emotional intelligence, occasional vulnerability.
```

**MuaPi media ID:** `a32bab6c-023e-469f-bf66-1b5596745f34`
**ElevenLabs voice:** Cassidy (ID: `56AoDkrOh6qfVPDXZ7Pt`)

### Adding new characters:
Copy the template above. Include:
- Physical appearance (2-3 sentences)
- Wardrobe (specific, no brands)
- Personality/delivery style (2-3 sentences)
- Reference image ID (if available)
- Voice assignment (if applicable)
