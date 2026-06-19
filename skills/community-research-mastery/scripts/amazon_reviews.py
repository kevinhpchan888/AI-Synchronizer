#!/usr/bin/env python3
"""
amazon_reviews.py — pull reviews for an ASIN.

Amazon aggressively blocks scraping. This script tries the public reviews
URL with a polite UA and falls back to a clear instruction for manual
collection if blocked. Designed to fail loudly, not silently.

Usage:
    python amazon_reviews.py B0CXXXXXXX --limit 50 --rating 1 2 3
    python amazon_reviews.py B0CXXXXXXX --domain co.uk

Output: JSON list of review dicts, or a manual-fallback instruction.
"""

import argparse
import json
import re
import sys
import time
import urllib.parse
import urllib.request

UA = "Mozilla/5.0 (compatible; DonnyResearchBot/1.0; +mailto:kevinhpchan@gmail.com)"
MIN_INTERVAL = 2.0


def _get(url):
    time.sleep(MIN_INTERVAL)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.read().decode("utf-8", errors="replace"), r.status
    except urllib.error.HTTPError as e:
        return None, e.code


REVIEW_RX = re.compile(
    r'data-hook="review".*?<a[^>]*?class="[^"]*?review-title[^"]*?"[^>]*>.*?<span[^>]*>(?P<title>[^<]+)</span>.*?'
    r'data-hook="review-star-rating".*?<span class="a-icon-alt">(?P<rating>\d(?:\.\d)?)\s+out of 5 stars</span>.*?'
    r'data-hook="review-date">(?P<date>[^<]+)</span>.*?'
    r'<span data-hook="review-body">.*?<span>\s*(?P<body>.*?)\s*</span>',
    re.DOTALL,
)


def fetch_reviews(asin, domain="com", page=1, sort="recent"):
    url = f"https://www.amazon.{domain}/product-reviews/{asin}/?sortBy={sort}&pageNumber={page}&reviewerType=avp_only_reviews"
    body, status = _get(url)
    if body is None or status != 200:
        return None, status
    reviews = []
    for m in REVIEW_RX.finditer(body):
        d = m.groupdict()
        body_text = re.sub(r"<[^>]+>", " ", d["body"]).strip()
        body_text = re.sub(r"\s+", " ", body_text)
        try:
            rating = int(float(d["rating"]))
        except ValueError:
            rating = None
        reviews.append({
            "title": d["title"].strip(),
            "rating": rating,
            "date": d["date"].strip(),
            "body": body_text,
        })
    return reviews, status


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("asin")
    ap.add_argument("--domain", default="com", help="Amazon domain TLD: com, co.uk, com.au, de, fr, etc.")
    ap.add_argument("--limit", type=int, default=50)
    ap.add_argument("--rating", type=int, nargs="*", help="Filter by ratings, e.g. --rating 1 2 3")
    ap.add_argument("--sort", default="recent", choices=["recent", "helpful"])
    args = ap.parse_args()

    all_reviews = []
    page = 1
    while len(all_reviews) < args.limit:
        revs, status = fetch_reviews(args.asin, args.domain, page, args.sort)
        if revs is None:
            print(json.dumps({
                "error": f"HTTP {status} — Amazon likely blocking. Manual fallback:",
                "manual_url": f"https://www.amazon.{args.domain}/product-reviews/{args.asin}/?sortBy={args.sort}",
                "instruction": "Open URL in browser, copy 1-3 star reviews, paste back to Donny for analysis.",
            }, indent=2))
            sys.exit(1)
        if not revs:
            break
        all_reviews.extend(revs)
        page += 1
        if page > 10:
            break

    if args.rating:
        all_reviews = [r for r in all_reviews if r.get("rating") in args.rating]

    json.dump(all_reviews[: args.limit], sys.stdout, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
