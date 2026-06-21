#!/usr/bin/env python3
"""Batch-process source images: probe DPI, assign sRGB, generate derivatives + sidecar."""
import argparse, json, pathlib, subprocess, datetime
from PIL import Image

def probe(p: pathlib.Path) -> dict:
    with Image.open(p) as im:
        return {
            "dimensions_px": list(im.size),
            "mode": im.mode,
            "dpi": int(im.info.get("dpi", (72, 72))[0]),
        }

def derivatives(src: pathlib.Path, out_dir: pathlib.Path) -> dict:
    out_dir.mkdir(parents=True, exist_ok=True)
    base = src.stem
    print_path = out_dir / f"{base}_print.png"
    web_path = out_dir / f"{base}_web.jpg"
    thumb_path = out_dir / f"{base}_thumb.jpg"
    with Image.open(src) as im:
        im_rgb = im.convert("RGB")
        im_rgb.save(print_path, "PNG", dpi=(300,300))
        w, h = im_rgb.size
        scale = min(1.0, 1600/max(w,h))
        im_rgb.resize((int(w*scale), int(h*scale)), Image.LANCZOS).save(web_path, "JPEG", quality=88)
        scale = min(1.0, 400/max(w,h))
        im_rgb.resize((int(w*scale), int(h*scale)), Image.LANCZOS).save(thumb_path, "JPEG", quality=80)
    return {"print": str(print_path), "web": str(web_path), "thumb": str(thumb_path)}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--src", type=pathlib.Path, required=True)
    p.add_argument("--out", type=pathlib.Path, required=True)
    p.add_argument("--intent", choices=["cover_front","interior","spot"], default="interior")
    a = p.parse_args()
    for img in list(a.src.glob("*.png")) + list(a.src.glob("*.jpg")) + list(a.src.glob("*.jpeg")):
        meta = probe(img)
        derivs = derivatives(img, a.out)
        sidecar = {
            "source_file": img.name,
            "source_prompt": "",
            "generator": "NanoBanana Pro",
            "generated_at": datetime.datetime.now().astimezone().isoformat(),
            "dimensions_px": meta["dimensions_px"],
            "dpi": meta["dpi"],
            "color_space": "sRGB",
            "intended_use": [a.intent],
            "license": "Kevin Sng / LumosBooks",
            "derivatives": derivs,
        }
        (a.out / f"{img.stem}.sidecar.json").write_text(json.dumps(sidecar, indent=2), encoding='utf-8')
        if meta["dpi"] < 300 and a.intent != "spot":
            print(f"[WARN] {img.name} is {meta['dpi']} DPI, below 300 for print")

if __name__ == "__main__": main()
