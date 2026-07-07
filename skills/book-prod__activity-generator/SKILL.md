---
name: activity-generator
description: "Deterministic generators for printable activity content: crosswords, word searches, mazes, sudoku, dot-to-dot, coloring pages, tracing, math worksheets, fill-in-the-blank, MCQs, lined and dot-grid and staff paper, journals, planners, logbooks. JSON in, SVG or PDF out for interior-layout. Trigger on puzzles, worksheets, no-content books, or any of those types."

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
