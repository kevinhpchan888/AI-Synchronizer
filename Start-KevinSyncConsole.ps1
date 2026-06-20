param(
  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 47831
$Url = "http://localhost:$Port"
$PidFile = Join-Path $Root "logs\server.pid"

function Test-ConsoleServer {
  try {
    $response = Invoke-WebRequest -Uri "$Url/api/summary" -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

Set-Location $Root

if (-not (Test-ConsoleServer)) {
  $node = Get-Command node -ErrorAction Stop
  $logFile = Join-Path $Root "logs\server.log"
  $errFile = Join-Path $Root "logs\server.err.log"
  $process = Start-Process -FilePath $node.Source -ArgumentList "src/server.mjs" -WorkingDirectory $Root -WindowStyle Hidden -RedirectStandardOutput $logFile -RedirectStandardError $errFile -PassThru
  Set-Content -LiteralPath $PidFile -Value $process.Id
  Start-Sleep -Seconds 2
}

if (-not $NoOpen) {
  Start-Process $Url
}
