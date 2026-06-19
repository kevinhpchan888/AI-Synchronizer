#!/usr/bin/env bash
ROOT="${HOME}/.claude/skills/book-prod"
VENV="${ROOT}/_install/venv/bin/python"
PY="${VENV:-python3}"
"$PY" "$(dirname "$0")/run.py" "$@"
