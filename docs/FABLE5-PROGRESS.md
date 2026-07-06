# Fable 5 Optimization Loop: Progress Ledger

Companion to `docs/FABLE5-OPTIMIZATION-LOOP.md`. Read this first, write it last, every iteration.

## Baseline (recorded 2026-07-07, iteration 1, MacBook Pro, real registry)
- check: pass
- tests: 14 pass (15 after M1 landed)
- route timings (curl, warm server): `/` 0.04s, `/api/summary` **4.93s**, `/api/memory` 0.11s,
  `/api/skills` 0.14s, `/api/agents` 0.28s, `/api/projects` 0.06s, `/api/tools` 0.30s
- notes: `/api/summary` is the whale; the dashboard blocks on it every refresh. It likely
  recomputes git status + memory status + source hashes for every registered project.
  That is the P2 P-2 target and the number to beat.

## Done
- [M1] Memory round-trip test: cold agent recovers project, branch, dirty state, last
  handoff, open tasks, and code location from CONTEXT_CAPSULE.md + AGENT_STARTUP.md alone
  | test/memory-roundtrip.test.mjs | verified: new test passes, full suite 15/15, server
  boots, GET / 200, /api/summary returns data | commit b37d74b on fable5/optimization-loop.
  Finding: the generator already carries all five facts; the test locks it in.

- [H1] Hermes context slim: bridge markdown is now a thin routing table (name, path,
  readiness, capsule, packet; attention line only when not ready); managed SOUL block,
  per-profile skill, and rule file compressed. Recall prompts, handoff excerpts, and
  changed-file lists removed from the bridge; they live in the capsule and projects.json
  (both verified intact). Measured on 8-project fixture: per-agent session context
  9,082 -> 4,245 bytes (53% cut), bridge 153 -> 66 lines. Size-guard + no-bloat + no-loss
  test added | src/lib/hermes-bridge.mjs, test/hermes-bridge.test.mjs | verified: 16/16
  tests, check pass, before/after measured with same fixture | commit on
  fable5/optimization-loop.

- [H2] Hermes round-trip test: a cold profile starting from ONLY its SOUL.md navigates
  the chain by parsing pointers out of each file (SOUL -> bridge -> capsule -> packet)
  and recovers the same five facts as M1 (project, branch, dirty state, handoff, tasks,
  code location). Also covers re-install discovering a newly added profile |
  test/hermes-roundtrip.test.mjs | verified: 17/17 tests, check pass | commit on
  fable5/optimization-loop.

- [H4] Stale bridge honesty verified and locked. Finding: the worker path was already
  correct (handleJob rewrites the bridge after every memory job via
  publishHeartbeat -> installHermesMemoryBridge), but nothing tested the semantics. New
  lifecycle test: bridge shows ready -> project file changes -> reinstall shows attention
  line and non-ready readiness -> refresh_memory job heals -> reinstall shows ready
  again | test/hermes-bridge.test.mjs | verified: 18/18 tests, check pass | commit on
  fable5/optimization-loop. Note: on machines without the worker, the bridge only
  refreshes when Install Hermes Bridge is clicked; the Generated timestamp in the bridge
  lets agents detect drift.

