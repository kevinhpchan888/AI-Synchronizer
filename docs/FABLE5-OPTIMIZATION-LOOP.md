# Fable 5 Optimization Loop: AI Synchronizer (Kevin Sync Console)

You are Fable 5, working in a `/loop`. Your mission is to dramatically improve the
performance, usability, and UI of this app, simplify it so it is much easier to use,
and prove that its memory system actually preserves context across tool and machine
switches. This document is your standing brief. Re-read Section 2 (Loop Protocol) at
the start of every iteration. Everything you need to skip discovery is in Section 1.

Do not re-explore the whole tree each iteration. The orientation packet below is the
map. Only open the specific files an iteration needs.

---

## 0. How to run this loop

- Launch: `/loop Read docs/FABLE5-OPTIMIZATION-LOOP.md, then run ONE iteration of the loop protocol and update docs/FABLE5-PROGRESS.md.`
- Each firing = exactly one backlog item taken to green (implemented, tested, verified,
  committed, ledger updated). Small, shippable, reversible.
- The ledger `docs/FABLE5-PROGRESS.md` is the single source of truth for what is done,
  in progress, and next. Read it first, write it last, every iteration.
- Stop conditions are in Section 6. When they are all met, stop scheduling and post a
  final summary instead of continuing.

---

## 1. Orientation packet (pre-loaded, so you do not have to discover it)

### 1.1 What the app is
A local visual control plane that keeps four things level across Kevin's machines
(Windows AMVPC, MacBook Pro, Mac Mini):
1. Project Git repos (each stays in its own folder / GitHub repo).
2. Claude Code + Codex config and skills.
3. Agent memory, stored per-project in a portable `.ai-memory/` folder.
4. A cross-machine "Hermes" coordinator that carries memory readiness between machines.

The console never merges project repos into itself. It registers each project by path
and runs Git and memory actions inside that folder. The dashboard is the only component
that safely modifies local files.

### 1.2 Stack and how to run it
- Runtime: Node 20+, **zero npm dependencies**. Pure `node:http`, `node:fs`, no framework,
  no build step, no bundler. Do not add dependencies or a build step without recording
  the reason in the ledger. Keeping it dependency-free is a feature.
- Start: `npm start` (runs `node src/server.mjs`), serves `http://localhost:47831`,
  bound to `127.0.0.1`.
- Mac launcher: `./start-kevin-sync-console.sh` (nohup + open browser, PID in `logs/`).
- Windows launcher: `Start-KevinSyncConsole.ps1`. Restore launchers: `restore-*`.
- Syntax gate: `npm run check` (node --check across server + every lib).
- Tests: `npm test` (node:test, currently 14 passing). Always keep these green.

### 1.3 File map (the whole surface)
```
src/server.mjs            693 lines. Raw HTTP router. All /api/* routes, manual if-chains.
src/lib/                  15 modules, all ESM (.mjs), all pure Node:
  registry.mjs            projects.json/machines.json/settings.json read/write. Resolves
                          $AI_SYNC_ROOT and $PROJECTS_HOME placeholders in stored paths.
  git.mjs                 git status/pull/push/commit helpers per project folder.
  memory.mjs              per-project .ai-memory status, init, event log, handoff writer.
  semantic-memory.mjs     1220 lines. Cognee-style index + Graphiti-style graph + capsule
                          + startup packet. Build, status(stale detection via source hash),
                          search, getAgentStartupPacket, getContextCapsule. THE core of
                          "does memory work". Biggest, densest file. Treat with care.
  hermes-bridge.mjs       writes bridge file + managed memory block into Hermes SOUL.md.
  hermes-memory.mjs       compact per-project memory readiness for the cloud plane.
  hermes-worker-routing.mjs  routes refresh_memory / build_semantic_memory jobs.
  mcp-sync.mjs            copies Claude MCP server defs + env keys into Codex config.
  skills.mjs              shared skill source; promote project skills; sync to Claude/Codex.
  environment.mjs         sync global Claude/Codex instructions, hooks, rules.
  agents.mjs              agent/model profiles (Claude, GLM 5.2, Codex, VS Code).
  machines.mjs            machine registry + pairing.
  workspaces.mjs          adopt loose folder -> local git + .ai-memory.
  cloud.mjs               Supabase/Vercel publish + status (optional, off by default).
  setup.mjs               generate one-click new-machine setup files.
  tools.mjs / command.mjs tool checks + shelling out safely.
public/index.html         409 lines. Single page. ~18 <section> panels + 6 <dialog>s.
public/app.js             1969 lines. Vanilla ES module. All fetch calls + DOM wiring.
public/styles.css         1202 lines. Hand-written, no framework.
registry/*.json           projects.json, machines.json, settings.json (port, safeMode, cloud).
.ai-memory/               THIS repo's own memory (dogfood). semantic/ holds the artifacts.
docs/                     Training + Mac setup + superpowers plan. This file lives here.
test/*.test.mjs           6 files, 14 tests. Cover clone, hermes, mcp-sync, semantic memory.
scripts/                  hermes-worker + install/start scripts (Mac + Windows).
cloud/ + supabase/        control-plane schema (kevin_sync_* tables) + CLI migration.
```

