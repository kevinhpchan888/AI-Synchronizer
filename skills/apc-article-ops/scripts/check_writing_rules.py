"""
APC writing-rules gate. Deterministic, no LLM. The hard, mechanical backstop behind
the CLAUDE.md writing rules so a banned character can never reach the live site again
just because a human (or model) forgot to eyeball it. Mirrors sign_illustrations.py's
--check gate: em/en dashes are a HARD FAIL; the banned-vocabulary list is a WARNING.

Usage:
  python check_writing_rules.py --check <file_or_dir> [--glob '*.html']   # exit 2 on any em/en dash
  # or import: from check_writing_rules import scan_text  -> returns (hard, warnings)

Hard rule (exit 2):  —  (em dash, U+2014)   and   – (en dash, U+2013)
Warnings (exit 0):   the banned vocabulary from CLAUDE.md rule 1.
"""
import argparse, os, re, sys

HARD_CHARS = {'—': 'em dash (—)', '–': 'en dash (–)'}

# CLAUDE.md rule 1 vocabulary blacklist (warn, not block — some may be legitimate in a quote)
BANNED_WORDS = [
    'journey', 'navigate', 'tapestry', 'delve', 'crucible', 'meaningful', 'resonate',
    'empower', 'holistic', 'transformative', 'seamless', 'curated', 'invaluable',
    'heartfelt', 'impactful', 'profound', 'game-changer', 'deep dive', 'uncharted',
    'embark', 'symphony of', 'dance of', 'luminous', 'gossamer', 'broken hymn',
]
WORD_RES = [(w, re.compile(r'(?<![a-z])' + re.escape(w) + r'(?![a-z])', re.I)) for w in BANNED_WORDS]


ESCAPE_RE = re.compile(r'\\[$%#_&{}]')  # markdown-escape leak into HTML, e.g. \$50,000 rendering literally


def scan_text(s):
    """Return (hard_hits, warn_hits). hard_hits is a list of (char_label, count)."""
    hard = [(label, s.count(ch)) for ch, label in HARD_CHARS.items() if ch in s]
    warn = [(w, len(rx.findall(s))) for w, rx in WORD_RES if rx.search(s)]
    esc = ESCAPE_RE.findall(s)
    if esc:
        warn.append(('markdown-escape leak (e.g. \\$ rendering literally)', len(esc)))
    return hard, warn


def _iter_files(path, glob):
    if os.path.isfile(path):
        yield path; return
    pat = re.compile(glob.replace('.', r'\.').replace('*', '.*') + r'$')
    for root, _, files in os.walk(path):
        for fn in files:
            if pat.match(fn):
                yield os.path.join(root, fn)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', required=True, help='file or directory to scan')
    ap.add_argument('--glob', default='*.html', help="filename glob when --check is a dir")
    a = ap.parse_args()
    any_hard = False
    for fp in sorted(_iter_files(a.check, a.glob)):
        try:
            s = open(fp, encoding='utf-8').read()
        except (UnicodeDecodeError, OSError):
            continue
        hard, warn = scan_text(s)
        if hard:
            any_hard = True
            for label, n in hard:
                print(f'HARD  {fp}: {n}x {label}')
        for w, n in warn:
            print(f'warn  {fp}: {n}x banned word "{w}"')
    if any_hard:
        print('\nFAIL: em/en dashes present. Brand rule: no dashes. Fix before publishing.')
        sys.exit(2)
    print('OK: no em/en dashes.')
    sys.exit(0)


if __name__ == '__main__':
    main()
