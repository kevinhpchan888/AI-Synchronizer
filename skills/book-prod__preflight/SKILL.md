---
name: preflight
description: "Validation gate for every PDF and EPUB before shipping: font embedding, PDF/A or PDF/X via veraPDF, trim and page count, 300 DPI, sRGB for KDP, EPUBCheck 5.3.0 zero errors, EPUB Accessibility 1.1 metadata. Emits one pass/fail report with fixes. Trigger on preflight, validate, check, gate, ship, or release."

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
