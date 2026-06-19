---
name: lumosbooks-preflight
description: Runs the full validation gauntlet on every LumosBooks PDF and EPUB before any deliverable ships. Checks PDF font embedding (pdffonts emb=yes for all fonts), PDF/A or PDF/X conformance via veraPDF when requested, page count and trim-size match, image DPI ≥ 300, color space sRGB for KDP. Validates EPUB3 with EPUBCheck 5.3.0 (zero errors required), checks EPUB Accessibility 1.1 metadata (schema:accessMode, schema:accessibilityFeature, schema:accessibilityHazard MUST be present per W3C REC 17 Oct 2024). Emits a single pass/fail report with actionable fixes. Use whenever Kevin says preflight, validate, check, gate, ship, or release a book; and the orchestrator calls it before marking any project ready.
---

# LumosBooks preflight gate

You validate every artifact and refuse to ship if anything fails.

## Procedure
1. Discover artifacts: `<project>/out/*.pdf`, `<project>/out/*.epub`, `<project>/out/*.jpg`.
2. For each PDF:
   - `pdffonts <file>` → every font row must show `emb=yes`. Use `Select-String 'no\s' -NotMatch` or grep.
   - Optional `verapdf -f 1b <file>` if PDF/A claimed.
   - `pdfinfo <file>` page size matches `expected_trim` ± 0.001 in.
   - `pdfimages -list <file>` → asserts image DPI ≥ 300.
3. For each EPUB:
   - `epubcheck <file> --json <project>/preflight/<name>.epubcheck.json`
   - Parse JSON; require zero `severity: ERROR`.
   - Open OEBPS/content.opf; assert presence of `schema:accessMode`, `schema:accessibilityFeature`, `schema:accessibilityHazard` per `~/.Codex/skills/book-prod/_reference/epub-a11y-1.1-checklist.md`.
4. Write `<project>/preflight/report.md` (human) and `report.json` (machine).
5. Set `state.json["preflight_passed"]` to `done` only on zero errors. Otherwise `failed` and **block downstream skills**.

## Fix table
| Failure | Auto-fix | Manual |
|---|---|---|
| Font not embedded | `gswin64c -dPDFSETTINGS=/prepress -dEmbedAllFonts=true -o fixed.pdf in.pdf` | Re-render with embed flag |
| Image < 300 DPI | None | Replace asset; re-run lumosbooks-images |
| EPUB OPF-014 (missing dcterms:modified) | Auto-patch via `lxml` on OPF | Add `<meta property="dcterms:modified">` |
| Missing schema:accessibilityFeature | Auto-insert `["alternativeText","tableOfContents"]` | Edit OPF |

A helper script lives at `~/.Codex/skills/book-prod/preflight/scripts/preflight.ps1` (Windows) and `preflight.sh` (bash) — call whichever fits the shell you're in.

## Examples
- "Preflight the phonics workbook before I upload to KDP."
- "Check the EPUB for accessibility compliance."
