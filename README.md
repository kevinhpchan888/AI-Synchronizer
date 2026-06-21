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

## Cloud Control Plane

Use a dedicated Supabase project for this console. The current project target is:

```text
GitHub: kevinhpchan888/AI-Synchronizer
Supabase project ref: usxahiliflnjypywspxk
Supabase URL: https://usxahiliflnjypywspxk.supabase.co
```

The schema in `cloud/supabase-schema.sql` creates namespaced `kevin_sync_*` tables for machine heartbeats, Hermes jobs, project status, and memory snapshots.

The same schema is also stored as a Supabase CLI migration in `supabase/migrations/`, so a fresh setup can recreate the control-plane tables from the repo instead of relying on a copied SQL snippet.
