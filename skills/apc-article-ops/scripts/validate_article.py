"""
APC article validator — the single, executable enforcement point for ARTICLE-RULES.md.
Every article (new, edited, back-scrubbed) must pass this before it ships.

  python validate_article.py <body.html> [--title T] [--page-title P] [--description D]

Exit 0 = compliant (warnings allowed). Exit 2 = HARD FAIL, does not ship.

Structure is detected via lightweight data-apc markers the template carries (see
references/selldone-article-template.html): lead, key, quote, fig, bottom, list.
This keeps detection unambiguous instead of guessing from styling.
"""
import argparse, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from check_writing_rules import scan_text, ESCAPE_RE

WALL_OF_TEXT = 900  # a single <p> longer than this (chars of text) is the regression symptom


def _count(pat, s):
    return len(re.findall(pat, s, re.I))


def _ptext_lengths(body):
    # crude: text length inside each <p>...</p>, tags stripped
    lens = []
    for m in re.findall(r'<p\b[^>]*>(.*?)</p>', body, re.I | re.S):
        txt = re.sub(r'<[^>]+>', '', m)
        lens.append(len(txt.strip()))
    return lens


def validate(body, title='', page_title='', description=''):
    hard, warn = [], []
    combined = '\n'.join([body, title, page_title, description])

    # --- writing (mechanical) ---
    h, w = scan_text(combined)
    for label, n in h:
        hard.append(f'{n}x {label}')
    # escape leaks are HARD here (they render literally on the live site)
    esc = len(ESCAPE_RE.findall(combined))
    if esc:
        hard.append(f'{esc}x markdown-escape leak (e.g. \\$ rendering literally)')
    for word, n in w:
        if 'escape leak' in word:
            continue  # already elevated to hard above
        warn.append(f'{n}x banned word "{word}" (allowed only inside a verbatim citation title/URL)')

    # --- structure (markers + required headings) ---
    checks = {
        'lead paragraph (data-apc="lead")': _count(r'data-apc="lead"', body) >= 1,
        'key box (data-apc="key")': _count(r'data-apc="key"', body) == 1,
        '>=1 pull-quote (data-apc="quote")': _count(r'data-apc="quote"', body) >= 1,
        '>=1 in-body list (data-apc="list")': _count(r'data-apc="list"', body) >= 1,
        'midpoint figure (data-apc="fig")': _count(r'data-apc="fig"', body) >= 1,
        'bottom-line card (data-apc="bottom")': _count(r'data-apc="bottom"', body) == 1,
        'FAQ section': bool(re.search(r'<h2[^>]*>\s*Frequently Asked Questions\s*</h2>', body, re.I)),
        'Sources section': bool(re.search(r'<h2[^>]*>\s*Sources\s*</h2>', body, re.I)),
        '>=2 illustrations': _count(r'<img\b', body) >= 2,
        '>=4 H2 sections': _count(r'<h2\b', body) >= 4,
        'mid-article Starter Kit CTA (data-apc="cta")': _count(r'data-apc="cta"', body) >= 1,
        '>=2 Starter Kit sign-up links (mid CTA + bottom)': _count(r'pages/starter-kit', body) >= 2,
    }
    for name, ok in checks.items():
        if not ok:
            hard.append(f'missing/!= required: {name}')

    # --- wall-of-text ---
    big = [n for n in _ptext_lengths(body) if n > WALL_OF_TEXT]
    if big:
        hard.append(f'{len(big)} paragraph(s) over {WALL_OF_TEXT} chars (wall-of-text; break into '
                    f'short paras + lists). Longest={max(big)}')

    # --- inline citations (warn) ---
    if _count(r'<sup', body) == 0 and re.search(r'<h2[^>]*>\s*Sources', body, re.I):
        warn.append('no inline citation markers (<sup><a href="#src-N">) linking claims to Sources')

    # --- citation integrity (HARD) — the cardinal rule (see ARTICLE-RULES §4b) ---
    # Truth (does the source exist and support the claim) cannot be checked mechanically;
    # that is a process gate (every source verified online before ship). These guards catch
    # the two mechanical tells of fabricated/lazy citations: machine-style identifiers sitting
    # in the prose, and "sources" that link to a homepage instead of the actual document.
    msrc = re.search(r'<h2[^>]*>\s*Sources\s*</h2>', body, re.I)
    prose = body[:msrc.start()] if msrc else body
    sources = body[msrc.start():] if msrc else ''

    # 1) no bare academic identifiers in the body prose (reads like a bot + hides fabrication).
    #    Strip tags first so identifiers inside href="" URLs are not counted.
    prose_text = re.sub(r'<[^>]+>', ' ', prose)
    for pat, label in [
        (r'\bPMC\s?\d{4,}\b', 'bare "PMC NNNN" in body prose'),
        (r'\bdoi:\s*10\.\d', 'bare "DOI:" in body prose'),
        (r'(?<!/)\b10\.\d{4,9}/[^\s,)"<]+', 'bare DOI string in body prose'),
    ]:
        n = len(re.findall(pat, prose_text, re.I))
        if n:
            hard.append(f'{n}x {label} (cite naturally in prose; the identifier + link belong only in Sources)')

    # 2) every Sources entry must carry a real deep link, not a bare homepage.
    if sources:
        for i, li in enumerate(re.findall(r'<li\b[^>]*>(.*?)</li>', sources, re.I | re.S), 1):
            hrefs = re.findall(r'href="(https?://[^"]+)"', li, re.I)
            if not hrefs:
                hard.append(f'Sources entry {i} has no link (every source needs a working URL to the document)')
            elif all(re.match(r'^https?://[^/]+/?$', h) for h in hrefs):
                hard.append(f'Sources entry {i} links only to a homepage, not the actual document')

    return hard, warn


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('body')
    ap.add_argument('--title', default='')
    ap.add_argument('--page-title', default='')
    ap.add_argument('--description', default='')
    a = ap.parse_args()
    body = open(a.body, encoding='utf-8').read()
    hard, warn = validate(body, a.title, a.page_title, a.description)
    name = os.path.basename(a.body)
    for m in warn:
        print(f'warn  {name}: {m}')
    for m in hard:
        print(f'HARD  {name}: {m}')
    if hard:
        print(f'\nFAIL ({len(hard)} hard issue(s)) — {name} does not ship.')
        sys.exit(2)
    print(f'PASS — {name} is compliant' + (f' ({len(warn)} warning(s))' if warn else ''))
    sys.exit(0)


if __name__ == '__main__':
    main()
