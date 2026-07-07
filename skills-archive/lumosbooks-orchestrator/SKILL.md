---
name: lumosbooks-orchestrator
description: Top-level entry point that turns a single Kevin prompt like "produce a 60-page kindergarten phonics workbook for LumosRead 8.5x11 white paper color interior" into a finished, preflighted book deliverable (KDP paperback PDF, digital PDF, EPUB3, three cover concepts, Shopify package). Decomposes the request into a project brief, scaffolds the project folder under %USERPROFILE%\BookProjects\<slug>\, then sequentially invokes the lumosbooks-brand, lumosbooks-images, lumosbooks-activities, lumosbooks-interior, lumosbooks-cover, lumosbooks-preflight, and lumosbooks-shopify skills. Use whenever Kevin gives a high-level book/workbook/journal/study-guide request that does not name a specific sub-skill, or asks to "produce a book", "make a workbook", "ship a journal", "resume project X", "build the next title".
---

# LumosBooks orchestrator

You drive the end-to-end pipeline. Kevin gives a one-line prompt; you produce a finished book.

## Pipeline (sequential, with state.json checkpoints)
1. **Brief** — write `brief.yaml` from Kevin's prompt; validate against `~/.claude/skills/book-prod/_shared/schemas/project-brief.schema.json`.
2. **Brand** — invoke `lumosbooks-brand` to resolve the imprint into Typst/LaTeX/CSS variable files.
3. **Images** — invoke `lumosbooks-images` on `assets/source/` (Kevin's NanoBanana drops).
4. **Activities** — invoke `lumosbooks-activities` for puzzles/worksheets/tracing per the brief.
5. **Interior** — invoke `lumosbooks-interior` to render KDP paperback PDF + digital PDF + EPUB3.
6. **Cover** — invoke `lumosbooks-cover` for 3 concepts + KDP wraparound + ebook JPG.
7. **Preflight** — invoke `lumosbooks-preflight`. **Hard gate: do not proceed if any check fails.**
8. **Shopify** — invoke `lumosbooks-shopify` to build the digital download bundle.

## Project folder
Use PowerShell to scaffold under `$env:USERPROFILE\BookProjects\<slug>\`:
```
brief.yaml  brand/  manuscript/  assets/{source,processed,activities}/
build/  out/  preflight/  state.json
```

## state.json keys (set to `done` on success, `failed` otherwise; record ISO timestamp per step)
`brief_validated`, `brand_resolved`, `assets_processed`, `activities_generated`, `interior_built`, `cover_built`, `preflight_passed`, `shopify_packaged`

## Resume rule
If `state.json` exists and Kevin says "resume", skip steps marked `done` whose inputs haven't changed (mtime check). Re-run any step whose inputs are newer.

## Slug convention
`<imprint>-<topic>-<YYYY-MM>` lowercased and hyphenated. Example: `lumosread-phonics-2026-05`.

## Examples
- "Produce a 60-page kindergarten phonics workbook for LumosRead, 8.5×11, white paper, color interior. Cover art at ~/Downloads/lumos-phonics-cover.png."
- "Resume the phonics workbook project; I dropped new cover art."
- "Build a 7×10 study guide on Singapore O-Level physics, 200 pages."

## Reference brief examples
- `~/.claude/skills/book-prod/_reference/examples/lumosread-phonics-workbook/brief.yaml`
- `~/.claude/skills/book-prod/_reference/examples/lumosread-productivity-journal/brief.yaml`
- `~/.claude/skills/book-prod/_reference/examples/lumosread-study-guide/brief.yaml`

If any sub-skill reports a missing tool, invoke `lumosbooks-installer` to fix it, then resume.
