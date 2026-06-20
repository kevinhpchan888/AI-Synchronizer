---
name: book-production-installer
description: Bootstraps the entire LumosBooks production toolchain on Windows native (Typst 0.14.2 via winget, Pandoc 3.9.x via winget, MiKTeX, Quarto 1.9.18, Calibre, Vivliostyle CLI 10.3.1, Ghostscript, ImageMagick, Poppler, rembg 2.0.75, potrace 1.16 via scoop, EPUBCheck 5.3.0 with cmd wrapper, veraPDF, mermaid-cli, pdf-lib, qqwing 1.3.4, genxword 2.2.0, mazelib, OFL fonts). Use this skill whenever Kevin asks to install, set up, bootstrap, repair, or verify the book production stack, or whenever any other book-prod skill reports a missing binary. Always run install first, then verify; never assume the toolchain is present.
---

# Book Production Installer (Windows native)

## When to invoke
Trigger on phrases like "install book stack", "set up book production", "bootstrap LumosBooks", "verify cluster", "missing typst", "fix preflight tools".

## Procedure
1. Confirm winget is present (`winget --version`).
2. Run `powershell -ExecutionPolicy Bypass -File %USERPROFILE%\.claude\skills\book-prod\_install\master-install.ps1` from an **elevated** PowerShell.
3. After completion, run `verify.ps1` from any PowerShell.
4. If any check fails, retry just the failing tool's install command (do not reinstall everything).
5. Report final pass/fail counts and the path to `install.log`.

## Manual steps (cannot be automated)
- **veraPDF**: download installer from https://verapdf.org/software/, run, ensure `verapdf.bat` on PATH.
- **qqwing**: not in winget/scoop. Either build from source (https://qqwing.com), grab a community Windows build, or run via WSL2.
- **OFL fonts**: download from fonts.google.com (EB Garamond, Crimson Pro, Source Serif 4, Inter, JetBrains Mono, Lora, Merriweather, Spectral) and right-click → Install for all users.

## Failure recovery rules
- **MiKTeX missing package**: ensure `MPM:AutoInstall=1`. First `xelatex` run will pull missing packages interactively if not.
- **npm EACCES**: `npm config set prefix %APPDATA%\npm` and add `%APPDATA%\npm` to PATH.
- **rembg ONNX download fails**: pre-create `%USERPROFILE%\.u2net\` and download `u2net.onnx` from rembg releases.
- **EPUBCheck "java not found"**: re-run the JDK install line: `winget install EclipseAdoptium.Temurin.21.JDK`.
- **scoop install fails**: ensure `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Examples
- "Install the book production cluster on this Windows PC."
- "Verify all book production tools are working."
- "Re-install only the LaTeX packages, the rest is fine."
