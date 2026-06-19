#!/usr/bin/env python3
"""Convert brand-tokens JSON to a Typst variables file."""
import json, sys, pathlib
from jsonschema import validate

def main(tokens_path: str, out_path: str, schema_path: str) -> None:
    tokens = json.loads(pathlib.Path(tokens_path).read_text(encoding='utf-8'))
    schema = json.loads(pathlib.Path(schema_path).read_text(encoding='utf-8'))
    validate(tokens, schema)
    c = tokens["color"]; t = tokens["typography"]; s = tokens["spacing"]
    out = ['// AUTO-GENERATED from brand-tokens.json. Do not edit.']
    out.append(f'#let primary   = rgb("{c["primary"]["hex"]}")')
    out.append(f'#let secondary = rgb("{c["secondary"]["hex"]}")')
    out.append(f'#let ink       = rgb("{c["neutrals"]["ink"]}")')
    out.append(f'#let paper     = rgb("{c["neutrals"]["paper"]}")')
    out.append(f'#let muted     = rgb("{c["neutrals"]["muted"]}")')
    for a in c.get("accents", []):
        out.append(f'#let accent_{a["name"]} = rgb("{a["hex"]}")')
    out.append(f'#let body_font     = "{t["body"]["family"]}"')
    out.append(f'#let body_size     = {t["body"]["size_pt"]}pt')
    out.append(f'#let body_leading  = {t["body"]["leading"]}em')
    out.append(f'#let display_font  = "{t["display"]["family"]}"')
    out.append(f'#let ui_sans       = "{t["ui_sans"]["family"]}"')
    out.append(f'#let space_unit    = {s["base_pt"]}pt')
    out_p = pathlib.Path(out_path)
    out_p.parent.mkdir(parents=True, exist_ok=True)
    out_p.write_text('\n'.join(out) + '\n', encoding='utf-8')
    print(f"wrote {out_path}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
