$json = $Input | Out-String | ConvertFrom-Json
$fp = $json.tool_input.file_path

if ($fp -notmatch '\.pdf$') { exit 0 }

$mdPath = $fp -replace '\.pdf$', '.markitdown.md'

try {
    $output = & markitdown $fp 2>$null
    if ($LASTEXITCODE -eq 0 -and $output) {
        $output | Set-Content -Path $mdPath -Encoding UTF8 -Force
        @{
            hookSpecificOutput = @{
                hookEventName = "PreToolUse"
                updatedInput = @{ file_path = $mdPath }
                additionalContext = "PDF converted to markdown via markitdown. Reading converted file: $mdPath"
            }
        } | ConvertTo-Json -Depth 5
    }
} catch {
    exit 0
}
