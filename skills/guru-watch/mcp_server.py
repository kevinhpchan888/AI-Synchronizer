"""guru-watch MCP server.

Exposes Kevin's mentor knowledge base as MCP tools so it's callable from
any Claude surface that speaks MCP (Claude Desktop, claude.ai web via
Desktop connector, Claude Code, custom integrations).

Vault location is auto-detected:
- Windows: G:\\My Drive\\Obsidian\\20-Guru-Watch
- macOS: ~/Library/CloudStorage/GoogleDrive-kevinhpchan@gmail.com/My Drive/Obsidian/20-Guru-Watch
- macOS project symlink: ~/guru-watch/vault (preferred when present)

Run standalone for testing:
    python mcp_server.py

Registered in Claude Desktop config at:
    %APPDATA%\\Claude\\claude_desktop_config.json (Windows)
    ~/Library/Application Support/Claude/claude_desktop_config.json (Mac)
"""
from __future__ import annotations

import os
import platform
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import FastMCP

# ---------------------------------------------------------------- vault path

def _vault_path() -> Path:
    env = os.environ.get("GURU_WATCH_VAULT")
    if env:
        p = Path(env)
        if p.exists():
            return p
    sys = platform.system()
    candidates: list[Path] = []
    if sys == "Windows":
        candidates += [
            Path("G:/My Drive/Obsidian/20-Guru-Watch"),
            Path("H:/My Drive/Obsidian/20-Guru-Watch"),
        ]
    elif sys == "Darwin":
        home = Path.home()
        candidates += [
            home / "guru-watch" / "vault",
            home / "Library/CloudStorage/GoogleDrive-kevinhpchan@gmail.com/My Drive/Obsidian/20-Guru-Watch",
        ]
    for c in candidates:
        if c.exists():
            return c
    # last resort
    return candidates[0] if candidates else Path.cwd()


VAULT = _vault_path()
GURUS_DIR = VAULT / "wiki" / "gurus"
COMP_DIR = VAULT / "wiki" / "comparisons"
RAW_DIR = VAULT / "raw"

# ---------------------------------------------------------------- helpers

def _read_file(p: Path, max_chars: int = 50000) -> str:
    try:
        text = p.read_text(encoding="utf-8")
        if len(text) > max_chars:
            return text[:max_chars] + f"\n\n[truncated at {max_chars} chars; full file is {len(text)} chars]"
        return text
    except Exception as e:
        return f"[error reading {p}: {e}]"


def _list_md(d: Path) -> list[str]:
    if not d.exists():
        return []
    return sorted(f.stem for f in d.glob("*.md"))


def _slug_to_raw_folder(slug: str) -> str:
    """wiki slug uses hyphens; raw folder uses underscores."""
    return slug.replace("-", "_")


def _extract_frontmatter(text: str) -> dict[str, str]:
    """Very lightweight YAML-ish frontmatter extraction (just for surfacing risk_flags)."""
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    fm = text[3:end].strip()
    out: dict[str, str] = {}
    for line in fm.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            out[k.strip()] = v.strip()
    return out


# ---------------------------------------------------------------- mcp server

mcp = FastMCP("guru-watch")


@mcp.tool()
def vault_info() -> dict[str, Any]:
    """Return where the guru-watch vault is located and basic counts."""
    return {
        "vault_path": str(VAULT),
        "vault_exists": VAULT.exists(),
        "platform": platform.system(),
        "guru_pages": len(_list_md(GURUS_DIR)),
        "comparison_pages": len(_list_md(COMP_DIR)),
        "raw_mentor_folders": len([d for d in RAW_DIR.iterdir() if d.is_dir()]) if RAW_DIR.exists() else 0,
    }


