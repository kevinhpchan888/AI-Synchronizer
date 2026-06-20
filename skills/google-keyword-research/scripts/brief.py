"""
brief.py — Turn L1 keyword data (+ optional Reddit/Trends verdicts) into an
article-opportunity brief that drops straight into apc-article-ops.

The fusion that actually moves rankings is three layers (article-playbook §0a):
    L1  google-keyword-research  -> demand + exact question phrasing  (this repo)
    L2  reddit-mcp               -> voice-of-customer hook + objections (MCP, agent)
    L3  googletrends-mastery     -> rising vs dying direction          (skill, agent)

L1 runs headless (keyword_backend.py). L2 and L3 are agent/MCP-driven, so this
script accepts their verdicts as optional inputs and assembles the brief. Run
keyword_backend.py first, pipe its --json here, add --reddit / --trend notes.

Usage:
    python keyword_backend.py "respite care for aging parents" --json > kw.json
    python brief.py kw.json \
        --reddit "verbatim: 'I haven't slept in 3 days'; n=3 across r/AgingParents" \
        --reddit-url "https://reddit.com/r/AgingParents/..." \
        --trend "rising, 5y slope positive, LOW noise (CV<10%)" \
        --category 7926
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date


def _slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def _title_candidates(seed: str, clusters: list[dict]) -> list[str]:
    """Seed the playbook's proven hook structures. The writer picks/sharpens one;
    these only guarantee the primary keyword is front-loaded (SEO test)."""
    kw = seed.strip()
    kwc = kw[:1].upper() + kw[1:]
    has_cost = any(c["intent"] == "commercial" for c in clusters)
    has_cmp = any(c["intent"] == "comparison" for c in clusters)
    out = [f"How to {kwc}: What to Do First"]
    if has_cost:
        out.append(f"What {kwc} Actually Costs in {date.today().year}")
    if has_cmp:
        out.append(f"{kwc}: The Real Difference, Plainly")
    out.append(f"{kwc}: The Checklist Families Miss")
    return out


def build_brief(kw: dict, reddit: str = "", reddit_url: str = "",
                trend: str = "", category: str = "") -> str:
    seed = kw["seed"]
    clusters = kw.get("clusters", [])
    faqs = kw.get("faq_questions", [])[:8]
    primary = seed
    secondary = [c["head"] for c in clusters[:6] if c["head"].lower() not in seed.lower()]

    g_signal = (f"backend={kw.get('backend')}; {kw.get('n_phrases')} autocompletes; "
                f"top intents={', '.join(sorted({c['intent'] for c in clusters[:6]}))}; "
                f"real_volume={kw.get('has_real_volume')}")
    r_signal = reddit or "TODO: run reddit-mcp (seed r/AgingParents, r/CaregiverSupport, r/eldercare; n=3)"
    if reddit_url:
        r_signal += f" | src: {reddit_url}"
    t_signal = trend or "TODO: run googletrends-mastery (confirm rising, not dying; >=4 pulls, CV<10%)"

    lines = []
    lines.append("---")
    lines.append(f"title: \"TODO — score 4/4 on Hook/Specificity/Action/SEO\"")
    lines.append(f"slug: {_slug(seed)}")
    lines.append(f"primary_keyword: {primary}")
    lines.append(f"secondary_keywords: [{', '.join(secondary)}]")
    if category:
        lines.append(f"category_id: {category}")
    lines.append(f"google_signal: \"{g_signal}\"")
    lines.append(f"reddit_signal: \"{r_signal}\"")
    lines.append(f"trend_signal: \"{t_signal}\"")
    lines.append(f"status: draft-brief")
    lines.append(f"generated: {date.today().isoformat()}")
    lines.append("---")
    lines.append("")
    lines.append(f"# Article brief: {seed}")
    lines.append("")
    lines.append("## Go / no-go gate (article-playbook §0a)")
    lines.append("- [ ] L1 demand present (below) — never ship L2 without L1")
    lines.append("- [ ] L2 Reddit VOC: verbatim hook + 3 objections, n=3 triangulated, URL captured")
    lines.append("- [ ] L3 Trends: topic rising or evergreen, NOT dying (a dying topic is a skip)")
    lines.append("- [ ] Dedup: no live article shares primary keyword or >3 consecutive title words")
    lines.append("")
    lines.append("## Title candidates (sharpen, don't ship as-is)")
    for t in _title_candidates(seed, clusters):
        lines.append(f"- {t}")
    lines.append("")
    lines.append("## Primary + secondary keywords")
    lines.append(f"- **Primary (front-load in title + H1 + meta):** {primary}")
    for s in secondary:
        lines.append(f"- secondary: {s}")
    lines.append("")
    lines.append("## FAQ block (use verbatim question wording — these are real searches)")
    for q in faqs:
        lines.append(f"- {q}")
    lines.append("")
    lines.append("## Intent map (what the body must deliver)")
    for c in clusters[:8]:
        ex = c["phrases"][0] if c.get("phrases") else ""
        lines.append(f"- **{c['intent']}** · `{c['head']}` (priority {c['score']}) — e.g. \"{ex}\"")
    lines.append("")
    lines.append("## Signals")
    lines.append(f"- google_signal: {g_signal}")
    lines.append(f"- reddit_signal: {r_signal}")
    lines.append(f"- trend_signal: {t_signal}")
    lines.append("")
    lines.append("> Caveat: " + kw.get("caveat", ""))
    return "\n".join(lines)


def _main(argv: list[str]) -> int:
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    reddit = reddit_url = trend = category = ""
    path = argv[0]
    i = 1
    while i < len(argv):
        a = argv[i]
        if a == "--reddit": reddit = argv[i + 1]; i += 2
        elif a == "--reddit-url": reddit_url = argv[i + 1]; i += 2
        elif a == "--trend": trend = argv[i + 1]; i += 2
        elif a == "--category": category = argv[i + 1]; i += 2
        else: i += 1
    with open(path) as f:
        kw = json.load(f)
    print(build_brief(kw, reddit=reddit, reddit_url=reddit_url,
                      trend=trend, category=category))
    return 0


if __name__ == "__main__":
    raise SystemExit(_main(sys.argv[1:]))
