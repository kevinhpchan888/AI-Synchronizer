"""
scan_amazon_ms.py - Amazon Movers and Shakers scraper for dropshipping product discovery.

Amazon Movers and Shakers refreshes hourly and shows biggest sales-rank gainers over 24 hours.
This is one of the strongest free purchase-velocity signals available.

Usage:
    python scan_amazon_ms.py                      # All categories, top 20
    python scan_amazon_ms.py --category home      # Just home and kitchen
    python scan_amazon_ms.py --min-rank-gain 300  # Only products with 300%+ rank gain
    python scan_amazon_ms.py --output csv         # Write to CSV instead of stdout

Portable to any Python 3.9+ environment. No API keys required.
"""

import argparse
import csv
import sys
import time
import random
from typing import List, Dict, Optional
from urllib.parse import urljoin

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Missing dependencies. Run: pip install requests beautifulsoup4", file=sys.stderr)
    sys.exit(1)


# Category slugs map to Amazon's internal node IDs. Common dropshipping categories:
CATEGORIES = {
    "all": "https://www.amazon.com/gp/movers-and-shakers/",
    "home": "https://www.amazon.com/gp/movers-and-shakers/home-garden/",
    "kitchen": "https://www.amazon.com/gp/movers-and-shakers/kitchen/",
    "beauty": "https://www.amazon.com/gp/movers-and-shakers/beauty/",
    "health": "https://www.amazon.com/gp/movers-and-shakers/hpc/",
    "electronics": "https://www.amazon.com/gp/movers-and-shakers/electronics/",
    "sports": "https://www.amazon.com/gp/movers-and-shakers/sporting-goods/",
    "toys": "https://www.amazon.com/gp/movers-and-shakers/toys-and-games/",
    "pet": "https://www.amazon.com/gp/movers-and-shakers/pet-supplies/",
    "garden": "https://www.amazon.com/gp/movers-and-shakers/lawn-garden/",
    "office": "https://www.amazon.com/gp/movers-and-shakers/office-products/",
}

# Rotate user agents to reduce block risk. Kept current for 2026.
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
]


def fetch_page(url: str, timeout: int = 20) -> Optional[str]:
    """Fetch a URL with rotating UA and sensible retry. Returns HTML or None on failure."""
    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
    }
    for attempt in range(3):
        try:
            r = requests.get(url, headers=headers, timeout=timeout)
            if r.status_code == 200:
                return r.text
            if r.status_code == 503:
                # Amazon throttling. Wait and retry.
                time.sleep(5 + attempt * 5)
                continue
            print(f"HTTP {r.status_code} for {url}", file=sys.stderr)
            return None
        except requests.RequestException as e:
            print(f"Attempt {attempt+1} failed: {e}", file=sys.stderr)
            time.sleep(2 + attempt * 3)
    return None


def parse_movers(html: str, limit: int = 50) -> List[Dict]:
    """
    Parse the Movers and Shakers HTML. Amazon changes DOM regularly so this uses
    defensive selectors and falls back on multiple strategies.
    """
    soup = BeautifulSoup(html, "lxml")
    items = []

    # Strategy 1: modern zg-grid-general-faceout cards (2024-2026 layout)
    cards = soup.select("div[id^='p13n-asin-index-']")
    if not cards:
        # Strategy 2: older layout
        cards = soup.select(".zg-item-immersion")
    if not cards:
        # Strategy 3: very generic fallback
        cards = soup.select("[data-asin]")

    for card in cards[:limit]:
        item = _extract_card(card)
        if item:
            items.append(item)
    return items


