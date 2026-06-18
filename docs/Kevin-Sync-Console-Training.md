# Kevin Sync Console Mini Training

## The Goal

Keep your PC, MacBook, Claude, Codex, skills, and project repos level without typing commands.

## The Color Rule

- Green: ready.
- Yellow: normal sync or setup needed.
- Red: stop and fix before switching machines.
- Gray: optional or local-only.

## Daily Flow

### Starting Work

1. Open **Kevin Sync Console**.
2. Click **Refresh**.
3. Read **Current Readiness**.
4. If it says you are ready, open Claude or Codex.
5. If it says something needs attention, follow the **Needs Attention** panel first.

### Ending Work

1. Click **End Work**.
2. If a project says local changes exist, click **Save WIP**.
3. If a project says commits need pushing, click **Push**.
4. When the dashboard is green or only has optional cloud setup warnings, you can switch machines.

### Adding A Project

1. Click **Add Project**.
2. Name it clearly, such as `Website` or `Book Store`.
3. Paste/select the local folder for that project repo.
4. The project stays in its own GitHub repo. The console only monitors and syncs it.

### Adding A Machine

1. Click **Add Machine**.
2. Enter a name like `MacBook Pro`.
3. The console creates a pairing code.
4. On the new machine, clone the sync-console repo and run the restore launcher.
5. Publish cloud status after Supabase is connected.

## What To Do When Something Is Wrong

- Missing folder: remove the project and add it again with the correct folder.
- No upstream branch: connect this repo to a private GitHub repo.
- Cloud not connected: local sync still works; Supabase/Vercel setup can come later.
- Vercel not logged in: the hosted dashboard is not deployed yet.
- Red project warning: do not switch machines until it is fixed.

## The One Habit

Use the console as the doorway:

```text
Start Work -> work in Claude/Codex -> End Work -> switch machine
```
