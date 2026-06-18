#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PORT="47831"
URL="http://localhost:${PORT}"
PID_FILE="${ROOT}/logs/server.pid"

server_running() {
  curl -fsS "${URL}/api/summary" >/dev/null 2>&1
}

cd "$ROOT"

if ! server_running; then
  mkdir -p "$ROOT/logs"
  nohup node src/server.mjs > "$ROOT/logs/server.log" 2> "$ROOT/logs/server.err.log" &
  echo "$!" > "$PID_FILE"
  sleep 2
fi

if command -v open >/dev/null 2>&1; then
  open "$URL"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL"
else
  printf '%s\n' "$URL"
fi
