#!/usr/bin/env bash
set -uo pipefail
PROJ="${1:?project dir required}"
REPORT="${PROJ}/preflight/report.md"
mkdir -p "${PROJ}/preflight"
ERR=0
{
  echo "# Preflight Report — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
  for pdf in "${PROJ}"/out/*.pdf; do
    [[ -f "$pdf" ]] || continue
    echo "## $(basename "$pdf")"
    if pdffonts "$pdf" | awk 'NR>2 && $4!="yes" {exit 1}'; then
      echo "- [x] All fonts embedded"
    else
      echo "- [ ] Some fonts NOT embedded"; ERR=$((ERR+1))
    fi
    pdfimages -list "$pdf" | awk 'NR>2 && $13<300 {bad=1} END{exit bad}' \
      && echo "- [x] All images >= 300 DPI" \
      || { echo "- [ ] Image(s) under 300 DPI"; ERR=$((ERR+1)); }
  done
  for epub in "${PROJ}"/out/*.epub; do
    [[ -f "$epub" ]] || continue
    echo "## $(basename "$epub")"
    if epubcheck "$epub" --json "${PROJ}/preflight/$(basename "$epub").json" 2>/dev/null; then
      echo "- [x] EPUBCheck 5.3.0: 0 errors"
    else
      echo "- [ ] EPUBCheck FAILED"; ERR=$((ERR+1))
    fi
  done
  echo
  echo "**READY: $([[ $ERR -eq 0 ]] && echo true || echo false)**"
} > "$REPORT"
exit $ERR
