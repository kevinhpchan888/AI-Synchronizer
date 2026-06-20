"""
keyword_backend.py — L1 keyword-demand layer for APC SEO.

Mirrors the swappable-backend discipline of googletrends-mastery/trends_backend.py:
every keyword source (free Google autocomplete, paid SerpApi, paid DataForSEO)
can be killed or rate-limited, so consumers code against ONE interface and a
backend swap is configuration, not refactor.

Default backend is FREE and needs no API key: it hits Google's public
autocomplete (suggest) endpoint, which returns the literal phrases people type.
That gives demand-shaped phrasing and the exact question wording for FAQ blocks.
What it does NOT give is search volume or true People-Also-Ask trees — those
require a paid backend (SerpApi / DataForSEO). The code is honest about which
numbers are real demand data and which are heuristic intent scores.

Public surface (names chosen to match the apc-article-ops playbook L1 contract):
    expand_autocomplete(seed, ...)      -> list[str]
    extract_paa_related(seed, ...)      -> {"paa": [...], "related": [...]}
    cluster_and_score(phrases, ...)     -> list[KeywordCluster]
    keyword_research_full(seed, ...)    -> dict   (the one-call orchestration)

CLI:
    python keyword_backend.py "aging parent care" --geo US --hl en
    python keyword_backend.py "guardianship vs conservatorship" --json
"""

from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from abc import ABC, abstractmethod
from dataclasses import dataclass, asdict, field
from typing import Optional

# ---------------------------------------------------------------------------
# Intent vocabulary — tuned for APC caregiver decision-content.
# These are the words a tired caregiver types when they are about to DO
# something (the playbook's Action test) or spend money (commercial intent).
# ---------------------------------------------------------------------------

QUESTION_WORDS = ["how", "what", "when", "why", "where", "who", "which",
                  "can", "do", "does", "is", "are", "should", "will"]

# modifier -> (intent_label, weight). Higher weight = closer to a decision/spend.
INTENT_MODIFIERS = {
    "cost": ("commercial", 3.0), "costs": ("commercial", 3.0),
    "price": ("commercial", 3.0), "how much": ("commercial", 3.0),
    "near me": ("local", 2.5), "vs": ("comparison", 2.5),
    "versus": ("comparison", 2.5), "or": ("comparison", 1.5),
    "best": ("commercial", 2.0), "how to": ("how-to", 2.0),
    "checklist": ("how-to", 2.0), "form": ("how-to", 2.0),
    "qualify": ("how-to", 2.0), "apply": ("how-to", 2.0),
    "documents": ("how-to", 1.8), "requirements": ("how-to", 1.8),
    "without": ("how-to", 1.5), "refuses": ("how-to", 1.8),
    "won't": ("how-to", 1.8), "when to": ("how-to", 1.8),
    "signs": ("informational", 1.5), "checklist for": ("how-to", 2.0),
}

# Alphabet-soup + question seeds appended to the head term to widen the pull.
_ALPHA = list("abcdefghijklmnopqrstuvwxyz")


# ---------------------------------------------------------------------------
# Result types
# ---------------------------------------------------------------------------

@dataclass
class KeywordCluster:
    head: str                       # the cluster's anchor token/phrase
    intent: str                     # how-to | commercial | comparison | informational | local
    score: float                    # heuristic priority, NOT search volume
    phrases: list[str] = field(default_factory=list)
    questions: list[str] = field(default_factory=list)   # phrases that are FAQ-ready

    def as_dict(self) -> dict:
        return asdict(self)


# ---------------------------------------------------------------------------
# Backend interface
# ---------------------------------------------------------------------------

class KeywordBackend(ABC):
    name = "abstract"
    real_volume = False             # does this backend return true search volume?

    @abstractmethod
    def autocomplete(self, query: str, geo: str = "US", hl: str = "en") -> list[str]:
        ...

    def paa_related(self, query: str, geo: str = "US", hl: str = "en") -> dict:
        """Paid backends override. Free backend returns a flagged proxy."""
        return {"paa": [], "related": [], "_note": "no PAA source on this backend"}


# ---------------------------------------------------------------------------
# Free Google autocomplete backend (default, no key, stdlib only)
# ---------------------------------------------------------------------------

