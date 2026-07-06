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

## In progress
- (nothing; next up: M2 staleness honesty, then P2 P-2 using the 4.93s baseline)

## Backlog (ordered by value; seeded from the brief, keep it live)
- P0 M2 Staleness honesty + fix self-dirtying .ai-memory
- P0 M3 Capsule quality: compact, answers "what next"
- P0 M4 One-glance memory truth signal on dashboard
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
