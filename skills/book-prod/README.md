# LumosBooks Production Cluster (Windows native)

10-skill cluster that turns a single Markdown brief into KDP paperback PDFs, EPUB3, digital PDFs, and Shopify packages.

**Install path:** `%USERPROFILE%\.claude\skills\book-prod\`
**Project path:** `%USERPROFILE%\BookProjects\<slug>\`

## First run
```powershell
# 1. Install toolchain (run from elevated PowerShell)
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.claude\skills\book-prod\_install\master-install.ps1"

# 2. Verify
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.claude\skills\book-prod\_install\verify.ps1"
```

## Skills
1. `book-production-installer` — bootstrap toolchain
2. `brand-system` — multi-imprint tokens (LumosRead loaded)
3. `interior-layout` — Typst/LaTeX/EPUB engine
4. `cover-design` — KDP wraparound + ebook cover
5. `activity-generator` — puzzles, mazes, sudoku, tracing
6. `image-integration` — NanoBanana → print-ready
7. `preflight` — PDF/EPUB validation gate
8. `project-orchestrator` — top-level entry point
9. `shopify-deliverable` — digital download package

See `PLATFORM_NOTES.md` for Windows-specific deviations from the original macOS spec.
