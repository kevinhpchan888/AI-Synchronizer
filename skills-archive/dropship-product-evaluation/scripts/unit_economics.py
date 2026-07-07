"""
unit_economics.py - Dropshipping unit economics calculator.

Computes contribution margin, break-even CPA, target CPA, and required landing-page
conversion rate given realistic 2026 Meta CPMs. Refuses to approve products that need
unrealistic conversion rates to be profitable.

Usage:
    python unit_economics.py --retail 39.99 --cogs 7.50
    python unit_economics.py --retail 49.99 --cogs 8.00 --geo US --category electronics
    python unit_economics.py --interactive
"""

import argparse
import sys
from dataclasses import dataclass
from typing import Dict, Optional


# 2026 baseline Meta CPMs by geo (honest operator benchmarks, not guru-course fantasy)
CPM_BENCHMARKS = {
    "US_T1": {"cpm": 35, "ctr": 0.015, "label": "US Tier 1 cold broad"},
    "US_iOS": {"cpm": 42, "ctr": 0.014, "label": "US iOS-device targeting"},
    "UK": {"cpm": 27, "ctr": 0.016, "label": "UK"},
    "AU": {"cpm": 28, "ctr": 0.015, "label": "Australia"},
    "CA": {"cpm": 25, "ctr": 0.016, "label": "Canada"},
    "EU_EN": {"cpm": 22, "ctr": 0.015, "label": "Western Europe English"},
    "EU_NonEN": {"cpm": 19, "ctr": 0.016, "label": "Western Europe non-English"},
    "LATAM": {"cpm": 10, "ctr": 0.018, "label": "LATAM"},
    "SEA": {"cpm": 8, "ctr": 0.020, "label": "Southeast Asia"},
}

# Return rates by category (reserve that hits contribution margin)
CATEGORY_RETURNS = {
    "electronics": 0.12,
    "apparel": 0.20,
    "jewelry": 0.15,
    "home": 0.05,
    "kitchen": 0.05,
    "novelty": 0.05,
    "beauty": 0.08,
    "health": 0.08,
    "pet": 0.06,
    "sports": 0.07,
    "office": 0.04,
    "default": 0.07,
}


@dataclass
class UnitEconomics:
    retail: float
    cogs: float  # landed cost: product + shipping to customer + packaging
    payment_fee_rate: float = 0.035  # Shopify + Shop Pay blended
    app_cost_per_order: float = 0.50  # apps divided across monthly volume
    return_rate: float = 0.07
    geo: str = "US_T1"
    target_net_margin_pct: float = 0.40  # keep 40% of contribution as net

    @property
    def payment_fee(self) -> float:
        return self.retail * self.payment_fee_rate

    @property
    def gross_margin_per_unit(self) -> float:
        return self.retail - self.cogs

    @property
    def refund_loss(self) -> float:
        return self.return_rate * self.gross_margin_per_unit

    @property
    def contribution_margin(self) -> float:
        return (
            self.retail
            - self.cogs
            - self.payment_fee
            - self.app_cost_per_order
            - self.refund_loss
        )

    @property
    def break_even_cpa(self) -> float:
        return self.contribution_margin

    @property
    def target_cpa(self) -> float:
        return self.contribution_margin * (1 - self.target_net_margin_pct)

    @property
    def cpm(self) -> float:
        return CPM_BENCHMARKS.get(self.geo, CPM_BENCHMARKS["US_T1"])["cpm"]

    @property
    def ctr(self) -> float:
        return CPM_BENCHMARKS.get(self.geo, CPM_BENCHMARKS["US_T1"])["ctr"]

    @property
    def required_lp_conversion(self) -> float:
        """
        Required landing-page conversion rate to hit target CPA.
        Target CPA = CPM / 1000 * 1/CTR * 1/LP_rate
        -> LP_rate = CPM / (1000 * CTR * Target_CPA)
        """
        if self.target_cpa <= 0:
            return 999.0  # impossible
        return self.cpm / (1000 * self.ctr * self.target_cpa)

    @property
    def markup_multiple(self) -> float:
        if self.cogs <= 0:
            return 0
        return self.retail / self.cogs

    def verdict(self) -> Dict:
        lp_rate = self.required_lp_conversion
        cm = self.contribution_margin
        if cm <= 0:
            status = "FAIL"
            reason = "Negative contribution margin. Product loses money before ad spend."
        elif self.target_cpa <= 0:
            status = "FAIL"
            reason = "Zero or negative target CPA after net margin reserve."
        elif lp_rate > 0.05:
            status = "FAIL"
            reason = f"Required LP conversion {lp_rate:.1%} exceeds realistic 5% ceiling."
        elif lp_rate > 0.035:
            status = "MARGINAL"
            reason = f"LP conversion {lp_rate:.1%} is above 3.5%. Achievable but needs excellent creative and offer."
        elif lp_rate > 0.025:
            status = "PASS"
            reason = f"LP conversion {lp_rate:.1%} is in the 2.5-3.5% workable band."
        else:
            status = "STRONG PASS"
            reason = f"LP conversion {lp_rate:.1%} is comfortably below industry benchmark. Strong unit economics."
        return {"status": status, "reason": reason, "lp_rate": lp_rate}