### 1.4 API surface (all routes, from src/server.mjs)
GET  `/api/summary` `/api/session` `/api/tools` `/api/setup` `/api/agents` `/api/skills`
`/api/memory` `/api/hermes-bridge/status` `/api/cloud/status` `/api/projects` `/api/machines`.
POST `/api/session/project` `/api/cloud/publish` `/api/agents/glm52/configure`
`/api/agents/claude/restore` `/api/setup/prepare` `/api/setup/open-folder`
`/api/memory/auto-setup` `/api/hermes-bridge/install` `/api/workspaces/adopt`
`/api/projects/clone` `/api/projects` `/api/projects/discover` `/api/projects/:id/action`
`/api/skills/sync-local` `/api/skills/import-local` `/api/environment/sync-local`
`/api/machines`. DELETE `/api/projects/:id`.
Static: everything else is served from `public/` with no-store caching.

### 1.5 The memory pipeline (what must actually work)
Every project owns a portable `.ai-memory/` folder that travels with the repo:
- Flat files: `PROJECT.md STATUS.md TASKS.md RULES.md HANDOFF.md DECISIONS.md CONTEXT_INDEX.json`
  plus `events/*.jsonl`.
- `semantic/` subfolder is the rich layer:
  - `cognee-index.json`   chunk + entity index (Cognee-style).
  - `graphiti-graph.json` + `graphiti-episodes.jsonl`  temporal relation graph.
  - `context-capsule.json` + `CONTEXT_CAPSULE.md`  compact post-compression recovery brief.
  - `AGENT_STARTUP.md`  fuller first-read packet: operating brief, changed-since-handoff,
    current local changes, search recipes, next-agent checklist.
- Staleness: status compares a source hash of project files against the last build. If a
  file changed after the graph was built, the Memory tile goes yellow and asks for a rebuild.
- Cross-machine: Hermes bridge injects one rule into each agent profile: read the AI Sync
  bridge, then the project `CONTEXT_CAPSULE.md`, then `AGENT_STARTUP.md`, before editing.

The product promise is: an agent that lost its chat context (compressed, or switched from
Claude to Codex, or PC to Mac) can read only the capsule + startup packet and resume
correctly. Section 4 is how you prove or fix that.

### 1.6 Known pain points (Kevin's own words, decoded)
- "UI is complex": ~18 top-level panels rendered at once, plus a command-stack of six
  ambiguous buttons (Start Work, Use Claude, Use Codex, End Handoff, Sync Now, Memory
  Status) and sync buttons scattered across many panels. No progressive disclosure.
- "Not clear how well it works": no visible, trustworthy signal that memory round-trips.
  The dashboard reports colors, but nothing demonstrates that a fresh agent actually
  recovers context. This is both a UX gap and a correctness question.
- Implicit: `app.js` (1969 lines) and `semantic-memory.mjs` (1220 lines) are large single
  files; performance of the full-refresh dashboard render and repeated Git/hash scans is
  unmeasured.

---

## 2. Loop protocol (run this every iteration)

1. **Read the ledger.** Open `docs/FABLE5-PROGRESS.md`. Identify the single highest-value
   item not yet done. Prefer P0 over P1 over P2. Prefer memory-correctness when tied.
