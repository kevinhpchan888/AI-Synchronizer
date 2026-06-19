#!/usr/bin/env python3
"""Generate multiple-choice quizzes from JSON input.

Input JSON format:
[{"q": "What is 2+2?", "choices": ["3","4","5","6"], "correct": 1}, ...]
'correct' is 0-indexed.

Output: Markdown worksheet + answer key.
"""
import argparse, json, pathlib

LETTERS = "ABCDEFGH"

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--in", dest="src", type=pathlib.Path, required=True)
    p.add_argument("--out", type=pathlib.Path, required=True)
    p.add_argument("--name", default="quiz")
    p.add_argument("--title", default="Quiz")
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    items = json.loads(a.src.read_text(encoding="utf-8"))
    ws = [f"# {a.title}\n"]
    key = [f"# {a.title} — Answer Key\n"]
    for i, it in enumerate(items, 1):
        ws.append(f"**{i}. {it['q']}**\n")
        for j, c in enumerate(it["choices"]):
            ws.append(f"   {LETTERS[j]}. {c}")
        ws.append("")
        key.append(f"{i}. {LETTERS[it['correct']]}")
    (a.out / f"{a.name}.md").write_text("\n".join(ws), encoding="utf-8")
    (a.out / f"{a.name}_key.md").write_text("\n".join(key), encoding="utf-8")
    print(f"mcq -> {a.out / a.name}.md")

if __name__ == "__main__":
    main()
