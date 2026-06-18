#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$ROOT"

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    return 1
  fi
}

need git || { printf '%s\n' "Git is required. Install Git, then run this restore again."; exit 1; }
need node || { printf '%s\n' "Node.js 20+ is required. Install Node.js, then run this restore again."; exit 1; }

need ai-config-sync || npm install -g ai-config-sync-manager
need memorix || npm install -g memorix
need supabase || npm install -g supabase
need vercel || npm install -g vercel
need skillshare || curl -fsSL https://raw.githubusercontent.com/runkids/skillshare/main/install.sh | sh

sh "$ROOT/start-kevin-sync-console.sh"