2. **Frame the goal.** State the item as one verifiable outcome. If it is a bug, reproduce
   it first. If it is a feature or a UX change, define the before/after and how you will
   observe success.
3. **Establish the baseline.** Before changing anything: `npm run check` and `npm test`
   must be green. If they are not, fixing that IS the iteration.
4. **Make the surgical change.** Smallest diff that achieves the goal. Match existing style
   (raw Node, vanilla JS, no deps). Do not refactor adjacent code you were not asked to
   touch. If a file is too big to change safely, splitting it can be its own ledger item,
   done in isolation with tests unchanged.
5. **Prove it.** Run `npm run check` + `npm test`. Add or update a test when behavior
   changed. For UI or endpoint changes, actually run the app and observe: start the server,
   hit the affected `/api/*` route, and use the browser preview to confirm the panel renders
   and the control works. Capture what you observed in the ledger. Do not claim done from
   reading code alone.
6. **Guard against regressions.** Confirm no other test broke and the dashboard still loads
   end to end (`GET /` + `GET /api/summary` succeed).
7. **Commit.** One focused commit on a working branch (never commit straight to `master`
   without branching first). Message describes the user-visible improvement. End with the
   Co-Authored-By trailer.
8. **Update the ledger.** Move the item to Done with: what changed, files touched, how you
   verified, and any follow-up spun off. Add newly discovered work to the backlog.
9. **Schedule the next iteration** only if a stop condition (Section 6) is not yet met.

Keep each iteration self-contained. If an item is large, split it: land a thin verifiable
slice this iteration and enqueue the rest.

---

## 3. Prioritized backlog (seed; keep it live in the ledger)

### P0 — Prove and harden memory (the core promise)
- **M1. Memory round-trip test.** Add an automated test that builds semantic memory for a
  fixture project, then asserts the capsule + startup packet contain the recoverable facts:
  project name, current branch, uncommitted-file awareness, last handoff, open tasks, and
  a pointer to where key code lives. This is the executable definition of "memory works".
- **M2. Staleness honesty.** Verify the source-hash staleness logic actually flips to yellow
  when a tracked file changes and back to green after rebuild. Add a test. Fix drift where
  generated `.ai-memory` files themselves wrongly count as source changes (self-dirtying).
- **M3. Capsule quality.** Confirm `CONTEXT_CAPSULE.md` is genuinely compact and answers
  "what do I do next" for a cold agent. Trim noise, keep the operating brief + next steps.
- **M4. One-glance memory truth.** Surface a single dashboard signal that says, in plain
  words, whether the active project's memory would let a fresh agent resume, with the
  timestamp of the last good build. Not six tiles. One honest answer.

### P1 — Simplify the UI (make it much easier to use)
- **U1. Progressive disclosure.** Keep the top cockpit (active project + readiness + primary
  action) always visible. Move the ~15 secondary panels behind a small number of tabs or an
  "Advanced" drawer (candidate groups: Work, Memory, Machines, Skills/Agents, Setup). Render
  only the active group. Nothing below the fold should load work the user did not ask for.
- **U2. Collapse the command stack.** Six ambiguous buttons become one primary action that
  adapts to state (Start Work / Continue / End Work) plus a clearly separated tool switch
  (Claude vs Codex) and a single Sync. Remove duplicate sync buttons scattered in panels.
- **U3. Plain-language state.** Replace jargon-y micro-labels with what to do next. Every
  colored dot needs a one-line "why" and, when not green, a single button that fixes it.
- **U4. First-run clarity.** A new user should understand in 10 seconds: pick project ->
  Start Work -> switch tools safely -> End Work. Make that path unmissable.

### P2 — Performance and code health
- **P-1. Measure first.** Time a full dashboard refresh and each `/api/*` handler on a real
  registry. Record numbers in the ledger before optimizing. No speculative optimization.
- **P-2. Avoid redundant scans.** If summary recomputes Git status and source hashes for
  every project on every refresh, cache by mtime/hash and only recompute what changed.
- **P-3. Render less.** `app.js` should update only changed DOM, not rebuild every panel on
  each refresh. Split `app.js` and `semantic-memory.mjs` into cohesive modules only if it
  reduces risk; keep tests green and behavior identical.