def _extract_card(card) -> Optional[Dict]:
    """Pull ASIN, title, rank change, price, and link from a card. Skip on any core failure."""
    try:
        # Title and link
        title_el = card.select_one("a[href*='/dp/'] .p13n-sc-truncate-desktop-type2, a[href*='/dp/'] ._cDEzb_p13n-sc-css-line-clamp-3_g3dy1, a[href*='/dp/']")
        if not title_el:
            return None
        title = title_el.get_text(strip=True)
        link_el = card.select_one("a[href*='/dp/']")
        link = urljoin("https://www.amazon.com", link_el["href"].split("?")[0]) if link_el else None

        # ASIN
        asin = None
        if link:
            # Typical pattern: /dp/B0XXXXXXXX/
            parts = link.split("/dp/")
            if len(parts) > 1:
                asin = parts[1].split("/")[0]

        # Rank gain (the key signal)
        rank_el = card.select_one(".zg-percent-change, .zg-sales-movement, [class*='rank']")
        rank_text = rank_el.get_text(strip=True) if rank_el else ""

        # Price
        price_el = card.select_one(".p13n-sc-price, .a-price .a-offscreen, ._cDEzb_p13n-sc-price_3mJ9Z")
        price = price_el.get_text(strip=True) if price_el else ""

        # Rating
        rating_el = card.select_one(".a-icon-star-small .a-icon-alt, .a-icon-star .a-icon-alt")
        rating = rating_el.get_text(strip=True) if rating_el else ""

        return {
            "asin": asin or "",
            "title": title[:200],
            "rank_change": rank_text,
            "price": price,
            "rating": rating,
            "url": link or "",
        }
    except Exception as e:
        print(f"Card parse error: {e}", file=sys.stderr)
        return None


def filter_by_rank_gain(items: List[Dict], min_pct: int = 0) -> List[Dict]:
    """Keep only items with rank gain above min_pct. Parses text like '+1,234%' or 'Sales rank: 45 (Was 300)'."""
    if min_pct <= 0:
        return items
    kept = []
    for it in items:
        text = it["rank_change"]
        # Extract percentage
        import re
        m = re.search(r"(\d[\d,]*)\s*%", text)
        if m:
            pct = int(m.group(1).replace(",", ""))
            if pct >= min_pct:
                kept.append(it)
    return kept


def output_table(items: List[Dict]) -> None:
    """Pretty-print to stdout."""
    if not items:
        print("No items found. Amazon may have changed DOM or throttled.", file=sys.stderr)
        return
    for i, it in enumerate(items, 1):
        print(f"{i}. {it['title']}")
        print(f"   ASIN: {it['asin']} | Price: {it['price']} | Rank gain: {it['rank_change']} | {it['rating']}")
        print(f"   {it['url']}")
        print()


def output_csv(items: List[Dict], path: str) -> None:
    """Write to CSV."""
    if not items:
        return
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["asin", "title", "price", "rank_change", "rating", "url"])
        w.writeheader()
        w.writerows(items)
    print(f"Wrote {len(items)} items to {path}", file=sys.stderr)


def main() -> int:
    ap = argparse.ArgumentParser(description="Scan Amazon Movers and Shakers for dropshipping signals.")
    ap.add_argument("--category", default="all", choices=list(CATEGORIES.keys()))
    ap.add_argument("--limit", type=int, default=50)
    ap.add_argument("--min-rank-gain", type=int, default=0, help="Minimum rank gain percentage to keep")
    ap.add_argument("--output", default="stdout", choices=["stdout", "csv"])
    ap.add_argument("--csv-path", default="amazon_movers.csv")
    args = ap.parse_args()

    url = CATEGORIES[args.category]
    print(f"Fetching {args.category} from {url}", file=sys.stderr)

    html = fetch_page(url)
    if not html:
        print("Failed to fetch. Likely rate-limited or DOM changed. Try again in 5 minutes.", file=sys.stderr)
        return 1

    items = parse_movers(html, limit=args.limit)
    items = filter_by_rank_gain(items, args.min_rank_gain)

    if args.output == "csv":
        output_csv(items, args.csv_path)
    else:
        output_table(items)

    return 0


if __name__ == "__main__":
    sys.exit(main())
