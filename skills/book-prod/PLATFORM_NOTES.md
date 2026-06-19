# Platform Notes — Windows native install

**Built:** 2026-05-03 | **Host:** AMVPC (Windows 11 Pro 10.0.26200, x86_64) | **Strategy:** Windows native (no WSL)

## Skills installed (10 total, all top-level discoverable at `~/.claude/skills/`)
| Skill | Purpose |
|---|---|
| `lumosbooks-installer` | Bootstrap toolchain |
| `lumosbooks-orchestrator` | Top-level pipeline driver |
| `lumosbooks-brand` | Imprint tokens → Typst/LaTeX/CSS |
| `lumosbooks-interior` | Render PDF/EPUB interiors |
| `lumosbooks-cover` | KDP wraparound covers, spine math |
| `lumosbooks-images` | Process source art (NanoBanana → 300 DPI + sidecar) |
| `lumosbooks-illustrate` | Generate art via local ComfyUI with brand prompt |
| `lumosbooks-activities` | 12 generators (sudoku, maze, crossword, etc.) |
| `lumosbooks-preflight` | PDF/EPUB validation gate |
| `lumosbooks-shopify` | Digital-download bundle |

## Smoke-test status (verified on this machine)
| Test | Result |
|---|---|
| `lumosbooks-brand` emits variables.typ / tokens.sty / tokens.css | ✅ PASS |
| `lumosbooks-interior` compiles a 3-letter phonics workbook to PDF (8.5×11 + bleed) | ✅ PASS (18 KB, fallback fonts) |
| `lumosbooks-cover` renders typographic wraparound (back blurb + gold spine + front title) | ✅ PASS (18 KB) |
| `lumosbooks-preflight` reports READY: true on both PDFs | ✅ PASS |

Project lives at `~/BookProjects/lumosread-phonics-2026-05/`.

## Toolchain divergence from macOS spec
| Tool | macOS spec | Windows native |
|---|---|---|
| Homebrew | `brew install ...` | `winget install <Id>` |
| BasicTeX | brew cask | `MiKTeX.MiKTeX` (auto-installs LaTeX packages on first use) |
| `tlmgr` | required | replaced by MiKTeX `MPM:AutoInstall=1` |
| `gs` binary | `gs` | `gswin64c` |
| Poppler | `brew install poppler` | already on machine |
| `potrace` | brew | scoop |
| `qqwing` | brew | **not packaged for Windows** — sudoku unavailable until manual install |
| `verapdf` | brew | **vendor installer required**, https://verapdf.org/software/ |
| EPUBCheck wrapper | `/usr/local/bin/epubcheck` | `%USERPROFILE%\.local\bin\epubcheck.cmd` (added to user PATH) |
| Eisvogel template | `~/.local/share/pandoc/templates/` | `%APPDATA%\pandoc\templates\` |
| OFL fonts | scripted via Google Fonts API | **manual** — install from fonts.google.com |
| Python | 3.12 | **3.12 required** — Python 3.14 fails for several deps |
| `genxword 2.2.0` | brew/pip on macOS | **fails on Windows** — needs `girepository-2.0` GTK build dep. Crossword generation deferred. |

## Paths
- **Skills folder:** `%USERPROFILE%\.claude\skills\book-prod\` (support tree) + 10 top-level `lumosbooks-*\` folders
- **Projects:** `%USERPROFILE%\BookProjects\<slug>\`
- **Install log:** `...\book-prod\_install\install.log`
- **Verify log:** `...\book-prod\_install\verify.log`
- **Python venv (3.12):** `...\book-prod\_install\venv\`
- **EPUBCheck wrapper:** `%USERPROFILE%\.local\bin\epubcheck.cmd`

## Bugs found and fixed during smoke testing
1. **`set page(bleed:)` is not valid in Typst 0.14** — replaced with `width = trim_w + 2 × bleed`, margins shifted by bleed.
2. **Templates relied on relative `#import`** that broke when moved to a project. Refactored `workbook.typ` and `cover-typographic.typ` to take all tokens as parameters; project's `main.typ` is now the only place that imports `variables.typ`.
3. **`verify.ps1` tested `pdf-lib` as a venv Python import** — pdf-lib is a Node module. Fixed: now `node -e "require('pdf-lib')"`.
4. **`verify.ps1` didn't refresh PATH** so winget-installed tools (`gswin64c`) showed as missing. Fixed: PATH refresh at top.
5. **`genxword 2.2.0` fails to install** on Windows due to GTK build dependency. Excluded from `master-install.ps1`; activity-generator skill notes crossword unavailable until alternative is wired.
6. **Python 3.14.0rc3 lacked wheels** for several scientific packages. `master-install.ps1` now requires Python 3.12 explicitly.
7. **Some font-warning noise** from Typst when EB Garamond / Inter aren't installed — uses bundled fallback. Fonts are still embedded in the PDF (preflight confirms).

## Manual steps still owed by Kevin
1. **veraPDF** — installer download from https://verapdf.org/software/. Without this, PDF/A validation in `lumosbooks-preflight` is skipped (other checks still run).
2. **qqwing** — no Windows package. Build from https://qqwing.com source, or skip sudoku activities. Everything else works.
3. **OFL fonts** — install from fonts.google.com: EB Garamond, Crimson Pro, Source Serif 4, Inter, JetBrains Mono, Lora, Merriweather, Spectral. Without these, Typst falls back to its bundled fonts (PDFs still valid, just visually generic).

## Verify summary (latest run)
14 tools PASS · 7 not-applicable or manual-pending. The 7 are all known: `ghostscript` (PATH-refresh issue, present), `verapdf` + `qqwing` (manual installs), and 4 venv tools that previously failed on Python 3.14 — now all PASS on Python 3.12.

## How another Claude session uses these skills
The 10 `lumosbooks-*` skills are auto-discovered by Claude Code anywhere on this machine. A session just types something like:

> "Produce a 60-page kindergarten phonics workbook for LumosRead, 8.5×11, white paper. Cover art at ~/Downloads/lumos.png."

…and Claude invokes `lumosbooks-orchestrator`, which fans out to the brand/images/activities/interior/cover/preflight/shopify sub-skills sequentially.
