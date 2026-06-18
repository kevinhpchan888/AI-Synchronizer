# Kevin Sync Console

Kevin Sync Console is a local visual companion for keeping project repos, Claude/Codex skills, Claude/Codex config, and agent memory aligned across Windows and Mac.

Start on Windows:

```powershell
.\Start-KevinSyncConsole.ps1
```

Start on Mac/Linux:

```bash
./start-kevin-sync-console.sh
```

The dashboard opens at `http://localhost:47831` on the current machine. A future Vercel/Supabase control plane can show all machines in one hosted dashboard, but the local companion remains the component that safely modifies local files.

## How Existing GitHub Project Repos Work

Existing projects keep their own Git repos. This console stores a registry entry with the project name and local path, then checks and runs Git actions inside that project folder. It does not merge project repos into this sync-console repo.

## Secrets

Local secrets belong in `.env.local`, OS credential stores, or each tool's own auth store. The dashboard only reports whether required values exist; it does not display secret values.
