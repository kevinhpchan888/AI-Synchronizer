---
name: brand-system
description: "Multi-imprint brand identity for LumosBooks (LumosRead first): canonical brand-tokens.json (color, type, spacing, page geometry, prompts, voice, logos) converted to engine configs (variables.typ, tokens.sty, tokens.css). Trigger on brand, imprint, LumosRead, tokens, design system, palette, or starting a new imprint."

---

# Brand System

## When to invoke
On "create new imprint", "set LumosRead colors", "what fonts does LumosRead use", "export brand to typst", "brand tokens for [imprint]".

## Files
- `assets/imprints/lumosread.tokens.json` (populated)
- `assets/imprints/_template.tokens.json` (blank, for new imprints)
- `references/schema.json` (validates tokens; same as `_shared/schemas/brand-tokens.schema.json`)
- `scripts/new_imprint.ps1 <slug>` / `new_imprint.sh <slug>`
- `scripts/build_tokens.ps1 <imprint-slug>` / `build_tokens.sh <imprint-slug>`

## Procedure
1. Validate `assets/imprints/<slug>.tokens.json` against the schema using `jsonschema`.
2. Run `_shared/lib/tokens_to_typst.py` → emits `_shared/build/<slug>/variables.typ`.
3. Run `_shared/lib/tokens_to_latex.py` → emits `_shared/build/<slug>/tokens.sty`.
4. Run `_shared/lib/tokens_to_css.py` → emits `_shared/build/<slug>/tokens.css`.
5. Cache build outputs; downstream skills read these files.

## Examples
- "Confirm LumosRead loaded and rebuild the variables files."
- "Create a new imprint called LumosWell for adult wellness titles."
