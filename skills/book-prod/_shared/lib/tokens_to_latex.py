#!/usr/bin/env python3
"""Convert brand-tokens JSON to a LaTeX style file (tokens.sty)."""
import json, sys, pathlib
from jsonschema import validate

def hex_to_html(h: str) -> str:
    return h.lstrip('#').upper()

def main(tokens_path: str, out_path: str, schema_path: str) -> None:
    tokens = json.loads(pathlib.Path(tokens_path).read_text(encoding='utf-8'))
    schema = json.loads(pathlib.Path(schema_path).read_text(encoding='utf-8'))
    validate(tokens, schema)
    slug = tokens["imprint"]["slug"]
    c = tokens["color"]; t = tokens["typography"]
    out = [
        '% AUTO-GENERATED from brand-tokens.json. Do not edit.',
        f'\\ProvidesPackage{{tokens}}[{slug}]',
        '\\RequirePackage{xcolor}',
        f'\\definecolor{{{slug}primary}}{{HTML}}{{{hex_to_html(c["primary"]["hex"])}}}',
        f'\\definecolor{{{slug}secondary}}{{HTML}}{{{hex_to_html(c["secondary"]["hex"])}}}',
        f'\\definecolor{{{slug}ink}}{{HTML}}{{{hex_to_html(c["neutrals"]["ink"])}}}',
        f'\\definecolor{{{slug}paper}}{{HTML}}{{{hex_to_html(c["neutrals"]["paper"])}}}',
        f'\\definecolor{{{slug}muted}}{{HTML}}{{{hex_to_html(c["neutrals"]["muted"])}}}',
    ]
    for a in c.get("accents", []):
        out.append(f'\\definecolor{{{slug}{a["name"]}}}{{HTML}}{{{hex_to_html(a["hex"])}}}')
    out.append(f'\\newcommand{{\\bodyfont}}{{{t["body"]["family"]}}}')
    out.append(f'\\newcommand{{\\displayfont}}{{{t["display"]["family"]}}}')
    out.append(f'\\newcommand{{\\uisansfont}}{{{t["ui_sans"]["family"]}}}')
    out.append('\\endinput')
    out_p = pathlib.Path(out_path)
    out_p.parent.mkdir(parents=True, exist_ok=True)
    out_p.write_text('\n'.join(out) + '\n', encoding='utf-8')
    print(f"wrote {out_path}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
