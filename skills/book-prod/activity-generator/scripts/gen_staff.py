#!/usr/bin/env python3
"""Music staff paper (treble/bass/grand) as SVG.

Usage: gen_staff.py --style treble --systems 10 --out outdir
"""
import argparse, pathlib, svgwrite

def staff_at(dwg, x_mm, y_mm, w_mm, line_gap=2.5):
    for i in range(5):
        y = y_mm + i * line_gap
        dwg.add(dwg.line((f"{x_mm}mm", f"{y}mm"), (f"{x_mm + w_mm}mm", f"{y}mm"),
                         stroke="black", stroke_width=0.3))

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--style", choices=["treble","bass","grand"], default="treble")
    p.add_argument("--systems", type=int, default=10)
    p.add_argument("--out", type=pathlib.Path, required=True)
    p.add_argument("--name", default="staff")
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    page_w, page_h = 190, 260
    out = a.out / f"{a.name}.svg"
    dwg = svgwrite.Drawing(str(out), size=(f"{page_w}mm", f"{page_h}mm"))
    sys_h = (page_h - 30) / a.systems
    for s in range(a.systems):
        y = 20 + s * sys_h
        if a.style == "grand":
            staff_at(dwg, 10, y, page_w - 20)
            staff_at(dwg, 10, y + 14, page_w - 20)
            dwg.add(dwg.line((f"10mm", f"{y}mm"), (f"10mm", f"{y+26}mm"),
                             stroke="black", stroke_width=0.4))
        else:
            staff_at(dwg, 10, y, page_w - 20)
    dwg.save()
    print(f"staff -> {out}")

if __name__ == "__main__":
    main()
