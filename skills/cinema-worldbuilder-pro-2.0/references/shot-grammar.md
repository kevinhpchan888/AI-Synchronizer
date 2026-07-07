## UNIVERSAL PROMPT RULES (ALL MODES)

These apply to every Seedance prompt this skill produces, no exceptions:

1. **Pre-prompt confirmation on every new scene.** Bulleted list (References / Mode / Scene / Characters / Frame Map / Camera / Runtime), references FIRST, runtime LAST. Skip only on iterations of a prompt just delivered.
2. **Three-part delivery format, in order:** (a) numbered bulleted reference list, (b) bolded English title line with runtime, (c) English code block with discrete labeled blocks and inline `@imageN` tags.
3. **`@imageN` numbering matches the bullet list order exactly.** Bullet 1 → `@image1`, bullet 2 → `@image2`, etc.
4. **Every reference in the bullet list appears at least once as an `@imageN` tag** inside the code block.
5. **Runtime baked into the closing Camera Capture line.** Always ask runtime; never default. The runtime in the title line above the code block must match the runtime in the Camera Capture line inside it.
6. **Per-shot timing inline in Movement** for any multi-cut sequence ("Shot 1 (0–6s): ... Hard cut to Shot 2 (6–10s): ...").
7. **Discrete labeled blocks inside the code block, in this exact order, every prompt, no exceptions — HARD LOCK:** Scene & Mood → Frame Map → Subject Lock(s) → Cross-Frame Rules → Movement → Last Frame → World Plate → Sound Bed → Capture Realism → Camera Capture. This order never changes. No block may be omitted, reordered, merged, renamed, or replaced with flowing prose. Every block ships with its label prefix (e.g. `Scene & Mood:`, `Frame Map:`, etc.). Single-shot, multi-shot, narrative, studio, action, performance, atmospheric — all ten blocks, all in this order, every time. The only conditional content is *inside* a block (the `[IF WET: ...]` clause in Capture Realism drops on dry scenes; the human-skin sentence in Capture Realism drops on M5 no-humans plates) — the block itself still ships with its label. If a block has nothing to say for the scene, the block is still present and its content is shortened, never omitted.
8. **One Subject Lock block per character.** When multiple characters share the frame, each gets its own discrete Subject Lock block — never jammed into one paragraph.
9. **One Camera Capture line at the bottom — never doubled.** The Camera Capture is the only camera/grade/film stock language anywhere in the prompt. No discrete `Camera:` block in the middle of the body.
10. **No character names in prompt output.** Describe by hair color, wardrobe, identity markers. The `@imageN` tag handles reference anchoring.
11. **No real brand names in prompt output.** Generic visual descriptors only ("white low-slung mid-engine sports car," not specific brand names).
12. **No platform/tool names in prompt output.** Never reference "Higgsfield," "Seedance," "Banana Pro," "Soul Cinema," etc. inside the prompt text.
13. **No internal production context.** No "carried through the world," no "matching the previous scene," no "as established earlier." Every prompt is standalone.
14. **Pure visual description only.** No meta-commentary. Every word describes a visible thing in the frame.
15. **Diegetic audio only** — no music, no lyrics, no song references in the Sound Bed.
16. **Energy over position** in the Scene & Mood block. Describe what bodies and forces are doing dramatically. Frame Map handles the geometric specifics.
17. **Cut triggers.** Use "Hard cut to," "Smash cut to," "Match cut on" to signal edits inside multi-shot prompts. Auto-edit on by default.
18. **Age-blind.** Never describe characters by age. Describe by role, hair, wardrobe, and identity markers.
19. **No on-screen text by default.** Never write captions, subtitles, slogans, signage typography, speech bubbles, UI overlays, or rendered text into a Seedance prompt unless the user has explicitly asked for on-screen text. To suppress Seedance's tendency to hallucinate text, every prompt's Last Frame block closes with: "No on-screen text, no captions, no signage typography, no rendered text in the frame." Skip the suppression only when the user has explicitly requested in-frame text.
20. **Positive locks over negative prohibitions.** Translate "no drifting" into "boots stay planted on the same ground marks." Translate "don't change face" into "@image1 keeps the same face, hair, wardrobe, and silhouette throughout." Negative prompts have weaker pull than positive constraints.
21. **One main idea per shot.** One dominant action, one main camera strategy, one major lighting motivation. If a request requires more, split into a multi-shot sequence.
22. **Trust the reference image for wardrobe.** The Subject Lock block names identity anchor, body orientation, pose, state, gaze, contact points, and the lock-down line. Do not re-describe wardrobe details that are already visible in the reference. Only specify the wardrobe details that the model cannot read from the image (e.g., "damp from rain," "torn at the shoulder," "covered in dust") — text-only state information the reference image can't convey.
23. **Canonical reference always attached, never substituted by the plate.** Every named subject that appears in the scene gets its canonical reference (character reference sheet, vehicle reference, prop reference, creature reference) attached as its own `@imageN` slot — even when that subject is also visible inside the rendered environment plate. The plate carries the world (location, weather, light, set dressing, composition); the canonical reference carries identity (face, body, livery, markings, silhouette). Never let the plate stand in for a canonical reference. Subject Locks anchor to canonical reference tags (`@image1`, `@image2`, etc.); the World Plate block anchors to the plate tag (`@imageN`). Hard rule, no exceptions: if a character or vehicle appears in the plate AND has a canonical reference, the canonical reference still gets its own slot in the reference list and its own Subject Lock block in the prompt. This applies regardless of how clearly the subject reads in the plate. Identity fidelity is always anchored to the canonical reference, never to the rendered plate.