- [M2] Fixed self-dirtying memory: .ai-memory/events/*.jsonl appends (written on Start
  Work, tool switches, checkpoints) were included in the staleness source hash, so the
  memory tile flipped yellow immediately after every switch. Root cause of "not clear how
  well it works". Events stay indexed for search but are excluded from the hash; real
  file changes still flip stale (RED->GREEN, same test asserts both directions) |
  src/lib/semantic-memory.mjs (sourceHash), test/semantic-memory.test.mjs | verified:
  19/19 tests, check pass, server boots, /api/memory returns honest state | commit 55b50b2.

- [M4] One-glance memory truth: memory status now carries a resume verdict (ready bool,
  plain headline, what-to-do detail, lastBuiltAt). Active-project memory tile shows it
  verbatim instead of "85% + graph" / "220 entities · 450 relations". Client falls back
  to old rendering if the API lacks the field | src/lib/memory.mjs, public/app.js,
  test/memory-status.test.mjs | verified: 20/20 tests, check pass, live API on side port
  returns honest verdict for real registry | commit 3ce73a2. NOTE: Kevin's long-running
  console (PID uptime 2+ days) serves old server code until restarted; new app.js is
  served from disk immediately.

- [U1] Progressive disclosure shipped: cockpit + flow strip + Next Best Actions stay
  visible; the other ~14 panels are grouped under six tabs (Overview, Memory, Projects,
  Skills & Agents, Machines & Setup, More). Hidden-not-removed so existing wiring works;
  active tab persists in localStorage | public/index.html, public/app.js,
  public/styles.css | verified in Chrome on side-port server: default view, tab switch,
  persistence across reload, M4 verdict visible in flow strip | commit 5e7a821.

- [U2] Command stack collapsed 6 -> 4 controls: Start Work primary; Claude/Codex is a
  segmented "Work in" switch highlighting the active tool (click other side = existing
  handoff flow); End Work + Sync Now share a row; Memory Status removed from cockpit
  (verdict lives in flow strip, detail in Memory tab; handler kept, optional-chained) |
  public/index.html, public/app.js, public/styles.css | verified in Chrome: layout,
  active-tool highlight, zero console errors on fresh load; 20/20 tests | commit 6ed7ac1.

- [P-2] Summary refresh 4.93s -> 0.28s warm (94% cut). Root cause: getCloudStatus ran
  "vercel whoami" (network call, 15s timeout) on EVERY /api/summary. Auth answer now
  cached 10 min, timeout capped at 5s, response shape unchanged; cache semantics locked
  by test. Profiled all summary() components first: cloud 1.7s, skills 133ms, git x9
  80ms, tools 78ms, memory 72ms, rest negligible | src/lib/cloud.mjs,
  test/cloud-status.test.mjs | verified: cold 1.98s, warm 0.28/0.28/0.27s on real
  registry; 21/21 tests | commit 736466e.

- [M3] Capsule/packet dedupe (folds in H3): capsule markdown is now the short brief only
  (recovery prompt, identity, summary, handoff, tasks, rules, read-next); Memory Health,
  Changed Since Handoff, and Important Files inventories live in the packet alone.
  Capsule JSON keeps full data for the Hermes worker and cloud. 1,853 -> 1,321 bytes /
  76 -> 48 lines on a small fixture, more on real projects. Both round-trip tests pass,
  proving no recoverable fact was lost; compactness locked by assertions |
  src/lib/semantic-memory.mjs, test/semantic-memory.test.mjs | verified: 21/21 tests,
  before/after measured on identical fixture | commit b9baf68.

## STOP CONDITIONS MET (2026-07-07, iteration 10)
All five Section 6 conditions of the loop brief hold:
1. Memory round-trip demonstrated + locked (M1, H2); one honest resume signal (M4).
2. Default view = cockpit + 6 tabs (U1); command stack 6 -> 4 controls (U2); the
   pick -> Start -> switch -> End path is the visible spine of the page.
3. Refresh 4.93s -> 0.28s warm, measured and recorded (P-2).
4. check + 21/21 tests green; app verified end to end in the browser.
5. Ledger reflects reality. Remaining backlog is optional polish only.
Loop wound down. Remaining backlog items stay valid entry points for a future loop.

## In progress
- (loop stopped; nothing in flight)

## Backlog (ordered by value; seeded from the brief, keep it live)
- P0b H5 Worker efficiency: reuse P-2 caching in buildHermesMemoryStatus
- P1 U3 Plain-language state + one fix-it button per warning
- P1 U4 First-run clarity: pick -> Start -> switch -> End
- P2 P-2b Remaining refresh cost is ~0.3s (skills scan 133ms, git 80ms); only optimize if felt
- P2 P-3 Render only changed DOM; split oversized files if it lowers risk
- P2 P-4 Parallel client fetches; never block first paint on cloud
- P3 Error surfacing, loading/empty states, a11y on dialogs, missing-folder safety

## Live environment constraints (from Kevin, 2026-07-07 night — do NOT violate)
- All 9 ~/.hermes configs were rewritten tonight (GLM coding-plan provider, compression
  caps, GPT-5.5 fallback). NEVER restore ~/.hermes from repo templates or pre-tonight
  backups. This loop only touches Hermes via temp fixtures (mkdtemp); keep it that way.
- Do not run skill sync, Sync Agent Environment, installers, or restore scripts against
  the live machine from this loop. Code + tests only.
- env/portable-agent-profile and cos/profile/gateway-wrapper.sh.template are STALE vs
  live wrappers (webhook env exports on cos/donny). Do not "fix" live config from
  templates; if template drift needs correcting, update the template FROM live, and only
  when Kevin asks.
- Ports in use tonight: 8645/8646 (webhooks), 8009 (ChatMock), plus 47831 (Kevin's live
  console, uptime 2+ days). Test servers use 47899+.
- The generated ai-sync skill in Hermes profiles was deliberately left untouched by
  tonight's pruning; the APC installer now has an exclude list. Bridge installs remain
  Kevin-triggered, not loop-triggered.
- Hermes gateways restarted ~5x tonight; connection blips in worker logs from tonight
  are expected, not bugs.

## Open questions for Kevin
- (none yet)
