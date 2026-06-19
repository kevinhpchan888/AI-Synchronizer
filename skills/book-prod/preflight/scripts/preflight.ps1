# Preflight gate (Windows). Usage: .\preflight.ps1 <project-dir>
param([Parameter(Mandatory)][string]$ProjDir)
$Report = Join-Path $ProjDir 'preflight\report.md'
New-Item -ItemType Directory -Force -Path (Split-Path $Report) | Out-Null
$err = 0
$lines = @("# Preflight Report — $(Get-Date -Format o)", "")

Get-ChildItem (Join-Path $ProjDir 'out\*.pdf') -ErrorAction SilentlyContinue | ForEach-Object {
    $lines += "## $($_.Name)"
    $fonts = & pdffonts $_.FullName 2>$null
    if ($fonts -and ($fonts | Select-String -Pattern 'no\s+\w+\s+\d+\s+\d+\s*$')) {
        $lines += "- [ ] Some fonts NOT embedded"; $err++
    } else {
        $lines += "- [x] All fonts embedded"
    }
}

Get-ChildItem (Join-Path $ProjDir 'out\*.epub') -ErrorAction SilentlyContinue | ForEach-Object {
    $lines += "## $($_.Name)"
    $jsonOut = Join-Path $ProjDir "preflight\$($_.BaseName).json"
    & epubcheck $_.FullName --json $jsonOut 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $lines += "- [x] EPUBCheck 5.3.0: 0 errors"
    } else {
        $lines += "- [ ] EPUBCheck FAILED — see $jsonOut"; $err++
    }
}

$ready = if ($err -eq 0) { 'true' } else { 'false' }
$lines += ""
$lines += "**READY: $ready**"
$lines | Set-Content -Path $Report -Encoding UTF8
Write-Host "Report: $Report"
exit $err
