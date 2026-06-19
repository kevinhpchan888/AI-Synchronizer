#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
PLIST="$HOME/Library/LaunchAgents/com.amv.aisync.console.plist"
LOG_DIR="$ROOT/logs"

mkdir -p "$HOME/Library/LaunchAgents" "$LOG_DIR"
chmod +x "$ROOT/scripts/start-local-console.sh"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.amv.aisync.console</string>
  <key>ProgramArguments</key>
  <array>
    <string>$ROOT/scripts/start-local-console.sh</string>
  </array>
  <key>WorkingDirectory</key>
  <string>$ROOT</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$LOG_DIR/local-console.out.log</string>
  <key>StandardErrorPath</key>
  <string>$LOG_DIR/local-console.err.log</string>
</dict>
</plist>
EOF

launchctl bootout "gui/$(id -u)" "$PLIST" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl kickstart -k "gui/$(id -u)/com.amv.aisync.console"
launchctl print "gui/$(id -u)/com.amv.aisync.console" >/dev/null
echo "AI Sync local console installed and running at http://127.0.0.1:47831"