---

## READING REFERENCE IMAGES

When the user uploads reference images, extract everything visible in the frame by **visual description only** — never use names, never invent details that aren't in the image. The extracted reading is for Claude's own understanding and the pre-prompt check. The actual prompt body trusts the reference image and only restates what the image cannot carry.

**For each character in the reference, capture:**

- **Hair:** color (every nuance), length, style, texture, parting, styling, accessories
- **Makeup:** skin finish, brow shape and density, eye treatment, lashes, lip register, cheek treatment, any face jewelry, freckles or beauty marks **only if visible**
- **Wardrobe:** every garment top to bottom — fabric, color, fit, structural details, neckline, sleeve length, hem position, layering
- **Jewelry & accessories:** every piece — earring style, necklace count and material, rings, bracelets, body chains, belts, bag, sunglasses, watch
- **Body markers:** piercings, tattoos, nail length and color (only if visible)
- **Pose and energy:** body angle, weight distribution, hand position, expression register

**For each environment in the reference, capture:**

- **Location:** interior or exterior, architecture, materials, scale
- **Time of day and weather:** lighting direction, quality, color temperature, sky, atmospheric conditions
- **Set dressing:** every visible object that shapes the world
- **Color palette:** dominant tones, accent colors, contrast structure

**Naming rule (absolute lock).** NEVER use proper names in the prompt output. Refer to every character by visual description only.

**No-invention rule.** If the user gives you a reference image and asks for the same character in a new scene, do not invent wardrobe or styling details that aren't in the image or specified in the request.

**Trust-the-reference rule.** Once a character's wardrobe and identity are anchored to an `@imageN` tag, the Subject Lock block in the prompt body does NOT re-describe every garment in detail. The lock-down line ("face, hair, wardrobe, and silhouette identical throughout") closes the block. Only state-changes the image can't carry (damp, dirty, torn, wet, dusty, bloodied) get spelled out.

**Canonical-over-plate rule (HARD LOCK).** Every named subject that appears in a Seedance scene gets its canonical reference attached as its own `@imageN` slot — even if that subject is also visible in the rendered environment plate. Characters, vehicles, props, creatures, animals — anything with locked identity that needs to hold across the cut gets its dedicated reference, no exceptions. The plate carries the world (location, weather, light, set dressing, composition); canonical references carry identity (face, body, livery, markings, silhouette). The plate is never a substitute for a canonical reference, and a subject's visible presence in the plate never reduces or removes the requirement to attach its canonical reference. If a character's reference sheet exists, attach it. If a vehicle's canonical reference exists, attach it. Subject Locks anchor to the canonical reference tag; the World Plate block anchors to the plate tag. This is the rule that prevents identity drift between the plate and the rendered Seedance output.

