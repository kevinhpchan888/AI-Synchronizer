#!/usr/bin/env python3
"""Generate N sudoku puzzles + solutions via qqwing, render as SVG grid."""
import subprocess, argparse, svgwrite, pathlib, re

def render_grid(puzzle: str, out: pathlib.Path):
    dwg = svgwrite.Drawing(str(out), size=("180mm", "180mm"), viewBox="0 0 9 9")
    for i in range(10):
        sw = 0.06 if i % 3 == 0 else 0.02
        dwg.add(dwg.line((i, 0), (i, 9), stroke="black", stroke_width=sw))
        dwg.add(dwg.line((0, i), (9, i), stroke="black", stroke_width=sw))
    nums = re.findall(r"[0-9.]", puzzle)
    for idx, ch in enumerate(nums[:81]):
        if ch != ".":
            r, c = idx // 9, idx % 9
            dwg.add(dwg.text(ch, insert=(c + 0.3, r + 0.75), font_size=0.7,
                             font_family="EB Garamond"))
    dwg.save()

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--count", type=int, default=10)
    p.add_argument("--difficulty", choices=["simple","easy","intermediate","expert"], default="easy")
    p.add_argument("--out", type=pathlib.Path, required=True)
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    proc = subprocess.run(
        ["qqwing", "--generate", str(a.count), "--difficulty", a.difficulty, "--one-line"],
        capture_output=True, text=True, check=True
    )
    for i, puz in enumerate(proc.stdout.strip().splitlines(), 1):
        render_grid(puz, a.out / f"puzzle_{i:03d}.svg")

if __name__ == "__main__": main()
