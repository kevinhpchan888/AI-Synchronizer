---
name: lumosbooks-installer
description: Installs and verifies the LumosBooks book-production toolchain on Windows native (Typst, Pandoc, MiKTeX/LaTeX, Quarto, Ghostscript, ImageMagick, Java 21, EPUBCheck 5.3.0, scoop, potrace, Vivliostyle CLI, mermaid-cli, pdf-lib, rembg, genxword, mazelib, Eisvogel template). Use whenever Kevin asks to install, set up, bootstrap, repair, verify, fix, or check the LumosBooks / book-prod / book production toolchain, or whenever any other lumosbooks-* skill reports a missing binary like typst, pandoc, xelatex, epubcheck, ghostscript, qqwing, or veraPDF.
---

# LumosBooks installer

You install and verify the toolchain on Kevin's Windows machine. **Kevin never runs scripts manually — you execute every command using the Bash or PowerShell tool.**

## When to invoke
Triggers: "install book stack", "set up LumosBooks", "verify book production", "bootstrap book-prod", "missing typst", "fix preflight tools", "EPUBCheck not working", or any other lumosbooks-* skill reporting a missing tool.

## Prerequisites check (always run first)
Use PowerShell:
```powershell
winget --version
Get-Command typst, pandoc, xelatex, gswin64c, magick, mmdc, vivliostyle, epubcheck, java, node, python, ebook-convert, pdftotext, scoop, potrace, qqwing, verapdf -ErrorAction SilentlyContinue | Select Name, Source
```
Skip any tool that's already present.

## Install order (one PowerShell command per tool, idempotent)

Use `winget install --id <Id> --silent --accept-source-agreements --accept-package-agreements` for each:

| Tool | winget Id |
|---|---|
| Typst | `Typst.Typst` |
| Pandoc | `JohnMacFarlane.Pandoc` |
| MiKTeX (LaTeX) | `MiKTeX.MiKTeX` |
| Quarto | `Posit.Quarto` |
| Ghostscript | `ArtifexSoftware.GhostScript` |
| ImageMagick | `ImageMagick.ImageMagick` |
| Java 21 (Temurin) | `EclipseAdoptium.Temurin.21.JDK` |

After winget installs:
1. Refresh PATH: `$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')`
2. Install scoop if missing: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force; irm get.scoop.sh | iex`
3. `scoop install potrace`
4. **EPUBCheck 5.3.0**: download zip from `https://github.com/w3c/epubcheck/releases/download/v5.3.0/epubcheck-5.3.0.zip`, extract to `$env:USERPROFILE\.claude\skills\book-prod\_install\epubcheck\`, then write a `$env:USERPROFILE\.local\bin\epubcheck.cmd` wrapper that calls `java -jar <path>\epubcheck.jar %*`. Add `%USERPROFILE%\.local\bin` to user PATH if missing.
5. **Eisvogel template**: download `https://github.com/Wandmalfarbe/pandoc-latex-template/releases/latest/download/Eisvogel.zip`, extract `eisvogel.latex`, copy to `$env:APPDATA\pandoc\templates\eisvogel.latex`.
6. **Python venv** at `$env:USERPROFILE\.claude\skills\book-prod\_install\venv`: `python -m venv <path>`, then `<path>\Scripts\pip install --upgrade pip "rembg[cpu]>=2.0.75" "genxword==2.2.0" mazelib Pillow pypdf reportlab svgwrite jsonschema pyyaml lxml`.
7. **npm globals**: `npm install -g @vivliostyle/cli@10.3.1 @mermaid-js/mermaid-cli pdf-lib`
8. **MiKTeX auto-install on demand**: `initexmf --set-config-value=[MPM]AutoInstall=1`

## Tools that need manual user action (tell Kevin clearly)
- **veraPDF** — vendor only ships an installer EXE. Print the URL `https://verapdf.org/software/` and ask Kevin to download + run it.
- **qqwing** — no Windows package exists. Tell Kevin sudoku generation is unavailable until he installs qqwing manually (build from https://qqwing.com or use WSL2). Everything else works without it.
- **OFL fonts** — fonts.google.com download API needs a browser session. List the font families (EB Garamond, Crimson Pro, Source Serif 4, Inter, JetBrains Mono, Lora, Merriweather, Spectral) and ask Kevin to install them from fonts.google.com.

## Verify (always run after install)
For each tool, call its `--version` (or equivalent) via PowerShell. Use `pdffonts -v 2>&1`, `java -version 2>&1`, `epubcheck --version`. For venv tools: `& "$env:USERPROFILE\.claude\skills\book-prod\_install\venv\Scripts\python.exe" -c "import genxword, mazelib, rembg"`.

Report a pass/fail count. Save the output to `$env:USERPROFILE\.claude\skills\book-prod\_install\verify.log`.

## Known issues
- After winget installs, the *current* PowerShell session won't see new commands — refresh PATH or open a new shell.
- MiKTeX may prompt on first xelatex run to install missing packages; with AutoInstall=1 it installs silently.
- npm EACCES → `npm config set prefix $env:APPDATA\npm` and add `%APPDATA%\npm` to PATH.
- rembg first run downloads `u2net.onnx` (~170 MB); if it stalls, pre-place file in `%USERPROFILE%\.u2net\`.

## What's already installed on AMVPC (skip these)
Calibre 9.5.0, Node 24.11.1, Python 3.14.0rc3, Poppler 4.00.

## Support tree
All shared assets live at `$env:USERPROFILE\.claude\skills\book-prod\` (templates, schemas, references, examples, helper Python). The 9 lumosbooks-* skills consume from there.