---

## FRAME MAP

Every Seedance prompt includes a Frame Map block that anchors every subject in screen space before motion enters the picture. Think of the Frame Map as the floorplan of the shot — where everything sits when the camera rolls.

**Treat the frame as 2D screen space:**

- **Horizontal:** left third / center / right third — or x% precision (0% = left edge, 50% = center, 100% = right edge)
- **Vertical:** upper third / center / lower third — or y% precision
- **Depth:** foreground / midground / background
- **Frame occupancy:** close-up / medium / full body / waist-up / chest-up / extreme close-up — or % of frame height
- **Negative space:** what stays empty, where the empty space sits, what fills it (atmosphere, environmental detail, distant elements)

**Single-subject example:**

> Frame Map: @image1 anchored in the left third, x=30%, foreground, medium shot from waist up, occupying 55% of frame height. The right two-thirds hold wet street and distant neon signage as negative space.

**Two-subject example:**

> Frame Map: @image1 in the left third, x=28%, foreground. @image2 in the right third, x=72%, midground, slightly deeper. The center holds open as tense negative space between them. Neither crosses the central vertical axis.

**Multi-shot example:**

> Frame Map: Shot 1 (0–6s) — wide two-shot. @image1 in the left third, x=32%, foreground, bent at the waist. @image2 in the right third, x=68%, midground, leaning against @image3. Shot 2 (6–10s) — low-angle close-up at hip height looking up at the side window, framed tight on @image1's reflection in the wet glass.

**When to skip percentages:** for clear classical compositions (centered single, OTS, profile two-shot, symmetrical wide), use film language without percentages. Coordinates earn their place when the composition is asymmetric, tightly blocked, or character drift would visibly break the shot.

---

## SUBJECT LOCK

Every character in the frame gets a Subject Lock block. The Lock pins every property that needs to stay stable across the runtime — pose, gaze, contact points, state — without re-describing what the reference image already carries.

**Properties to pin per character:**

- **Identity anchor:** which `@imageN` carries the face, hair, wardrobe, silhouette
- **Body orientation:** facing camera / profile left / profile right / three-quarter toward screen-right or screen-left / back to camera
- **Pose:** the specific physical posture (standing, kneeling, leaning, seated, walking, bent at the waist, hands raised, hand resting on X)
- **State:** emotional register described by what the body and face physically do — never abstract feelings
- **Expression:** lips, eyes, brow, jaw register
- **Gaze direction:** looking at @imageN / looking screen-left / looking screen-right / looking offscreen toward X / locked on camera (rare)
- **Contact points:** where the body physically touches the world — feet on which surface, hand on which object, body part against which surface
- **State-change details the image can't carry:** damp, dirty, torn, wet, dusty, bloodied
- **Lock-down line:** "face, hair, wardrobe, and silhouette identical throughout"

**Single-character example:**

> Subject Lock — @image1: Face, hair, oxblood corset, and silhouette identical throughout. Ponytail damp from the drizzle, fabric darker where rain has soaked in. Bent at the waist, torso angled toward the side window of @image3, both hands raised to her ponytail at the crown, fingers smoothing strands. Body squared to the car, weight even. Gaze locked on her own reflection in the wet glass.

**Multi-character example:** each character gets a discrete Subject Lock block.

> Subject Lock — @image1: [block for first character]
>
> Subject Lock — @image2: [block for second character]

Never jam multiple characters into one Subject Lock paragraph. The discrete blocks make iteration easier and give Seedance cleaner anchoring.

---

## CROSS-FRAME RULES

