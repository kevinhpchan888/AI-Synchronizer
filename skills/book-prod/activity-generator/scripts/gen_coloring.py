#!/usr/bin/env python3
"""Convert a line-art image to a printable coloring page SVG via potrace.

Usage: gen_coloring.py --in input.png --out outdir --name apple
Requires: potrace, ImageMagick (magick convert).
"""
import argparse, pathlib, subprocess, json, sys

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--in", dest="src", type=pathlib.Path, required=True)
    p.add_argument("--out", type=pathlib.Path, required=True)
    p.add_argument("--name", default="coloring")
    p.add_argument("--threshold", type=int, default=50, help="0-100, lower = more lines")
    a = p.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    pbm = a.out / f"{a.name}.pbm"
    svg = a.out / f"{a.name}.svg"
    # Convert to bitmap PBM via ImageMagick
    try:
        subprocess.check_call([
            "magick", str(a.src), "-colorspace", "Gray",
            "-threshold", f"{a.threshold}%", str(pbm)
        ])
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"[coloring] magick failed: {e}", file=sys.stderr); sys.exit(1)
    try:
        subprocess.check_call(["potrace", str(pbm), "-s", "-o", str(svg)])
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"[coloring] potrace failed: {e}", file=sys.stderr); sys.exit(1)
    pbm.unlink(missing_ok=True)
    (a.out / f"{a.name}.manifest.json").write_text(
        json.dumps({"type":"coloring","name":a.name,"source":str(a.src)}, indent=2),
        encoding="utf-8")
    print(f"coloring -> {svg}")

if __name__ == "__main__":
    main()
