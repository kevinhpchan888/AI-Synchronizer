---
name: lumosbooks-brand
description: Manages multi-imprint brand identity for LumosBooks. LumosRead is loaded; new imprints are added by copying the template. Defines the canonical brand-tokens.json schema (color, typography, spacing, page geometry per trim size, illustration prompts, voice, logo paths) and converts tokens into engine-specific configs (variables.typ for Typst, tokens.sty for LaTeX, tokens.css for EPUB/Vivliostyle). Use whenever the user mentions LumosBooks brand, LumosRead, imprint, navy, gold, lightbulb, brand tokens, design system, color palette, typography, or asks to start, edit, or rebuild a brand.
---

# LumosBooks brand system

You manage brand tokens and emit engine-ready variable files.

## Canonical paths
- Token files: `~/.Codex/skills/book-prod/brand-system/assets/imprints/<slug>.tokens.json`
- Schema: `~/.Codex/skills/book-prod/_shared/schemas/brand-tokens.schema.json`
- Output dir: `~/.Codex/skills/book-prod/_shared/build/<slug>/`
- Helpers: `~/.Codex/skills/book-prod/_shared/lib/tokens_to_{typst,latex,css}.py`
- LumosRead is pre-loaded; template at `_template.tokens.json`

## Build tokens (run when invoked or when tokens change)
For an imprint slug `<slug>`, run via Bash:
```bash
PY="$HOME/.Codex/skills/book-prod/_install/venv/Scripts/python.exe"
ROOT="$HOME/.Codex/skills/book-prod"
T="$ROOT/brand-system/assets/imprints/<slug>.tokens.json"
S="$ROOT/_shared/schemas/brand-tokens.schema.json"
O="$ROOT/_shared/build/<slug>"
mkdir -p "$O"
"$PY" "$ROOT/_shared/lib/tokens_to_typst.py" "$T" "$O/variables.typ" "$S"
"$PY" "$ROOT/_shared/lib/tokens_to_latex.py" "$T" "$O/tokens.sty"   "$S"
"$PY" "$ROOT/_shared/lib/tokens_to_css.py"   "$T" "$O/tokens.css"   "$S"
```

## New imprint
1. Copy `_template.tokens.json` to `<newslug>.tokens.json`.
2. Edit slug, display name, colors, fonts.
3. Run the build commands above.

## LumosRead defaults
- Primary navy `#0F2A4A`, secondary gold `#E5B53D`
- Body font: EB Garamond 11pt / leading 1.45
- UI sans: Inter; Mono: JetBrains Mono
- Voice: warm, curious, encouraging, reading age 6
- Illustration: soft watercolor + ink line, navy/gold accents

## Examples
- "Confirm LumosRead loaded and rebuild the variable files."
- "Create a new imprint called LumosWell for adult wellness titles."
- "Update LumosRead gold to a warmer hex and rebuild."
