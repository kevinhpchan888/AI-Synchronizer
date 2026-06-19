#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
PLIST="$HOME/Library/LaunchAgents/com.amv.aisync.hermes-worker.plist"
LOG_DIR="$ROOT/logs"

mkdir -p "$HOME/Library/LaunchAgents" "$LOG_DIR"
chmod +x "$ROOT/scripts/start-hermes-worker.sh"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.amv.aisync.hermes-worker</string>
  <key>ProgramArguments</key>
  <array>
    <string>$ROOT/scripts/start-hermes-worker.sh</string>
  </array>
  <key>WorkingDirectory</key>
  <string>$ROOT</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$LOG_DIR/hermes-worker.out.log</string>
  <key>StandardErrorPath</key>
  <string>$LOG_DIR/hermes-worker.err.log</string>
</dict>
</plist>
EOF

launchctl bootout "gui/$(id -u)" "$PLIST" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl kickstart -k "gui/$(id -u)/com.amv.aisync.hermes-worker"
launchctl print "gui/$(id -u)/com.amv.aisync.hermes-worker" >/dev/null
echo "AI Sync Hermes worker installed and running."
