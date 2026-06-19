#!/usr/bin/env bash
# Original macOS installer — preserved from spec for reference / future Mac/Linux porting.
# DO NOT RUN ON WINDOWS. Use master-install.ps1 instead.
set -euo pipefail
LOG="${HOME}/.claude/skills/book-prod/_install/install.log"
mkdir -p "$(dirname "$LOG")"
exec > >(tee -a "$LOG") 2>&1
log() { printf "\n[book-prod] %s\n" "$*"; }
fail() { printf "\n[FAIL] %s\n" "$*" >&2; exit 1; }

case "$(uname -s)" in
  Darwin*) ;;
  *) fail "This script targets macOS. On Windows use master-install.ps1; on Linux port via apt/dnf." ;;
esac

if ! command -v brew >/dev/null 2>&1; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || fail "brew install"
fi
brew update
brew install --quiet typst pandoc ghostscript imagemagick poppler qpdf jq yq potrace librsvg qqwing node python@3.12 openjdk@21 verapdf
brew install --cask --quiet basictex calibre
eval "$(/usr/libexec/path_helper)"
export PATH="/Library/TeX/texbin:$PATH"
sudo tlmgr update --self
sudo tlmgr install $(cat "${HOME}/.claude/skills/book-prod/_install/tex-packages.txt")
QUARTO_VER="1.9.18"
curl -fsSL "https://github.com/quarto-dev/quarto-cli/releases/download/v${QUARTO_VER}/quarto-${QUARTO_VER}-macos.pkg" -o /tmp/quarto.pkg
sudo installer -pkg /tmp/quarto.pkg -target /
npm install -g @vivliostyle/cli@10.3.1 @mermaid-js/mermaid-cli pdf-lib
VENV="${HOME}/.claude/skills/book-prod/_install/venv"
python3 -m venv "$VENV"
"$VENV/bin/pip" install --upgrade pip
"$VENV/bin/pip" install "rembg[cpu]>=2.0.75" "genxword==2.2.0" mazelib Pillow pypdf reportlab svgwrite jsonschema pyyaml lxml
EC_DIR="${HOME}/.claude/skills/book-prod/_install/epubcheck"
mkdir -p "$EC_DIR"
curl -fSL https://github.com/w3c/epubcheck/releases/download/v5.3.0/epubcheck-5.3.0.zip -o /tmp/epubcheck.zip
unzip -q -o /tmp/epubcheck.zip -d "$EC_DIR"
cat > /usr/local/bin/epubcheck <<EOF
#!/usr/bin/env bash
exec java -jar "${EC_DIR}/epubcheck-5.3.0/epubcheck.jar" "\$@"
EOF
chmod +x /usr/local/bin/epubcheck
log "Done."
