#!/usr/bin/env bash
set -euo pipefail

REPO_URL="__REPO_URL__"
INSTALL_ROOT="$HOME/Documents/ClaudeCodex Sync"

if [[ "$REPO_URL" == "__REPO_URL__" || -z "$REPO_URL" ]]; then
  echo "This setup file needs a GitHub repo URL."
  echo "Generate it from Kevin Sync Console after connecting the repo to GitHub."
  read -r -p "Press Enter to close."
  exit 1
fi

need_command() {
  local name="$1"
  local hint="$2"
  if ! command -v "$name" >/dev/null 2>&1; then
    echo "$name is required. $hint"
    if command -v brew >/dev/null 2>&1; then
      if [[ "$name" == "git" ]]; then
        brew install git
      elif [[ "$name" == "node" ]]; then
        brew install node
      fi
    fi
  fi
  if ! command -v "$name" >/dev/null 2>&1; then
    echo "$name is still missing. Install it, then run this setup again."
    read -r -p "Press Enter to close."
    exit 1
  fi
}

need_command git "Install Git or Xcode Command Line Tools."
need_command node "Install Node.js 20 or newer."

if [[ ! -d "$INSTALL_ROOT" ]]; then
  git clone "$REPO_URL" "$INSTALL_ROOT"
fi

cd "$INSTALL_ROOT"

chmod +x ./restore-kevin-sync-console.sh ./start-kevin-sync-console.sh 2>/dev/null || true
./restore-kevin-sync-console.sh
