---
name: preflight
description: Runs the full validation gauntlet on every PDF and EPUB before any deliverable ships. Checks PDF font embedding (pdffonts emb=yes for all fonts), PDF/A or PDF/X conformance via veraPDF when requested, page count and trim-size match, image DPI ≥ 300, color space sRGB for KDP. Validates EPUB3 with EPUBCheck 5.3.0 (zero errors required), checks EPUB Accessibility 1.1 metadata (schema:accessMode, schema:accessibilityFeature, schema:accessibilityHazard MUST be present per W3C REC 17 Oct 2024; schema:accessibilitySummary and schema:accessModeSufficient SHOULD; dcterms:conformsTo and a11y:certifiedBy MUST appear when claiming conformance). Emits a single pass/fail report with actionable fixes. Use whenever Kevin says preflight, validate, check, gate, ship, or release; and the orchestrator calls it before marking any project ready.
---

# Preflight

## Procedure
1. Discover artefacts in `out/`: `*.pdf`, `*.epub`, `*.jpg`.
2. For each PDF:
   - `pdffonts file.pdf` → every font row must show `emb=yes`.
   - `verapdf -f 1b file.pdf` if PDF/A claimed.
   - `pdfinfo` page size matches `expected_trim` ± 0.001 in.
   - `pdfimages -list` asserts min DPI ≥ 300.
3. For each EPUB:
   - `epubcheck file.epub --json out/preflight/<name>.epubcheck.json`
   - Require zero `severity: ERROR`.
   - Open `OEBPS/content.opf`; assert accessibility metadata.
4. Emit `out/preflight/report.md` and `report.json`.
5. If any error → `READY: false`.

## Fix table
| Failure | Auto-fix | Manual |
|---|---|---|
| Font not embedded | `gswin64c -dPDFSETTINGS=/prepress -dEmbedAllFonts=true -o fixed.pdf in.pdf` | Re-render with `--embed-fonts` |
| Image < 300 DPI | None | Replace asset; rerun image-integration |
| EPUB OPF-014 (missing modified date) | Auto-patch via `lxml` | Add `<meta property="dcterms:modified">` |
| Missing schema:accessibilityFeature | Auto-insert `["alternativeText", "tableOfContents"]` | Edit OPF |

Run via `scripts/preflight.ps1 <project-dir>` (Windows) or `scripts/preflight.sh` (bash).
