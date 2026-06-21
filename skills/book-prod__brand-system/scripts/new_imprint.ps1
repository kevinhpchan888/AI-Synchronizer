# Copy template tokens to a new imprint slug.
param([Parameter(Mandatory)][string]$Slug)
$Root = Join-Path $env:USERPROFILE '.claude\skills\book-prod'
$Tpl = Join-Path $Root 'brand-system\assets\imprints\_template.tokens.json'
$Dst = Join-Path $Root "brand-system\assets\imprints\$Slug.tokens.json"
if (Test-Path $Dst) { Write-Host "Already exists: $Dst"; exit 1 }
Copy-Item $Tpl $Dst
(Get-Content $Dst) -replace 'TODO-slug', $Slug | Set-Content $Dst
Write-Host "Created $Dst — edit tokens then run build_tokens.ps1 -Slug $Slug"
