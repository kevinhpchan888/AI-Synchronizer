#!/usr/bin/env sh
set -eu
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$DIR"
node scripts/hermes-worker.mjs
