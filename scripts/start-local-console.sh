#!/usr/bin/env sh
set -eu
export PATH="$HOME/.local/ai-sync/node/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$DIR"
node src/server.mjs
