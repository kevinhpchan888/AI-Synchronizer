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

## In progress
- (nothing; next up: M4 one-glance memory truth, then U1/U2 UI simplification)

## Backlog (ordered by value; seeded from the brief, keep it live)
- P0 M3 Capsule quality: compact, answers "what next" (fold in H3 overlap dedupe)
- P0 M4 One-glance memory truth signal on dashboard
- P0b H5 Worker efficiency: reuse P-2 caching in buildHermesMemoryStatus
- P1 U1 Progressive disclosure: cockpit + grouped tabs/drawer
- P1 U2 Collapse the six-button command stack
- P1 U3 Plain-language state + one fix-it button per warning
- P1 U4 First-run clarity: pick -> Start -> switch -> End
- P2 P-1 Measure refresh + per-route timings first
- P2 P-2 Cache Git status / source hashes by mtime
- P2 P-3 Render only changed DOM; split oversized files if it lowers risk
- P2 P-4 Parallel client fetches; never block first paint on cloud
- P3 Error surfacing, loading/empty states, a11y on dialogs, missing-folder safety

## Open questions for Kevin
- (none yet)
