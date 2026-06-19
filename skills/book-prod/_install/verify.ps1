# LumosBooks verify — Windows native
# Refresh PATH so newly-installed winget tools are visible
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' +
            [System.Environment]::GetEnvironmentVariable('Path','User')

$Root = Join-Path $env:USERPROFILE '.claude\skills\book-prod'
$Venv = Join-Path $Root '_install\venv'
$VenvPy = Join-Path $Venv 'Scripts\python.exe'
$VenvBin = Join-Path $Venv 'Scripts'
$Log = Join-Path $Root '_install\verify.log'
$pass = 0; $fail = 0
$results = @()

function Check($name, $scriptblock) {
    try {
        $out = & $scriptblock 2>&1
        if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
            Write-Host "[OK]   $name" -ForegroundColor Green
            $script:pass++
            $script:results += "[OK]   $name :: $($out | Select-Object -First 1)"
        } else {
            throw "exit $LASTEXITCODE"
        }
    } catch {
        Write-Host "[FAIL] $name" -ForegroundColor Red
        $script:fail++
        $script:results += "[FAIL] $name :: $_"
    }
}

# Native binaries
Check 'typst'        { typst --version }
Check 'pandoc'       { pandoc --version }
Check 'xelatex'      { xelatex --version }
Check 'quarto'       { quarto --version }
Check 'ghostscript'  { gswin64c --version }
Check 'imagemagick'  { magick -version }
Check 'pdffonts'     { pdftotext -v 2>&1 }   # poppler bundle marker
Check 'epubcheck'    { epubcheck --version }
Check 'calibre'      { ebook-convert --version }
Check 'vivliostyle'  { vivliostyle --version }
Check 'mermaid'      { mmdc --version }
Check 'potrace'      { potrace --version 2>&1 }
Check 'java'         { java -version 2>&1 }
Check 'node'         { node --version }
Check 'python'       { python --version }

# Manual-install (warn, do not hard-fail)
Check 'verapdf (manual install)'      { verapdf --version }
Check 'qqwing (manual install)'       { qqwing --version }

# Python venv packages
Check 'rembg (venv)'   { & $VenvPy -c "import rembg; print(rembg.__version__)" }
Check 'genxword (venv)' { & $VenvPy -c "import genxword" }
Check 'mazelib (venv)'  { & $VenvPy -c "import mazelib" }
Check 'Pillow (venv)'   { & $VenvPy -c "import PIL; print(PIL.__version__)" }
Check 'jsonschema (venv)' { & $VenvPy -c "import jsonschema" }
Check 'pyyaml (venv)'  { & $VenvPy -c "import yaml" }

# npm globals (pdf-lib is a Node module, NOT a Python package)
Check 'pdf-lib (npm global)' { node -e "require('pdf-lib')" }
Check 'mermaid-cli node module' { node -e "require.resolve('@mermaid-js/mermaid-cli')" }

Write-Host ""
Write-Host "Passed: $pass   Failed: $fail" -ForegroundColor $(if ($fail -eq 0) {'Green'} else {'Yellow'})
$results | Out-File -FilePath $Log -Encoding UTF8
Write-Host "Log: $Log"
if ($fail -gt 0) { exit 1 }
