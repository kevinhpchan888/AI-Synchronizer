# LumosBooks production cluster — Windows native master installer
# Run from elevated PowerShell:
#   powershell -ExecutionPolicy Bypass -File master-install.ps1
$ErrorActionPreference = 'Continue'
$Root = Join-Path $env:USERPROFILE '.claude\skills\book-prod'
$LogDir = Join-Path $Root '_install'
$Log = Join-Path $LogDir 'install.log'
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
Start-Transcript -Path $Log -Append | Out-Null

function Log($msg) { Write-Host "`n[book-prod] $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Fail($msg) { Write-Host "[FAIL] $msg" -ForegroundColor Red }

Log "Starting install at $(Get-Date)"

# 1. Verify winget
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Fail "winget not found. Install App Installer from Microsoft Store first."
    Stop-Transcript | Out-Null
    exit 1
}

# 2. winget packages (idempotent: --accept-source-agreements, skip if installed)
$wingetPackages = @(
    @{ Id = 'Typst.Typst';                       Name = 'Typst' },
    @{ Id = 'JohnMacFarlane.Pandoc';             Name = 'Pandoc' },
    @{ Id = 'MiKTeX.MiKTeX';                     Name = 'MiKTeX (LaTeX)' },
    @{ Id = 'Posit.Quarto';                      Name = 'Quarto' },
    @{ Id = 'ArtifexSoftware.GhostScript';       Name = 'Ghostscript' },
    @{ Id = 'ImageMagick.ImageMagick';           Name = 'ImageMagick' },
    @{ Id = 'EclipseAdoptium.Temurin.21.JDK';    Name = 'Java 21 (Temurin)' }
)
foreach ($p in $wingetPackages) {
    Log "winget install $($p.Name) ($($p.Id))"
    winget install --id $p.Id --silent --accept-source-agreements --accept-package-agreements 2>&1 | Out-Host
}

# 3. Already-installed tools (skip): Calibre, Node.js, Python, Poppler
Log "Skipping already-installed: Calibre, Node.js, Python, Poppler"

# 4. Scoop + potrace
if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Log "Installing Scoop"
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-RestMethod -Uri 'https://get.scoop.sh' | Invoke-Expression
}
Log "scoop install potrace"
scoop install potrace 2>&1 | Out-Host

# 5. Refresh PATH so the just-installed tools are visible to this session
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' +
            [System.Environment]::GetEnvironmentVariable('Path','User')

# 6. EPUBCheck 5.3.0 (Java jar + cmd wrapper)
$EcDir = Join-Path $Root '_install\epubcheck'
$BinDir = Join-Path $env:USERPROFILE '.local\bin'
New-Item -ItemType Directory -Force -Path $EcDir, $BinDir | Out-Null
$EcZip = Join-Path $env:TEMP 'epubcheck.zip'
Log "Downloading EPUBCheck 5.3.0"
Invoke-WebRequest -Uri 'https://github.com/w3c/epubcheck/releases/download/v5.3.0/epubcheck-5.3.0.zip' -OutFile $EcZip
Expand-Archive -Force -Path $EcZip -DestinationPath $EcDir
$EcJar = Join-Path $EcDir 'epubcheck-5.3.0\epubcheck.jar'
$EcCmd = Join-Path $BinDir 'epubcheck.cmd'
@"
@echo off
java -jar "$EcJar" %*
"@ | Set-Content -Path $EcCmd -Encoding ASCII
Log "epubcheck wrapper at $EcCmd"

# Add %USERPROFILE%\.local\bin to user PATH if missing
$userPath = [System.Environment]::GetEnvironmentVariable('Path','User')
if ($userPath -notlike "*$BinDir*") {
    [System.Environment]::SetEnvironmentVariable('Path', "$userPath;$BinDir", 'User')
    $env:Path = "$env:Path;$BinDir"
    Log "Added $BinDir to user PATH"
}

# 7. veraPDF — manual install required
Log "veraPDF: download installer manually from https://verapdf.org/software/ and run it"
Log "   After install, ensure verapdf.bat is on PATH"

# 8. qqwing — not in winget/scoop. Document as manual.
Log "qqwing: not packaged for Windows. Build from source (https://qqwing.com) or use WSL fallback."
Log "   Sudoku generation in activity-generator will fail until qqwing is on PATH."

# 9. npm globals
Log "Installing npm global CLIs"
npm install -g `@vivliostyle/cli@10.3.1 `@mermaid-js/mermaid-cli pdf-lib 2>&1 | Out-Host

# 10. Python venv + packages
$Venv = Join-Path $Root '_install\venv'
Log "Creating Python venv at $Venv"
python -m venv $Venv
$Pip = Join-Path $Venv 'Scripts\pip.exe'
& $Pip install --upgrade pip
& $Pip install "rembg[cpu]>=2.0.75" "genxword==2.2.0" mazelib Pillow pypdf reportlab svgwrite jsonschema pyyaml lxml

# 11. MiKTeX — install required packages on first use (auto-install enabled)
Log "Configuring MiKTeX to auto-install missing packages"
if (Get-Command initexmf -ErrorAction SilentlyContinue) {
    initexmf --set-config-value=[MPM]AutoInstall=1 2>&1 | Out-Host
}

# 12. Eisvogel template
$PandocTpl = Join-Path $env:APPDATA 'pandoc\templates'
New-Item -ItemType Directory -Force -Path $PandocTpl | Out-Null
$EisZip = Join-Path $env:TEMP 'eisvogel.zip'
Log "Downloading Eisvogel template"
try {
    Invoke-WebRequest -Uri 'https://github.com/Wandmalfarbe/pandoc-latex-template/releases/latest/download/Eisvogel.zip' -OutFile $EisZip
    Expand-Archive -Force -Path $EisZip -DestinationPath (Join-Path $env:TEMP 'eisvogel-extract')
    Get-ChildItem (Join-Path $env:TEMP 'eisvogel-extract') -Recurse -Filter 'eisvogel.latex' | Select-Object -First 1 |
        ForEach-Object { Copy-Item $_.FullName (Join-Path $PandocTpl 'eisvogel.latex') -Force }
    Log "Eisvogel installed to $PandocTpl"
} catch { Warn "Eisvogel download failed: $_" }

# 13. OFL fonts — Google Fonts download API requires a webdriver flow; document manual step
Log "Fonts: download EB Garamond, Crimson Pro, Source Serif 4, Inter, JetBrains Mono, Lora, Merriweather, Spectral"
Log "       from https://fonts.google.com and install (right-click TTF -> Install for all users)"

Log "Install complete. Run verify.ps1 next."
Stop-Transcript | Out-Null