When two or more characters share the frame, the Frame Map and Subject Lock blocks aren't enough on their own — the relationships between characters need their own explicit rules. Otherwise Seedance will sometimes swap them, cross them, drift their distance, or collapse their depth separation as the shot runs.

**Rules to specify for every multi-character shot:**

- **No swap:** characters never trade screen positions
- **No center crossing:** characters never cross the central vertical axis (unless an action demands it, in which case state the crossing with timing)
- **No depth change:** characters hold their depth layer throughout
- **Distance consistency:** the gap between them stays constant
- **Screen sides held:** left character stays left, right character stays right
- **Eyelines:** who looks at whom, and whether the look holds or breaks
- **Carry-across-the-cut:** for multi-shot sequences, name what holds when the camera cuts

**Standard language:**

> Cross-Frame Rules: @image1 and @image2 never swap positions, never cross center, never change depth. Distance, screen sides, eyelines, costumes, and silhouettes stay consistent across the full runtime.

**Multi-shot variant:**

> Cross-Frame Rules: @image1 holds her position at the side window across the full runtime of Shot 1. @image2 holds her lean at the rear quarter panel across Shot 1. In Shot 2 only the camera changes — @image1's position holds.

**When characters do need to cross:** state the crossing explicitly with timing. "At 4 seconds, @image1 steps across the central axis from the left third into the center. After 5 seconds, the new blocking holds: @image1 in the center foreground, @image2 unchanged in the right third midground."

---

## MOVEMENT

Movement in a Seedance shot is layered, not unified. The Movement block describes what happens across the runtime in flowing paragraph form, but the four layers — character motion, micro-motion, environmental motion, camera motion — should all appear in the description.

**The four layers (write them in this order in the paragraph):**

1. **Character motion** — what the subjects physically do across the runtime, with per-beat timestamps
2. **Micro-motion** — what moves on the body while the dominant action plays out (breath, hair, fabric, jewelry)
3. **Environmental motion** — what the world does around the subjects (rain, smoke, dust, traffic, wind, particles)
4. **Camera motion** — only when not already covered in the Camera Capture line; usually omitted from the Movement block since the Camera Capture handles it

**Single-shot example:**

> Movement: She takes one slow controlled step from the curb to the street across the first two seconds, then holds for the remaining eight. Ponytail catching subtle wind drift, parachute pants fabric rustling on the step, breath visible in the cold air on a controlled exhale, fingers flexing once inside her front pockets. Light cold rain falling at moderate density, neon reflections shimmering on the wet asphalt, distant taxi headlights moving slowly through the right midground, faint steam rising from a manhole grate behind her.

**Multi-shot example:**

> Movement: Shot 1 (0–6s) — @image1 smooths her ponytail at the crown, fingers working through strands. @image2 watches her with a soft closed-lip smile across the first three seconds, exhales a short scoff at 3 seconds, then turns her head slowly away toward the horizon screen-right and holds. Rain drizzles steadily, damp hair on both catches subtle wind, faint mist off the warm hood. Hard cut to Shot 2 (6–10s) — low-angle close-up looking up at the side window. Her eyes flick down and to the side once at 7 seconds — a single controlled eye roll — then return to her reflection. Hands resume smoothing the ponytail. Rain streaks roll down the wet glass naturally across the full close-up.

**Critical rule:** never tangle the four layers. Each one named explicitly in the paragraph, even when one layer is "no motion" or "nothing else moves in the frame." Saying nothing moves is a directive; absence is not.

---

## LAST FRAME

Every prompt closes with a Last Frame block specifying the exact composition the shot lands on at the end of the runtime. Seedance reads it as a target and structures the motion of the shot to deliver that closing image.

**What goes in the Last Frame block:**

- Where each character sits at the close (carries the Frame Map forward to the end)
- Their final pose / state / gaze
- What the camera is showing in focus
- What's in negative space at the close
- The visual punctuation — what the viewer's eye lands on
- **On-screen text suppression line:** "No on-screen text, no captions, no signage typography, no rendered text in the frame." (skip only when text is explicitly requested)

**Strong examples:**

