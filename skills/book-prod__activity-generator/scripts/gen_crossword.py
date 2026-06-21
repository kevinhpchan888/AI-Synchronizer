#!/usr/bin/env python3
"""Generate a crossword via genxword 2.2.0. Outputs SVG grid + clue list.

Usage: gen_crossword.py --words words.txt --out outdir [--size 17]
words.txt format: one "WORD,clue text" per line.
"""
import argparse, pathlib, subprocess, sys, tempfile, json

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--words", type=pathlib.Path, required=True,
                   help="Text file: one 'WORD,clue' per line")
    p.add_argument("--out", type=pathlib.Path, required=True)
    p.add_argument("--size", type=int, default=17)
    p.add_argument("--name", default="crossword")
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        td = pathlib.Path(td)
        # genxword 2.2.0 CLI: genxword-gtk or genxword (text)
        # We invoke via python -m genxword.control with a calc script
        try:
            subprocess.check_call([
                sys.executable, "-m", "genxword.control",
                str(a.words), a.name,
                "-o", "csv", "-a", "auto", "-n", str(a.size)
            ], cwd=str(td))
        except subprocess.CalledProcessError:
            print(f"[crossword] genxword failed; ensure 'pip install genxword==2.2.0' in venv", file=sys.stderr)
            sys.exit(1)
        for f in td.glob(f"{a.name}*"):
            (a.out / f.name).write_bytes(f.read_bytes())
    manifest = {"type": "crossword", "name": a.name, "size": a.size,
                "outputs": [str(p.relative_to(a.out)) for p in a.out.iterdir()]}
    (a.out / f"{a.name}.manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"crossword -> {a.out}")

if __name__ == "__main__":
    main()
