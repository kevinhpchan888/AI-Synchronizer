---
name: activity-generator
description: Programmatically generates printable activity content (crossword puzzles via genxword 2.2.0, mazes via mazelib, sudoku via qqwing 1.3.4, dot-to-dot from SVG outlines, coloring pages from line-art images, fill-in-the-blank worksheets, multiple-choice quizzes, lined/dot-grid/graph/music-staff pages, journals/planners/logbooks for KDP no-content books, math worksheets per grade level, letter and number tracing, and word searches). Each sub-generator is deterministic, takes a JSON input, and outputs SVG or PDF that the interior-layout skill embeds. Use whenever Kevin asks for puzzles, exercises, worksheets, mazes, crossword, word search, sudoku, tracing, coloring pages, no-content, journal, planner, or logbook.
---

# Activity Generator

## Sub-generators (under `scripts/`)
| Generator | Library | Script | Output |
|---|---|---|---|
| Crossword | genxword 2.2.0 | `gen_crossword.py` | SVG + clue list |
| Word search | custom | `gen_wordsearch.py` | SVG |
| Maze | mazelib | `gen_maze.py` | SVG |
| Sudoku | qqwing 1.3.4 | `gen_sudoku.py` | SVG |
| Dot-to-dot | svgwrite | `gen_dot2dot.py` | SVG |
| Coloring page | potrace + ImageMagick | `gen_coloring.py` | SVG |
| Fill-in-blank | regex | `gen_fill_blank.py` | Markdown |
| MCQ quiz | custom | `gen_mcq.py` | Markdown |
| Lined/grid pages | svgwrite | `gen_paper.py` | SVG |
| Math worksheets | custom | `gen_math.py` | Markdown |
| Tracing | svgwrite | `gen_trace.py` | SVG |
| Music staff | svgwrite | `gen_staff.py` | SVG |

## Procedure
1. Read `brief.yaml`, find `activities:` array.
2. For each entry, call the matching script with JSON params.
3. Place outputs under `assets/activities/<slug>/`.
4. Emit `activities.manifest.json` for interior-layout to read.

## Windows note
- `qqwing` is not packaged for Windows. Sudoku generation will fail until Kevin installs it manually or via WSL fallback. All other generators work natively.

## Examples
- "Generate a 10-puzzle crossword section using these vocabulary words."
- "Make a 30-maze book at 8.5×11 with progressive difficulty."