class GoogleSuggestBackend(KeywordBackend):
    name = "google-suggest"
    real_volume = False
    ENDPOINT = "https://suggestqueries.google.com/complete/search"
    UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
          "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36")

    def __init__(self, throttle: float = 0.4, timeout: float = 12.0):
        self.throttle = throttle
        self.timeout = timeout

    def _pull(self, query: str, geo: str, hl: str) -> list[str]:
        params = urllib.parse.urlencode({
            "client": "firefox",   # firefox client returns clean JSON: [q, [suggestions]]
            "q": query,
            "gl": geo.lower(),
            "hl": hl,
        })
        url = f"{self.ENDPOINT}?{params}"
        req = urllib.request.Request(url, headers={"User-Agent": self.UA})
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                raw = resp.read().decode("utf-8", errors="replace")
            data = json.loads(raw)
            return [s for s in data[1] if isinstance(s, str)]
        except Exception:
            return []

    def autocomplete(self, query: str, geo: str = "US", hl: str = "en") -> list[str]:
        """
        Alphabet-soup + question expansion: pulls the bare seed, then the seed
        with each question word in front and each letter after, deduped. This is
        the classic free keyword-discovery move; it surfaces the long tail.
        """
        seeds = [query]
        seeds += [f"{qw} {query}" for qw in QUESTION_WORDS]
        seeds += [f"{query} {a}" for a in _ALPHA]
        out: dict[str, None] = {}
        for s in seeds:
            for sug in self._pull(s, geo, hl):
                out.setdefault(sug.strip().lower(), None)
            time.sleep(self.throttle)
        return list(out)


# ---------------------------------------------------------------------------
# SerpApi backend (paid) — real PAA + Related Searches.
# Modeled on github.com/chukhraiartur/seo-keyword-research-tool.
# Volume still needs DataForSEO; SerpApi gives the question trees.
# ---------------------------------------------------------------------------

class SerpApiBackend(KeywordBackend):
    name = "serpapi"
    real_volume = False

    def __init__(self, api_key: Optional[str] = None):
        import os
        self.api_key = api_key or os.environ.get("SERPAPI_API_KEY")
        if not self.api_key:
            raise RuntimeError("SERPAPI_API_KEY not set")

    def autocomplete(self, query, geo="US", hl="en"):
        from serpapi import GoogleSearch
        data = GoogleSearch({
            "engine": "google_autocomplete", "q": query,
            "gl": geo.lower(), "hl": hl, "api_key": self.api_key,
        }).get_dict()
        return [s["value"] for s in data.get("suggestions", [])]

    def paa_related(self, query, geo="US", hl="en"):
        from serpapi import GoogleSearch
        data = GoogleSearch({
            "engine": "google", "q": query,
            "gl": geo.lower(), "hl": hl, "api_key": self.api_key,
        }).get_dict()
        paa = [q["question"] for q in data.get("related_questions", [])]
        related = [r["query"] for r in data.get("related_searches", [])]
        return {"paa": paa, "related": related}


# ---------------------------------------------------------------------------
# DataForSEO backend (paid) — the only one here with REAL search volume.
# Wire when precise volume/difficulty numbers are needed (~$ per 1k tasks).
# ---------------------------------------------------------------------------

class DataForSeoBackend(KeywordBackend):
    name = "dataforseo"
    real_volume = True

    def __init__(self, login: Optional[str] = None, password: Optional[str] = None):
        import os
        self.login = login or os.environ.get("DATAFORSEO_LOGIN")
        self.password = password or os.environ.get("DATAFORSEO_PASSWORD")
        if not (self.login and self.password):
            raise RuntimeError("DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD not set")

    def autocomplete(self, query, geo="US", hl="en"):
        raise NotImplementedError(
            "Wire to DataForSEO keywords_data/google_ads/search_volume + "
            "labs/related_keywords. Returns real volume + difficulty.")


# ---------------------------------------------------------------------------
# Scoring / clustering — heuristic, NOT volume. Documented as such.
# ---------------------------------------------------------------------------

_STOP = set("a an and the of for to in on with your you my is are how what "
            "when why do does can will should vs or near me".split())


def _intent_of(phrase: str) -> tuple[str, float]:
    p = f" {phrase.lower()} "
    best = ("informational", 1.0)
    for mod, (label, weight) in INTENT_MODIFIERS.items():
        if f" {mod} " in p or p.strip().startswith(mod + " "):
            if weight > best[1]:
                best = (label, weight)
    if any(p.strip().startswith(qw + " ") for qw in QUESTION_WORDS) and best[1] < 1.5:
        best = ("informational", 1.5)
    return best


def _head_token(phrase: str, seed: str) -> str:
    """Pick the most salient non-stopword token not already in the seed."""
    seed_tokens = set(re.findall(r"[a-z0-9']+", seed.lower()))
    toks = [t for t in re.findall(r"[a-z0-9']+", phrase.lower())
            if t not in _STOP and t not in seed_tokens and len(t) > 2]
    return toks[0] if toks else (seed.split()[0] if seed else phrase.split()[0])


