#!/usr/bin/env python3
"""gw — guru-watch standalone CLI.

Runs a cohort scrub against Kevin's mentor vault WITHOUT touching an LLM. Pure
deterministic retrieval. Use this when you need 100% certainty the cohort was
actually consulted (no question whether Claude "decided" to use the skill).

Usage:
    gw "I'm trying to launch a $30 ebook on agingparent.care"
    gw -m hormozi "How would he frame the APC offer?"
    gw --list

Output is human-readable + machine-parseable (sections in markdown). Pipe into
Claude separately for synthesis if you want, or read directly.
"""
from __future__ import annotations

import argparse
import io
import os
import platform
import re
import sys
from pathlib import Path

# Force UTF-8 on stdout for Windows so banner chars render
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# ─── vault detection ────────────────────────────────────────────────────────

def vault_path() -> Path:
    env = os.environ.get("GURU_WATCH_VAULT")
    if env:
        p = Path(env)
        if p.exists():
            return p
    sys_name = platform.system()
    candidates: list[Path] = []
    if sys_name == "Windows":
        candidates += [Path("G:/My Drive/Obsidian/20-Guru-Watch")]
    elif sys_name == "Darwin":
        home = Path.home()
        candidates += [
            home / "guru-watch" / "vault",
            home / "Library/CloudStorage/GoogleDrive-kevinhpchan@gmail.com/My Drive/Obsidian/20-Guru-Watch",
        ]
    for c in candidates:
        if c.exists():
            return c
    print(f"ERROR: vault not found. Tried: {candidates}", file=sys.stderr)
    sys.exit(2)


# ─── helpers ────────────────────────────────────────────────────────────────

STOPWORDS = {
    "what", "would", "each", "guru", "they", "this", "that", "from", "with",
    "have", "want", "need", "into", "about", "should", "could", "their", "kevin",
    "donny", "looking", "trying", "doing", "kind", "make", "more", "than", "then",
    "when", "where", "which", "while", "shall", "going", "build", "plan", "create",
    "help", "advice", "thinking", "tell", "show", "give", "best", "good", "great",
    "really", "just", "right", "going", "want", "wants", "needed", "needs",
}

def extract_keywords(text: str, max_n: int = 20) -> list[str]:
    tokens = re.findall(r"[A-Za-z][A-Za-z0-9-]{3,}", text.lower())
    out: list[str] = []
    seen: set[str] = set()
    for t in tokens:
        if t in STOPWORDS or t in seen:
            continue
        seen.add(t)
        out.append(t)
        if len(out) >= max_n:
            break
    return out


def banner(situation: str, vault: Path, mentor_count: int, topic_count: int) -> str:
    return f"""\
═══════════════════════════════════════════════════════════════════
🔍 GURU-WATCH SCRUB
   Situation: {situation[:120]}
   Vault: {vault}
   Cohort: {mentor_count} mentor pages, {topic_count} comparison pages
═══════════════════════════════════════════════════════════════════
"""


def search_mentor(page: Path, pattern: re.Pattern, max_hits: int = 4) -> list[str]:
    try:
        text = page.read_text(encoding="utf-8")
    except Exception:
        return []
    hits: list[str] = []
    for m in pattern.finditer(text):
        start = max(0, m.start() - 160)
        end = min(len(text), m.end() + 240)
        snippet = text[start:end].replace("\n", " ").strip()
        hits.append(snippet)
        if len(hits) >= max_hits:
            break
    return hits


# ─── commands ───────────────────────────────────────────────────────────────

def cmd_list(args: argparse.Namespace) -> int:
    vault = vault_path()
    mentors_dir = vault / "wiki" / "gurus"
    comps_dir = vault / "wiki" / "comparisons"
    mentors = sorted(p.stem for p in mentors_dir.glob("*.md")) if mentors_dir.exists() else []
    comps = sorted(p.stem for p in comps_dir.glob("*.md")) if comps_dir.exists() else []
    print(banner("list cohort", vault, len(mentors), len(comps)))
    print("MENTORS:")
    for s in mentors:
        print(f"  - {s}")
    print()
    print("COMPARISON TOPICS:")
    for s in comps:
        print(f"  - {s}")
    return 0


def cmd_mentor(args: argparse.Namespace) -> int:
    vault = vault_path()
    p = vault / "wiki" / "gurus" / f"{args.slug}.md"
    if not p.exists():
        avail = sorted(x.stem for x in (vault / "wiki" / "gurus").glob("*.md"))
        print(f"ERROR: no mentor page for '{args.slug}'", file=sys.stderr)
        print(f"Available: {avail}", file=sys.stderr)
        return 2
    print(banner(f"mentor: {args.slug}", vault, 1, 0))
    print(p.read_text(encoding="utf-8"))
    return 0


