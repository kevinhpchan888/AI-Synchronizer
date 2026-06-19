#!/usr/bin/env bash
# install-hermes.sh — make the `watch` skill available to every Hermes agent.
#
# Run this ON THE MAC MINI (100.88.103.85), where the Hermes fleet lives.
# It symlinks this repo's skills/watch into Hermes' global skills dir and into
# every per-agent profile, so /watch works for all agents and future edits
# pushed to the repo propagate automatically (no copy step).
#
# Usage:
#   bash skills/watch/install-hermes.sh            # install
#   bash skills/watch/install-hermes.sh --dry-run  # show what would happen
#
# Idempotent: re-running refreshes the symlinks. Safe to run any time.

set -euo pipefail

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

# Absolute path to this skill dir (the symlink target).
SKILL_SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HERMES_HOME="${HERMES_HOME:-$HOME/.hermes}"

if [ ! -d "$HERMES_HOME" ]; then
  echo "ERROR: Hermes home not found at $HERMES_HOME"
  echo "Set HERMES_HOME and re-run, e.g.: HERMES_HOME=/Volumes/SSD500/hermes bash $0"
  exit 1
fi

echo "  watch skill installer (Hermes)"
echo "  source:  $SKILL_SRC"
echo "  hermes:  $HERMES_HOME"
[ "$DRY_RUN" = 1 ] && echo "  mode:    DRY RUN (no changes)"
echo ""

link_into() {
  # $1 = a skills/ directory to drop the symlink into
  local skills_dir="$1"
  local target="$skills_dir/watch"
  if [ "$DRY_RUN" = 1 ]; then
    echo "  would link  $target -> $SKILL_SRC"
    return
  fi
  mkdir -p "$skills_dir"
  rm -rf "$target"                       # clear any stale copy/symlink
  ln -s "$SKILL_SRC" "$target"
  echo "  linked      $target"
}

count=0

# 1. Global skills dir (shared by all profiles), if Hermes uses one.
for global in "$HERMES_HOME/skills" "$HERMES_HOME/hermes-agent/skills"; do
  if [ -d "$global" ]; then
    link_into "$global"
    count=$((count + 1))
  fi
done

# 2. Every per-agent profile.
if [ -d "$HERMES_HOME/profiles" ]; then
  for profile in "$HERMES_HOME/profiles"/*/; do
    [ -d "$profile" ] || continue
    link_into "${profile%/}/skills"
    count=$((count + 1))
  done
fi

echo ""
if [ "$count" -eq 0 ]; then
  echo "  No Hermes skills dirs found under $HERMES_HOME."
  echo "  Check the layout (expected $HERMES_HOME/profiles/<agent>/skills) and re-run."
  exit 1
fi
echo "  Done. watch linked into $count location(s)."
echo "  Each Hermes agent can now /watch <url-or-path>."
echo ""
echo "  Note: agents need ffmpeg + yt-dlp on the box. They were installed during"
echo "  Hermes setup; if a run reports them missing, run:"
echo "    python3 \"$SKILL_SRC/scripts/setup.py\""
