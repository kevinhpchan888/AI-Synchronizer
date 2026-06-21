#!/usr/bin/env python3
"""Generate lined / dot-grid / graph / staff paper as SVG."""
import argparse, pathlib, svgwrite

def lined(out, w_mm=190, h_mm=260, gap=8):
    dwg = svgwrite.Drawing(str(out), size=(f"{w_mm}mm", f"{h_mm}mm"))
    y = gap
    while y < h_mm:
        dwg.add(dwg.line((5, y), (w_mm-5, y), stroke="#888", stroke_width=0.2))
        y += gap
    dwg.save()

def grid(out, w_mm=190, h_mm=260, gap=5):
    dwg = svgwrite.Drawing(str(out), size=(f"{w_mm}mm", f"{h_mm}mm"))
    for x in range(0, w_mm+1, gap):
        dwg.add(dwg.line((x, 0), (x, h_mm), stroke="#bbb", stroke_width=0.15))
    for y in range(0, h_mm+1, gap):
        dwg.add(dwg.line((0, y), (w_mm, y), stroke="#bbb", stroke_width=0.15))
    dwg.save()

def dot(out, w_mm=190, h_mm=260, gap=5):
    dwg = svgwrite.Drawing(str(out), size=(f"{w_mm}mm", f"{h_mm}mm"))
    for x in range(gap, w_mm, gap):
        for y in range(gap, h_mm, gap):
            dwg.add(dwg.circle(center=(x, y), r=0.3, fill="#888"))
    dwg.save()

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--style", choices=["lined","grid","dot"], default="lined")
    p.add_argument("--out", type=pathlib.Path, required=True)
    a = p.parse_args()
    a.out.parent.mkdir(parents=True, exist_ok=True)
    {"lined": lined, "grid": grid, "dot": dot}[a.style](a.out)

if __name__ == "__main__": main()
