#!/usr/bin/env python3
"""
CANONICAL APC illustration signer + enforcement gate. (The ONE tool — no other copies.)

Every illustration that goes to the Selldone CDN MUST be stamped by this script first.
Rule (CLAUDE.md + apc-illustrations + apc-article-ops + article-playbook + daily-routine):

  APC signature, bottom-right (SouthEast). LOCKED DEFAULTS: 10% of image width,
  1.5% margin, flattened to JPEG (q82). Asset: brand/APC Signature Transparent.png.

Signed files carry an embedded JPEG marker ("APC-SIG-v1") so signing is detectable,
idempotent, and enforceable. The upload step MUST run `--check` and refuse any image
that isn't marked. (Images signed by the old "APC_SIGNED v1" tool at 15% are treated as
UNSIGNED so they get re-signed to the locked 10% spec.)

Sign:
  python sign_illustrations.py --in <raw_dir> --sig <signature.png> --out <signed_dir>
      [--scale 0.10] [--margin 0.015] [--pos bottom-right] [--opacity 1.0] [--quality 82]
Gate (before any upload; exits 1 if anything is unsigned):
  python sign_illustrations.py --check <signed_dir>
"""
import argparse, os, sys
from PIL import Image

MARKER = b"APC-SIG-v1"
DEF_SIG = r"H:/My Drive/DIGITAL PRODUCTS/THE AGING PARENT CARE GIVING SYSTEM/brand/APC Signature Transparent.png"
EXTS = (".png", ".jpg", ".jpeg", ".webp")
POSITIONS = ("bottom-right", "bottom-left", "top-right", "top-left", "bottom-center")

def list_images(d):
    return sorted(f for f in os.listdir(d) if f.lower().endswith(EXTS) and os.path.isfile(os.path.join(d, f)))

def is_signed(path):
    try:
        with Image.open(path) as im:
            return im.info.get("comment") == MARKER or MARKER.decode() in str(im.info.get("comment", ""))
    except Exception:
        return False

def place(W, H, w, h, m, pos):
    if pos == "bottom-right":  return (W - w - m, H - h - m)
    if pos == "bottom-left":   return (m, H - h - m)
    if pos == "top-right":     return (W - w - m, m)
    if pos == "top-left":      return (m, m)
    if pos == "bottom-center": return ((W - w) // 2, H - h - m)
    raise SystemExit(f"unknown --pos {pos}")

def sign_one(img_path, sig_rgba, scale, margin, pos, opacity):
    base = Image.open(img_path).convert("RGBA")
    W, H = base.size
    target_w = max(1, int(W * scale))
    target_h = max(1, int(sig_rgba.height * target_w / sig_rgba.width))
    sig = sig_rgba.resize((target_w, target_h), Image.LANCZOS)
    if opacity < 1.0:
        sig.putalpha(sig.getchannel("A").point(lambda p: int(p * opacity)))
    base.alpha_composite(sig, place(W, H, target_w, target_h, int(W * margin), pos))
    return base.convert("RGB")

def do_sign(a):
    if not os.path.isfile(a.sig):
        raise SystemExit(f"ERROR: signature asset not found: {a.sig}")
    if not os.path.isdir(a.inp):
        raise SystemExit(f"ERROR: input dir not found: {a.inp}")
    os.makedirs(a.out, exist_ok=True)
    sig_rgba = Image.open(a.sig).convert("RGBA")
    imgs = list_images(a.inp)
    if not imgs:
        raise SystemExit(f"ERROR: no images in {a.inp}")
    print(f"Signing {len(imgs)} image(s) | scale={a.scale} margin={a.margin} pos={a.pos} opacity={a.opacity}")
    n = 0
    for f in imgs:
        src = os.path.join(a.inp, f)
        if is_signed(src):
            print(f"  skip (already signed): {f}")
            continue
        out_path = os.path.join(a.out, os.path.splitext(f)[0] + ".jpg")
        signed = sign_one(src, sig_rgba, a.scale, a.margin, a.pos, a.opacity)
        signed.save(out_path, "JPEG", quality=a.quality, optimize=True, comment=MARKER)
        n += 1
        print(f"  [{n:>2}/{len(imgs)}] {os.path.basename(out_path)} ({signed.size[0]}x{signed.size[1]})")
    print(f"DONE: {n} signed -> {a.out}")

def do_check(path):
    if os.path.isdir(path):
        targets = [os.path.join(path, f) for f in list_images(path)]
    elif os.path.isfile(path):
        targets = [path]
    else:
        raise SystemExit(f"ERROR: path not found: {path}")
    if not targets:
        raise SystemExit(f"ERROR: no images at {path}")
    unsigned = [t for t in targets if not is_signed(t)]
    for t in targets:
        print(("OK   " if t not in unsigned else "MISS ") + os.path.basename(t))
    if unsigned:
        raise SystemExit(f"GATE FAILED: {len(unsigned)} unsigned image(s). Sign before upload.")
    print(f"GATE PASSED: all {len(targets)} image(s) carry the APC signature.")

def main():
    ap = argparse.ArgumentParser(description="Canonical APC illustration signer + gate")
    ap.add_argument("--in", dest="inp", help="folder of raw illustrations to sign")
    ap.add_argument("--sig", dest="sig", default=DEF_SIG, help="APC Signature Transparent.png")
    ap.add_argument("--out", dest="out", default="./signed", help="output folder for signed JPEGs")
    ap.add_argument("--check", dest="check", help="verify a file/folder is signed; exit 1 if not")
    ap.add_argument("--scale", type=float, default=0.10, help="signature width as fraction of image width (LOCKED 0.10)")
    ap.add_argument("--margin", type=float, default=0.015, help="margin as fraction of image width (LOCKED 0.015)")
    ap.add_argument("--pos", default="bottom-right", choices=POSITIONS)
    ap.add_argument("--opacity", type=float, default=1.0)
    ap.add_argument("--quality", type=int, default=82)
    a = ap.parse_args()
    if a.check:
        do_check(a.check)
    elif a.inp:
        do_sign(a)
    else:
        ap.error("provide --in (to sign) or --check (to verify)")

if __name__ == "__main__":
    main()
