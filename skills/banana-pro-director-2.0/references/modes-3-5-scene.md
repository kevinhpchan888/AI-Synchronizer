## MODE 3 — CINEMATIC SCENE PLATE

**When to use:** Only when the user asks for a scene, an environment, a plate, a moment, or describes a setting. Never proposed proactively.

Two flavors:

- **3A — Character-in-environment plate:** placing one or more locked characters into a fully realized environment. Output becomes a Higgsfield reference asset that can feed Seedance for video generation. Camera language matches the cinema mode the eventual video will use.
- **3B — Pure environment plate:** no characters in frame. Pure location, lighting, atmosphere, set dressing. Useful as an environment anchor for video generation, mood-setting, or world-building.

**Goal:** A single still that captures the world (and the character, when present) and the camera grammar — as if a cinematographer locked off and grabbed a photo on the same camera package mid-take.

**Camera grammar — five cinema modes paired to scene type.** Pick the cinema mode that matches the scene. The cinema mode register (M1, M2, M3, M4, M5) is woven into the camera spec paragraph at the end of the prompt as part of the named camera package — see "THE CINEMA-PROSE REGISTER" for the locked write-out format.

| If the scene is... | Cinema mode |
|---|---|
| Real-world dramatic (street, kitchen, car, bar, interior, exterior location) | M1 — Narrative |
| Studio / editorial / void / clean set / fashion film | M2 — Studio / Editorial |
| Action / combat / chase / high-energy physical | M3 — Action / Combat |
| Performance / concert / stage / pit | M4 — Performance / Concert |
| Atmospheric / empty / no-humans / weather plate | M5 — Atmospheric / Empty |

The cinema mode carries: lens character, filtration look, film-stock rendition, grain, grade, color cast — all described as the visual *look*, never as brand names or model numbers the tools don't recognize. In the cinema-prose register, this gets written out as plain-language aesthetic, e.g., "Captured with a wide-latitude cinema look and a vintage 55mm-equivalent 2x anamorphic character at a wide aperture — oval bokeh, gentle horizontal squeeze, soft frame-edge falloff, a light diffusion bloom lifting highlights into a soft halation, color-negative daylight film rendition with fine 35mm grain, in an M1 cinematic narrative register." The M-tag appears as a brief identifier woven into the prose, not as a standalone label.

---

### THE SILENT 6-BLOCK MENTAL CHECKLIST (PRE-COMPOSITION ONLY)

Before writing the cinema-prose prompt, the skill silently runs through this six-bucket mental checklist to make sure the composition is complete. The buckets are NEVER written as labeled blocks in the prompt — they get woven into continuous cinema prose per the locked register below. This checklist is a thinking tool, not an output structure.

**Bucket 1 — Shot DNA.** Camera position, what the camera is looking at, the framing register, and the mood. The spine of the shot.

**Bucket 2 — Subject behavior + spatial placement.** What the subject is doing in this frame, where they sit in the frame (translated to positional prose, not coordinate notation), direction of motion or gaze.

**Bucket 3 — Visible detail (resolution-aware).** Only the details a real camera at this distance, lens, and motion register would resolve. (Resolution-aware rule documented below.)

**Bucket 4 — World.** Environment as ambience, not architecture. The space's register matters more than counting structural elements. World plate references carry the geometry — the prompt narrates the moment on top.

**Bucket 5 — Light and atmosphere.** What the light is doing, where the haze is, where shadows fall, color temperature register, key vs fill vs rim relationships.

**Bucket 6 — Camera spec + finish.** Full cinema stack as continuous descriptive prose, ending with the closing realism clause.

These six buckets get composed into the five-paragraph prose structure below — they do NOT appear as labeled blocks in the output. See "THE CINEMA-PROSE REGISTER" for the actual write-out format.

---

### RESOLUTION-AWARE DETAIL RULE (LOCKED)

**Describe what the camera at this position can physically see, not what's "true" about the subject.**

Before writing any visual detail in Block 3, the skill silently runs three diagnostic questions:

1. **At this distance, would a real cinema lens resolve this detail?** If no, drop it.
2. **At this motion blur level, would this detail read?** If no, drop it.
3. **At this lighting register, would this detail be visible?** If no, drop it.

**Examples of what this rule kills:**

- A car shot from 200 feet up at 120 mph at dawn → side decals, windshield text, badge logos, wheel spoke count are NOT resolvable. Drop them. The car reads as silhouette + color blocks + headlights + motion blur trails.
- A person walking across a wide environmental plate at 50 yards → facial expression, jewelry, fabric weave are NOT resolvable. Drop them. The person reads as silhouette + hair color + wardrobe color blocks + posture.
- A character in a moody night scene lit by one practical → skin pore detail, peach fuzz, micro-expression are NOT visible at this lighting. Drop them. The character reads as face shape + eye glints + key wardrobe pieces catching light.

**Examples of what this rule preserves:**

- The same car in a tight static shot at 20 feet → decals readable, windshield text readable, badge legible, wheel detail visible. Describe them.
- The same person in a medium two-shot at 8 feet → facial expression readable, jewelry visible, wardrobe detail clear. Describe them.

**Detail is earned by camera proximity, lens length, motion stillness, and lighting intensity. The skill respects this physics.**

---

### X/Y COORDINATE SYSTEM (MENTAL COMPOSITION TOOL — NOT OUTPUT NOTATION)

**The X/Y coordinate system is the skill's internal composition tool. It is NEVER written into the prompt body in the cinema-prose register.** The skill uses it silently to plan rule-of-thirds placement, motion direction, lead room, and landmark anchoring — then translates the coordinates into positional prose for the prompt (see the translation table under "THE CINEMA-PROSE REGISTER").

The coordinate library below is documented for the skill's planning use only. It does not appear in the output.

**Frame grid:**
- **X axis:** 0% = left edge, 50% = center, 100% = right edge
- **Y axis:** 0% = top edge, 50% = center, 100% = bottom edge

**Coordinate notation (internal use only):** `X: 30–55% / Y: 55–85%` — the rectangle of frame real estate the subject occupies. Always expressed as a range that represents the subject's bounding box, never a single point.

**Rule-of-thirds anchor table (locked vocabulary):**

| Thirds position | X | Y |
|---|---|---|
| Upper-left third | 33% | 33% |
| Upper-right third | 67% | 33% |
| Lower-left third | 33% | 67% |
| Lower-right third | 67% | 67% |
| Center | 50% | 50% |
| Upper third line (horizon/eye line) | — | 33% |
| Lower third line (horizon/eye line) | — | 67% |
| Left third line (vertical anchor) | 33% | — |
| Right third line (vertical anchor) | 67% | — |

**Standard cinematographer placement library:**

- **Hero subject, strong vertical (left third):** subject `X: 28–38% / Y: 25–95%`
- **Hero subject, strong vertical (right third):** subject `X: 62–72% / Y: 25–95%`
- **Two-shot facing each other:** subject A `X: 15–40% / Y: 25–90%`, subject B `X: 60–85% / Y: 25–90%`
- **Wide environmental with hero subject on lower-right third:** subject `X: 60–75% / Y: 55–80%`, environment fills the rest
- **Close-up face with eye line on upper third:** subject `X: 25–75% / Y: 10–85%`, eyes at `Y: 33%`
- **Three-quarter body portrait:** subject `X: 30–70% / Y: 15–95%`
- **Horizon on upper third:** horizon line at `Y: 33%`, sky fills `Y: 0–33%`, ground fills `Y: 33–100%`
- **Horizon on lower third:** horizon line at `Y: 67%`, sky fills `Y: 0–67%`, ground fills `Y: 67–100%`
- **Vehicle in motion:** car positioned at `X: 30–55%` with motion direction pointing toward `X: 100%`, leaving lead room ahead of the car for the eye to follow movement (always leave lead room in the direction of motion — never trail room)
- **Aerial subject (overhead light source, helicopter, sun shaft):** light source enters frame at the top edge `Y: 0%`, cone widening as it falls, source itself off-frame, subject lit at the destination coordinates
- **Architectural symmetry (centered hallway, centered facade, centered car alignment):** subject `X: 35–65% / Y: variable`, symmetry preserved

