## UNIVERSAL PROMPT RULES (ALL MODES)

These apply to every prompt this skill produces, no exceptions:

1. **No character names in prompt output.** Describe by hair color, wardrobe, identity markers extracted from references or the locked development spec.
2. **No real brand names in prompt output.** Generic visual descriptors only.
3. **No `@image` tags or `<<<image_n>>>` placeholders.** Image attachment happens in the Higgsfield UI directly. The prompt is text-only.
4. **No internal production context.** No "carried through the world," no "matching the previous scene." Every prompt is standalone and self-contained.
5. **Pure visual description only.** No meta-commentary about why the shot is framed that way, no references to the medium ("this is the still," "what the photo looks like"), no emotional intent ("the read is..."). Every word describes a visible thing in the frame.
6. **No teeth-showing smiles** unless the user explicitly requests one. Default expressions are model face-card neutral, subtle controlled, slight closed-lip smirk at most.
7. **No negative prompts.** This skill does not output negative prompt blocks. Higgsfield workflow doesn't use them.
8. **Cinema stack baked in for Modes 0, 1, 2, 4, 5.** The cinema stack closes every Mode 0, 1, 2, 4, and 5 prompt (with Step 1B.1 outfit reference using the lighter close documented in that section, and Mode 5 using its own locked lean prompt). Mode 3 is the exception — see rule 9.
9. **Mode 3 uses the cinema-prose closing paragraph in place of the cinema stack AND locked tag block.** Mode 3 scene plates (3A and 3B) close with the cinema-prose paragraph documented under "THE CINEMA-PROSE REGISTER" — the full look described in plain language (wide-latitude cinema capture, vintage anamorphic character, light diffusion bloom, color-negative film rendition with 35mm grain, never brand or model names), real anamorphic optical character (oval bokeh, handheld breath, edge falloff), theatrical fine grain, contemporary teal-amber grade with shadow/highlight handling, and the closing realism clause ("Real photographic frame captured on a real cinema camera... no CGI, no plastic, no AI smoothness, no skin smoothing"). This closing paragraph replaces the cinema stack AND the old locked tag block for Mode 3. The old tag block remains documented as a deprecated fallback only.
10. **Single fenced code block on output.** Deliver the full prompt as one continuous code block ready for clean copy-paste — no preamble or postamble unless the user explicitly asks for a breakdown. (The pre-prompt confirmation is its own short message before the code block — that's not preamble inside the code block.)
11. **Pre-prompt confirmation, always — except minor iteration on an approved prompt.** Every full prompt is preceded by a bulleted "here's what I'm about to prompt, sound good?" check. **References listed first**, then character, outfit, backdrop/environment, framing. Wait for the green light. Exception: if the user requests a minor tweak to a prompt already approved and delivered in this thread (framing shift, pose change, repositioning, single wardrobe swap, lighting nudge), skip the check and deliver the revised prompt directly. New characters, full outfit swaps, new modes, or new scene types still trigger a check.
12. **No aspect ratios in prompt output.** Never write "3:4 vertical aspect ratio," "16:9 horizontal," "21:9 cinematic," "4:5 portrait," "2.39:1," or any other ratio spec inside the prompt body. The user sets aspect ratio in the Higgsfield UI directly. The prompt describes framing in plain language only ("full body," "chest-up portrait," "wide establishing shot," "medium two-shot") — never with a numerical ratio.

---

## INVENTORY EXTRACTION CHECKLIST (run silently before composing)

Before writing the final prompt, silently catalog:

- [ ] Mode selected (0 face lock / 1 single-image outfit / 2 six-panel / 3A character scene / 3B environment plate / 4 GPT-2 / 5 outfit replacement) and rationale
- [ ] Every uploaded reference image identified and listed by short visual descriptor (this becomes the first bullet of the pre-prompt check)
- [ ] If Mode 0: text spec for the new character is locked and approved, tool fork has been presented (Banana Pro / GPT-2 / Soul Cinema), user has picked, and the locked baseline wardrobe (plain black camisole for women, plain black ribbed tank for men) is included in the prompt. If Soul Cinema picked, running Step 0.1 (Soul Cinema face plate) before Step 0.2 (Banana Pro 3:4 headshot).
- [ ] If Mode 1: a Mode 0 face lock exists for the character (if new), OR a locked character reference exists (if existing)
- [ ] If Mode 2: a Mode 1 base outfit reference exists and is approved (if not, stop and build the base first)
- [ ] If Mode 4: user explicitly asked for face/chest-up and confirmed GPT-2
- [ ] If Mode 5: two reference images uploaded — outfit reference (becomes @image1) and character reference (becomes @image2), order confirmed with the user
- [ ] Every character described by visual markers only (hair, makeup, wardrobe, jewelry, body markers, pose, expression)
- [ ] If Mode 3: environment described as ambience (not architectural enumeration) — world plate reference carries geometry
- [ ] If Mode 3: matching cinema mode identified (M1/M2/M3/M4/M5) and woven into Paragraph 5 camera spec
- [ ] If Mode 3: subject placed in frame with positional prose (not X/Y coordinate notation) — rule-of-thirds anchored, not dead-center unless explicitly motivated
- [ ] If Mode 3: resolution-aware detail check passed — every visible detail is something the camera at this distance, lens, motion, and lighting can physically resolve; anything the camera couldn't see is dropped
- [ ] If Mode 3: prompt follows the FIVE-PARAGRAPH PROSE STRUCTURE (Opening shot / Character / World / Subject anchor / Camera spec + finish) — no labeled blocks in output
- [ ] If Mode 3: closing realism clause is in place (full camera package + M-mode + "Real photographic frame... no CGI, no plastic, no AI" quality filter)
- [ ] Pose, body angle, expression register chosen
- [ ] No names, no brands, no internal context, no meta-commentary
- [ ] Cinema stack will close the prompt (for Modes 0, 1A, 2, 4; with Mode 1B Step 1 using lighter close; Mode 5 using its locked lean prompt; Mode 3 using the cinema-prose closing paragraph)
- [ ] Pre-prompt confirmation delivered and confirmed — references listed FIRST in the bullet list

If anything needed for composition is missing from the user input, ask before writing.

---

## WHEN THE USER ASKS FOR A PROMPT

The flow is always: **confirm character → confirm what's about to be prompted → deliver the prompt in a fenced code block**.

The user pastes the code block straight into Higgsfield. Tool routing: Banana Pro / Nano Banana for Mode 0 Step 0.A (single-pass default), Mode 0 Step 0.2 (Soul Cinema path lock), Modes 1A, 2, 3, 5; GPT-2 for Mode 0 Step 0.B (highest fidelity single-pass) and Mode 4; Soul Cinema for Mode 0 Step 0.1 (iteration path) and Mode 1B. The user attaches the same reference images (or selects them from their Higgsfield character/environment library) inside the Higgsfield UI. The skill's job ends at the code block.

If the user requests multiple shots in one ask, deliver each in its own code block, sequentially numbered or labeled — but still run the pre-prompt confirmation once before delivering the batch.