> Last Frame: Hold on her in the left third, eyes still tracking the now-passed taxi offscreen right, ponytail settling, rain visible on her shoulders, the center of the frame filled with empty wet street and reflected neon, taxi taillights fading at the right edge. No on-screen text, no captions, no signage typography, no rendered text in the frame.

> Last Frame: The camera holds tight on her face in the right third, eyes wide and steady, lips slightly parted on a held breath. Her opponent is fully out of frame on the left, leaving the left two-thirds of the frame as soft-focus rain and distant lit windows. No on-screen text, no captions, no signage typography, no rendered text in the frame.

**Last Frame is mandatory.** Every prompt closes with this block.

---

## WORLD PLATE

The World Plate block names the location, time of day, weather, set dressing, and atmospheric quality — anchored to a reference image when one is attached, or built from text when none is.

**Properties to specify:**

- **Location:** anchored to @imageN if a plate is attached; otherwise built from text
- **Time of day and weather:** lighting direction, quality, color temperature, sky, atmospheric conditions
- **Set dressing:** specific objects that shape the world (vehicles, signage, debris, vegetation, props, crowd)
- **Color palette:** dominant tones, contrast structure
- **Atmospheric quality:** haze density, particle suspension, weather intensity

**Single-shot example:**

> World Plate: Anchored to @image4 — cliffside overlook with low grass and exposed rock at the edge, the drop falling away behind @image3, dusk sky dropping from cool blue at top into deep magenta and warm tungsten residue at the horizon, distant clouds, light atmospheric haze. @image3 parked perpendicular to the cliff edge, paint slick with rain, side windows wet, faint mist off the warm hood.

**Text-only example (no plate attached):**

> World Plate: Midtown New York City street at 3 AM — wet black asphalt, mixed neon signage in magenta and cyan reflected across the puddles, distant traffic lights cycling, sparse pedestrian foot traffic far in the background. Light cold rain at moderate density. Steam rising from grates.

---

## SOUND BED

The Sound Bed describes **only what the scene physically produces** — sounds that exist within the world of the frame. Never reference music, lyrics, song names, soundtrack cues, or score. If the user wants music in the final cut, they upload the track as a separate audio reference inside Higgsfield.

**Allowed in the Sound Bed:**

- Footsteps (specify surface — wet pavement, gravel, polished floor, wood)
- Fabric movement (rustle, swish, whip on motion)
- Breath and breathing (steady, ragged, held, sharp inhale)
- Body sounds (hand on skin, grip on metal, jewelry chime)
- Object sounds (door, glass, paper, ceramic, metal, electronics, weapon mechanisms)
- Environmental ambient (room tone, wind, rain, traffic hum, distant horns, subway rumble, bird call, water, fire crackle)
- Mech / sci-fi diegetic (servos, weapon charging hum, pulse fire impact, alien screech, debris fall)
- Crowd diegetic (cheering, screaming, gasps, light stick taps, footsteps in unison)
- Stage diegetic (laser strobe hum, microphone handling noise, in-ear monitor cable rustle, stage floor creak, haze machine hiss)
- Weather and atmosphere (rain on lens, wind through structures, distant thunder, snowfall hush)

**Never in the Sound Bed:**

- Song names, artist names, album names
- Lyrics, sung vocals tied to a track
- "Music plays," "soundtrack swells," "song builds"
- Score descriptors (orchestral, synth pad, dramatic strings)
- Specific genre cues (hip hop beat drops, rock guitar)

**Audio modes (pick one based on user intent — ask if ambiguous):**

- **Mode 1 (default) — Diegetic with SFX and ambient.** Realistic in-scene audio. `Sound Bed: Diegetic only — [list of specific sounds], no music, no dialogue except what is physically spoken in frame.`
- **Mode 2 — Silent capture.** Used only when the user explicitly says they will upload music in post AND wants NO in-camera audio fighting it. `Sound Bed: NONE — fully silent capture. The audio track will be added separately in post.`
- **Mode 3 — Diegetic with SFX, no music explicitly.** Same as Mode 1, just confirming no music will be added. `Sound Bed: Diegetic only — [list of specific sounds], no music, no dialogue, no soundtrack.`

