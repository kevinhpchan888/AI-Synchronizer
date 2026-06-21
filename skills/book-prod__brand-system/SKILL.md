---
name: brand-system
description: Manages multi-imprint brand identity for LumosBooks (LumosRead is the first imprint; new imprints are added by copying the template). Defines the canonical brand-tokens.json schema covering color, typography, spacing, page geometry per trim size, illustration prompts, voice, and logo paths, then converts those tokens into engine-specific configs (variables.typ, tokens.sty, tokens.css). Use this skill whenever the user mentions brand, imprint, LumosRead, navy, gold, lightbulb, tokens, design system, color palette, typography, or asks to start a new brand.
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
