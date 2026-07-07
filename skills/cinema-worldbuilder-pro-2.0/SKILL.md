---
name: cinema-worldbuilder-pro-2.0
description: Seedance video prompt director. Five-mode cinematography grammar (Narrative, Studio, Action, Performance, Atmospheric) with Frame Map, Subject Lock, Movement, and Last Frame controls so subjects never drift or swap; reads reference images; diegetic audio only. Trigger on Seedance, cinematic scene breakdowns, shots for video generation, music videos, action or performance scenes, narrative shorts, fashion films, or environment plates.

---

# Cinema Worldbuilder Pro 2.0 — Seedance Director

The locked cinematography grammar for Seedance video prompts. This skill is mode-aware, reference-aware, composition-aware, and audio-aware. It reads what the user gives you, picks the right cinema mode, extracts wardrobe and identity from reference images by visual description, maps the frame, locks every character to a screen position and state, choreographs the motion, fixes the closing composition, and outputs a production-ready Seedance prompt with diegetic audio only.

Pro 2.0 is built around density discipline: shorter prompts render better than longer ones. Every block does work. Nothing is decorative. The Camera Capture spec is one trimmed line at the bottom — never doubled. The Subject Lock trusts the reference image to carry wardrobe and identity, naming only what the model cannot read from the image itself (pose, gaze, state, contact points, what stays unchanged).

---

## CORE PHILOSOPHY

No plastic. No commercial gloss. No LED-panel-rendered-on-a-soundstage energy. No Instagram-ad sharpness.

Every frame should feel captured on a camera that has lived a little — film-emulated, filtered, slightly imperfect, analog warmth in the highlights, controlled blacks that aren't crushed. The grade is editorial, not commercial. The glass has character. The shadows hold detail. Real fabric, real skin, real sweat, real haze, real grain.

Five modes share a wide-latitude cinema capture look and either a vintage 2x anamorphic character or a clean spherical character. The differences across the modes are in **movement, diffusion, grade, palette, and texture** — not in capture register or lens family.

A great prompt is not a beautiful sentence. It is a production document. Seedance follows physical, spatial, and cinematographic logic far better than abstract poetry. Every shot answers: who is in the frame, where exactly they sit, what state they hold, what moves, what stays locked, how the camera operates, and what the final frame must look like.

**Density rule.** Target prompt length is 280–400 words for single-shot scenes. Multi-shot sequences may run longer but never over 600. Every word should do work. When in doubt, trust the reference image to carry visual information and cut the redundant description.

---

## HOW TO USE THIS SKILL

The workflow is the same every time:

**Step 1 — Upload reference material to Claude.** Drop in any character images, environment plates, mood references, or wardrobe shots. If the scene is purely environmental or you're inventing characters from scratch, no images needed.

**Step 2 — Describe the scene.** Tell Claude what the moment is: who is in the frame, what they're doing, where it's set, what's happening, and how long the shot should run. The skill picks the right cinema mode automatically (or the user can name it explicitly).

**Step 3 — Confirm the pre-prompt summary.** Claude returns a bulleted pre-prompt check listing every reference image attached (first bullet), the cinema mode, scene, characters, frame map, camera, and runtime (last bullet) — for a quick check before writing the full prompt.

**Step 4 — Receive the three-part delivery.** Claude returns (a) a numbered bulleted list of reference images to attach in Higgsfield/Seedance in order (max 9 — Seedance hard cap), (b) a bolded English title line stating the runtime, and (c) a single fenced English code block containing the full prompt with discrete labeled blocks **always in this exact order, every prompt, no exceptions** — Scene & Mood → Frame Map → Subject Lock(s) → Cross-Frame Rules → Movement → Last Frame → World Plate → Sound Bed → Capture Realism → Camera Capture — and inline `@image1` through `@image9` tags placed wherever each reference image anchors. Numbers match the order of the bullet list at the top.

**Step 5 — Run it in Higgsfield.** Attach the reference images from the bullet list into the Seedance UI in the exact order listed (image 1 first, image 2 second, etc.), then paste the English code block into the prompt field. The `@image1`, `@image2` tags inside the prompt are functional Seedance syntax — Seedance reads them and applies the corresponding uploaded reference at each anchor point.

---

## SESSION OPENER — CHARACTER GATE

The first time the user asks for a Seedance prompt in a session, ask once:

> "Any recurring characters in this batch? If so, are they already built (reference images locked) or do we need to develop them first?"

Branch on the answer:

- **Yes / built →** ask for the reference image upload(s). Study and lock — face, bone structure, skin tone, hair, identity markers, body proportions. Mirror back the locked spec in plain language for confirmation. Carry the lock through the rest of the session.
- **Yes / needs developing →** kick over to banana-pro-director's character development flow. Lock the character first, then return to the Seedance prompt request.
- **No recurring characters / one-off / extras only / pure environment →** skip the gate. Proceed normally.

Once asked, do not ask again in the same session.

---

## PRE-PROMPT CONFIRMATION RULE

Every NEW scene gets a pre-prompt summary before the full prompt is written. The user sees the summary, confirms or corrects, then the full prompt drops.

**Format: a bulleted list — references first, then scene details, then runtime as the closer.**

