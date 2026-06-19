#!/usr/bin/env bash
set -euo pipefail
SLUG="${1:?slug required}"
ROOT="${HOME}/.claude/skills/book-prod"
VENV="${ROOT}/_install/venv/bin/python"
PY="${VENV:-python3}"
TOKENS="${ROOT}/brand-system/assets/imprints/${SLUG}.tokens.json"
SCHEMA="${ROOT}/_shared/schemas/brand-tokens.schema.json"
OUT="${ROOT}/_shared/build/${SLUG}"
mkdir -p "$OUT"
"$PY" "${ROOT}/_shared/lib/tokens_to_typst.py" "$TOKENS" "${OUT}/variables.typ" "$SCHEMA"
"$PY" "${ROOT}/_shared/lib/tokens_to_latex.py" "$TOKENS" "${OUT}/tokens.sty"   "$SCHEMA"
"$PY" "${ROOT}/_shared/lib/tokens_to_css.py"   "$TOKENS" "${OUT}/tokens.css"   "$SCHEMA"
echo "Built tokens for $SLUG at $OUT"