def report(ue: UnitEconomics) -> None:
    geo_info = CPM_BENCHMARKS.get(ue.geo, CPM_BENCHMARKS["US_T1"])
    print("=" * 60)
    print("DROPSHIPPING UNIT ECONOMICS")
    print("=" * 60)
    print(f"Retail price:          ${ue.retail:.2f}")
    print(f"Landed cost (COGS):    ${ue.cogs:.2f}")
    print(f"Markup multiple:       {ue.markup_multiple:.2f}x")
    print(f"Payment fee ({ue.payment_fee_rate:.1%}):   ${ue.payment_fee:.2f}")
    print(f"Apps/order:            ${ue.app_cost_per_order:.2f}")
    print(f"Return rate:           {ue.return_rate:.1%}")
    print(f"Refund loss:           ${ue.refund_loss:.2f}")
    print("-" * 60)
    print(f"CONTRIBUTION MARGIN:   ${ue.contribution_margin:.2f}")
    print(f"Break-even CPA:        ${ue.break_even_cpa:.2f}")
    print(f"Target CPA ({ue.target_net_margin_pct:.0%} net): ${ue.target_cpa:.2f}")
    print("-" * 60)
    print(f"Geo:                   {geo_info['label']}")
    print(f"Expected CPM:          ${ue.cpm:.2f}")
    print(f"Expected CTR:          {ue.ctr:.2%}")
    verdict = ue.verdict()
    print(f"Required LP conv:      {verdict['lp_rate']:.2%}")
    print("=" * 60)
    print(f"VERDICT: {verdict['status']}")
    print(f"Reasoning: {verdict['reason']}")
    print("=" * 60)

    # Helpful sensitivity hints
    if verdict["status"] in ("FAIL", "MARGINAL"):
        print("\nSensitivity levers to try:")
        # What retail would make it work?
        target_lp = 0.025
        needed_cpa = ue.cpm / (1000 * ue.ctr * target_lp)
        needed_cm = needed_cpa / (1 - ue.target_net_margin_pct)
        needed_retail = ue.cogs + ue.payment_fee_rate * ue.retail + ue.app_cost_per_order + (
            ue.return_rate * ue.gross_margin_per_unit
        ) + needed_cm
        # approximate; payment fee scales with retail
        # Use iteration for a cleaner answer
        r = ue.cogs + needed_cm + ue.app_cost_per_order
        for _ in range(5):
            fee = r * ue.payment_fee_rate
            loss = ue.return_rate * (r - ue.cogs)
            r = ue.cogs + fee + ue.app_cost_per_order + loss + needed_cm
        print(f"  - Raise retail to ~${r:.2f} (stress-test demand at higher price)")
        target_cogs = ue.cogs * 0.7
        print(f"  - Cut COGS to ~${target_cogs:.2f} (30% via better supplier)")
        print(f"  - Add bundle offer to lift AOV: buy 2 get 1 or pair with upsell at ~${ue.retail*1.5:.2f}")


def interactive() -> UnitEconomics:
    print("Dropshipping unit economics calculator (interactive)")
    retail = float(input("Retail price (USD): ").strip())
    cogs = float(input("Landed cost incl. shipping to customer (USD): ").strip())
    print("\nGeos:")
    for k, v in CPM_BENCHMARKS.items():
        print(f"  {k:12s}  {v['label']}  (CPM ${v['cpm']}, CTR {v['ctr']:.1%})")
    geo = input("Geo (default US_T1): ").strip() or "US_T1"
    print("\nCategories for return rate:")
    for k, v in CATEGORY_RETURNS.items():
        if k != "default":
            print(f"  {k:12s}  {v:.1%}")
    cat = input("Category (default 'default' 7%): ").strip() or "default"
    return UnitEconomics(
        retail=retail,
        cogs=cogs,
        geo=geo,
        return_rate=CATEGORY_RETURNS.get(cat, CATEGORY_RETURNS["default"]),
    )


def main() -> int:
    ap = argparse.ArgumentParser(description="Dropshipping unit economics.")
    ap.add_argument("--retail", type=float, help="Retail price USD")
    ap.add_argument("--cogs", type=float, help="Landed cost USD")
    ap.add_argument("--geo", default="US_T1", choices=list(CPM_BENCHMARKS.keys()))
    ap.add_argument("--category", default="default", choices=list(CATEGORY_RETURNS.keys()))
    ap.add_argument("--net-margin", type=float, default=0.40, help="Target net margin %")
    ap.add_argument("--interactive", action="store_true")
    args = ap.parse_args()

    if args.interactive:
        ue = interactive()
    else:
        if args.retail is None or args.cogs is None:
            ap.error("Provide --retail and --cogs, or use --interactive")
        ue = UnitEconomics(
            retail=args.retail,
            cogs=args.cogs,
            geo=args.geo,
            return_rate=CATEGORY_RETURNS.get(args.category, 0.07),
            target_net_margin_pct=args.net_margin,
        )

    report(ue)
    verdict = ue.verdict()
    return 0 if verdict["status"] in ("PASS", "STRONG PASS") else 1


if __name__ == "__main__":
    sys.exit(main())