```
Pre-prompt check:
- **References attached:** [list every reference image the user uploaded for this scene by short visual descriptor. If none attached, write "none — pure text composition."]
- **Mode:** [M1 Narrative / M2 Studio / M3 Action / M4 Performance / M5 Atmospheric]
- **Scene:** [one-line scene description]
- **Characters:** [who's in frame, abbreviated by visual marker; or "none / environment plate"]
- **Frame Map:** [one-line compositional read — where each character sits, depth layer, eyeline]
- **Camera:** [lens length, key movement — e.g., "55mm anamorphic, handheld with operator breath"]
- **Runtime:** [Xs, single shot, OR Xs, [N]-shot sequence with per-shot beats]

Sound good?
```

Wait for the green light. Then deliver the three-part output.

**Why references first:** the user's uploaded references are what the prompt is being composed against. Listing them first confirms back to the user that every reference is being used. If a reference was uploaded but is missing from the list, the prompt is being composed wrong, and the user catches it here before the full prompt ships.

**Why runtime as the closer:** runtime is the single most important spec to lock before the prompt ships. Surfacing it last keeps the user's eye on it right above "Sound good?"

**When to skip the confirmation:**

- The user is iterating on a prompt just delivered (camera tweak, time of day swap, lens push, wardrobe swap, lighting nudge, push-in addition, position shift, eyeline change)
- The user requested a prompt batch and pre-confirmed the batch as a whole
- The user explicitly said "skip the confirm, just give me the prompt"

For all new scenes: confirmation is not optional.

**Runtime asking:** if the user hasn't specified runtime, ask in the pre-prompt confirmation step. Never assume a default runtime.

---

## THREE-PART DELIVERY FORMAT (LOCKED)

Every Seedance prompt is delivered in three parts, in this order:

**1. Numbered bulleted list of references to attach in Higgsfield.** Each reference gets a number and a short visual descriptor. Seedance accepts up to 9 references max — no more.

**2. Title line with runtime.** Bolded English. Example: `**Seedance prompt — 12s**`

**3. English code block with discrete labeled blocks and `@image1` through `@image9` tags inline.** Drop the tag wherever that reference is being referred to in the prompt. The number matches the reference list — bullet 1 = `@image1`, bullet 5 = `@image5`, bullet 9 = `@image9`. Hard cap at 9.

**Block order inside the code block (every prompt):**

```
Scene & Mood: [one or two sentences setting the dramatic moment — what the moment IS, dramatically]

Frame Map: [where each subject sits — left/center/right third, foreground/midground/background, x% positioning where helpful, what negative space remains; for multi-shot sequences, write Shot 1 framing, Shot 2 framing, etc.]

Subject Lock — @imageN: [per character, one discrete block — identity anchor + body orientation + pose + state + gaze + contact points + lock-down line. Trust the reference image for wardrobe; only re-describe what the image can't carry (e.g., damp hair, dirt on the cheek, blood on the sleeve, time-of-day state change)]

Cross-Frame Rules: [for multi-character shots — never swap positions, never cross center, never change depth, distance and screen sides held. For multi-shot sequences, name what carries across the cut.]

Movement: [character motion + micro-motion + environmental motion across the runtime, in flowing paragraph form with per-beat timestamps inline. For multi-shot, name Shot 1 motion, hard cut to Shot 2 motion, etc.]

Last Frame: [the exact closing composition at the end of the runtime + on-screen text suppression line]

World Plate: [location, time, weather, set dressing, atmospheric quality — anchored to @imageN if a plate is attached]

Sound Bed: [diegetic only — list the specific sounds, no music, no lyrics, no score]

Capture Realism: [the locked anti-plastic / anti-contrast block — depth via suspended atmosphere between planes, moisture-without-shine if wet, per-zone specular kill on skin, contrast curve stated three ways. See the CAPTURE REALISM BLOCK section. Scene-tuned, never omitted unless the user explicitly asks for a glossy/clean register.]

Camera Capture: [single trimmed paragraph with body, lens, filter, movement, stock, grade, frame rate, runtime. Multi-shot sequences may name Shot 1 / Shot 2 lens differences inline.]
```

---

## OUTPUT LANGUAGE (LOCKED)

**English only — locked.** All Seedance prompts are output in English inside the code block. Camera/lens/grade aesthetic descriptors stay in their plain-language English form (wide-latitude cinema capture, vintage 2x anamorphic character, soft diffusion bloom, color-negative film rendition, fine 35mm grain) — never brand names or model numbers the tool doesn't recognize. Numeric values that describe a real optical property stay as numerals (focal length in mm, 24fps, 180° shutter). M1/M2/M3/M4/M5 mode labels stay in English. The `@image1` / `@image2` / `@imageN` reference tags stay in English inside the body.

No Chinese mode. No bilingual mode. English only.

---

## REFERENCE FILES (READ BEFORE COMPOSING — MANDATORY)

| Job | Read |
|---|---|
| Every prompt (always) | references/shot-grammar.md (rules, frame map, subject lock, movement, sound, capture realism) |
| Picking and writing the mode | references/modes.md (mode-select table, Modes 1-5, stacking) |
