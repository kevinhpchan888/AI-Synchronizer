$ErrorActionPreference = "Stop"

$RepoUrl = "__REPO_URL__"
$InstallRoot = Join-Path ([Environment]::GetFolderPath("MyDocuments")) "ClaudeCodex Sync"

function Ensure-Command {
  param(
    [string]$Name,
    [string]$InstallHint
  )

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
      if ($Name -eq "git") {
        winget install --id Git.Git -e --source winget
      } elseif ($Name -eq "node") {
        winget install --id OpenJS.NodeJS.LTS -e --source winget
      }
    }
  }

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name is required. $InstallHint"
  }
}

if ($RepoUrl -eq "__REPO_URL__" -or [string]::IsNullOrWhiteSpace($RepoUrl)) {
  throw "This setup file needs a GitHub repo URL. Generate it from Kevin Sync Console after connecting the repo to GitHub."
}

Ensure-Command git "Install Git, then run this setup again."
Ensure-Command node "Install Node.js 20 or newer, then run this setup again."

if (-not (Test-Path -LiteralPath $InstallRoot)) {
  git clone $RepoUrl "$InstallRoot"
}

Set-Location $InstallRoot

if (Test-Path -LiteralPath ".\Restore-KevinSyncConsole.ps1") {
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\Restore-KevinSyncConsole.ps1"
} else {
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\Start-KevinSyncConsole.ps1"
}