@mcp.tool()
def list_mentors() -> list[dict[str, str]]:
    """List all mentors in the cohort with their slug, title, and frontmatter summary.

    Returns one entry per wiki/gurus/*.md page. Each entry has:
      - slug: filename without .md (use this with get_mentor)
      - title: from frontmatter
      - cohort: dropshipping / ad_craft_strategy / digital_products (inferred from notes)
      - risk_flags: from frontmatter if present
      - meta_ads_relevance: from frontmatter if present
    """
    out: list[dict[str, str]] = []
    for slug in _list_md(GURUS_DIR):
        p = GURUS_DIR / f"{slug}.md"
        text = _read_file(p, max_chars=2000)
        fm = _extract_frontmatter(text)
        out.append({
            "slug": slug,
            "title": fm.get("title", slug.replace("-", " ").title()),
            "risk_flags": fm.get("risk_flags", ""),
            "meta_ads_relevance": fm.get("meta_ads_relevance", ""),
            "last_synth": fm.get("last_synth", ""),
            "page_path": str(p),
        })
    return out


@mcp.tool()
def get_mentor(slug: str) -> str:
    """Return the full synthesis page for one mentor.

    Args:
        slug: wiki slug (e.g. "alex-hormozi", "spencer-pawliw", "dara-denney").
              Use list_mentors() to see available slugs.
    """
    p = GURUS_DIR / f"{slug}.md"
    if not p.exists():
        avail = ", ".join(_list_md(GURUS_DIR))
        return f"[no mentor page for slug '{slug}']\nAvailable: {avail}"
    return _read_file(p)


@mcp.tool()
def list_topics() -> list[dict[str, str]]:
    """List available cross-mentor comparison topics (one synthesis page per topic)."""
    out: list[dict[str, str]] = []
    for slug in _list_md(COMP_DIR):
        p = COMP_DIR / f"{slug}.md"
        fm = _extract_frontmatter(_read_file(p, max_chars=2000))
        out.append({
            "slug": slug,
            "title": fm.get("title", slug.replace("-", " ").title()),
            "last_synth": fm.get("last_synth", ""),
            "page_path": str(p),
        })
    return out


@mcp.tool()
def get_comparison(topic: str) -> str:
    """Return the full cross-mentor comparison page for one topic.

    Args:
        topic: comparison topic slug. Currently available:
               meta-ads-testing, product-research, creative-strategy, scaling,
               store-design, one-product-vs-general, supplier-fulfillment.
               Use list_topics() for the current list.
    """
    p = COMP_DIR / f"{topic}.md"
    if not p.exists():
        avail = ", ".join(_list_md(COMP_DIR))
        return f"[no comparison page for topic '{topic}']\nAvailable: {avail}"
    return _read_file(p)


@mcp.tool()
def search_vault(query: str, scope: str = "all", limit: int = 20) -> list[dict[str, str]]:
    """Full-text search across the vault. Returns matches with file path and snippet.

    Args:
        query: search terms. Treated case-insensitive. Supports simple word-boundary regex.
        scope: 'wiki' (synthesis pages only), 'raw' (transcripts only), or 'all'.
        limit: max number of matches to return.

    Each result is {slug, file_type ('mentor'|'comparison'|'raw'), guru_id, path, snippet}.
    """
    if not VAULT.exists():
        return [{"error": f"vault not found at {VAULT}"}]
    pattern = re.compile(query, re.IGNORECASE)
    results: list[dict[str, str]] = []

    def scan_file(p: Path, file_type: str, guru_id: str = "") -> None:
        try:
            text = p.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            return
        m = pattern.search(text)
        if not m:
            return
        start = max(0, m.start() - 120)
        end = min(len(text), m.end() + 180)
        snippet = text[start:end].replace("\n", " ")
        results.append({
            "file_type": file_type,
            "guru_id": guru_id,
            "path": str(p.relative_to(VAULT)),
            "snippet": ("..." if start > 0 else "") + snippet + ("..." if end < len(text) else ""),
        })

    if scope in ("wiki", "all"):
        for p in GURUS_DIR.glob("*.md"):
            scan_file(p, "mentor", p.stem)
            if len(results) >= limit:
                return results
        for p in COMP_DIR.glob("*.md"):
            scan_file(p, "comparison", p.stem)
            if len(results) >= limit:
                return results

    if scope in ("raw", "all") and RAW_DIR.exists():
        for guru_dir in sorted(RAW_DIR.iterdir()):
            if not guru_dir.is_dir():
                continue
            for src_dir in sorted(guru_dir.iterdir()):
                if not src_dir.is_dir():
                    continue
                for p in sorted(src_dir.glob("*.md")):
                    scan_file(p, "raw", guru_dir.name)
                    if len(results) >= limit:
                        return results
    return results


