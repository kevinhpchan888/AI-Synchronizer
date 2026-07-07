"""
kill_criteria.py - Evaluate whether a Facebook ad set should be killed.

Takes ad set performance inputs and returns a decision based on 2026 operator consensus
kill criteria. Helps a user resist the temptation to keep a losing ad set alive.

Usage:
    python kill_criteria.py --spent 55 --purchases 0 --break-even-cpa 17 --ctr 0.012 --cpc 1.20 --clicks 46
    python kill_criteria.py --interactive
"""

import argparse
import sys
from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class AdSetStatus:
    spent: float
    purchases: int
    break_even_cpa: float
    ctr: float  # decimal, e.g. 0.015
    cpc: float
    cpm: float  # cost per 1000 impressions
    clicks: int
    lp_conv_rate: float  # decimal
    roas: float  # observed ROAS (raw Meta number)
    days_live: int
    geo_cpm_benchmark: float = 30.0  # realistic 2026 US T1 baseline


def evaluate(s: AdSetStatus) -> Tuple[str, List[str]]:
    """Return (decision, reasons)."""
    kill_reasons = []
    warn_reasons = []

    # 1. Zero purchases at 3x break-even
    if s.purchases == 0 and s.spent >= 3 * s.break_even_cpa:
        kill_reasons.append(
            f"Zero purchases after spending ${s.spent:.2f}, which is 3x break-even CPA of ${s.break_even_cpa:.2f}. Statistically the creative or product is not converting."
        )

    # 2. CTR under 1% after $50
    if s.spent >= 50 and s.ctr < 0.01:
        kill_reasons.append(
            f"CTR {s.ctr:.2%} is below the 1.0% floor after ${s.spent:.2f} spent. The hook is not working."
        )
    elif s.ctr < 0.012:
        warn_reasons.append(f"CTR {s.ctr:.2%} is weak. 1.5%+ is the target on good creative.")

    # 3. CPC above 1.5x viable threshold (only if not already proving out via purchases)
    # If the ad set is actually converting at good ROAS, the theoretical CPC check is moot.
    max_viable_cpc = s.break_even_cpa * 0.025  # assumes 2.5% LP conv
    if s.spent >= 30 and s.cpc > max_viable_cpc * 1.5 and s.purchases < 2:
        kill_reasons.append(
            f"CPC ${s.cpc:.2f} is 1.5x above viable threshold of ${max_viable_cpc:.2f} (assumes 2.5% LP conversion) and only {s.purchases} purchase(s). Math does not work unless LP conversion is unrealistically high."
        )

    # 4. CPM above 1.5x geo benchmark
    if s.spent >= 50 and s.cpm > s.geo_cpm_benchmark * 1.5:
        warn_reasons.append(
            f"CPM ${s.cpm:.2f} is 1.5x above geo benchmark ${s.geo_cpm_benchmark:.2f}. Quality score likely penalized. Check policy."
        )

    # 5. ROAS below 1.2 after 3 days at steady spend
    if s.days_live >= 3 and s.roas < 1.2 and s.purchases >= 3:
        kill_reasons.append(
            f"ROAS {s.roas:.2f} is below 1.2 after {s.days_live} days with {s.purchases} purchases. Losing money at scale."
        )

    # 6. LP conversion below 0.8% after 200 clicks
    if s.clicks >= 200 and s.lp_conv_rate < 0.008:
        kill_reasons.append(
            f"LP conversion {s.lp_conv_rate:.2%} is below 0.8% floor after {s.clicks} clicks. Ad-to-page disconnect or broken funnel."
        )

    # Decision
    if kill_reasons:
        return "KILL", kill_reasons + warn_reasons
    if warn_reasons:
        return "WATCH", warn_reasons
    # Is there positive signal?
    if s.purchases >= 3 and s.roas >= 1.5 and s.days_live >= 3:
        return "SCALE", [
            f"Clean signal: {s.purchases} purchases, ROAS {s.roas:.2f}, {s.days_live} days stable.",
            "Consider duplicating to ASC at 2-3x budget. Preserve post ID for social proof.",
        ]
    return "HOLD", [f"Not enough data to decide. Spent ${s.spent:.2f}, {s.purchases} purchases."]


def interactive() -> AdSetStatus:
    print("Ad set kill-criteria evaluator (interactive)")
    spent = float(input("Total spend ($): "))
    purchases = int(input("Purchases: "))
    be_cpa = float(input("Break-even CPA from unit economics ($): "))
    ctr_pct = float(input("CTR (%): "))
    cpc = float(input("CPC ($): "))
    cpm = float(input("CPM ($): "))
    clicks = int(input("Total clicks: "))
    lp = float(input("LP conversion rate (%): "))
    roas = float(input("Meta-reported ROAS: "))
    days = int(input("Days live: "))
    return AdSetStatus(
        spent=spent,
        purchases=purchases,
        break_even_cpa=be_cpa,
        ctr=ctr_pct / 100,
        cpc=cpc,
        cpm=cpm,
        clicks=clicks,
        lp_conv_rate=lp / 100,
        roas=roas,
        days_live=days,
    )


def main() -> int:
    ap = argparse.ArgumentParser(description="Ad set kill criteria evaluator")
    ap.add_argument("--spent", type=float)
    ap.add_argument("--purchases", type=int, default=0)
    ap.add_argument("--break-even-cpa", type=float)
    ap.add_argument("--ctr", type=float, help="Decimal, e.g. 0.015")
    ap.add_argument("--cpc", type=float, default=0)
    ap.add_argument("--cpm", type=float, default=0)
    ap.add_argument("--clicks", type=int, default=0)
    ap.add_argument("--lp-conv", type=float, default=0, help="Decimal, e.g. 0.02")
    ap.add_argument("--roas", type=float, default=0)
    ap.add_argument("--days", type=int, default=1)
    ap.add_argument("--interactive", action="store_true")
    args = ap.parse_args()

    if args.interactive:
        s = interactive()
    elif args.spent is None or args.break_even_cpa is None:
        ap.error("Provide --spent and --break-even-cpa, or use --interactive")
    else:
        s = AdSetStatus(
            spent=args.spent,
            purchases=args.purchases,
            break_even_cpa=args.break_even_cpa,
            ctr=args.ctr or 0,
            cpc=args.cpc or 0,
            cpm=args.cpm or 0,
            clicks=args.clicks,
            lp_conv_rate=args.lp_conv,
            roas=args.roas,
            days_live=args.days,
        )

    decision, reasons = evaluate(s)
    print("\n" + "=" * 60)
    print(f"DECISION: {decision}")
    print("=" * 60)
    for r in reasons:
        print(f"- {r}")
    print()
    return 0 if decision in ("SCALE", "HOLD") else 1


if __name__ == "__main__":
    sys.exit(main())