**Coordinates are translated into positional prose for the prompt output.** Internally, the skill thinks of the primary subject in Paragraph 2 with a coordinate range, environmental landmarks in Paragraph 3, and load-bearing light sources in the light-and-atmosphere writing — then writes those positions as "centered in the room," "in the deeper background camera-left," "anchored on the lower-left third," etc. See the positional prose translation table under "THE CINEMA-PROSE REGISTER" for the canonical mappings.

---

### THE LOCKED TAG BLOCK (DEPRECATED FOR PROSE — KEPT AS FALLBACK)

**This six-phrase tag block is deprecated for the cinema-prose register.** It has been superseded by the closing realism clause documented under "THE CINEMA-PROSE REGISTER" below — a continuous descriptive paragraph that describes the actual look in plain language (wide-latitude cinema capture, vintage anamorphic character, diffusion bloom, color-negative film rendition with 35mm grain) along with the M-mode register, then closes with the "Real photographic frame... no CGI, no plastic, no AI" quality filter.

The tag block format remains documented here ONLY as a fallback for cases where the user explicitly requests a stripped-down lean Mode 3 prompt without full cinema-prose. Default behavior is the cinema-prose closing paragraph.

```
[Cinema mode tag — M1 Narrative / M2 Studio / M3 Action / M4 Performance / M5 Atmospheric]. Atmospheric volumetric haze. Real volumetric light physics. Gentle filmic highlight roll-off. Lifted blacks. Theatrical 35mm grain. Photographed not generated.
```

If the fallback tag block is used, it REPLACES the cinema stack at the end. Modes 0, 1, 2, 4, and 5 still append the full cinema stack. The cinema-prose register's closing paragraph also replaces the cinema stack for Mode 3 — they are mutually exclusive options for Mode 3, with cinema-prose as the default.

---

### THE CINEMA-PROSE REGISTER (LOCKED, NON-NEGOTIABLE)

**Mode 3 prompts are written like a DP describing a real frame, not like a spec sheet.** The 6-block spatial logic still applies — but it dissolves INTO the prose. No labeled headers, no `X: 30–55% / Y: 25–95%` coordinate notation in the body, no CRITICAL LIGHTING RULES blocks, no explicit negations, no architectural enumeration of room geometry.

The voice is **cinematic anamorphic prose** — confident, declarative, observational. The kind of language that appears in a treatment, a shot list narration, or a hero-still caption. Like a real photograph being described, not a frame being engineered.

**Why this register works:**
- The model responds to confident scene description, not coordinate grids
- References carry the heavy lifting on geometry, palette, and continuity — the prompt narrates the moment ON TOP of the reference
- Over-specification creates conflicting instructions; the model trusts plain language more than rule-blocks
- Spatial logic is preserved by writing positionally ("standing alone in the center of the room," "in the deeper background camera-left") instead of numerically

**What the register sounds like:**

> "A cinematic anamorphic still photograph captured handheld on a real cinema set — a Dutch-tilted intimate over-the-shoulder hero composition of a young Korean man standing alone in a dim converted private garage lounge at pre-dawn, the entire frame tilted at approximately 4 degrees Dutch angle camera-left low giving the composition a quietly off-kilter held-breath feel, the camera positioned right behind him at shoulder height in a waist-up framing showing his back, shoulders, and the back of his head filling the foreground with the wall-mounted television playing the live broadcast visible past his right shoulder in the mid-ground."

That opening sentence does the work of Blocks 1 and 2 in one continuous breath, with the camera position, the framing, the Dutch tilt, the subject placement, and the mood all woven together.

---

### THE FIVE-PARAGRAPH PROSE STRUCTURE (LOCKED)

Every Mode 3 prompt is composed as five paragraphs in this order. Paragraphs are not labeled in the output — they flow as continuous prose for the model.

