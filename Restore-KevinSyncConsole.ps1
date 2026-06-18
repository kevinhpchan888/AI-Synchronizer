$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

function Ensure-Command {
  param(
    [string]$Name,
    [scriptblock]$Install
  )

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    & $Install
  }
}

Ensure-Command git { throw "Git is required. Install Git for Windows, then run this restore again." }
Ensure-Command node { throw "Node.js 20+ is required. Install Node.js, then run this restore again." }

Ensure-Command ai-config-sync { npm install -g ai-config-sync-manager }
Ensure-Command memorix { npm install -g memorix }
Ensure-Command supabase { npm install -g supabase }
Ensure-Command vercel { npm install -g vercel }
Ensure-Command skillshare { irm https://raw.githubusercontent.com/runkids/skillshare/main/install.ps1 | iex }

& "$Root\Start-KevinSyncConsole.ps1"
