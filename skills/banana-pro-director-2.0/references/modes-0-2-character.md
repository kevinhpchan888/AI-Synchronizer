## MODE 0 — FACE LOCK (NEW CHARACTERS ONLY)

**When to use:** Any time a character is being developed from scratch and there is no existing canonical reference image of their face. Run this BEFORE any outfit work, any 6-panel sheet, any scene plate. The face has to be locked as a visual asset first — every downstream prompt anchors to it.

**Goal:** Produce the canonical face reference for the character. Identity only — no outfit considerations beyond a locked neutral baseline top, no environment, no posing direction. Just: a clean, locked face on white background with soft soft lighting that makes the skin read matte and cinema-placement-ready.

**Universal wardrobe lock for Mode 0:** Every face lock prompt — regardless of tool — puts the character in a neutral baseline top:
- **Women:** plain black thin-strap camisole
- **Men:** plain black ribbed tank
No styling, no jewelry, no logos, no graphics. This keeps the face plate identity-pure and gives every downstream Mode 1 outfit build a clean neutral starting reference.

---

### Tool fork — pick one (ask the user first)

Before any prompt, ask the user which tool to use for the face lock. Three options:

> Want to build this in Banana Pro, GPT-2, or Soul Cinema?
> — **Banana Pro (recommended default):** balanced fidelity, reasonable credit cost. Works for most character builds straight up. Single-pass build, no Step 0.1 needed.
> — **GPT-2 (highest fidelity, highest credits):** chest-up only, sharpest detail, best for nailing tricky identity markers in one shot (intricate piercings, fine scars, beauty marks, specific eye color). Heads-up — uses considerably more Higgsfield credits than Banana Pro.
> — **Soul Cinema (looser, fast iteration):** good when the user isn't sure yet and wants to throw stuff at the wall to see variations on the face register. Lower fidelity than Banana Pro but faster to iterate. If used, run as Step 0.1 first to produce a face plate, then a Banana Pro 3:4 pass (Step 0.2) to lock the finer detail.

Mention the GPT-2 credit cost ONCE per conversation, then drop it for the rest of the session.

Wait for the user to pick. Then proceed to the matching step.

---

### Step 0.A — Banana Pro single-pass face lock (default)

