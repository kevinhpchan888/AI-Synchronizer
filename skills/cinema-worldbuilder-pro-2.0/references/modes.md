## MODE-SELECT TABLE

| Mode | Use when scene is... | Capture | Lens | Movement | Diffusion | Grade |
|---|---|---|---|---|---|---|
| **M1 — Narrative** | Real-world dramatic — streets, kitchens, cars, bars, interiors, exterior locations. Anywhere lived-in. | Wide-latitude cinema capture | Vintage 2x anamorphic character, 40/55/75/100mm, wide aperture — oval bokeh, soft frame-edge falloff | Handheld with operator breath | Light diffusion bloom softening highlights | Color-negative daylight film rendition, fine 35mm grain, teal-amber |
| **M2 — Studio / Editorial** | White void, clean studio, hyperpop saturated set, fashion film, editorial portrait, performance-on-set | Wide-latitude cinema capture | Clean spherical character, 32/50/75/100mm, wide aperture — natural round bokeh, even sharpness | Locked tripod with optional slow push | Mild diffusion bloom; intentional highlight bloom on chrome/rhinestone | Saturated editorial, warm-retained blacks, fine grain |
| **M3 — Action / Combat** | Combat, chase, stunts, war, mech battles, alien encounters, debris, smoke, dust | Wide-latitude cinema capture | Vintage 2x anamorphic character, 40/55/75/100mm, wide aperture — oval bokeh, soft edge falloff | Handheld and shaky throughout, no stabilized shots | Light diffusion bloom softening highlights | Color-negative film rendition, heavier low-light grain, palette per scene, dusty haze |
| **M4 — Performance / Concert** | Stadium, arena, stage, jumbotron, lightstick crowd, festival pit | Wide-latitude cinema capture | Vintage 2x anamorphic character, 40/55/75/100mm, wide aperture — oval bokeh, horizontal streak flares on stage lights | Mixed handheld pit-photographer and orbital, hard cuts | Light diffusion bloom softening highlights | Color-negative film rendition, fine grain, desaturated cool with warm bloom, stage color cast |
| **M5 — Atmospheric / Empty** | Abandoned environments, no-humans plates, landscapes, weather pieces, mood/world establishing shots | Wide-latitude cinema capture | Vintage 2x anamorphic character, 35→85mm push range, wide aperture — oval bokeh, soft edge falloff | Locked-off or extremely slow push-in / pull-back | Light diffusion bloom softening highlights | Color-negative film rendition, fine grain, palette-driven (specify hex per scene) |

---

## MODE 1 — NARRATIVE (Real-World, Lived-In)

**When to use:** Real-world dramatic scenes. Streets, apartments, kitchens, cars, bars, diners, locker rooms, exterior locations, anywhere someone could plausibly walk into and shoot.

**Camera Capture line (drop in at end of any M1 prompt):**

```
Camera Capture: wide-latitude cinema capture, vintage [XX]mm 2x anamorphic character at a wide aperture — oval bokeh, soft frame-edge falloff — light diffusion bloom softening highlights, handheld with natural operator breath, color-negative daylight film rendition with fine 35mm grain, teal-amber grade, shallow depth of field, 24fps 180° shutter, [XX] seconds.
```

Replace `[XX]` with lens length (40mm wide, 55mm medium, 75mm tight, 100mm close-up) and the runtime.

**Multi-shot variant:**

```
Camera Capture: Shot 1 — wide-latitude cinema capture, vintage 40mm 2x anamorphic character at a wide aperture, light diffusion bloom softening highlights, handheld with natural operator breath. Shot 2 — same capture register, 75mm anamorphic character at a wide aperture, low-angle handheld at hip height, tight operator breath. Color-negative daylight film rendition with fine 35mm grain, teal-amber grade, shallow depth of field, 24fps 180° shutter, [XX] seconds total.
```

---

## MODE 2 — STUDIO / EDITORIAL (Crafted, Not Photographed)

**When to use:** White void, clean studio sets, editorial portraits, hyperpop saturated worlds, fashion film, performance-on-set, any scene that is *crafted* rather than *photographed.*

