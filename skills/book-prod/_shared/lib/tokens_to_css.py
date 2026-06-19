#!/usr/bin/env python3
"""Convert brand-tokens JSON to a CSS custom-properties file."""
import json, sys, pathlib
from jsonschema import validate

def main(tokens_path: str, out_path: str, schema_path: str) -> None:
    tokens = json.loads(pathlib.Path(tokens_path).read_text(encoding='utf-8'))
    schema = json.loads(pathlib.Path(schema_path).read_text(encoding='utf-8'))
    validate(tokens, schema)
    c = tokens["color"]; t = tokens["typography"]; s = tokens["spacing"]
    lines = ['/* AUTO-GENERATED from brand-tokens.json. Do not edit. */', ':root {']
    lines.append(f'  --primary: {c["primary"]["hex"]};')
    lines.append(f'  --secondary: {c["secondary"]["hex"]};')
    lines.append(f'  --ink: {c["neutrals"]["ink"]};')
    lines.append(f'  --paper: {c["neutrals"]["paper"]};')
    lines.append(f'  --muted: {c["neutrals"]["muted"]};')
    for a in c.get("accents", []):
        lines.append(f'  --accent-{a["name"]}: {a["hex"]};')
    lines.append(f'  --body-font: "{t["body"]["family"]}", serif;')
    lines.append(f'  --display-font: "{t["display"]["family"]}", serif;')
    lines.append(f'  --ui-sans: "{t["ui_sans"]["family"]}", sans-serif;')
    lines.append(f'  --body-size: {t["body"]["size_pt"]}pt;')
    lines.append(f'  --body-leading: {t["body"]["leading"]};')
    lines.append(f'  --space-unit: {s["base_pt"]}pt;')
    lines.append('}')
    lines.append('body { font-family: var(--body-font); color: var(--ink); background: var(--paper); }')
    out_p = pathlib.Path(out_path)
    out_p.parent.mkdir(parents=True, exist_ok=True)
    out_p.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f"wrote {out_path}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