**Paragraph 1 — Opening shot description.** One long sentence that establishes: the medium ("a cinematic anamorphic still photograph"), the framing register ("Dutch-tilted intimate hero composition"), the subject identification at high level ("a young Korean man standing in a dim converted private garage lounge at pre-dawn"), the camera position and angle in prose ("the camera positioned right behind him at shoulder height in a waist-up framing"), and the mood/intent ("quietly off-kilter held-breath feel"). This is the spine. Everything that follows hangs from this opening.

**Paragraph 2 — Character block.** Describes the character(s) in confident observational prose. Identity markers pulled from the attached reference written as visible facts in the frame ("dark layered mid-length tousled fringe falling across the back of his head, double small silver hoop earrings on each ear lobe catching faint warm spill, warm fair matte Korean skin"). Pose, attention, and held props woven in naturally ("a small black television remote held loosely in his right hand at his side... his head perfectly motionless, his eyes locked on the screen ahead of him").

**Paragraph 3 — World/environment block.** Describes the location as ambience and atmosphere, not architecture. The space's register — converted garage at pre-dawn, dawn cliffside, neon parking garage — matters more than counting structural elements. Anchor the world to the attached reference ("the converted garage lounge at pre-dawn carrying from the attached world reference"). Background subjects (a car silhouette in deep BG, a second character in the alcove) get positional language ("in the deeper background camera-left") not coordinates.

**Paragraph 4 — Subject anchor block.** Whatever the focal anchor of the shot is — the TV broadcast playing on the wall, the second car in BG, the dawn whisper on the horizon — gets its own paragraph. This is where any specific content (broadcast graphics, decals, signage, environmental detail) is described. If the shot has no focal anchor beyond the character, this paragraph folds into Paragraph 3.

**Paragraph 5 — Camera spec + finish.** Full cinema look in one continuous descriptive paragraph: capture register, lens character, diffusion/filtration look, film-stock rendition, grain register, grade, color cast, optical character (anamorphic oval bokeh, organic handheld breath, edge falloff, soft diffusion bloom if relevant) — all in plain-language look terms, never brand or model names — and the closing realism clause ("Real photographic frame captured on a real cinema camera, real anamorphic lens, real cotton tee, real human subject, real concrete and haze — no CGI, no rendered look, no digital cleanliness, no plastic surfaces, no AI smoothness, no skin smoothing, no glow, no halation bloom that reads as artificial, no glossy highlights").

The closing realism clause is mandatory. The list of "no X, no Y, no Z" at the very end is a load-bearing element — it tells the model what NOT to lean toward, and it does so AFTER all the positive description, where the model handles it as a quality filter rather than a conflicting instruction.

---

### KEY WRITING RULES FOR THE PROSE REGISTER

1. **No labeled blocks in output.** Never write "Block 1," "PARAGRAPH 2," "CRITICAL LIGHTING RULE," or any structural label in the prompt body. The structure is invisible — it lives in the writing order.

2. **No coordinate notation in the prompt body.** No `X: 38–62% / Y: 12–95%`. Replace with positional prose: "centered in the room," "in the deeper background camera-left," "filling the foreground," "anchored upper-left of the broadcast."

3. **No CRITICAL/IMPORTANT/MUST rules.** No "the cool wash MUST NOT catch the back wall." Replace with descriptive prose about what IS happening: "the cool broadcast wash catching only the immediate floor patch around his feet and a soft cool rim on his shoulders."

4. **No explicit negations as instructions.** Don't write "NO long sleeves, NOT factory tank-top construction." Write what IS there: "the sleeves cut off cleanly at the shoulder seam with raw unfinished armholes." The end-of-prompt realism clause is the ONLY place negations appear, and only as quality filters (no CGI, no plastic, no AI smoothness).

5. **References do the geometry work.** When the user attaches a world plate, write "carrying identically from the attached world reference" — don't re-enumerate the room geometry. The reference IS the geometry.

6. **References do the identity work.** When the user attaches a character reference sheet, write "carrying identically from the attached character reference" — don't re-describe every facial feature in the prompt. The reference IS the identity.

7. **The prompt narrates THE MOMENT.** What is the character doing right now? What is the camera doing right now? What is the light doing right now? That's the prompt's job. Continuity (room geometry, character identity, broadcast content) is reference work.