**Lens guide:**
- 32mm — full-body wide on the void / group framing
- 50mm — medium portrait
- 75mm — tight editorial face cuts
- 100mm — extreme close-ups (lips, eyes, jewelry, fabric)

**Camera Capture line:**

```
Camera Capture: wide-latitude cinema capture, clean spherical [XX]mm character at a wide aperture — natural round bokeh, even sharpness — mild diffusion bloom, locked tripod with optional slow push-in, saturated editorial grade, fine grain, warm-retained blacks, 24fps 180° shutter, [XX] seconds.
```

For rhinestone, chrome, or surface-detail close-ups, add: `intentional highlight bloom on reflective surfaces, blooming the speculars on chrome and rhinestone.`

---

## MODE 3 — ACTION / COMBAT (Documentary-Sci-Fi)

**When to use:** Combat, chase, stunts, war, mech battles, alien encounters, fight choreography, any high-physicality scene with debris, smoke, dust, or destruction.

**Camera Capture line:**

```
Camera Capture: wide-latitude cinema capture, vintage [XX]mm 2x anamorphic character at a wide aperture — oval bokeh, soft edge falloff — light diffusion bloom softening highlights, handheld and shaky throughout with no stabilized shots, color-negative film rendition with heavier low-light grain, [palette descriptor] with dusty atmospheric haze, 24fps 180° shutter, [XX] seconds.
```

Replace `[palette descriptor]` with scene-appropriate language (e.g., "daylight overcast palette," "golden hour warm palette," "blue-hour cool palette," "stormy desaturated palette").

For impact slow-motion: append `intercut 96fps high-speed slow-motion at the [moment] holding 180° shutter for natural motion blur.`

---

## MODE 4 — PERFORMANCE / CONCERT (Pit-Photographer Documentary)

**When to use:** Stadium and arena performance shots, festival pits, concert footage, jumbotron-and-lightstick worlds, anywhere a performer is on stage with a crowd and stage lighting.

**Camera Capture line:**

```
Camera Capture: wide-latitude cinema capture, vintage [XX]mm 2x anamorphic character at a wide aperture — oval bokeh, horizontal streak flares on stage lights — light diffusion bloom softening highlights, mixed handheld pit-photographer and orbital operator energy with hard cuts between angles, color-negative film rendition with fine grain, [stage-lighting color cast], heavy volumetric haze, real sweat sheen, 24fps 180° shutter, [XX] seconds.
```

Replace `[stage-lighting color cast]` with scene-specific language (e.g., "magenta-red color cast from the LED cube above," "amber and ultraviolet wash from side rigs," "cyan and white strobe punching through warm tungsten").

---

## MODE 5 — ATMOSPHERIC / EMPTY (Environment & Mood)

**When to use:** Abandoned cityscapes, no-humans environment plates, landscapes, weather pieces, slow-burn mood shots, world-establishing footage where the environment is the subject.

Also use for: "no humans," "abandoned," "empty," "ghost city," "deserted," "weather plate," "establishing wide" requests.

**Camera Capture line:**

```
Camera Capture: wide-latitude cinema capture, vintage [XX]mm 2x anamorphic character at a wide aperture — oval bokeh, soft edge falloff — light diffusion bloom softening highlights, locked-off or extremely slow push-in only, color-negative film rendition with fine grain, palette grade [hex values], atmospheric haze, weathered material detail, 24fps 180° shutter, [XX] seconds. No humans, environment is the subject.
```

Replace `[hex values]` with actual color codes for the scene's palette (e.g., "#2A3540, #4A5560, #6B7280, #8B7355, #A89178").

---

## STACKING MODES (Multi-World Sequences)

If a single Seedance sequence cuts between two worlds — for example, a music video that intercuts a white void (M2) with a kitchen (M1), or action footage (M3) intercut with performance footage (M4) — write each shot's Camera Capture specs inline in the closing line. Don't blend modes into one averaged grade. The cut between modes is the visual punch; collapsing them kills the contrast.

