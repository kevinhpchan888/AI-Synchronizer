#!/usr/bin/env bash
set -uo pipefail
PASS=0; FAIL=0
check() {
  local name="$1"; shift
  if "$@" >/dev/null 2>&1; then
    printf "[OK] %s\n" "$name"; PASS=$((PASS+1))
  else
    printf "[--] %s\n" "$name"; FAIL=$((FAIL+1))
  fi
}
check "typst"      typst --version
check "pandoc"     pandoc --version
check "xelatex"    xelatex --version
check "quarto"     quarto --version
check "ghostscript" gs --version
check "imagemagick" magick -version
check "pdffonts"   pdffonts -v
check "verapdf"    verapdf --version
check "epubcheck"  epubcheck --version
check "calibre"    ebook-convert --version
check "vivliostyle" vivliostyle --version
check "mermaid"    mmdc --version
check "potrace"    potrace --version
check "qqwing"     qqwing --version
check "rembg"      "${HOME}/.claude/skills/book-prod/_install/venv/bin/rembg" --help
check "genxword"   "${HOME}/.claude/skills/book-prod/_install/venv/bin/python" -c "import genxword"
check "mazelib"    "${HOME}/.claude/skills/book-prod/_install/venv/bin/python" -c "import mazelib"
check "pdf-lib"    node -e "require('pdf-lib')"
echo "Passed: $PASS   Failed: $FAIL"
[[ $FAIL -eq 0 ]] || exit 1
