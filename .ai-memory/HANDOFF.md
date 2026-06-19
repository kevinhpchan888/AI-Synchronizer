# Handoff

## Latest Handoff

Hosted/local mode split fixed. The hosted domain aisync.amvnow.com is now a read-only cloud fleet view and blocks local POST actions with a clear "Open http://127.0.0.1:47831" message. It no longer renders Vercel sandbox paths like /var/task or /home/sbx_user... as project paths. File-changing actions, project switching, scan/import, memory initialization, handoffs, tool installs, and Claude/Codex switching are local-console only. Use the hosted domain to inspect fleet status; use http://127.0.0.1:47831 on the current machine to act.

Updated: 2026-06-19T13:30:00.000Z