8. **The closing realism clause is non-negotiable.** Every Mode 3 prompt ends with the full cinema stack paragraph + the "Real photographic frame... no CGI, no plastic, no AI" close-out. This replaces the old locked tag block.

9. **The cinema mode register (M1/M2/M3/M4/M5) is invoked by DESCRIBING the actual look in plain language** in Paragraph 5 — not by writing "M1 Narrative" as a tag, and never by naming camera/lens/stock brands. Example: "Captured with a wide-latitude cinema look and a vintage 55mm-equivalent 2x anamorphic character at a wide aperture — oval bokeh, gentle horizontal squeeze, soft frame-edge falloff, a light diffusion bloom lifting highlights into a soft halation, color-negative daylight film rendition pushed slightly, with fine 35mm grain, in an M1 cinematic narrative register." The M-tag appears as a brief identifier at the end of the description, not as a standalone label.

10. **Do not write aspect ratios into the prompt** — the user sets aspect in the Higgsfield UI (typically 21:9 or 2.39:1 for cinematic plates).

---

### CANONICAL MODE 3 PROMPT — REFERENCE EXAMPLE

This is the locked register. Every future Mode 3 prompt is written in this voice — confident, observational, declarative, references doing the geometry and identity work, no labeled blocks, no coordinate notation in the body.

```
A cinematic anamorphic still photograph captured handheld on a real cinema set — a low-angle medium hero composition of a woman standing alone at the edge of an empty rooftop at dusk, the camera positioned slightly below her eye line in a waist-up framing anchored to the left third of the frame, the deepening dusk sky filling the upper two-thirds of the frame behind her, the city skyline reading in soft silhouette across the lower third of the background, the composition holding a quiet observational stillness.

The character carrying identically from the attached character reference — her hair, skin, makeup, and identity locked from the reference. She wears the wardrobe carrying identically from the attached wardrobe reference, the fabric reading natural across her shoulders and upper torso. Her body is angled three-quarters toward camera, her weight settled on her back foot, her left hand resting loosely at her side, her right hand at her hip. Her gaze is locked across the rooftop toward the horizon screen-right, her expression neutral and held, her shoulders relaxed but settled.

The rooftop beyond her is the location carrying from the attached environment plate — weathered concrete edge, rusted railing in the foreground softened by shallow depth of field, the city skyline beyond reading as silhouette layers stacked into atmospheric haze, distant building lights coming on one by one as dusk falls. Light atmospheric haze suspended through the deeper space giving the air real physical body, the horizon glow warm magenta-orange transitioning into deep blue overhead. Practical warm light from off-frame at camera-right catches the right side of her face and shoulder with restrained natural rim, the cool ambient dusk light wrapping faintly around her left side where the warm and cool temperatures meet.

The city skyline reads as the visual anchor of the deeper frame — building silhouettes layered front-to-back with progressive atmospheric desaturation, the warm horizon glow visible between the structures, scattered building lights warm and small in the deep distance, a faint aircraft beacon blinking once at the upper-right edge of the frame, the rest of the sky held in deep cool blue with the first stars just visible at the upper edge.

Captured with a wide-latitude cinema look and a vintage 55mm-equivalent 2x anamorphic character at a wide aperture, a light diffusion bloom softening the highlights, color-negative daylight film rendition pushed slightly, in an M1 cinematic narrative register. Real anamorphic optical character with oval bokeh on the deeper city elements, organic handheld operator breath, subtle frame-edge falloff, a faint horizontal streak flare on the brightest horizon highlight. Theatrical fine 35mm film grain across the entire frame — skin, fabric, concrete, sky, haze. Contemporary teal-amber cinema grade with the warm horizon glow on her right side meeting the cool dusk wash on her left, shadows lifted gently into deep cool blue-grey never crushed, highlights rolled off softly never blown. Real photographic frame captured on a real cinema camera, real anamorphic lens, real fabric, real human subject, real concrete and haze — no CGI, no rendered look, no digital cleanliness, no plastic surfaces, no AI smoothness, no skin smoothing, no glow, no halation bloom that reads as artificial, no glossy highlights.
```

