"""
compare_products.py - Compare arbitrarily many keywords on the same normalized Google Trends scale.

Google Trends limits each request to 5 keywords. The pivot-anchor technique:
    1. Pick one anchor keyword with mid-range volume.
    2. Split the full list into batches of 4.
    3. Query each batch WITH the anchor: [anchor, kw1, kw2, kw3, kw4], [anchor, kw5, kw6, kw7, kw8], etc.
    4. Rescale each batch by base_anchor_mean / this_batch_anchor_mean.
    5. All keywords end up on the same scale.

Usage:
    python compare_products.py --anchor "phone case" --keywords "posture corrector" "led lamp" "yoga mat" "air fryer" "resistance band" "magic bra"
"""

import argparse
import logging
import sys
from typing import List

try:
    import pandas as pd
except ImportError:
    print("pip install pandas", file=sys.stderr)
    sys.exit(1)

# Import the fetcher from sibling module
sys.path.insert(0, ".")
try:
    from fetch_trends import TrendsFetcher
except ImportError:
    # Allow running from any dir
    import os
    here = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, here)
    from fetch_trends import TrendsFetcher

log = logging.getLogger("compare")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


def compare_many(
    fetcher: TrendsFetcher,
    anchor: str,
    keywords: List[str],
    timeframe: str = "today 12-m",
    geo: str = "",
) -> pd.DataFrame:
    """Pivot-anchor scaling for >5 keywords."""
    # Dedupe and remove anchor from keywords
    keywords = [k for k in keywords if k != anchor]
    keywords = list(dict.fromkeys(keywords))  # dedupe preserving order

    batches = [keywords[i : i + 4] for i in range(0, len(keywords), 4)]
    merged = None
    base_anchor_mean = None

    for batch_idx, batch in enumerate(batches):
        log.info(f"Batch {batch_idx + 1}/{len(batches)}: {batch}")
        df = fetcher.interest_over_time([anchor] + batch, timeframe, geo)
        if df.empty or anchor not in df.columns:
            log.warning(f"Batch {batch_idx + 1} returned no usable data, skipping")
            continue

        this_anchor_mean = df[anchor].mean()
        if this_anchor_mean <= 0.01:
            this_anchor_mean = 0.01  # floor to avoid div by zero

        if merged is None:
            merged = df.copy()
            base_anchor_mean = df[anchor].mean() or 0.01
            log.info(f"Base anchor mean: {base_anchor_mean:.2f}")
        else:
            # Scale this batch's keyword columns to match base
            scale = base_anchor_mean / this_anchor_mean
            log.info(f"Batch {batch_idx + 1} scale factor: {scale:.3f}")
            for col in batch:
                if col in df.columns:
                    merged[col] = df[col] * scale

    if merged is None or merged.empty:
        log.error("No usable batches returned.")
        return pd.DataFrame()

    return merged


def rank_and_report(df: pd.DataFrame, anchor: str) -> None:
    """Print a ranking and comparison table."""
    if df.empty:
        return

    # Drop anchor from display
    display_cols = [c for c in df.columns if c != anchor]
    if not display_cols:
        print("No keywords to compare after removing anchor.")
        return

    # Compute summary per keyword
    print("\n" + "=" * 70)
    print("KEYWORD COMPARISON (normalized via anchor: '{}')".format(anchor))
    print("=" * 70)
    print(f"{'Keyword':<30} {'Mean':>8} {'Peak':>6} {'Recent 30d':>12} {'vs Prior':>10}")
    print("-" * 70)

    rows = []
    for kw in display_cols:
        s = df[kw].dropna()
        if len(s) < 4:
            continue
        mean = s.mean()
        peak = s.max()
        recent = s.tail(4).mean()
        prior = s.iloc[-26:-4].mean() if len(s) >= 26 else s.head(len(s) // 2).mean()
        change = ((recent - prior) / prior * 100) if prior > 0 else 0
        rows.append((kw, mean, peak, recent, change))

    # Sort by recent momentum
    rows.sort(key=lambda r: r[4], reverse=True)
    for kw, mean, peak, recent, change in rows:
        arrow = "↑" if change > 10 else "↓" if change < -10 else "→"
        print(f"{kw[:30]:<30} {mean:>8.1f} {peak:>6.0f} {recent:>12.1f} {change:>+9.1f}% {arrow}")
    print("=" * 70)
    print("\nRanking note: higher 'Recent 30d' means more current interest on the normalized scale.")
    print("Positive 'vs Prior' means momentum. Use dropship-product-evaluation to take ranked winners further.")


def main() -> int:
    ap = argparse.ArgumentParser(description="Compare many keywords via pivot-anchor")
    ap.add_argument("--anchor", required=True, help="Stable mid-volume keyword (e.g. 'phone case')")
    ap.add_argument("--keywords", nargs="+", required=True, help="List of product keywords (any number)")
    ap.add_argument("--timeframe", default="today 12-m")
    ap.add_argument("--geo", default="")
    ap.add_argument("--output", default="summary", choices=["summary", "csv"])
    ap.add_argument("--csv-path", default="comparison.csv")
    args = ap.parse_args()

    fetcher = TrendsFetcher()
    df = compare_many(fetcher, args.anchor, args.keywords, args.timeframe, args.geo)

    if df.empty:
        return 1

    if args.output == "csv":
        df.to_csv(args.csv_path)
        print(f"Wrote {args.csv_path}")
    else:
        rank_and_report(df, args.anchor)

    return 0


if __name__ == "__main__":
    sys.exit(main())