For multi-shot sequences in the same mode, you can compose one continuous prompt with hard-cut triggers in Movement and a single Camera Capture line with per-shot lens differences inline.

---

## LENS LENGTH GUIDE (across all modes)

- **32mm / 35mm / 40mm:** Wide establishing, full-body, group framing, environmental context
- **50mm / 55mm:** Medium portrait, two-shot, waist-up, dialogue framing
- **75mm:** Tight editorial portrait, single-character isolation, performance close-up
- **85mm / 100mm:** Extreme close-up — eyes, lips, jewelry, fabric texture, surface detail

When in doubt, default to 55mm (M1 / M3 / M4) or 50mm (M2) for medium framing. M5 typically uses the wider end (35→55mm) for environmental reach.

---

## FRAME RATE NOTES

All five modes default to **24fps with 180° shutter** for cinema-standard motion blur.

Slow-motion beats (impact, hair whip, fabric on a hit, water splash, weapon recoil): specify inside the Camera Capture line — `intercut 96fps high-speed slow-motion at [moment] holding 180° shutter.` Keep the base frame rate at 24fps.

---

## RUNTIME & PER-SHOT TIMING

**Total runtime** is stated in three places: title line above the code block, Frame Map block (for multi-shot sequences with per-shot timing), and the closing Camera Capture line. All three must match.

**Always ask runtime — never default.** If the user hasn't specified runtime, ask in the pre-prompt confirmation step.

**Shot complexity guidance:**
- **4–8 seconds** — one strong character action, single locked composition
- **8–12 seconds** — one action plus reveal or hold, optional micro-shift in composition
- **12–15 seconds** — 2–3 simple beats with hard cuts inside the prompt
- **Complex multi-action sequences** — split into separate prompts

**Per-shot timing for multi-cut sequences:** when a single Seedance prompt contains more than one shot stitched with hard cuts, label each shot inline in the Frame Map and Movement blocks with its time range. The per-shot timing must add up to the total runtime stated in Camera Capture and the title.

---

## NEGATIVE → POSITIVE REWRITES

Seedance responds far better to positive locks than to negative prohibitions.

| Instinct (negative) | Lock (positive) |
|---|---|
| Don't change face | @image1 keeps the same face, hair, wardrobe, and silhouette throughout. |
| Don't switch positions | @image1 remains in the left third throughout; @image2 remains in the right third throughout. Neither crosses the center line. |
| Don't drift | Boots stay planted on the same ground marks across the full runtime. Only breath, eyes, hair, and fabric move subtly. |
| Don't change costume | Wardrobe identical across the runtime. |
| No extra people | The frame contains only @image1 and @image2 in their specified positions. No other figures enter or pass through. |
| No on-screen text | No on-screen text, no captions, no signage typography, no rendered text in the frame. |
| No camera chaos | Slow controlled handheld with natural operator breath, preserving @image1 in the left third and @image2 in the right third throughout. |
| No blur | Subjects remain sharply focused; controlled cinematic motion blur appears only on falling rain and distant background light sources. |
| Don't blink mid-action | Gaze stays locked on @image2 across the full runtime, eyes steady, no break in eye contact. |
| No mode switching | The shot runs as one continuous take with no cuts, no scene change, no time jump. |

**Always prefer the positive form.** Negative phrasing belongs only in the explicit suppression lines for known Seedance failure modes (the on-screen text suppression is the canonical example).

---

## PRE-DELIVERY PASS (Silent QA — Run Before Every Delivery)

Before delivering the full prompt to the user, silently run this pass. If anything fails the check, fix it before the prompt ships. Do not narrate this pass — it happens internally.

**The pass:**

