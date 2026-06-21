#!/usr/bin/env python3
"""KDP spine width and full-cover geometry calculator."""
import json, argparse

PAPER_MULT = {"white": 0.002252, "cream": 0.0025}

def geometry(page_count: int, paper: str, trim_w: float, trim_h: float, hardcover: bool=False):
    if page_count < 24:
        raise ValueError("KDP minimum is 24 pages for paperback")
    mult = PAPER_MULT[paper]
    spine = page_count * mult
    if not hardcover:
        spine += 0.06
    bleed = 0.125
    if hardcover:
        wrap = 0.591
        cover_w = trim_w * 2 + spine + wrap * 2
        cover_h = trim_h + 0.236 + wrap * 2
    else:
        cover_w = trim_w * 2 + spine + bleed * 2
        cover_h = trim_h + bleed * 2
    return {
      "spine_in": round(spine, 4),
      "cover_width_in": round(cover_w, 4),
      "cover_height_in": round(cover_h, 4),
      "front_x_offset_in": round(bleed + trim_w + spine, 4),
      "spine_text_allowed": page_count >= 79,
      "px_300dpi": [round(cover_w * 300), round(cover_h * 300)]
    }

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--pages", type=int, required=True)
    p.add_argument("--paper", choices=["white","cream"], default="white")
    p.add_argument("--trim-w", type=float, required=True)
    p.add_argument("--trim-h", type=float, required=True)
    p.add_argument("--hardcover", action="store_true")
    a = p.parse_args()
    print(json.dumps(geometry(a.pages, a.paper, a.trim_w, a.trim_h, a.hardcover), indent=2))
