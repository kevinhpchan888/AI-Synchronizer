#!/usr/bin/env bash
# PostToolUse hook: warn (do not block) on APC writing-rule violations in files
# Claude just wrote/edited. Reads the hook JSON on stdin, and if the written file
# is APC content (.html/.md/.txt under skills/apc-article-ops), runs the canonical
# writing-rules scanner and surfaces any em/en dash (HARD) or banned-vocabulary
# (warn) hits back to the model. The hard publish gate still lives in the publisher;
# this is the early-warning layer the CLAUDE.md references.
set -euo pipefail
f=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty' 2>/dev/null || true)
[ -z "$f" ] && exit 0
case "$f" in *skills/apc-article-ops/*) ;; *) exit 0 ;; esac
case "$f" in *.html|*.md|*.txt) ;; *) exit 0 ;; esac
[ -f "$f" ] || exit 0
out=$(python3 "$(dirname "$0")/check_writing_rules.py" --check "$f" 2>&1 || true)
if printf '%s\n' "$out" | grep -qE '^(HARD|warn)'; then
  msg="APC writing-rules check on $(basename "$f"):
$(printf '%s\n' "$out" | grep -E '^(HARD|warn)' | head -20)"
  jq -cn --arg m "$msg" '{systemMessage:$m, hookSpecificOutput:{hookEventName:"PostToolUse", additionalContext:$m}}'
fi
exit 0
