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

Preferred one-click path:

1. On the current machine, connect `ClaudeCodex Sync` to a private GitHub repo.
2. In the dashboard, click **Prepare Setup Files**.
3. Click **Open Setup Folder**.
4. Copy the Mac or Windows setup file to the new machine.
5. Double-click the setup file.
6. The setup file clones the repo, installs/checks tools, runs restore, and opens Kevin Sync Console.
7. In the dashboard, click **Sync Agent Environment**.
8. Click **Publish Cloud Status** once Supabase is connected.

Manual fallback:

1. Install Git and Node.js if they are not already installed.
2. Clone the private `ClaudeCodex Sync` GitHub repo onto the machine.
3. Open the cloned folder.
4. Run the restore launcher:
   - Windows: `Restore-KevinSyncConsole.ps1`
   - Mac: `restore-kevin-sync-console.sh`
5. Open the dashboard.
6. Confirm the machine appears in **Machines**.
7. Click **Sync Agent Environment**.
8. Click **Publish Cloud Status** once Supabase is connected.

If GitHub is not connected yet, the dashboard will keep warning that restore is not fully protected. That warning is expected until the sync-console repo has a private GitHub remote.

For the Mac-specific checklist, use `docs/Mac-Setup-Checklist.md`.

## Daily Flow

## PC-First Claude / Codex Workflow

Use this on AMVPC when switching between Claude Code and Codex.

1. Open Kevin Sync Console.
2. If the work is in a loose folder, click **Adopt Workspace** instead of **Add Project**.
3. Adopt Workspace creates local Git and `.ai-memory/` so Claude and Codex share the same project files and memory.
4. Click **Start Work** before opening Claude Code or Codex.
5. When switching from Claude Code to Codex, click **Use Codex**. The console generates and saves the handoff.
6. When switching from Codex to Claude Code, click **Use Claude**. The console generates and saves the handoff.
7. Keep both tools pointed at the same workspace folder.
8. Before stopping or changing machines, use **End Work**. If memory is yellow, click **Refresh Handoff**.

The rule is simple:

```text
Do not switch tools from chat memory. Switch through the workspace folder and handoff.
```

You should not need to type a handoff for normal switching. The manual handoff note is only for extra context the console cannot infer.

For projects without GitHub repos:

```text
Loose folder -> Adopt Workspace -> local Git + .ai-memory -> optional GitHub later
```

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

## Agent / Model Profiles

Use **Agent / Model Profiles** to see which AI working environment is ready on the current machine.

- **Claude Code + Claude Models**: your normal Claude Code route for Claude/Opus/Sonnet.
- **Claude Code + GLM 5.2**: Claude Code pointed at Z.ai GLM 5.2 with 1M context.
- **Codex + OpenAI Models**: Codex using the same synced skills.
- **VS Code + Cline/Roo + GLM 5.2**: optional future visual editor workflow.

### Setting Up GLM 5.2 On This PC

1. Open **Kevin Sync Console**.
2. Go to **Agent / Model Profiles**.
3. Click **Open Z.ai API Keys** if you need to copy your key.
4. Click **Configure GLM 5.2**.
5. Paste the Z.ai GLM Coding Plan API key.
6. Click **Apply GLM 5.2**.
7. The GLM card should turn green.
8. Open Claude Code and type `/status` to confirm the active model.

To use normal Claude models again, click **Switch Back To Claude** in the same panel.

### Before Switching Tools

1. Click **Sync Agent Environment**.
2. Confirm Claude Code and Codex show the same skill count.
3. Use **Agent / Model Profiles** to choose whether Claude Code is currently on Claude models or GLM 5.2.

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

Use **Sync Agent Environment** when you want this machine to match the shared Claude/Codex working setup. It syncs global Claude instructions, global Codex instructions, portable hooks/rules, and all shared skills. It does not copy auth files, sessions, logs, caches, SQLite databases, or machine-specific app paths.

Use **Sync Local Skills** only when you want to refresh skills without touching the shared Claude/Codex instruction layer.

When the shared source is empty, use **Build Shared Skill Source** first. That imports the skills already present on the current machine from Claude Code, Codex, and Shared Agents into the shared source folder. After that, use **Sync Local Skills**.

## Starting From Scratch

Use this when a machine is refreshed, wiped, or replaced.

1. Use the generated one-click setup file if available.
2. If not available, install Git and Node.js.
3. Clone the private `ClaudeCodex Sync` repo.
4. Run the restore launcher.
5. Open Kevin Sync Console.
6. Check **Machines** and **Skill Coverage**.
7. Add local project folders again if they are not already cloned.
8. Click **Sync Agent Environment**.
9. Click **Publish Cloud Status** after cloud credentials are connected.
10. Start work only after the top readiness panel is not red.

## What To Do When Something Is Wrong

- Missing folder: remove the project and add it again with the correct folder.
- No upstream branch: connect this repo to a private GitHub repo.
- Cloud not connected: local sync still works; Supabase/Vercel setup can come later.
- Vercel not logged in: the hosted dashboard is not deployed yet.
- Red project warning: do not switch machines until it is fixed.
- Pending machine: restore the repo on that machine and publish status.
- Empty shared skills: click **Build Shared Skill Source**, then **Sync Agent Environment**.

## The One Habit

Use the console as the doorway:

```text
Start Work -> work in Claude/Codex -> End Work -> switch machine
```
