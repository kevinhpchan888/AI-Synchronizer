#!/usr/bin/env python3
"""Letter and number tracing pages as SVG.

Usage: gen_trace.py --chars 'ABCDE' --out outdir --rows 4 --per-row 6
Renders dotted-outline glyphs for tracing practice.
"""
import argparse, pathlib, svgwrite, json

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--chars", required=True, help="String of glyphs to render, one page each")
    p.add_argument("--out", type=pathlib.Path, required=True)
    p.add_argument("--rows", type=int, default=4)
    p.add_argument("--per-row", type=int, default=6)
    p.add_argument("--font", default="EB Garamond")
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    page_w, page_h = 190, 260  # mm
    cell_w = page_w / a.per_row
    cell_h = (page_h - 30) / a.rows
    for ch in a.chars:
        out = a.out / f"trace_{ch}.svg"
        dwg = svgwrite.Drawing(str(out), size=(f"{page_w}mm", f"{page_h}mm"))
        # Big reference glyph at top
        dwg.add(dwg.text(ch, insert=(f"{page_w/2}mm", "30mm"),
                         font_size="28mm", font_family=a.font,
                         text_anchor="middle", fill="#0F2A4A"))
        # Tracing grid
        for r in range(a.rows):
            for c in range(a.per_row):
                x = c * cell_w + cell_w/2
                y = 50 + r * cell_h + cell_h * 0.75
                dwg.add(dwg.text(ch, insert=(f"{x}mm", f"{y}mm"),
                                 font_size=f"{min(cell_w, cell_h)*0.7}mm",
                                 font_family=a.font, text_anchor="middle",
                                 fill="#cccccc"))
        # Baseline rules per row
        for r in range(a.rows + 1):
            y = 50 + r * cell_h
            dwg.add(dwg.line((f"5mm", f"{y}mm"), (f"{page_w-5}mm", f"{y}mm"),
                             stroke="#888", stroke_width=0.2))
        dwg.save()
    (a.out / "trace.manifest.json").write_text(
        json.dumps({"type":"trace","chars":list(a.chars)}, indent=2), encoding="utf-8")
    print(f"trace -> {a.out}")

if __name__ == "__main__":
    main()
