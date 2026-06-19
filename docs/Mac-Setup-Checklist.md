# Mac Setup Checklist

Use this on the MacBook Pro first, then repeat on the Mac Mini when ready.

## One-Time Setup

Preferred path:

1. On AMVPC, open Kevin Sync Console.
2. Click **Prepare Setup Files**.
3. Click **Open Setup Folder**.
4. Copy `Setup-KevinSync-Mac.command` to the Mac.
5. Double-click it on the Mac.
6. When the dashboard opens, click **Sync Local Skills**.

Manual fallback:

1. Install Git.
2. Install Node.js 20 or newer.
3. Install Claude Code.
4. Install Codex.
5. Clone the private `ClaudeCodex Sync` GitHub repo.
6. Open the cloned folder.
7. Run:

```bash
./restore-kevin-sync-console.sh
```

8. Open Kevin Sync Console in the browser.
9. Confirm the machine appears in **Machines**.
10. Click **Sync Local Skills**.
11. Click **Publish Cloud Status** after Supabase is connected.

## What You Should See

- AMVPC: online when this PC is running.
- MacBook Pro: online after setup runs there.
- Mac Mini: pending until you run setup there.
- Skill Coverage: Claude Code, Codex, and Shared Agents should show the same skill count after sync.

## If The Mac Was Wiped

1. Reinstall Git and Node.js.
2. Clone the private `ClaudeCodex Sync` repo again.
3. Run `./restore-kevin-sync-console.sh`.
4. Click **Sync Local Skills**.
5. Add project folders again if they were not cloned yet.
6. Use **Start Work** only after red warnings are gone.