- **P-4. Client fetches in parallel** where independent, and never block first paint on
  optional cloud calls.

### P3 — Robustness and polish
- Consistent error surfacing from `/api/*` (every catch returns a useful message the UI
  shows). Loading and empty states for every list. Keyboard and accessibility passes on
  dialogs. Guard against a missing/renamed project folder without crashing a refresh.

Do not treat this list as fixed. As you learn the code, add, re-rank, and split items in
the ledger. Always leave the backlog ordered by value.

---

## 4. Memory correctness contract (the thing Kevin cares about most)

An iteration that touches memory is not done until you have demonstrated a round-trip, not
just read the code:

1. Pick a real registered project (or a temp fixture).
2. Trigger a build (`POST /api/memory/auto-setup` and the semantic rebuild path, or call the
   `rebuildSemanticMemory` export directly in a test).
3. Open ONLY `.ai-memory/semantic/CONTEXT_CAPSULE.md` and `AGENT_STARTUP.md`.
4. From those two files alone, answer: What is this project? What branch and is it dirty?
   What was the last handoff? What are the next tasks? Where does the relevant code live?
5. If any answer is missing, wrong, or stale, that is the bug. Fix the generator, not the
   test, then repeat until the two files are sufficient.
6. Lock the win with an automated assertion so it cannot silently regress.

Treat "memory works" as: a cold agent reading those two files resumes correctly without the
chat history. Everything in the memory workstream serves that sentence.

---

## 5. Guardrails (non-negotiable)

- Simplicity first. No features beyond the item. No abstraction for single-use code. If 200
  lines can be 50, write 50. Three similar lines beat a premature abstraction.
- Surgical diffs. Every changed line traces to the current item. Do not reformat files.
- No new runtime dependencies and no build step. Stay pure Node + vanilla browser JS.
- Keep `npm run check` and `npm test` green at the end of every iteration. Never leave the
  tree broken between iterations.
- Preserve API request/response shapes unless the item is explicitly to change them; the
  frontend and tests depend on them.
- Writing style in any docs or UI copy you author: no em dashes (brand rule), plain direct
  language, say what a control does, not how the user feels.
- Branch, do not push to `master` directly. Commit messages end with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- This is Kevin's live sync tool and it manages real files. Prefer reversible changes.
  Never delete a user's project registry entries or `.ai-memory` content as a side effect.

---

## 6. Definition of done and stop conditions

Stop scheduling new iterations and post a final report when ALL of these hold:
1. Memory round-trip (Section 4) is demonstrated and locked by an automated test, and the
   dashboard shows one honest "can a fresh agent resume?" signal for the active project.
2. The default view shows the cockpit plus at most a handful of grouped, progressively
   disclosed sections instead of ~18 always-on panels, and the primary path
   (pick -> Start -> switch -> End) is obvious to a first-time user.
3. A full dashboard refresh is measurably faster than the recorded baseline, with numbers
   in the ledger, and no panel does redundant per-refresh recomputation.
4. `npm run check` and `npm test` are green, tests cover the new behavior, and the app runs
   end to end (server boots, dashboard loads, core actions work in the browser).
5. `docs/FABLE5-PROGRESS.md` reflects reality: every shipped change logged with how it was
   verified, and the backlog contains only genuinely optional polish.

If you cannot make progress (blocked on a decision only Kevin can make, or a change would be
irreversible), stop and write the specific question into the ledger instead of guessing.

---

## 7. Ledger format (docs/FABLE5-PROGRESS.md)

Keep it short and current:
```
## Baseline (fill on iteration 1)
- check: pass/fail   tests: N pass   refresh time: Xms   notes: ...

## Done
- [ID] one line: what changed | files | how verified | commit

## In progress
- [ID] current item, current step in the protocol

## Backlog (ordered by value)
- P0 ... P1 ... P2 ... P3 ...

## Open questions for Kevin
- ...
```

Begin now: read the ledger (create it from the Section 7 template if missing), then run one
iteration. Iteration 1 should establish the baseline (Section 6.3 numbers) and take M1 or
U1, whichever you can land cleanly.