def cmd_scrub(args: argparse.Namespace) -> int:
    vault = vault_path()
    situation = " ".join(args.situation).strip()
    if not situation:
        print("ERROR: no situation provided", file=sys.stderr)
        return 2

    mentors_dir = vault / "wiki" / "gurus"
    comps_dir = vault / "wiki" / "comparisons"
    raw_dir = vault / "raw"

    mentor_pages = sorted(mentors_dir.glob("*.md")) if mentors_dir.exists() else []
    comp_pages = sorted(comps_dir.glob("*.md")) if comps_dir.exists() else []

    print(banner(situation, vault, len(mentor_pages), len(comp_pages)), flush=True)

    keywords = extract_keywords(situation, max_n=20)
    if not keywords:
        print("ERROR: could not extract keywords from situation", file=sys.stderr)
        return 2
    print(f"KEYWORDS EXTRACTED: {' | '.join(keywords[:15])}")
    print()

    pattern = re.compile("|".join(re.escape(k) for k in keywords), re.IGNORECASE)

    # mentor scan
    per_mentor: dict[str, list[str]] = {}
    no_match: list[str] = []
    for page in mentor_pages:
        hits = search_mentor(page, pattern, max_hits=args.max_per_mentor)
        if hits:
            per_mentor[page.stem] = hits
        else:
            no_match.append(page.stem)

    print(f"───── COHORT READ ─────")
    print(f"Mentors with matching content: {len(per_mentor)} of {len(mentor_pages)}")
    print(f"Mentors with no matching content: {len(no_match)}")
    print()

    for slug in sorted(per_mentor):
        print(f"━━━ [[{slug}]] ━━━")
        for i, snip in enumerate(per_mentor[slug], 1):
            print(f"  ({i}) ...{snip}...")
        print()

    # comparison scan
    cohort_matches: list[tuple[str, str]] = []
    for page in comp_pages:
        try:
            text = page.read_text(encoding="utf-8")
        except Exception:
            continue
        m = pattern.search(text)
        if m:
            start = max(0, m.start() - 200)
            end = min(len(text), m.end() + 400)
            snippet = text[start:end].replace("\n", " ").strip()
            cohort_matches.append((page.stem, snippet))

    if cohort_matches:
        print("───── COMPARISON PAGES WITH SIGNAL ─────")
        for slug, snip in cohort_matches:
            print(f"━━━ comparisons/{slug} ━━━")
            print(f"  ...{snip}...")
            print()

    # raw scan (optional)
    if args.include_raw and raw_dir.exists():
        print("───── RAW TRANSCRIPT SAMPLES ─────")
        raw_hits = 0
        for guru_dir in sorted(raw_dir.iterdir()):
            if not guru_dir.is_dir():
                continue
            for src_dir in guru_dir.iterdir():
                if not src_dir.is_dir():
                    continue
                for raw_page in sorted(src_dir.glob("*.md"))[:5]:
                    try:
                        text = raw_page.read_text(encoding="utf-8", errors="ignore")
                    except Exception:
                        continue
                    m = pattern.search(text)
                    if m:
                        start = max(0, m.start() - 120)
                        end = min(len(text), m.end() + 180)
                        snip = text[start:end].replace("\n", " ").strip()
                        rel = raw_page.relative_to(vault)
                        print(f"  {rel}")
                        print(f"    ...{snip}...")
                        raw_hits += 1
                        if raw_hits >= 20:
                            break
                if raw_hits >= 20:
                    break
            if raw_hits >= 20:
                break

    print()
    print("───── PROVENANCE ─────")
    print(f"  Vault: {vault}")
    print(f"  Mentor pages scanned: {len(mentor_pages)}")
    print(f"  Comparison pages scanned: {len(comp_pages)}")
    print(f"  Matches: {len(per_mentor)} mentors + {len(cohort_matches)} topics")
    print(f"  Keywords: {keywords}")
    print("═══════════════════════════════════════════════════════════════════")
    return 0


# ─── main ───────────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        prog="gw",
        description="Guru-Watch standalone CLI - deterministic cohort scrub, no LLM involved.",
    )
    parser.add_argument("situation", nargs="*", help="What you are trying to accomplish")
    parser.add_argument("-m", "--mentor", help="Show one mentor's full page instead of scrubbing")
    parser.add_argument("--list", action="store_true", help="List all mentors and comparison topics")
    parser.add_argument("--max-per-mentor", type=int, default=4, help="Max snippets per mentor")
    parser.add_argument("--include-raw", action="store_true", help="Also scan raw transcripts (slower)")

    args = parser.parse_args()

    if args.list:
        return cmd_list(args)
    if args.mentor:
        args.slug = args.mentor
        return cmd_mentor(args)
    return cmd_scrub(args)


if __name__ == "__main__":
    sys.exit(main())