@mcp.tool()
def situation_brief(situation: str, max_per_mentor: int = 3) -> dict[str, Any]:
    """Given a situation description, return what each mentor's content says about it.

    THIS IS THE KEY TOOL FOR TACTICS-AND-STRATEGY questions. Use this when Kevin
    asks "I'm trying to do X, what would each guru do?" or "I need to launch
    Y, what does my cohort suggest?".

    The tool extracts keywords from the situation, searches each mentor's
    synthesis page for relevant content, and returns a structured brief with
    top matches per mentor. Claude synthesizes the final answer from this data.

    Args:
        situation: free-form description of what Kevin is trying to do.
                   e.g. "launch a $30 ebook on the APC store as a lead magnet"
        max_per_mentor: max number of matching snippets to return per mentor.

    Returns:
        dict with:
          - situation: the input
          - keywords_extracted: list of keywords used to search
          - per_mentor: dict of slug -> [list of snippets from that mentor's page]
          - mentors_without_matches: mentors whose pages didn't match
          - recommendation: which cohort(s) and skills to consult next
    """
    # very simple keyword extraction: tokens >= 4 chars, alpha
    tokens = re.findall(r"[A-Za-z][A-Za-z0-9-]{3,}", situation.lower())
    stopwords = {
        "what", "would", "each", "guru", "they", "this", "that", "from", "with",
        "have", "want", "need", "into", "about", "should", "could", "their",
        "kevin", "donny", "looking", "trying", "doing", "kind", "make", "more",
        "than", "then", "when", "where", "which", "while", "shall", "going",
    }
    keywords = [t for t in tokens if t not in stopwords]
    # dedupe preserving order
    seen: set[str] = set()
    keywords = [t for t in keywords if not (t in seen or seen.add(t))]
    pattern = re.compile("|".join(re.escape(k) for k in keywords[:20]) if keywords else r"$^", re.IGNORECASE)

    per_mentor: dict[str, list[str]] = {}
    no_match: list[str] = []
    for slug in _list_md(GURUS_DIR):
        p = GURUS_DIR / f"{slug}.md"
        try:
            text = p.read_text(encoding="utf-8")
        except Exception:
            continue
        matches: list[str] = []
        for m in pattern.finditer(text):
            start = max(0, m.start() - 150)
            end = min(len(text), m.end() + 220)
            snippet = text[start:end].replace("\n", " ").strip()
            matches.append(snippet)
            if len(matches) >= max_per_mentor:
                break
        if matches:
            per_mentor[slug] = matches
        else:
            no_match.append(slug)

    # also include any matching comparison page
    comp_matches: dict[str, str] = {}
    for slug in _list_md(COMP_DIR):
        p = COMP_DIR / f"{slug}.md"
        try:
            text = p.read_text(encoding="utf-8")
        except Exception:
            continue
        m = pattern.search(text)
        if m:
            start = max(0, m.start() - 200)
            end = min(len(text), m.end() + 300)
            comp_matches[slug] = text[start:end].replace("\n", " ").strip()

    cohort_hint = "Mention `dropship-*` skills for ecom and `ebook-*` skills for digital products. For ad scripts pair with `storytelling-ads`."
    return {
        "situation": situation,
        "keywords_extracted": keywords[:20],
        "per_mentor": per_mentor,
        "mentors_without_matches": no_match,
        "matching_comparison_pages": comp_matches,
        "synthesis_instructions": (
            "Use this data to answer Kevin in his cohort-honest style: surface what "
            "EACH mentor would do (cite by slug), note contradictions explicitly, "
            "flag any operator-claimed revenue numbers as unverified, weight "
            "Meta-ads relevance for the dropship vertical and digital-product "
            "fit for the APC vertical. No em-dashes. Cite raw transcript paths "
            "via get_mentor() if you need deeper proof for a specific claim."
        ),
        "cohort_hint": cohort_hint,
    }


# ---------------------------------------------------------------- main

if __name__ == "__main__":
    mcp.run()