Mode 1/3 is the default. Use Mode 2 only when the user explicitly says they're adding a music track in post AND wants the video silent.

**Sound Bed example:**

> Sound Bed: Diegetic only — boots on wet pavement, fabric whip on movement, sharp inhale, distant traffic hum with layered horns, faint subway rumble below grade, rain hiss against the lens, wind cutting between buildings, no music, no dialogue except what is physically spoken in frame.

---

## CAPTURE REALISM BLOCK (LOCKED — THE REAL-FOOTAGE ENGINE)

This is the block that makes a shot read as real cinema capture instead of AI video. The Camera Capture line below names the *gear*; this block names the *physics* — the four mechanics that, in practice, are what separate footage that looks photographed from footage that looks rendered. It sits second-to-last in the block order, immediately before Camera Capture, and ships on every prompt unless the user explicitly asks for a glossy, clean, or commercial register.

**Why it exists:** the most common AI-video failure isn't bad framing or wrong lens — it's the over-contrasty, over-plastic look. That look comes from three things the model does by default: it invents flat single-plane staging (no air between subject and background), it renders moisture and skin as glossy/specular, and it over-renders contrast cues into clipped highlights and crushed blacks. This block attacks all three at the source. It is the codified, repeatable version of what hand-written one-off prompts had to spell out from scratch.

**The four mechanics — every Capture Realism block tunes all four to the scene.** Mechanic 1 (depth via suspended atmosphere) is default-on in every mode that has planes to separate — M1, M3, M4, and M5 always; M2 studio when there's any depth to read. It is the primary lever against the flat, over-contrasted, plastic look and should be scaled (thin/light/heavy) rather than dropped. Mechanics 2–4 tune or drop per scene as noted below.

**1. Depth via suspended atmosphere between planes.** This is the single biggest lever for real-camera depth. State that atmosphere — haze, mist, air density, particulate — is *suspended in the air between the camera, the subject, and the background*, forcing the model to render distant planes softer, desaturated, and lower-contrast than the foreground. This is what makes a subject sit *inside* the depth of the frame rather than pasted onto a flat backdrop. Always tie it to the actual planes in this shot (foreground subject / midground / far background element).

**2. Moisture without shine (only if the scene is wet/humid/sweaty).** The default AI failure on any wet scene is glossy beads and specular sheen, which instantly reads CGI. If the scene has moisture of any kind, state it as *present but matte* — surfaces are damp, not beaded; wet but not glossy; moisture that mutes and saturates without producing a single specular hotspot. Damp matte hair, slight moisture on skin that stays matte, wet ground with muted (not mirror) reflection, wet paint that stays matte not showroom. If the scene is bone-dry, skip this mechanic entirely.

**3. Per-zone specular kill on skin — and the flattering ceiling.** "Matte skin" is too vague to hold. Name the zones individually: zero shine on forehead, zero shine on nose bridge, zero shine on cheekbones, zero shine on temples, zero shine on chin, zero shine on collarbones. The blown specular hotspot on a nose bridge or cheekbone is *the* AI-skin tell — naming each zone kills each hotspot. Pair it with the biology cues: real peach fuzz at jaw and hairline, real soft pore texture, light absorbed like true subsurface scattering, warmth preserved (slightly desaturated is fine, washed-out/pale/cool-shifted is not). **The flattering ceiling is locked on every face:** the texture is fine, soft, and even — never harsh, severe, or unflattering. No acne, no blemishes, no prominent spots, no scarring, no enlarged/cratered/rough pores, no brutal clinical macro-detail. Realism never makes a face look ugly. Matte carries the anti-plastic; fine-and-even carries the flattering; both run together, and any tension resolves toward flattering.

