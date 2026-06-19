#!/usr/bin/env python3
"""Generate a dot-to-dot puzzle from an SVG path or a list of (x,y) points.

Usage:
  gen_dot2dot.py --points 'x1,y1 x2,y2 ...' --out outdir --name star
  gen_dot2dot.py --shape star --out outdir --name star
"""
import argparse, math, pathlib, svgwrite, json

SHAPES = {
    "star": [(50,5),(61,38),(95,38),(68,58),(79,90),(50,70),(21,90),(32,58),(5,38),(39,38)],
    "house": [(20,80),(20,40),(50,15),(80,40),(80,80),(60,80),(60,55),(40,55),(40,80)],
    "fish": [(10,50),(40,30),(70,30),(85,50),(70,70),(40,70),(10,50),(0,40),(0,60)],
}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--points", help="Space-separated 'x,y' points")
    p.add_argument("--shape", choices=list(SHAPES.keys()))
    p.add_argument("--out", type=pathlib.Path, required=True)
    p.add_argument("--name", default="dot2dot")
    p.add_argument("--size-mm", type=float, default=160)
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    if a.points:
        pts = [tuple(float(v) for v in pair.split(",")) for pair in a.points.split()]
    elif a.shape:
        pts = SHAPES[a.shape]
    else:
        raise SystemExit("--points or --shape required")
    out = a.out / f"{a.name}.svg"
    dwg = svgwrite.Drawing(str(out), size=(f"{a.size_mm}mm", f"{a.size_mm}mm"),
                           viewBox="0 0 100 100")
    for i, (x, y) in enumerate(pts, 1):
        dwg.add(dwg.circle(center=(x, y), r=0.7, fill="black"))
        dwg.add(dwg.text(str(i), insert=(x + 1.5, y - 1.5),
                         font_size=3, font_family="Inter"))
    dwg.save()
    (a.out / f"{a.name}.manifest.json").write_text(
        json.dumps({"type":"dot2dot","name":a.name,"points":len(pts)}, indent=2),
        encoding="utf-8")
    print(f"dot2dot -> {out}")

if __name__ == "__main__":
    main()
