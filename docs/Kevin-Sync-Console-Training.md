# Kevin Sync Console Mini Training

## The Goal

Keep your PC, MacBook, Claude, Codex, skills, and project repos level without typing commands.

Your planned machines are:

- AMVPC: Windows PC, currently online.
- MacBook Pro: primary portable machine, pending setup.
- Mac Mini: hub / standby machine, pending setup.

## The Color Rule

- Green: ready.
- Yellow: normal sync or setup needed.
- Red: stop and fix before switching machines.
- Gray: optional or local-only.

## First-Time Setup On A New Machine

Use this when setting up the MacBook Pro, Mac Mini, or a freshly wiped computer.

1. Install Git and Node.js if they are not already installed.
2. Clone the private `ClaudeCodex Sync` GitHub repo onto the machine.
3. Open the cloned folder.
4. Run the restore launcher:
   - Windows: `Restore-KevinSyncConsole.ps1`
   - Mac: `restore-kevin-sync-console.sh`
5. Open the dashboard.
6. Confirm the machine appears in **Machines**.
7. Click **Publish Cloud Status** once Supabase is connected.
8. Click **Sync Local Skills** to copy shared skills into Claude, Codex, and Shared Agents on that machine.

If GitHub is not connected yet, the dashboard will keep warning that restore is not fully protected. That warning is expected until the sync-console repo has a private GitHub remote.

For the Mac-specific checklist, use `docs/Mac-Setup-Checklist.md`.

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

## Skill Coverage

Use **Skill Coverage** to compare whether each environment has the same shared skills:

```text
Machine -> Claude Code / Codex / Shared Agents
```

What the labels mean:

- `Pending setup`: that machine has not reported in yet.
- `0 skills`: the shared source or target folder is empty.
- `extra`: that agent has skills not yet in the shared source.
- `missing`: that agent is missing skills from the shared source.

Use **Sync Local Skills** after you add or update skills in the shared `skills/` folder. It copies the shared skills into local Claude, Codex, and Shared Agents folders on the current machine.

When the shared source is empty, use **Build Shared Skill Source** first. That imports the skills already present on the current machine from Claude Code, Codex, and Shared Agents into the shared source folder. After that, use **Sync Local Skills**.

## Starting From Scratch

Use this when a machine is refreshed, wiped, or replaced.

1. Install Git and Node.js.
2. Clone the private `ClaudeCodex Sync` repo.
3. Run the restore launcher.
4. Open Kevin Sync Console.
5. Check **Machines** and **Skill Coverage**.
6. Add local project folders again if they are not already cloned.
7. Click **Sync Local Skills**.
8. Click **Publish Cloud Status** after cloud credentials are connected.
9. Start work only after the top readiness panel is not red.

## What To Do When Something Is Wrong

- Missing folder: remove the project and add it again with the correct folder.
- No upstream branch: connect this repo to a private GitHub repo.
- Cloud not connected: local sync still works; Supabase/Vercel setup can come later.
- Vercel not logged in: the hosted dashboard is not deployed yet.
- Red project warning: do not switch machines until it is fixed.
- Pending machine: restore the repo on that machine and publish status.
- Empty shared skills: click **Build Shared Skill Source**, then **Sync Local Skills**.

## The One Habit

Use the console as the doorway:

```text
Start Work -> work in Claude/Codex -> End Work -> switch machine
```