**4. Contrast curve stated three ways.** Over-contrast is the headline complaint, so attack it from three angles in the same block: (a) the tonal curve — shadows lifted gently, highlights rolled off softly, nothing clipping to pure white or crushing to pure black; (b) specular removal — all specular highlights surgically removed from skin, hair, fabric, and surfaces, every pixel reading matte and diffuse; (c) the grade — low-contrast, slightly desaturated, warmth preserved. Three statements of the same intent is what holds it; one statement gets overridden by the model's default contrast bias.

**Canonical Capture Realism block (tune every bracket to the scene):**

```
Capture Realism: [Foreground subject] sits inside real depth — [thin/light/heavy] atmosphere suspended in the air between camera, subject, and [the far background element], the background rendered softer, desaturated, and lower-contrast than the foreground so the figure sits within the air rather than pasted on a flat plane. [IF WET: Slight moisture has settled on every surface — damp matte hair, slight moisture on skin holding fully matte with no beading and no wet sheen, [wet ground with muted reflection / damp matte fabric / car paint damp but matte not showroom], moisture that mutes and deepens without a single specular hotspot.] Skin reads true cinematic matte — zero shine on forehead, nose bridge, cheekbones, temples, chin, and collarbones, real peach fuzz catching light at the jaw and hairline, real soft fine even pore texture, light absorbed like true subsurface scattering, warmth preserved and natural, slightly desaturated but never pale or washed-out or cool-shifted, never plastic, never doll-skin, never AI-rendered, and never harsh — no acne, no blemishes, no enlarged or rough pores, fine flattering texture that keeps the face looking good. Low-contrast curve — shadows lifted gently holding texture, highlights rolled off softly never clipping to white, nothing crushed to black. All specular highlights surgically removed from skin, hair, fabric, and surrounding surfaces, every pixel reading matte and diffuse. Slightly desaturated grade with warmth preserved.
```

**Tuning notes:**
- **Dry scenes:** delete the entire `[IF WET: ...]` sentence. Don't force moisture into a dry environment.
- **No humans (M5 / pure environment plates):** drop the skin sentence entirely. Keep mechanics 1 and 4 (atmosphere-between-planes and the contrast curve), and apply the matte-not-glossy logic to environmental surfaces (wet concrete, metal, glass) instead of skin.
- **Studio / M2 editorial:** if the user wants the *crafted* glossy editorial look, this block is reduced or skipped — M2 is the one mode where controlled specular (intentional highlight bloom on chrome/rhinestone) is intentional. Use judgment; ask if unsure.
- **Atmosphere density** scales with the scene: "thin atmosphere" for a clear interior, "light haze" for most exteriors, "heavy suspended mist" for a moody pre-dawn or a destroyed-city plate. The denser the air, the stronger the depth separation.
- **This block does not name gear, grade hex, frame rate, or runtime** — that all stays in Camera Capture. No overlap. Capture Realism is physics; Camera Capture is hardware.

**Relationship to the negative→positive rule:** this block leans positive ("reads matte," "lifted gently," "warmth preserved") rather than piling negatives, but the specular-kill and the anti-plastic clauses are the sanctioned exception — like the on-screen-text suppression, the "no shine / no plastic / no beading" phrasings are known-failure-mode suppressions that earn their place. Keep them tight; don't let the block balloon into a wall of negatives.

---

## CAMERA CAPTURE

The Camera Capture is the single closing line of every Seedance prompt. It contains body, lens, filter, movement, stock, grade, frame rate, and runtime — all in one trimmed paragraph.

**This is the only camera/grade/film stock language anywhere in the prompt.** No discrete `Camera:` block in the middle of the body. No double specification. The Camera Capture line carries it all.

**Default camera energy is handheld with breath, drift, and organic operator movement** — even in editorial / quiet / observational moments. The lived-in operator presence is part of the cinema register.

**Locked-off tripod is OPT-IN ONLY** — used only when the user explicitly requests "locked off," "tripod," "no camera movement," "static," "still camera," or names a specific shot type that requires it (overhead surveillance plate, surgical observation, security cam aesthetic, formal portrait studio plate).

---

