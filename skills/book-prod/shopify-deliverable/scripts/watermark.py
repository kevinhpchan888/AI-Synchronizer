#!/usr/bin/env python3
"""Apply a low-opacity diagonal watermark to a PDF using pypdf + reportlab."""
import argparse, io, pathlib
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from pypdf import PdfReader, PdfWriter, Transformation

def make_stamp(text: str, opacity: float, w: float, h: float) -> io.BytesIO:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(w, h))
    c.setFillColorRGB(0.5, 0.5, 0.5, alpha=opacity)
    c.setFont("Helvetica-Bold", 36)
    c.saveState(); c.translate(w/2, h/2); c.rotate(35)
    c.drawCentredString(0, 0, text); c.restoreState(); c.save()
    buf.seek(0); return buf

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--pdf", type=pathlib.Path, required=True)
    p.add_argument("--text", required=True)
    p.add_argument("--opacity", type=float, default=0.08)
    p.add_argument("--out", type=pathlib.Path, required=True)
    a = p.parse_args()
    reader = PdfReader(str(a.pdf)); writer = PdfWriter()
    for page in reader.pages:
        w = float(page.mediabox.width); h = float(page.mediabox.height)
        stamp = PdfReader(make_stamp(a.text, a.opacity, w, h)).pages[0]
        page.merge_page(stamp)
        writer.add_page(page)
    with open(a.out, "wb") as f: writer.write(f)

if __name__ == "__main__": main()