This example demonstrates the five-paragraph prose structure with references doing the geometry/identity work, positional prose instead of coordinates, and the closing realism clause.

---

### THE OLD COORDINATE GRAMMAR (DEPRECATED)

The previous Mode 3 structure used labeled blocks, X/Y coordinate notation, CRITICAL LIGHTING RULES sections, explicit negations, and architectural room enumeration. **That grammar is deprecated for prose composition.** It made the model overcorrect and confuse spatial relationships.

The 6-block spatial logic (Shot DNA, Subject + placement, Visible detail, World, Light, Locked tag block) is preserved as a SILENT mental checklist — the skill thinks in those buckets, but writes in continuous cinema prose. The X/Y coordinate library and resolution-aware detail rule remain as composition diagnostics, but coordinates are translated into positional prose for the prompt body.

Positional prose translation table:

| Old coordinate notation | New prose translation |
|---|---|
| `X: 38–62% / Y: 12–95%` | "centered in the frame" / "filling the centered vertical column" |
| `X: 18–55% / Y: 8–95%` | "in the left half of the frame" / "filling the foreground left" |
| `X: 60–85% / Y: 25–80%` | "in the right portion of the frame" |
| `X: 30–55% / Y: 55–85%` | "in the lower-left third" / "anchored to the lower-left third" |
| horizon at `Y: 33%` | "the horizon line sitting at the upper third" |
| subject in `X: 28–38%` (left third) | "anchored on the left third" / "weighted to the left of frame" |
| second subject `X: 60–85%` | "in the deeper right background" / "positioned camera-right" |

---

## MODE 4 — GPT-2 DETAIL FACE SHOT (HIGGSFIELD GPT-2)

**When to use:** Only when the user explicitly asks for a chest-up portrait, face detail shot, or close-up where face/skin/eye fidelity matters most. Never suggested proactively for any other shot type.

**Gating behavior:**
- Wait for the user to ask for a detail/face/chest-up shot.
- Then ask: "want to run this on Higgsfield GPT-2 for the higher-fidelity face read? heads-up — GPT-2 uses more Higgsfield credits than Banana Pro." (Mention the credit cost only the first time per conversation. After that, just confirm "want this on GPT-2?")
- Wait for the green light. Then run the standard pre-prompt confirmation. Then deliver the prompt.

**Goal:** Maximum face fidelity. Skin texture, eye detail, lip detail, hair edge detail, micro-expression, fabric weave at the collar and shoulder. The character stays locked from existing references — GPT-2 just reads it sharper.

**Frame and composition:**
- Framing: chest-up, shoulders-up, or face-only (forehead to collarbone)
- Background: mid-gray seamless studio (locked default, matches base references) OR soft moody studio backdrop if the user wants a more cinematic register — white seamless only on explicit request
- Lighting: classical beauty lighting — soft key from slightly above and camera-left, soft fill at chest level from camera-right, subtle hair light behind, soft underlight bounce from below to lift eye sockets
- Do not write aspect ratios into the prompt — the user sets aspect in the Higgsfield UI (typically 4:5 or 1:1 for face/chest-up).

**Canonical Mode 4 (GPT-2) prompt structure:**

```
[Visual descriptor of the character — hair, makeup, wardrobe visible in frame from the chest up, jewelry visible at collar and ears, eye color and detail, lip detail, skin finish]. [Pose direction — head angle, shoulder angle, expression register].

[Background — mid-gray seamless studio (locked default) OR specified moody backdrop]. Classical beauty lighting — soft key from slightly above and camera-left at 35 degrees, soft fill at chest level from camera-right, subtle hair light behind defining the crown, soft underlight bounce lifting the eye sockets. [Framing — chest-up portrait / shoulders-up / face-only forehead-to-collarbone].

Extreme face fidelity. Real skin texture with visible pores, fine peach fuzz catching light along the jawline and upper lip, subtle subsurface scattering on the nose bridge cheeks and ears, micro-expression detail in the eyes and mouth corners, individual lash detail, real moisture and reflection in the iris with visible iris pattern, real lip texture with subtle natural lip lines, hair rendered strand by strand at the hairline with visible baby hairs and flyaways, fabric weave visible at the collar and shoulder.

[The cinema stack].
```