- [ ] Character gate asked (if first prompt of session) and answer carried
- [ ] Every uploaded reference image identified and listed by short visual descriptor — first bullet of the pre-prompt check, numbered bullet list at top of delivery, and inline `@imageN` tag. Order matches across all three.
- [ ] **Canonical reference attached for every named subject that appears in the scene, even when that subject is also visible in the rendered plate** — characters, vehicles, props, creatures. Plate carries the world; canonical reference carries identity. No exceptions. Subject Lock for every canonical-referenced subject anchored to its own `@imageN`.
- [ ] Mode selected (M1 / M2 / M3 / M4 / M5) with rationale
- [ ] Frame Map block written — every character pinned to a screen position, depth layer, frame occupancy
- [ ] Subject Lock block written for every character — identity / orientation / pose / state / gaze / contact points / state-changes / lock-down line. Wardrobe NOT re-described from reference image — only state-changes the image can't carry.
- [ ] Cross-Frame Rules written if 2+ characters in frame — no swap, no center cross, no depth change, distance held, screen sides held
- [ ] Movement block written — four layers present (character / micro / environmental / camera) in paragraph form, per-beat timestamps where the action demands
- [ ] Last Frame block written — exact closing composition stated, on-screen text suppression line included (unless user requested in-frame text)
- [ ] World Plate written — location, time, weather, set dressing, anchored to plate ref if attached
- [ ] Sound Bed written — diegetic mode chosen, specific sounds listed, no music referenced
- [ ] Capture Realism block written and tuned to the scene — depth-via-suspended-atmosphere between the actual planes; moisture-without-shine ONLY if the scene is wet (deleted if dry); per-zone specular kill on skin (dropped if no humans); contrast curve stated three ways. Not duplicating any gear/grade/frame-rate language from Camera Capture. Reduced or skipped only if the user explicitly asked for a glossy/clean/editorial register.
- [ ] Camera Capture line at the bottom — single trimmed paragraph, body / lens / filter / movement / stock / grade / frame rate / runtime, no double camera spec
- [ ] Lens length chosen for the framing
- [ ] Runtime confirmed with the user (never assumed). Runtime in title matches runtime in Camera Capture.
- [ ] Per-shot timing planned for multi-cut sequences, summing to total runtime
- [ ] No character names in prompt output
- [ ] No real brand names in prompt output
- [ ] No platform/tool names in prompt output
- [ ] No internal production context, no meta-commentary, no abstract emotional intent
- [ ] No music, no lyrics, no song references in Sound Bed
- [ ] Output language locked to English inside the code block
- [ ] Three-part delivery format: (1) numbered bulleted reference list, (2) bolded English title with runtime, (3) English code block with labeled blocks and `@imageN` tags
- [ ] All ten labeled blocks present in the code block, in exact locked order: Scene & Mood → Frame Map → Subject Lock(s) → Cross-Frame Rules → Movement → Last Frame → World Plate → Sound Bed → Capture Realism → Camera Capture. None missing, none reordered, none merged, none renamed.
- [ ] Every reference in the bullet list appears at least once as an `@imageN` tag inside the code block, numbering matches exactly
- [ ] Negative prohibitions translated to positive locks throughout
- [ ] Total prompt body word count within target range (280–400 single shot, up to 600 multi-shot)

**Repair pass — if any of these conditions are detected, fix before delivery:**

- **Too poetic or abstract** → rewrite Scene & Mood as physical visual instructions
- **Overloaded with action** → split into a multi-shot sequence
- **Character might drift** → tighten Subject Lock with contact points and ground marks
- **Characters might swap positions** → tighten Cross-Frame Rules
- **Wardrobe re-described from the image** → cut redundant description, trust the reference
- **Double camera spec detected** → collapse to single Camera Capture line at the bottom
- **Mode register conflict** → keep one cinema mode dominant per shot
- **Action too complex** → keep one dominant character motion, push the rest into the next shot
- **Last Frame missing or vague** → write a specific closing composition
- **Prompt word count over target** → trim Subject Lock and Movement first, then Cross-Frame Rules

---

## OPTIONAL HANDOFF — BANANA PRO DIRECTOR

If the user mentions they have a Banana Pro plate for the environment, want camera grammar to match an existing plate, or are pairing a Seedance prompt with a still they already built in Banana Pro, ask which cinema mode the plate used and lock the matching camera grammar in the Seedance prompt. The two skills share the same five-mode framework — when paired, the still and the video share visual DNA.

Otherwise, do not bring this up. Cinema-worldbuilder operates standalone unless the user invokes the pairing.

