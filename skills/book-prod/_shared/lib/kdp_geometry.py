#!/usr/bin/env python3
"""KDP page geometry: trim, bleed, gutter as a function of page count."""
from __future__ import annotations
from dataclasses import dataclass

@dataclass
class Geometry:
    trim_w_in: float
    trim_h_in: float
    bleed_in: float
    inside_margin_in: float
    outside_margin_in: float
    top_margin_in: float
    bottom_margin_in: float

def inside_margin_for(page_count: int) -> float:
    if page_count <= 150: return 0.375
    if page_count <= 300: return 0.5
    if page_count <= 500: return 0.625
    if page_count <= 700: return 0.75
    return 0.875

def geometry(trim: tuple[float, float], page_count: int, bleed: bool = True) -> Geometry:
    inside = inside_margin_for(page_count)
    outside = 0.5 if bleed else 0.5
    tb = 0.375 if bleed else 0.25
    tb = max(tb, 0.75)
    return Geometry(trim[0], trim[1], 0.125 if bleed else 0.0, inside, outside, tb, tb)

if __name__ == "__main__":
    import json, sys
    pc = int(sys.argv[1]) if len(sys.argv) > 1 else 60
    g = geometry((8.5, 11.0), pc)
    print(json.dumps(g.__dict__, indent=2))
