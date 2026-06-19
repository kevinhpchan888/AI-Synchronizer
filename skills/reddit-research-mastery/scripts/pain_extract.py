#!/usr/bin/env python3
"""
pain_extract.py — extract pain language patterns from a comment dump.

Reads JSON output from reddit_backend.py and surfaces sentences matching
the pain-pattern taxonomy from SKILL.md.

Usage:
    python reddit_backend.py thread <id> > thread.json
    python pain_extract.py thread.json --top 20
"""

import argparse
import json
import re
import sys
from collections import Counter

# Pattern -> (regex, label)
PATTERNS = [
    (r"\b(i hate when|i can'?t stand|i'?m so sick of|i'?m so tired of|drives me (crazy|nuts|insane))\b", "rage"),
    (r"\b(i wish there (was|were)|why is there no|why doesn'?t (someone|anyone) (make|sell))\b", "unmet_need"),
    (r"\b(i (tried|bought|owned) .{0,80}? (and|but) (none|neither|it didn'?t|they didn'?t))\b", "failed_alternatives"),
    (r"\b(it'?s like|it feels like|like trying to|kind of like|sort of like)\b", "metaphor"),
    (r"\b(has anyone else|am i the only one|does anyone (else )?(have|get|feel))\b", "validation_seeking"),
    (r"\b(why does (no ?one|nobody) talk about|why is no ?one (talking|saying))\b", "hidden_problem"),
    (r"\b(if only|i just want|all i want|i'?d kill for|i'?d pay (good )?money for)\b", "desired_state"),
    (r"\b(don'?t (waste your money|bother|buy)|stay away from|avoid|terrible|garbage|junk|scam)\b", "negative_signal"),
    (r"\b(i almost bought .{0,80}? (but|then)|i was (going|about) to (buy|get) .{0,40}? (but|then))\b", "near_miss"),
    (r"\b(does this (actually|really) work|is this (a |another )?(scam|gimmick|placebo))\b", "skepticism"),
    (r"\b(\$\d+ for|paying \$\d+|costs? \$\d+).{0,80}?(ridiculous|insane|crazy|too much|rip ?off)", "price_objection"),
    (r"\b(side effects?|safe|dangerous|risk|hurt(s)?|injur(y|ed)|allerg)\b", "safety_concern"),
    (r"\b(worth it|game ?changer|life ?saver|life ?changing|finally|holy grail)\b", "raving_fan"),
]

COMPILED = [(re.compile(p, re.IGNORECASE), label) for p, label in PATTERNS]
SENT_SPLIT = re.compile(r"(?<=[.!?])\s+(?=[A-Z\"'(])")


def split_sentences(text):
    if not text:
        return []
    text = text.replace("\n", " ").strip()
    parts = SENT_SPLIT.split(text)
    return [p.strip() for p in parts if p.strip() and len(p.strip()) > 10]


def extract(text, source_meta=None):
    hits = []
    for sent in split_sentences(text):
        for rx, label in COMPILED:
            if rx.search(sent):
                hits.append({"label": label, "sentence": sent, **(source_meta or {})})
                break  # one label per sentence
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", help="JSON file from reddit_backend.py (thread, sub, or search output)")
    ap.add_argument("--top", type=int, default=0, help="Limit output per label")
    ap.add_argument("--label", help="Filter by single label")
    args = ap.parse_args()

    with open(args.input, encoding="utf-8") as f:
        data = json.load(f)

    items = []
    if isinstance(data, dict) and "comments" in data:
        # thread output
        for c in data["comments"]:
            items.append({"text": c.get("body", ""), "author": c.get("author"), "score": c.get("score"), "id": c.get("id")})
        if data.get("post", {}).get("selftext"):
            p = data["post"]
            items.append({"text": p["selftext"], "author": p.get("author"), "score": p.get("score"), "id": p.get("id")})
    elif isinstance(data, list):
        # search/sub output (posts)
        for p in data:
            text = (p.get("title", "") + ". " + (p.get("selftext") or "")).strip()
            items.append({"text": text, "author": p.get("author"), "score": p.get("score"), "id": p.get("id"), "permalink": p.get("permalink")})
    else:
        print("Unrecognized input shape", file=sys.stderr)
        sys.exit(1)

    all_hits = []
    for it in items:
        meta = {k: v for k, v in it.items() if k != "text"}
        all_hits.extend(extract(it["text"], meta))

    if args.label:
        all_hits = [h for h in all_hits if h["label"] == args.label]

    by_label = {}
    for h in all_hits:
        by_label.setdefault(h["label"], []).append(h)

    # Sort each label group by score desc, take --top
    for label, hits in by_label.items():
        hits.sort(key=lambda x: x.get("score", 0) or 0, reverse=True)
        if args.top:
            by_label[label] = hits[: args.top]

    counts = Counter({k: len(v) for k, v in by_label.items()})
    out = {
        "summary": dict(counts.most_common()),
        "total_sentences_matched": sum(counts.values()),
        "by_label": by_label,
    }
    json.dump(out, sys.stdout, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
