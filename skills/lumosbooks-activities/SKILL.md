---
name: lumosbooks-activities
description: Programmatically generates printable activity content for LumosBooks (crossword puzzles via genxword 2.2.0, mazes via mazelib, sudoku via qqwing 1.3.4, dot-to-dot, coloring pages via potrace, fill-in-the-blank, multiple-choice quizzes, lined/dot-grid/graph/music-staff pages, journals/planners/logbooks for KDP no-content books, math worksheets per grade, letter and number tracing, word searches). Each sub-generator is deterministic, takes JSON input, outputs SVG or PDF that lumosbooks-interior embeds. Use whenever Kevin asks for puzzles, exercises, worksheets, mazes, crossword, word search, sudoku, tracing, coloring pages, no-content book, journal pages, planner pages, logbook pages.
---

# LumosBooks activity generator

You generate printable activity assets and emit a manifest the interior layout reads.

## Scripts (under `~/.Codex/skills/book-prod/activity-generator/scripts/`)
- `gen_sudoku.py` — needs `qqwing` on PATH (Windows: not packaged; Sudoku unavailable until manual install)
- `gen_maze.py` — uses `mazelib`
- `gen_paper.py` — lined / grid / dot
- (More to add: gen_crossword, gen_wordsearch, gen_dot2dot, gen_coloring, gen_trace, gen_math, gen_mcq, gen_fill_blank, gen_staff)

Run scripts via the Python venv:
```bash
PY="$HOME/.Codex/skills/book-prod/_install/venv/Scripts/python.exe"
"$PY" "$HOME/.Codex/skills/book-prod/activity-generator/scripts/gen_maze.py" --count 30 --width 15 --height 15 --out "<project>/assets/activities/mazes"
```

## Procedure
1. Read `<project>/brief.yaml` → walk `activities:` array.
2. For each entry, dispatch to the matching script with its JSON params.
3. Place outputs under `<project>/assets/activities/<type>/`.
4. Emit `<project>/assets/activities/manifest.json` listing every generated asset (path, type, intended page).

## Library notes
- `genxword 2.2.0` — pinned, "limited maintenance" upstream; fine for now.
- `mazelib` — actively maintained.
- `qqwing` — Windows: tell Kevin to install manually; skip sudoku activities until then.
- `potrace` — installed via scoop.

## Examples
- "Generate a 10-puzzle crossword section using these vocabulary words."
- "Make a 30-maze book at 8.5×11 with progressive difficulty."
