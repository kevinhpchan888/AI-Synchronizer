---
name: interior-layout
description: "Produces book interiors from a Markdown brief plus brand tokens: KDP-ready paperback PDF, digital PDF, EPUB3 passing EPUBCheck. Handles prose, workbooks, study guides, journals, planners, activity books; respects KDP trim, bleed, and margin minimums. Trigger on lay out, format, typeset, render, or produce a book interior, manuscript, or interior PDF or EPUB."

---

# Interior Layout

## Engine selection rule
1. Default: **Typst 0.14.2**. Faster, deterministic, embeds fonts cleanly, native PDF tagging.
2. **Eisvogel 3.0.0 + XeLaTeX** when: microtype expansion needed, BibLaTeX with niche styles, or `engine: latex` in brief.
3. **Vivliostyle CLI 10.3.1** only when CSS-paged output is needed.

## Templates
- `assets/templates/typst/workbook.typ`
- `assets/templates/typst/study-guide.typ`
- `assets/templates/typst/prose-book.typ`
- `assets/templates/latex/eisvogel-lumosread.latex`

## Procedure
1. Load `_shared/build/<slug>/variables.typ`.
2. Read project `brief.yaml`. Resolve `content_type`:
   - `workbook` | `activity-book` → `workbook.typ`
   - `study-guide` | `non-fiction-reference` → `study-guide.typ`
   - `prose` | `chapter-book` → `prose-book.typ`
   - `journal` | `planner` → `workbook.typ` with `mode: planner`
3. Compute geometry via `_shared/lib/kdp_geometry.py`.
4. For each target:
   - paperback: `typst compile main.typ build/<slug>-kdp.pdf --input target=kdp`
   - digital:   `typst compile main.typ build/<slug>-digital.pdf --input target=digital`
   - epub:      `pandoc manuscript.md -o build/<slug>.epub --metadata-file=epub-meta.yaml --css=build/<slug>/tokens.css`
5. Hand off to `preflight`.

## Trim sizes whitelist
6×9, 5×8, 5.5×8.5, 7×10, 8×10, 8.5×8.5, 8.5×11, 8.27×11.69 (A4).

## Examples
- "Lay out a 60-page kindergarten phonics workbook for LumosRead, 8.5×11, color interior."
- "Format manuscript.md as a 6×9 prose chapter book."