def cluster_and_score(phrases: list[str], seed: str) -> list[KeywordCluster]:
    """
    Group expanded phrases by a shared salient token and score each group.
    Score blends: cluster breadth (how many distinct phrases share the head —
    a rough demand-breadth proxy) and the strongest decision/commercial intent
    in the cluster. This is a PRIORITY heuristic, not search volume.
    """
    buckets: dict[str, KeywordCluster] = {}
    for ph in phrases:
        head = _head_token(ph, seed)
        intent, w = _intent_of(ph)
        c = buckets.get(head)
        if c is None:
            c = KeywordCluster(head=head, intent=intent, score=0.0)
            buckets[head] = c
        c.phrases.append(ph)
        # keep the highest-intent label for the cluster
        if w > INTENT_MODIFIERS.get(c.intent, ("", 1.0))[1] and intent != "informational":
            c.intent = intent
        if any(ph.lower().startswith(qw + " ") for qw in QUESTION_WORDS) or ph.endswith("?"):
            c.questions.append(ph)

    clusters = list(buckets.values())
    for c in clusters:
        breadth = len(c.phrases)
        intent_w = max((_intent_of(p)[1] for p in c.phrases), default=1.0)
        # log-ish breadth so one huge bucket doesn't dominate everything
        c.score = round((breadth ** 0.5) * intent_w, 3)
        c.phrases = sorted(set(c.phrases))
        c.questions = sorted(set(c.questions))
    clusters.sort(key=lambda c: c.score, reverse=True)
    return clusters


# ---------------------------------------------------------------------------
# Orchestration
# ---------------------------------------------------------------------------

def get_backend(name: str = "google-suggest", **kw) -> KeywordBackend:
    table = {
        "google-suggest": GoogleSuggestBackend,
        "serpapi": SerpApiBackend,
        "dataforseo": DataForSeoBackend,
    }
    if name not in table:
        raise ValueError(f"Unknown backend {name!r}. Available: {list(table)}")
    return table[name](**kw)


def expand_autocomplete(seed: str, geo: str = "US", hl: str = "en",
                        backend: str = "google-suggest") -> list[str]:
    return get_backend(backend).autocomplete(seed, geo=geo, hl=hl)


def extract_paa_related(seed: str, geo: str = "US", hl: str = "en",
                        backend: str = "google-suggest") -> dict:
    return get_backend(backend).paa_related(seed, geo=geo, hl=hl)


def keyword_research_full(seed: str, geo: str = "US", hl: str = "en",
                          backend: str = "google-suggest", top: int = 12) -> dict:
    """One-call L1: expand -> (paa) -> cluster -> score. Returns a structured
    dict ready to feed brief.py and the apc-article-ops frontmatter."""
    be = get_backend(backend)
    phrases = be.autocomplete(seed, geo=geo, hl=hl)
    paa = be.paa_related(seed, geo=geo, hl=hl)
    clusters = cluster_and_score(phrases, seed)
    # FAQ-ready questions: real PAA if a paid backend supplied them, else the
    # question-shaped autocompletes as a flagged proxy.
    questions = paa.get("paa") or [p for p in phrases
                                   if any(p.startswith(qw + " ") for qw in QUESTION_WORDS)]
    return {
        "seed": seed,
        "geo": geo,
        "backend": be.name,
        "has_real_volume": be.real_volume,
        "n_phrases": len(phrases),
        "clusters": [c.as_dict() for c in clusters[:top]],
        "faq_questions": questions[:15],
        "related": paa.get("related", []),
        "caveat": ("Scores are demand-shape heuristics, not search volume. "
                   "For true volume/difficulty switch backend='dataforseo'."),
    }


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _main(argv: list[str]) -> int:
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    seed = argv[0]
    geo = "US"; hl = "en"; backend = "google-suggest"; as_json = False
    i = 1
    while i < len(argv):
        a = argv[i]
        if a == "--geo": geo = argv[i + 1]; i += 2
        elif a == "--hl": hl = argv[i + 1]; i += 2
        elif a == "--backend": backend = argv[i + 1]; i += 2
        elif a == "--json": as_json = True; i += 1
        else: i += 1
    result = keyword_research_full(seed, geo=geo, hl=hl, backend=backend)
    if as_json:
        print(json.dumps(result, indent=2))
        return 0
    print(f"\nSeed: {result['seed']}  |  backend: {result['backend']}  |  "
          f"{result['n_phrases']} phrases  |  real_volume={result['has_real_volume']}")
    print(f"  {result['caveat']}\n")
    print("Top clusters (priority heuristic):")
    for c in result["clusters"]:
        print(f"  [{c['score']:>5}] {c['intent']:<13} {c['head']:<22} "
              f"({len(c['phrases'])} phrases)  e.g. {c['phrases'][0]}")
    print("\nFAQ-ready questions:")
    for q in result["faq_questions"][:10]:
        print(f"  - {q}")
    return 0


if __name__ == "__main__":
    raise SystemExit(_main(sys.argv[1:]))
