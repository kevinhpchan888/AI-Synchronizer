#!/usr/bin/env python3
"""Generate fill-in-the-blank worksheets from sentences.

Input JSON format: [{"sentence": "The cat sat on the [mat].", "answer": "mat"}, ...]
Brackets mark the blank.

Usage: gen_fill_blank.py --in items.json --out outdir --name lesson1
Output: Markdown worksheet + answer key.
"""
import argparse, json, pathlib, re

BLANK_RE = re.compile(r"\[([^\]]+)\]")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--in", dest="src", type=pathlib.Path, required=True)
    p.add_argument("--out", type=pathlib.Path, required=True)
    p.add_argument("--name", default="fill_blank")
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    items = json.loads(a.src.read_text(encoding="utf-8"))
    ws = ["# Fill in the Blank\n"]
    key = ["# Answer Key\n"]
    for i, it in enumerate(items, 1):
        sent = it.get("sentence", "")
        answer = it.get("answer") or " / ".join(BLANK_RE.findall(sent))
        sent_blank = BLANK_RE.sub(lambda m: "_" * max(8, len(m.group(1)) + 4), sent)
        ws.append(f"{i}. {sent_blank}\n")
        key.append(f"{i}. {answer}\n")
    (a.out / f"{a.name}.md").write_text("\n".join(ws), encoding="utf-8")
    (a.out / f"{a.name}_key.md").write_text("\n".join(key), encoding="utf-8")
    print(f"fill_blank -> {a.out / a.name}.md")

if __name__ == "__main__":
    main()