**When:** User picks Banana Pro (or doesn't specify and goes with the default recommendation).

**How:** Single-pass Banana Pro generation, no Soul Cinema plate required. The prompt itself locks identity markers in one shot.

**Pre-prompt check:**

Pre-prompt check — Banana Pro face lock (single-pass):
- **Reference attached:** none — text-only build
- **Character spec:** [identity essentials only — heritage, build, skin, hair color + length + texture, eye shape + color, key identity markers like beauty marks/scars/piercings]
- **Wardrobe:** plain black [camisole / ribbed tank]
- **Backdrop:** mid-gray seamless studio (locked default)
- **Lighting:** soft soft natural light from camera-[left/right]
- **Framing:** 3:4 headshot, forehead to upper chest, face filling most of the frame

Sound good?

**Canonical Step 0.A prompt structure:**

```
A clean cinema-character-reference 3:4 headshot, framed from forehead to upper chest with the face filling most of the frame. [Identity essentials — heritage, build, skin tone and finish, hair (color, length, texture), eye shape and color, any key identity markers being locked: piercings with exact position and metal, scars with placement and size, beauty marks with placement]. She wears [a plain black thin-strap camisole / he wears a plain black ribbed tank], no jewelry, no logos, no graphics. Body squared to camera, head level, neutral relaxed expression, eyes to camera, lips closed and relaxed, subtle controlled energy.

Mid-gray seamless studio background — even neutral mid-gray, no seam line, no gradient, no falloff to black or white. Relight from scratch overriding any reference lighting: one broad diffused source from camera-[left/right] and slightly above, a soft triangle of light on the shadow cheek, gentle wrap onto the face, no hard shadow edges, no rim light, no hair light, no kicker. Skin reads matte and velvety — zero shine on forehead, nose bridge, cheekbones, temples, and chin, no oily T-zone — in a low-contrast milky look. Skin renders at its true natural skin tone and wardrobe at its true natural color, warmth preserved and natural against the neutral gray, never pale or washed-out or cool-shifted by the background. Real peach fuzz at the jaw and hairline, real soft fine even pore texture, subsurface scattering reading as semi-translucent biology, never plastic, never waxy AI render, never glass-skin, never harsh — fine flattering texture that keeps the face looking good, no acne, no blemishes, no rough pores. Photographed on a 50mm prime at a wide aperture, natural round bokeh, even sharpness, soft natural film grain. Photographed not generated.

[Gray is the locked default — use the lean Rembrandt close above. If the user explicitly asks for a white card instead, swap to "Pure white seamless studio background, no gradient, no seam line, perfectly even. Soft soft cinematic light from camera-[left/right], very diffused, gentle wrap onto the face, no hard shadow edges, no rim light, no hair light, no kicker. Skin reads matte and slightly diffused, cinematic register ready for placement onto scene plates." and append the full cinema stack from "THE CINEMA STACK" section instead of this lean close.]

---

### Step 0.B — GPT-2 single-pass face lock (highest fidelity)

**When:** User explicitly picks GPT-2 and has confirmed the higher credit cost.

**How:** Single-pass GPT-2 generation, chest-up framing only (GPT-2's sweet spot — anything wider loses the fidelity advantage and isn't worth the credit hit).

**Pre-prompt check:**

Pre-prompt check — GPT-2 face lock (single-pass, chest-up only):
- **Reference attached:** none — text-only build
- **Character spec:** [identity essentials only — heritage, build, skin, hair color + length + texture, eye shape + color, key identity markers]
- **Wardrobe:** plain black [camisole / ribbed tank]
- **Backdrop:** mid-gray seamless studio (locked default)
- **Lighting:** soft soft natural light from camera-[left/right]
- **Framing:** chest-up portrait, face dominant in the frame

Sound good?

**Canonical Step 0.B prompt structure:** Use the GPT-2 prompt structure documented in the GPT-2 section of this skill (Mode 4). Apply the same identity essentials, wardrobe lock, white backdrop, and soft soft lighting as Step 0.A — just routed through the GPT-2 prompt grammar instead of the Banana Pro grammar.

---

### Step 0.1 + Step 0.2 — Soul Cinema two-pass face lock (iteration path)

**When:** User picks Soul Cinema. Use when the user wants to throw variations at the wall before committing to a final face. Soul Cinema is the lowest-fidelity option for face work, so it gets used only as a quick exploratory pass, then Banana Pro locks the result.

### Step 0.1 — Soul Cinema face plate

Run a lean Soul Cinema generation to produce a clean face plate on mid-gray seamless with soft soft lighting. The plate is exploratory — identity essentials only, no makeup detail, no granular facial anatomy, no fine identity markers (those go into Step 0.2 where Banana Pro can actually hold them).

**Pre-prompt check:**

Pre-prompt check — Step 0.1 of 2 (Soul Cinema face plate):
- **Reference attached:** none — text-only build
- **Character spec:** [identity essentials only — heritage, build, skin tone, hair (color, length, texture), eye shape and color, beauty marks / scars only if they're large/obvious — fine markers held for Step 0.2]
- **Wardrobe:** plain black [camisole / ribbed tank]
- **Backdrop:** mid-gray seamless studio (locked default)
- **Lighting:** soft soft natural light from camera-[left/right]
- **Framing:** chest-up, face clearly readable, body squared to camera

Sound good?

**Canonical Step 0.1 prompt structure (lean — identity essentials only):**

```
A [heritage] [woman / man] with a [slim / specified] build, [skin tone and finish], [hair color, length, texture]. [Eye shape and color]. [Large/obvious identity markers only — beauty marks or scars that are visually dominant. Hold fine markers for Step 0.2]. [She wears a plain black thin-strap camisole / He wears a plain black ribbed tank], no jewelry, no logos, no graphics. Body squared to camera, head level, neutral relaxed expression, eyes to camera, lips closed and relaxed.

Mid-gray seamless studio background — even neutral mid-gray, no seam line, no gradient. Soft soft natural light from camera-[left/right], very diffused, no hard shadow edges, no rim light, no hair light, no kicker, no harsh directional studio lighting. The light produces only the gentlest lifted shadow on the off-light side of the face. Skin renders at its true natural skin tone, warmth preserved and natural against the neutral gray, never cool-shifted or washed-out by the background. Skin reads matte and slightly diffused, clean and even, ready for placement onto cinematic scene plates. Chest-up framing.

Real human skin with visible natural pore texture, fine peach fuzz catching light along the jawline, subtle subsurface scattering on the cheeks and ear edges. Hair rendered strand by strand with realistic natural texture, individual flyaways at the hairline. Fine cinema grain. Lived-in, not pristine. Photographic, not rendered.
```

This is intentionally lean — no full cinema stack at this stage, no granular face anatomy (jaw, chin, lips, cheekbones, brow detail), no makeup paragraph. Let Soul Cinema interpret the face from the essentials. Step 0.2 locks the rest.

After delivery, the user runs this in Soul Cinema, saves the result as the Step 0.1 face plate reference.

### Step 0.2 — Banana Pro 3:4 headshot to lock the full facial character

Once the Soul Cinema face plate exists, run a second-pass Banana Pro 3:4 headshot using that Soul Cinema plate as the character reference. This second pass locks finer facial detail (exact eye color, lip shape, facial structure, skin texture) and any fine identity markers (small scars, beauty marks, piercings) that need to be permanent across all future prompts.

**Pre-prompt check:**

Pre-prompt check — Step 0.2 of 2 (Banana Pro 3:4 headshot, identity lock):
- **Reference attached:** the Soul Cinema face plate from Step 0.1
- **Character spec:** [same essentials as Step 0.1, PLUS all fine identity markers — beauty marks with placement, scars with placement and size, piercings with exact position and metal, makeup register if relevant]
- **Wardrobe:** plain black [camisole / ribbed tank] (matching Step 0.1)
- **Backdrop:** mid-gray seamless studio (locked default)
- **Lighting:** soft soft from camera-[left/right] (matching Step 0.1)
- **Framing:** 3:4 headshot, forehead to upper chest, face filling most of the frame

Sound good?

**Canonical Step 0.2 prompt structure:**

```
A clean cinema-character-reference 3:4 headshot of the same character as the attached Soul Cinema face plate, framed from forehead to upper chest with the face filling most of the frame. [Full character descriptor — heritage, build, skin tone and finish, hair (color, length, texture), face register (jaw, chin, lips, cheekbones, brow shape), eye shape and color, all identity markers being locked: piercings with exact position and metal, scars with placement and size, beauty marks with placement, default makeup register]. She wears [a plain black thin-strap camisole / he wears a plain black ribbed tank], no jewelry, no logos, no graphics. Body squared to camera, head level, neutral relaxed expression, eyes to camera, lips closed and relaxed, subtle controlled energy.

Mid-gray seamless studio background — even neutral mid-gray, no seam line, no gradient, no falloff to black or white. Relight from scratch overriding any reference lighting: one broad diffused source from camera-[left/right] and slightly above, a soft triangle of light on the shadow cheek, gentle wrap onto the face, no hard shadow edges, no rim light, no hair light, no kicker. Skin reads matte and velvety — zero shine on forehead, nose bridge, cheekbones, temples, and chin, no oily T-zone — in a low-contrast milky look. Skin renders at its true natural skin tone and wardrobe at its true natural color, warmth preserved and natural against the neutral gray, never pale or washed-out or cool-shifted by the background. Real peach fuzz at the jaw and hairline, real soft fine even pore texture, subsurface scattering reading as semi-translucent biology, never plastic, never waxy AI render, never glass-skin, never harsh — fine flattering texture that keeps the face looking good, no acne, no blemishes, no rough pores. Photographed on a 50mm prime at a wide aperture, natural round bokeh, even sharpness, soft natural film grain. Photographed not generated.

[Gray is the locked default — use the lean Rembrandt close above. If the user explicitly asks for a white card instead, swap to the white-backdrop line and append the full cinema stack from "THE CINEMA STACK" section instead of this lean close.]
```

After delivery, the user runs this in Banana Pro. The output becomes the canonical character reference image — the locked face card used as the identity anchor for every future outfit/scene/sheet prompt for this character.

**Why two steps for Soul Cinema:** Soul Cinema is faster and looser than Banana Pro on faces but holds less fidelity. The two-step flow uses Soul Cinema for exploration (cheap variations on the face register) and Banana Pro for the lock (fine markers, exact eye color, makeup, the canonical reference). This is the slowest path of the three options — only use it when iteration is more valuable than speed.

---

**What Mode 0 is NOT for:**
- Refining an existing character that already has a canonical reference → not needed, skip to Mode 1
- Outfit design → use Mode 1 (Mode 0's locked black camisole/tank is identity-baseline, not a styled outfit)
- Multi-angle sheets → use Mode 2, but only AFTER Mode 0 + Mode 1 are done

Mode 0 is one-and-done per character. Once the locked 3:4 headshot exists, every future prompt for that character anchors to it.

---

## MODE 1A — SINGLE-IMAGE CHARACTER OUTFIT, BANANA PRO PATH

**When to use:** First image of any character/outfit pairing **when the user picks Banana Pro** in the Mode 1 tool fork. Best for relatively simple outfits where full prompt control gets us there in one clean shot. Heavier on styling description, full control over every detail, single locked output.

**Goal:** Single character, face clearly readable, full styling locked head-to-toe, environment minimal so the character is the only subject. The prompt is identity-forward, environment-minimal, lighting-controlled.

**Frame and composition:**
- Framing: Subject centered, weight shifted onto one hip in the cocked-hip model stance, body angled 15–30° from camera, chin slightly tucked or level, eyes to camera or slightly off-camera. Default is full-body for an outfit reference because it shows the whole fit; waist-up or head-to-shoulders only when the user asks. Do not write aspect ratios into the prompt — the user sets aspect in the Higgsfield UI.
- Background: **Mid-gray seamless studio.** The locked default for all character/outfit work — even neutral mid-gray, no seam line, no gradient. Lowers subject-to-background contrast for cleaner edges and less inherited plastic when the still seeds downstream video. **Exception:** if the user explicitly asks for a clean white card (a finished standalone still to post or hand off), swap to pure white seamless and use the full cinema stack close instead of the lean Rembrandt grade.
- Lighting: Soft soft cinematic key from camera-left or camera-right (user picks side), very diffused, gentle wrap onto the figure, no harsh shadows, no rim light, no hair light, no kicker — only the gentlest lifted shadow on the off-light side. Skin reads matte and slightly diffused, cinema-placement ready.

**Default expression:** Model face-card neutral, subtle controlled, slight closed-lip smirk at most. Never teeth-showing smile unless the user specifically requests it.

**Canonical Mode 1A prompt structure:**

```
[Visual descriptor of the character — hair, makeup, full wardrobe head-to-toe, jewelry, body markers, all extracted from references or locked from the development phase]. [Pose direction — body angle, weight distribution, hand position, expression].

Mid-gray seamless studio background — even neutral mid-gray, no seam line, no gradient, no falloff to black or white. Relight from scratch overriding any reference lighting: one broad diffused source from camera-[left/right] and slightly above, gentle wrap onto the figure, no harsh shadows, no rim light, no hair light, no kicker, only the gentlest lifted shadow on the off-light side. Skin and fabric read matte and velvety in a low-contrast milky look, no shine, no oily T-zone. Skin renders at its true natural skin tone and the outfit at its true natural color, warmth preserved and natural against the neutral gray, never pale or washed-out or cool-shifted by the background. Real peach fuzz at the jaw and hairline, real fine even pore texture, subsurface scattering reading as semi-translucent biology, real fabric weave and drape, never plastic, never waxy, never harsh. Photographed on a 50mm prime at a wide aperture, natural round bokeh, even sharpness, soft natural film grain. Photographed not generated. [Framing — full body / waist-up / head-to-shoulders].

[Gray is the locked default — use the lean Rembrandt close above. If the user explicitly asks for a white card, swap to "Pure white seamless studio background, no gradient, no seam line, perfectly even. Soft soft cinematic light from camera-[left/right]..." and append the full cinema stack from "THE CINEMA STACK" section instead of this lean close.]
```

**Variation strategy when building multiple base references:** When generating a series of single-image base references for the same character (different outfits, different lighting moods, etc.), keep the mid-gray seamless backdrop locked and vary one parameter per shot:

- Pose (cocked-hip front → angled three-quarter → seated → side profile → back-to-camera over-shoulder)
- Framing (full body → waist-up → head-to-shoulders)
- Expression (neutral → smirk → eyes-closed → looking off-frame)
- Lighting direction (key from L → R → top → backlit)

Don't vary face, skin, or core identity markers. Those stay locked.

---

## MODE 1B — SINGLE-IMAGE CHARACTER OUTFIT, SOUL CINEMA PATH

**When to use:** First image of any character/outfit pairing **when the user picks Soul Cinema** in the Step 1 tool fork. Best when the user wants to design a custom fit and put it on the locked character without prompt-writing the styling from scratch onto the face. Faster iteration than Mode 1A, more variety per generation, lighter prompts.

**How it works — TWO-STEP FLOW (critical):**

Soul Cinema is a two-step process. Do not skip Step 1B.1 and jump straight to compositing.

### Step 1B.1 — Generate the outfit on a neutral model

First, build the outfit on a slim, normal-looking model (gender-matched to the outfit) so it exists as a clean visual reference. No locked character yet — just the fit on a generic model with normal hair and a normal model face on mid-gray seamless. The model is straight-on, not posed, neutral expression, so the focus stays on the clothes.

**Model spec (locked):**
- Slim model build, refined proportions
- Normal hair — simple natural style appropriate to the model's gender (medium-length straight or slight wave for women, short clean cut for men), neutral natural color (medium brown by default unless the outfit calls for something specific)
- Normal model face — clean even features, neutral natural makeup if a woman (skin-tint, soft brow, neutral lip), no styled makeup if a man, blank neutral model expression
- Straight-on stance, weight evenly distributed, arms relaxed at the sides, not posed, not cocked-hip
- Body squared to camera, eyes to camera
- Gender matched to the outfit — woman for women's wear, man for menswear, the figure that fits the outfit best for unisex

**Pre-prompt check (clean bullet format):**

Pre-prompt check — Step 1 of 2 (build the fit):
- **Subject:** slim [woman/man], normal hair, neutral model face, straight-on relaxed stance
- **Outfit:** [full outfit description — every garment, accessory, jewelry, footwear]
- **Backdrop:** mid-gray seamless studio (locked default)
- **Lighting:** soft soft natural light from camera-[left/right] (user picks side)

Sound good?

**Canonical Step 1B.1 prompt structure:**

```
A slim [woman / man] standing straight-on to camera in a relaxed neutral stance, weight evenly distributed across both feet, arms hanging relaxed at the sides, shoulders level and relaxed, body squared to the camera, head level. Medium-length [natural medium brown hair, simple straight or slight natural wave, parted naturally / short clean haircut, natural medium brown color]. Clean even features, neutral natural skin tone, [light natural makeup with skin-tint finish, soft groomed brows, neutral lip / no makeup, naturally groomed brows], neutral blank model expression, eyes directly to camera, lips closed and relaxed. Slim model build with refined proportions. The figure wears [full outfit description here — every garment top to bottom with fabric, color, fit, structural details, layering, hem positions, footwear, jewelry, accessories].

Mid-gray seamless studio background, even neutral mid-gray, no shadow falloff to black or white, no visible seam line, perfectly even backdrop. Soft soft natural light from camera-[left/right], very diffused, gentle wrap onto the figure, no harsh shadows, no dramatic rim light, no kicker, no hair light — only the gentlest lifted shadow on the off-light side. Skin and fabric read matte and slightly diffused, clean and even, the outfit fully readable and rendering at its true natural color against the neutral gray, never cool-shifted or washed-out by the background. Full body framing from head to just below the footwear.

Real fabric texture with visible weave detail, real weight, real drape, visible texture variation across the surface. Jewelry with real metal surface detail. Real human skin with natural pore texture. Fine cinema grain, soft lens vignette, natural color grade. Photographic, not rendered.
```

Note: Lighting is intentionally soft soft from a single side — no full theatrical cinema stack at this stage, no dramatic three-point lighting. The outfit is the only subject. The lighter close is deliberate — we want a clean, matte, slightly diffused outfit reference that composites cleanly onto the locked character in Step 1B.2 without dragging cinema register baggage along. Run this in Soul Cinema. The user saves the result — that's the outfit reference for Step 1B.2.

### Step 1B.2 — Composite the outfit onto the locked character

Once the outfit reference exists from Step 1B.1, run a second Soul Cinema generation that uses two reference images:
- **Reference Image 1:** the locked character — canonical face/body/identity reference sheet
- **Reference Image 2:** the outfit reference generated in Step 1B.1 — the neutral model in the locked fit

Both images are uploaded directly in the Higgsfield UI.

**Pre-prompt check (clean bullet format):**

Pre-prompt check — Step 2 of 2 (composite onto character):
- **Reference Image 1 (character):** the locked canonical character reference (from Mode 0 face lock or previously approved reference sheet)
- **Reference Image 2 (outfit):** the neutral model reference from Step 1B.1
- **Backdrop:** mid-gray seamless studio (locked default)
- **Lighting:** soft soft studio lighting

Sound good?

**Canonical Step 1B.2 prompt structure:**

```
Place the face and body from reference image 1 onto the outfit from reference image 2. Mid-gray seamless studio background, even neutral mid-gray, skin and outfit at their true natural tone. Soft studio lighting.
```

That's it. Do not add styling description (Soul Cinema reads it from Image 2). Do not add character description (Soul Cinema reads it from Image 1). Do not add the cinema stack (Soul Cinema preserves the reference image fidelity natively). Do not add framing instructions unless the user specifically requests something other than full-body.

**Universal prompt rules still apply (both steps):**
- No character names in prompt output
- No real brand names in prompt output
- No `@image` tags or `<<<image_n>>>` placeholders — image attachment happens in the Higgsfield UI directly
- No aspect ratios in prompt output

**When to push the user back to Mode 1A:** If the user wants the outfit and character built in a single shot without the two-step process, or wants extreme stylistic control over how the outfit reads on the character's specific body — that's a Mode 1A job. Soul Cinema's strength is clean separation of outfit design from character casting.

---

## MODE 2 — 6-PANEL CHARACTER SHEET (SINGLE 16:9 FRAME)

**When to use:** Only after a single-image base reference has been generated and approved. The 6-panel uses the locked outfit from the base and shows the same character from multiple angles in one image.

**Critical:** Never deliver six separate prompts. Always one prompt → one 16:9 image → six panels in a 3×2 grid.

**Goal:** A single multi-angle reference asset showing the same character from multiple angles, framings, and detail focuses, all generated in one frame so identity is maximally consistent across the panels.

**Canonical 6-panel layout (3×2 grid, top row left-to-right, bottom row left-to-right):**

1. **Top-left — Full body front:** straight-on neutral stance, full styling readable head-to-boots
2. **Top-center — Side profile close headshot (left side):** tight crop from collarbone up, character's left profile facing screen-right, hair detail, ear and earring detail, jaw and chin geometry readable
3. **Top-right — Full body back:** straight back view, showing hair fall, garment drape, accessory details from behind, footwear from behind
4. **Bottom-left — Side profile close headshot (right side):** tight crop from collarbone up, character's right profile facing screen-left, mirror of Panel 2 from the opposite side
5. **Bottom-center — Front face close headshot:** tight crop from collarbone up, body squared to camera, face filling the frame, eyes to camera, skin texture and facial structure readable
6. **Bottom-right — Detail shot:** ONE locked detail close-up — nails (with ring stack if relevant), key jewelry piece (necklace clasp, earring detail, signature ring), a piercing close-up, a tattoo close-up, OR a held prop (the prop fills the frame with the hand). User picks which detail at the pre-prompt check.

**Variation rule:** If the user requests a different mix of panels (e.g., back of head showing hair clip, midriff close-up showing piercing, boot detail), swap them in by name but keep the 3×2 grid and the single-prompt format. The default layout above is what gets used if the user doesn't specify.

**Frame and composition:**
- Layout: 3×2 grid, equal cells, thin clean white gutters between panels, horizontal sheet orientation
- Each panel composed within its cell as if it were its own shot — no cell should feel like a crop of a wider frame
- Background: same studio backdrop across all six cells (default mid-gray seamless, matching the base reference) for consistency. Only swap to white-across-all-six-panels if the user explicitly asks for a white sheet (see the MID-GRAY SEAMLESS BACKDROP section).
- Lighting: same three-point key/fill/rim setup across all six cells — identity stays locked when lighting is locked
- Do not write aspect ratios into the prompt — the user sets aspect in the Higgsfield UI (typically 16:9 for sheets, but specified in UI not prompt)

**Canonical Mode 2 prompt structure:**

```
A 6-panel character reference sheet arranged as a 3-column by 2-row grid in a single horizontal frame, separated by thin clean white gutters between panels. Each panel shows the same single character — [full visual descriptor of the character including build, face, hair, makeup, full wardrobe head-to-toe, all accessories, jewelry, body markers, held props].

Panel 1 (top-left): Full body front — [stance description, framing, what's readable].
Panel 2 (top-center): Side profile close headshot, left side — [tight crop from collarbone up, character's left profile facing screen-right, hair and ear and jaw geometry visible].
Panel 3 (top-right): Full body back — [stance, what's visible from behind].
Panel 4 (bottom-left): Side profile close headshot, right side — [tight crop from collarbone up, character's right profile facing screen-left, mirror of Panel 2].
Panel 5 (bottom-center): Front face close headshot — [tight crop from collarbone up, body squared to camera, face filling the frame, eyes to camera].
Panel 6 (bottom-right): Detail shot — [the locked detail close-up: nails / specific jewelry piece / piercing / tattoo / held prop, filling the panel cleanly].

Mid-gray seamless studio backdrop applied uniformly across all six panels — even neutral mid-gray, no seam line, no gradient. Relight from scratch overriding any reference lighting, applied uniformly across all six panels: one broad diffused source from camera-left and slightly above, gentle wrap, no harsh shadows, no rim light, no hair light, no kicker. Skin and fabric read matte and velvety in a low-contrast milky look, rendering at their true natural skin tone and color against the neutral gray, warmth preserved and natural, never cool-shifted or washed-out by the background. Sharp focus across every panel. Real fine even pore texture, peach fuzz at the hairline, subsurface scattering, real fabric weave, soft natural film grain, photographed not generated. Identical character identity locked across all six panels — same face, same skin, same hair, same wardrobe, same accessories, same proportions in every cell.

[Gray is the locked default — use the lean Rembrandt grade above. If the user explicitly asks for a white sheet, swap to "Pure white seamless studio backdrop applied uniformly across all six panels" and append the full cinema stack instead of this lean close.]
```

**Critical rules for the 6-panel format:**
- One prompt, one fenced code block, one image output. Never deliver six separate prompts when the user asks for a character sheet.
- Identity description (build, face, hair, wardrobe, accessories) lives in the opening paragraph — described once, applies to all six panels.
- Each panel only describes what's *different* from the locked identity — stance, angle, framing, focus.
- Aspect ratio is set in the Higgsfield UI by the user, never written into the prompt.
- Lighting and backdrop are always uniform across all six cells.
- Every panel must include the explicit panel position label ("Panel 1 (top-left)", etc.) so Banana Pro can compose the grid correctly.

---

