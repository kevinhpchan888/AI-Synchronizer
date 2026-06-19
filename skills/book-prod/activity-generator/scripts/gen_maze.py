#!/usr/bin/env python3
"""Generate mazes via mazelib, render as SVG."""
import argparse, pathlib, svgwrite
from mazelib import Maze
from mazelib.generate.Prims import Prims

def render(maze, out: pathlib.Path, cell: float = 5.0):
    grid = maze.grid
    h, w = len(grid), len(grid[0])
    dwg = svgwrite.Drawing(str(out), size=(f"{w*cell}mm", f"{h*cell}mm"))
    for r in range(h):
        for c in range(w):
            if grid[r][c] == 1:
                dwg.add(dwg.rect(insert=(c*cell, r*cell), size=(cell, cell), fill="black"))
    dwg.save()

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--count", type=int, default=10)
    p.add_argument("--width",  type=int, default=15)
    p.add_argument("--height", type=int, default=15)
    p.add_argument("--out", type=pathlib.Path, required=True)
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    for i in range(1, a.count+1):
        m = Maze()
        m.generator = Prims(a.height, a.width)
        m.generate()
        render(m, a.out / f"maze_{i:03d}.svg")

if __name__ == "__main__": main()
