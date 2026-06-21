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
2. If the GitHub repo is not on this machine yet, click **Clone Project**.
3. If the work is in a loose folder that already exists on this machine, click **Adopt Workspace** instead of **Add Project**.
4. Adopt Workspace creates local Git and `.ai-memory/` so Claude and Codex share the same project files and memory.
5. Click **Start Work** before opening Claude Code or Codex.
6. When switching from Claude Code to Codex, click **Use Codex**. The console generates and saves the handoff.
7. When switching from Codex to Claude Code, click **Use Claude**. The console generates and saves the handoff.
8. Keep both tools pointed at the same workspace folder.
9. Before stopping or changing machines, use **End Work**. If memory is yellow, click **Refresh Handoff**.

The **Memory Status** button stays inside AI Sync Console. It highlights the project memory status and tells you whether to initialize `.ai-memory`, refresh the handoff, or continue. MemoRix is legacy/optional here; it is not the daily control plane.

The **Cognee + Graphiti Semantic Memory** panel is the richer memory layer:

1. **Build Semantic Memory** creates the project knowledge index, temporal graph, and startup packet.
2. **Show Memory Capsule** shows the compact recovery brief for a compressed or brand-new AI session.
3. **Show Startup Packet** shows the fuller context Claude, Codex, and Hermes should read before substantial work.
4. **Search Memory** searches files, decisions, tasks, API routes, entities, and relations already indexed from the project.
5. **Install Hermes Bridge** queues the Mac Mini worker to install the project-memory rule into every Hermes profile.

Every project gets its own `.ai-memory/` folder inside that project. This is intentional. The memory travels with the repo or folder, so APC has APC memory, AutoResearch has AutoResearch memory, and a non-repo workspace gets its own context space. AI Sync Console is the control plane that scans and compares them.

For APC, the key files are `.ai-memory/semantic/CONTEXT_CAPSULE.md` and `.ai-memory/semantic/AGENT_STARTUP.md`. The capsule is the short recovery brief after compression. The startup packet is the fuller first-read file when moving from Claude to Codex, Codex to Claude, PC to Mac, or Mac to PC.

The startup packet now includes the practical parts that matter when an agent resumes:

- **Operating Brief**: project state, branch, uncommitted files, status, handoff, tasks, and decisions.
- **Changed Since Last Handoff**: files touched after the last handoff, so the next agent knows what to inspect first.
- **Current Local Changes**: files Git sees as changed on this machine.
- **Search Memory Recipes**: ready-made searches to recover context quickly.
- **Next Agent Checklist**: what Claude, Codex, GLM, or Hermes should do before editing.

If a project file changes after the semantic graph was built, the memory panel turns yellow and says the graph should be rebuilt. Click **Build Semantic Memory** or **Start Work** to refresh it.

Hermes publishes compact memory readiness for each project into the cloud control plane. It can also process queued memory refresh jobs named `refresh_memory`, `refresh_project_memory`, `build_semantic_memory`, or `memory_briefing`. Hermes is still not a replacement for the project repo. It is a coordinator that carries the project capsule, handoff, and stale/fresh state across machines.

The Hermes bridge makes the rule explicit. It writes a shared bridge file inside the Hermes home folder and adds a managed memory block to each Hermes profile `SOUL.md`. After that, each profile has the same instruction: read the AI Sync bridge first, then read the matching project `CONTEXT_CAPSULE.md`, then read `AGENT_STARTUP.md` before substantial work. If memory is missing or stale, the profile should report that instead of editing from old context.

Search results now show **why** they matched and which source file they came from. Use this when you are unsure where a decision, task, rule, route, or skill lives.

The rule is simple:

```text
Do not switch tools from chat memory. Switch through the workspace folder, semantic startup packet, and handoff.
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

Use **Clone Project** when the GitHub repo is not on this machine yet.

1. Click **Clone Project**.
2. Paste `owner/repo`, `gh:owner/repo`, or a GitHub URL.
3. Optional: enter a friendly project name or folder name.
4. Click **Clone And Prepare**.
5. AI Sync clones into your GitHub folder, adds the project, creates `.ai-memory`, builds the memory capsule, and makes it active.

Use **Add Project** when the repo already exists locally but is not listed yet.

1. Click **Add Project**.
2. Name it clearly, such as `Website` or `Book Store`.
3. Paste/select the local folder for that project repo.
4. The project stays in its own GitHub repo. The console monitors and prepares it.

Use **Adopt Workspace** when the folder already exists but is not a GitHub repo yet.

1. Click **Adopt Workspace**.
2. Enter the folder path.
3. AI Sync initializes local Git, adds `.ai-memory`, builds semantic memory, and tracks it as a local workspace.

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

Use **Sync Agent Environment** when you want this machine to match the shared Claude/Codex working setup. It syncs global Claude instructions, global Codex instructions, portable hooks/rules, shared skills, and Claude MCP server entries into Codex. It does not copy sessions, logs, caches, SQLite databases, or machine-specific app paths.

MCP sync copies the server definitions and environment keys already present in Claude settings into Codex config. After new MCP entries are added, open a new Codex session so Codex loads the new tools. For example, if Selldone works in Claude but not Codex, use **Sync Agent Environment**, then start a new Codex session.

Use **Sync Local Skills** only when you want to refresh skills without touching the shared Claude/Codex instruction layer.

Tracked project repos can also contain skill folders. For example, APC can carry `skills/watch` because GitHub Desktop keeps that project repo current. The console treats those as upstream project skill sources, promotes newer project skills into the shared source, then copies the shared source into Claude Code, Codex, and Shared Agents. The live runtime folders are:

```text
C:\Users\Kevin Chan\.claude\skills
C:\Users\Kevin Chan\.codex\skills
C:\Users\Kevin Chan\.agents\skills
```

Daily rule: keep working in the local repo folder. Let AI Sync promote project skills and context into the shared layer.

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
