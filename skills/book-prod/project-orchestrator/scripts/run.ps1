# Orchestrator wrapper (Windows). Usage:
#   .\run.ps1 -Brief path\to\brief.yaml
#   .\run.ps1 -Slug my-book -Resume
param(
  [string]$Brief,
  [string]$Slug,
  [switch]$Resume
)
$Root = Join-Path $env:USERPROFILE '.claude\skills\book-prod'
$Venv = Join-Path $Root '_install\venv\Scripts\python.exe'
$Py = if (Test-Path $Venv) { $Venv } else { 'python' }
$Args = @((Join-Path $PSScriptRoot 'run.py'))
if ($Brief)  { $Args += @('--brief', $Brief) }
if ($Slug)   { $Args += @('--slug',  $Slug)  }
if ($Resume) { $Args += '--resume' }
& $Py @Args
exit $LASTEXITCODE
