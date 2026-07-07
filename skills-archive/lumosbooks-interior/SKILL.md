---
name: lumosbooks-interior
description: Produces book interiors (KDP-ready paperback PDF, digital PDF with bookmarks/hyperlinks, EPUB3 that passes EPUBCheck 5.3.0) from a Markdown brief plus brand tokens. Handles prose chapters, study guides, workbooks, journals, planners, and activity books with single-column, two-column, marginalia, full-bleed, and exercise layouts. Respects KDP trim, bleed (0.125 in), and inside-margin minimums (0.375 in for 24-150 pp; 0.5 in for 151-300 pp; 0.625 in for 301-500 pp; 0.75 in for 501-700 pp; 0.875 in for 701-828 pp). Use whenever Kevin asks to lay out, format, typeset, render, or produce a book, manuscript, workbook, study guide, planner, journal, or interior PDF/EPUB.
---

# LumosBooks interior layout

You compile manuscripts into print-ready PDFs and EPUB3.

## Engine selection
1. **Default: Typst 0.14.x** — fast, deterministic, embeds fonts cleanly.
2. **Eisvogel + XeLaTeX** when the brief sets `engine: latex`, or microtype/BibLaTeX is required.
3. **Vivliostyle** only when CSS-paged HTML output is needed.

## Templates
- `~/.claude/skills/book-prod/interior-layout/assets/templates/typst/{workbook,study-guide,prose-book}.typ`
- `~/.claude/skills/book-prod/interior-layout/assets/templates/latex/eisvogel-lumosread.latex`

## Map content_type → template
| content_type | template | mode |
|---|---|---|
| `workbook`, `activity-book` | workbook.typ | default |
| `journal`, `planner` | workbook.typ | `mode: planner` |
| `study-guide`, `non-fiction-reference` | study-guide.typ | default |
| `prose`, `chapter-book` | prose-book.typ | default |

## Procedure
1. Read `<project>/brief.yaml`. Confirm `~/.claude/skills/book-prod/_shared/build/<imprint>/variables.typ` exists; if not, invoke `lumosbooks-brand` first.
2. Import the right template into `<project>/build/main.typ` and inject the manuscript chapters.
3. Compute geometry via `~/.claude/skills/book-prod/_shared/lib/kdp_geometry.py` (inside margin grows with page count).
4. Render targets via Bash:
   - Paperback: `typst compile <project>/build/main.typ <project>/out/<slug>-kdp.pdf --input target=kdp`
   - Digital:   `typst compile <project>/build/main.typ <project>/out/<slug>-digital.pdf --input target=digital`
   - EPUB:      `pandoc <project>/manuscript/*.md -o <project>/out/<slug>.epub --metadata-file=<project>/build/epub-meta.yaml --css=$HOME/.claude/skills/book-prod/_shared/build/<imprint>/tokens.css`
5. Use `~/.claude/skills/book-prod/_reference/epub3-metadata-template.opf` to fill EPUB accessibility metadata.
6. Hand off to `lumosbooks-preflight`.

## Trim sizes whitelist
6×9, 5×8, 5.5×8.5, 7×10, 8×10, 8.5×8.5, 8.5×11, 8.27×11.69 (A4). Reject anything else with the `~/.claude/skills/book-prod/_reference/kdp-trim-sizes.json` list.

## Examples
- "Lay out a 60-page kindergarten phonics workbook for LumosRead, 8.5×11, color interior."
- "Format manuscript.md as a 6×9 prose chapter book."
