"""
icd203_brief.py — Generate ICD 203-compliant briefings from triangulated data.

Author: Donny (Kevin Chan), April 2026.

ICD 203 (Intelligence Community Directive 203) defines the analytic standards
that US intelligence products are evaluated against. This skill enforces them
on Trends-derived briefings because the same failure modes apply: source
quality matters, alternative explanations matter, likelihood is not the same
as confidence, and the consumer of the brief should know exactly which
combination of belief states the analyst held.

Likelihood vocabulary (verbatim from ICD 203):
    almost no chance      1-5%
    very unlikely         5-20%
    unlikely              20-45%
    roughly even chance   45-55%
    likely                55-80%
    very likely           80-95%
    almost certain        95-99%

Confidence is a separate axis. "Very likely" with "low confidence" is valid
and important. They must never be conflated.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Literal


LikelihoodTier = Literal[
    "almost no chance",
    "very unlikely",
    "unlikely",
    "roughly even chance",
    "likely",
    "very likely",
    "almost certain",
]
ConfidenceTier = Literal["LOW", "MODERATE", "HIGH"]


@dataclass
class AlternativeExplanation:
    name: str  # "Reverse causality", "Algorithmic artifact", etc.
    ruled: Literal["IN", "OUT", "PARTIAL"]
    reasoning: str


@dataclass
class Brief:
    subject_bluf: str
    key_judgment: str
    likelihood: LikelihoodTier
    confidence: ConfidenceTier
    confidence_basis: str
    evidence: list[str]
    alternatives: list[AlternativeExplanation]
    so_what: str
    now_what: str
    sources_caveats: list[str]
    author: str = "Donny (Kevin Chan)"
    generated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def render(self) -> str:
        lines = [
            f"SUBJECT: {self.subject_bluf}",
            "",
            f"KEY JUDGMENT: {self.key_judgment}",
            f"  Likelihood: {self.likelihood}",
            f"  Confidence: {self.confidence} — {self.confidence_basis}",
            "",
            "EVIDENCE (3 MECE points):",
        ]
        for i, e in enumerate(self.evidence, 1):
            lines.append(f"  {i}. {e}")
        lines += ["", "ALTERNATIVE EXPLANATIONS CONSIDERED:"]
        for alt in self.alternatives:
            lines.append(f"  - {alt.name}: ruled {alt.ruled} — {alt.reasoning}")
        lines += [
            "",
            f"SO WHAT: {self.so_what}",
            f"NOW WHAT: {self.now_what}",
            "",
            "SOURCES & CAVEATS:",
        ]
        for c in self.sources_caveats:
            lines.append(f"  - {c}")
        lines += [
            "",
            f"Author: {self.author}",
            f"Generated: {self.generated_at:%Y-%m-%d %H:%M UTC}",
        ]
        return "\n".join(lines)


def validate(brief: Brief) -> list[str]:
    """Return a list of ICD 203 compliance issues, empty if compliant."""
    issues = []
    if len(brief.evidence) != 3:
        issues.append(f"ICD 203 requires 3 MECE evidence points; got {len(brief.evidence)}")
    required_alternatives = {
        "Reverse causality", "Algorithmic artifact",
        "Sampling noise", "News-cycle confound",
    }
    present = {a.name for a in brief.alternatives}
    missing = required_alternatives - present
    if missing:
        issues.append(f"Missing required alternatives: {sorted(missing)}")
    if not brief.so_what.strip() or not brief.now_what.strip():
        issues.append("SO WHAT and NOW WHAT must both be non-empty")
    if not brief.sources_caveats:
        issues.append("At least one source/caveat must be listed")
    return issues


# ---------------------------------------------------------------------------
# Example: how the rest of the skill assembles a brief from triangulate.py
# ---------------------------------------------------------------------------

def example():
    brief = Brief(
        subject_bluf=(
            "BLUF: 'AI agents' search interest shows sustained breakout pattern; "
            "publish a creator video in next 4 weeks."
        ),
        key_judgment=(
            "'AI agents' is in a sustained-breakout phase, not a fad spike, "
            "and creator content published within the next 4 weeks is positioned "
            "for the +12w persistence window."
        ),
        likelihood="likely",
        confidence="MODERATE",
        confidence_basis=(
            "4-pull replication CV < 8%, Wikipedia and GDELT corroborate, "
            "but only 9 months of post-emergence history available"
        ),
        evidence=[
            "Trends 5-y series shows trend slope +0.42 per week with seasonal amplitude <8 (sustained-breakout fingerprint)",
            "Wikipedia 'AI_agent' pageviews up 4.2x year-over-year in matching window",
            "GDELT volume up 3.1x but does not lead Trends — corroboration without news-cycle dominance",
        ],
        alternatives=[
            AlternativeExplanation(
                name="Reverse causality",
                ruled="OUT",
                reasoning="Wikipedia leads Trends by ~2 weeks consistently",
            ),
            AlternativeExplanation(
                name="Algorithmic artifact",
                ruled="OUT",
                reasoning="Pattern replicates in US, UK, AU, CA independently",
            ),
            AlternativeExplanation(
                name="Sampling noise",
                ruled="OUT",
                reasoning="Max bucket CV across 4 pulls is 7.3%, below 10% threshold",
            ),
            AlternativeExplanation(
                name="News-cycle confound",
                ruled="PARTIAL",
                reasoning="GDELT shows elevated volume; some component is press-driven",
            ),
        ],
        so_what=(
            "Topic is structurally rising. A creator publishing now captures "
            "the +12w persistence window with high probability of viewership above baseline."
        ),
        now_what=(
            "Re-pull at 2026-05-27 (4-week checkpoint). If Trends slope > +0.3 and "
            "Wikipedia YoY > 3x, proceed with publication."
        ),
        sources_caveats=[
            "Trends pulls: 4 pulls, 2026-04-26, US/UK/AU/CA, 5-y window, weekly granularity",
            "Triangulation: Wikipedia en + de pageviews (corroborate), GDELT timelinevol (partial corroborate)",
            "Limitation: AI Mode and AI Overviews queries excluded from Trends — likely undercounts true interest",
            "Limitation: only 9 months post-emergence history; concept-drift risk for 26w persistence",
        ],
    )
    print(brief.render())
    issues = validate(brief)
    if issues:
        print("\nICD 203 COMPLIANCE ISSUES:")
        for i in issues:
            print(f"  - {i}")
    else:
        print("\n[ICD 203 compliant]")


if __name__ == "__main__":
    example()