**Why GPT-2 for these shots:** Banana Pro is excellent for full-body, multi-panel, and scene work. GPT-2 has a stronger read on micro-detail at face-and-shoulders range — pores, lash separation, iris pattern, lip texture, hair strand definition at the hairline. For any shot where the face is the entire point of the image, GPT-2 earns the extra credits.

---

## MODE 5 — OUTFIT REPLACEMENT (BANANA PRO TWO-REFERENCE SWAP)

**When to use:** When the user wants to take an outfit and pose from one image and apply it to a different character. The outfit reference image has the wardrobe, styling, footwear, accessories, and body pose locked in. The character reference image has the face, bone structure, body type, skin tone, and hair locked in. The output combines them — the character from the second image now wears the outfit and holds the pose from the first image.

Trigger phrases include: "outfit replacement," "outfit swap," "put [character] in this outfit," "swap the face," "put this character in that fit," "replace the model with [character] wearing [outfit]," or any request that involves combining a wardrobe/pose reference with a separate character reference.

**Goal:** Maximum identity transfer of the character (from @image2) onto the outfit and pose (from @image1) with zero alteration to either side — the outfit stays exactly as shown, the character's identity stays exactly as shown, only the body underneath the outfit changes to match the new character.

**Reference attachment order (CRITICAL):**
- **@image1 = outfit reference** — the image containing the outfit, styling, footwear, accessories, and pose to keep
- **@image2 = character reference** — the image containing the face, bone structure, body type, skin tone, and hair to apply

This order is fixed. Do not swap. The prompt is written around this exact mapping and reversing it will break the swap.

**Pre-prompt confirmation rule applies.** Even though the prompt itself is short and locked, the user should confirm:
- Which reference is the outfit/pose source
- Which reference is the character/identity source
- That both references are uploaded and visible in chat

Use the standard pre-prompt check format — references first, then the two roles, then run.

**Canonical Mode 5 prompt (LOCKED — do not modify):**

```
Replace the character in @image1 with the character in @image2. Keep the outfit and pose from @image1 exactly. Match the face, bone structure, body type, skin tone, and hair from @image2. Clean mid-gray seamless studio background, even neutral mid-gray with no seam line, soft large-source studio lighting, skin and outfit rendering at their true natural tone against the neutral gray, natural film grain, full body framing.
```

**Why this prompt is locked:** Mode 5 does not use the cinema stack. The two reference images carry the photographic register on their own — adding texture stack language on top of a swap operation creates conflicting instructions and degrades the identity transfer. The lean prompt structure is the entire point of this mode. Trust the references.

**Background and lighting language is also locked.** The locked prompt outputs to a clean mid-gray seamless studio with soft large-source lighting — this is the canonical neutral output for character/outfit reference assets (white seamless only if the user explicitly asks for a white card). If the user wants the swap output dropped into a different environment, that becomes a Mode 3 scene plate built on top of the Mode 5 output (run Mode 5 first to produce the locked base, then Mode 3 to place it in the scene).

**Per-character or per-IP modifiers:** None. Mode 5 is character-and-IP-agnostic. The prompt does not name characters, does not specify nationality, does not adjust language per group or project. The two reference images carry all of the identity load. The skill ships the locked prompt unchanged regardless of what the character or outfit is.

**What Mode 5 is NOT for:**
- Building a new outfit from scratch on a locked character → use Mode 1A (Banana Pro full styling) or Mode 1B (Soul Cinema two-step)
- Generating multiple angles of a locked character in a locked outfit → use Mode 2 (6-panel character sheet)
- Placing a character in a cinematic environment → use Mode 3A
- Detail face shots → use Mode 4 (GPT-2)

Mode 5 is the single-purpose tool for: *here is an outfit on a model I don't care about, and here is the character I do care about, give me the character in that outfit.*

---

