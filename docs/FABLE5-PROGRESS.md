# Fable 5 Optimization Loop: Progress Ledger

Companion to `docs/FABLE5-OPTIMIZATION-LOOP.md`. Read this first, write it last, every iteration.

## Baseline (fill on iteration 1)
- check: (run `npm run check`)
- tests: (run `npm test`, record pass count; seed = 14 passing)
- full dashboard refresh time: (measure GET / then GET /api/summary on real registry)
- per-route timings: (record slow /api/* handlers)
- notes:

## Done
- (nothing yet)

## In progress
- (nothing yet)

## Backlog (ordered by value; seeded from the brief, keep it live)
- P0 M1 Memory round-trip test (executable "memory works")
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
