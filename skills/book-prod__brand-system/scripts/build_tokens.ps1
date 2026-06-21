# Build engine-specific token files for an imprint.
# Usage: .\build_tokens.ps1 -Slug lumosread
param([Parameter(Mandatory)][string]$Slug)
$Root = Join-Path $env:USERPROFILE '.claude\skills\book-prod'
$Venv = Join-Path $Root '_install\venv\Scripts\python.exe'
$Py = if (Test-Path $Venv) { $Venv } else { 'python' }
$Tokens = Join-Path $Root "brand-system\assets\imprints\$Slug.tokens.json"
$Schema = Join-Path $Root "_shared\schemas\brand-tokens.schema.json"
$OutDir = Join-Path $Root "_shared\build\$Slug"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
& $Py (Join-Path $Root "_shared\lib\tokens_to_typst.py") $Tokens (Join-Path $OutDir 'variables.typ') $Schema
& $Py (Join-Path $Root "_shared\lib\tokens_to_latex.py") $Tokens (Join-Path $OutDir 'tokens.sty')   $Schema
& $Py (Join-Path $Root "_shared\lib\tokens_to_css.py")   $Tokens (Join-Path $OutDir 'tokens.css')   $Schema
Write-Host "Built tokens for $Slug at $OutDir"
