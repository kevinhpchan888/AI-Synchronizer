#!/usr/bin/env python3
"""Generate a word-search puzzle as SVG.

Usage: gen_wordsearch.py --words a,b,c --out outdir [--size 15] [--name puzzle]
"""
import argparse, pathlib, random, svgwrite, json

DIRS = [(1,0),(0,1),(1,1),(-1,1),(-1,0),(0,-1),(-1,-1),(1,-1)]

def place(grid, word, size, rng):
    for _ in range(200):
        d = rng.choice(DIRS)
        r = rng.randrange(size); c = rng.randrange(size)
        end_r = r + d[0]*(len(word)-1); end_c = c + d[1]*(len(word)-1)
        if not (0 <= end_r < size and 0 <= end_c < size): continue
        ok = True
        for i, ch in enumerate(word):
            rr, cc = r+d[0]*i, c+d[1]*i
            if grid[rr][cc] not in (None, ch): ok = False; break
        if not ok: continue
        for i, ch in enumerate(word):
            grid[r+d[0]*i][c+d[1]*i] = ch
        return True
    return False

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--words", required=True, help="Comma-separated words")
    p.add_argument("--out", type=pathlib.Path, required=True)
    p.add_argument("--size", type=int, default=15)
    p.add_argument("--name", default="wordsearch")
    p.add_argument("--seed", type=int, default=42)
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    rng = random.Random(a.seed)
    words = [w.strip().upper() for w in a.words.split(",") if w.strip()]
    grid = [[None]*a.size for _ in range(a.size)]
    placed = []
    for w in sorted(words, key=len, reverse=True):
        if place(grid, w, a.size, rng): placed.append(w)
    for r in range(a.size):
        for c in range(a.size):
            if grid[r][c] is None:
                grid[r][c] = chr(rng.randrange(26) + ord('A'))
    cell = 8.0  # mm
    sz_mm = cell * a.size
    out = a.out / f"{a.name}.svg"
    dwg = svgwrite.Drawing(str(out), size=(f"{sz_mm}mm", f"{sz_mm + 30}mm"))
    for r in range(a.size):
        for c in range(a.size):
            x = c * cell + cell/2
            y = r * cell + cell*0.7 + 5
            dwg.add(dwg.text(grid[r][c], insert=(f"{x}mm", f"{y}mm"),
                             font_size="5mm", font_family="EB Garamond",
                             text_anchor="middle"))
    word_list = "  ".join(placed)
    dwg.add(dwg.text(word_list, insert=("0mm", f"{sz_mm + 15}mm"),
                     font_size="3mm", font_family="EB Garamond"))
    dwg.save()
    (a.out / f"{a.name}.manifest.json").write_text(
        json.dumps({"type":"wordsearch","name":a.name,"size":a.size,
                    "words_placed":placed,"words_skipped":[w for w in words if w not in placed]},
                   indent=2), encoding="utf-8")
    print(f"wordsearch -> {out}")

if __name__ == "__main__":
    main()
