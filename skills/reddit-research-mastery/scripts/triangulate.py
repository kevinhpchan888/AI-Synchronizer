#!/usr/bin/env python3
"""
triangulate.py — cross-reference a Reddit-found pain theme against other sources.

Takes a phrase or set of phrases and reports presence/absence across:
  - Google Trends (delegates to googletrends-mastery's trends_backend.py if installed)
  - Amazon reviews (delegates to community-research-mastery's amazon_reviews.py if installed)
  - Reddit historical (counts matching posts via reddit_backend.py)

Usage:
    python triangulate.py "posture corrector hurts my back" \
        --reddit --trends --asin B0CXXXXXXX

Output: confidence label (Low/Medium/High) and per-source notes.
"""

import argparse
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def _try_call(script_path, args):
    if not os.path.exists(script_path):
        return {"available": False, "note": f"{script_path} not installed"}
    try:
        out = subprocess.check_output([sys.executable, script_path] + args, timeout=60).decode("utf-8")
        return {"available": True, "output": out[:4000]}
    except subprocess.CalledProcessError as e:
        return {"available": True, "error": str(e), "stderr": (e.stderr or b"").decode("utf-8")[:2000] if e.stderr else None}
    except Exception as e:
        return {"available": True, "error": repr(e)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("phrase")
    ap.add_argument("--reddit", action="store_true", help="Search Reddit for the phrase")
    ap.add_argument("--trends", action="store_true", help="Hit Google Trends via sibling skill")
    ap.add_argument("--asin", help="Amazon ASIN to pull reviews for")
    ap.add_argument("--limit", type=int, default=25)
    args = ap.parse_args()

    result = {"phrase": args.phrase, "sources": {}}

    if args.reddit:
        rb = os.path.join(HERE, "reddit_backend.py")
        result["sources"]["reddit"] = _try_call(rb, ["search", args.phrase, "--limit", str(args.limit), "--sort", "top"])

    if args.trends:
        # Adjacent skill: googletrends-mastery
        tb = os.path.join(HERE, "..", "..", "googletrends-mastery", "scripts", "trends_backend.py")
        result["sources"]["google_trends"] = _try_call(tb, [args.phrase])

    if args.asin:
        # Adjacent skill: community-research-mastery
        ar = os.path.join(HERE, "..", "..", "community-research-mastery", "scripts", "amazon_reviews.py")
        result["sources"]["amazon_reviews"] = _try_call(ar, [args.asin, "--limit", str(args.limit)])

    sources_present = sum(1 for v in result["sources"].values() if v.get("available") and "output" in v)
    if sources_present >= 3:
        result["confidence"] = "High"
    elif sources_present == 2:
        result["confidence"] = "Medium"
    elif sources_present == 1:
        result["confidence"] = "Low (anecdote — find one more source before testing)"
    else:
        result["confidence"] = "None — no triangulation performed"

    json.dump(result, sys.stdout, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
