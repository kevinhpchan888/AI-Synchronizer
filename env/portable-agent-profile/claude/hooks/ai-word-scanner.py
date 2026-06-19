"""
PostToolUse hook: scans files written/edited by Claude for AI blacklist words.
Reads JSON from stdin (tool_input/tool_response), checks file content,
outputs JSON with additionalContext if violations found.
"""
import sys
import json
import re
import os

def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    # Extract file path from tool input or response
    fp = (data.get("tool_input", {}).get("file_path")
          or data.get("tool_response", {}).get("filePath", ""))
    if not fp:
        sys.exit(0)

    # Only scan text files that likely contain prose
    ext = os.path.splitext(fp)[1].lower()
    prose_exts = {
        ".py", ".md", ".txt", ".html", ".htm", ".json",
        ".yaml", ".yml", ".tsx", ".ts", ".js", ".jsx",
        ".vue", ".svelte", ".astro",
    }
    if ext not in prose_exts:
        sys.exit(0)

    # Skip files that DEFINE the blacklist rules (self, CLAUDE.md, skill files)
    basename_lower = os.path.basename(fp).lower()
    skip_files = {"ai-word-scanner.py", "claude.md", "skill.md"}
    if basename_lower in skip_files:
        sys.exit(0)
    # Skip anything inside .claude/hooks/ or .claude/skills/
    fp_normalized = fp.replace("\\", "/").lower()
    if "/.claude/hooks/" in fp_normalized or "/.claude/skills/" in fp_normalized:
        sys.exit(0)

    try:
        with open(fp, encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception:
        sys.exit(0)

    # AI vocabulary blacklist patterns
    blacklist = [
        (r"\bjourney\b", "journey"),
        (r"\bnavigate[ds]?\b", "navigate"),
        (r"\bnavigating\b", "navigating"),
        (r"\btapestry\b", "tapestry"),
        (r"\bdelve[ds]?\b", "delve"),
        (r"\bcrucible\b", "crucible"),
        (r"\bresonated?\b", "resonate"),
        (r"\bmeaningful\b", "meaningful"),
        (r"\bholistic\b", "holistic"),
        (r"\bempowere?(?:s|d|ing)?\b", "empower"),
        (r"\btransformative\b", "transformative"),
        (r"\buncharted\b", "uncharted"),
        (r"\bembark\b", "embark"),
        (r"\bseamless(?:ly)?\b", "seamless"),
        (r"\bcurated?\b", "curated"),
        (r"\binvaluable\b", "invaluable"),
        (r"\bheartfelt\b", "heartfelt"),
        (r"\bimpactful\b", "impactful"),
        (r"\bprofound(?:ly)?\b", "profound"),
        (r"\bgame.changer\b", "game-changer"),
        (r"\bdeep dive\b", "deep dive"),
        (r"\bsymphony of\b", "symphony of"),
        (r"\bdance of\b", "dance of"),
        (r"\bechoed through\b", "echoed through"),
        (r"\bwhispered promises\b", "whispered promises"),
        (r"\bsomething shifted\b", "something shifted"),
        (r"\bthere was something about\b", "there was something about"),
        (r"\bit was as if\b", "it was as if"),
        (r"\bbroken hymn\b", "broken hymn"),
        (r"\bluminous\b", "luminous"),
        (r"\bgossamer\b", "gossamer"),
        (r"\bhaunted\b", "haunted"),  # in emotional/metaphorical context
    ]

    lines = content.split("\n")
    found = []

    # Patterns that indicate a line is DEFINING the blacklist rule itself
    # (e.g., "Never use: journey, navigate, tapestry...")
    rule_def_patterns = [
        r"never use",
        r"blacklist",
        r"ai.?word",
        r"ai.?pattern",
        r"no ai",
        r"banned word",
        r"flagged word",
        r"vocabulary.?blacklist",
        r"do not use",
        r"must not use",
        r"avoid.?these",
        r"forbidden.?word",
        r"MANDATORY WRITING RULES",
    ]

    def is_rule_definition(line_text):
        """Check if a line is defining the rule itself, not violating it."""
        low = line_text.lower()
        for rp in rule_def_patterns:
            if re.search(rp, low, re.IGNORECASE):
                return True
        return False

    for pattern, label in blacklist:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            line_num = content[:m.start()].count("\n") + 1
            line = lines[line_num - 1].strip()

            # Skip lines that are defining the blacklist rule itself
            if is_rule_definition(line):
                continue

            # For .md files: skip lines that are enumerating banned words
            # (lines starting with "1." or "-" that list words as a rule)
            if ext == ".md":
                # Skip numbered rule lines like "1. **No AI words.** Never use:"
                if re.match(r"^\d+\.\s+\*\*No\b", line):
                    continue
                # Skip lines in a MANDATORY WRITING RULES section
                # Check if we're within 10 lines of a "MANDATORY" header
                start_line = max(0, line_num - 10)
                context_block = "\n".join(lines[start_line:line_num])
                if "MANDATORY WRITING RULES" in context_block:
                    continue

            # Only flag if inside a string literal or comment (contains quotes or #)
            if '"' in line or "'" in line or line.lstrip().startswith("#"):
                found.append((line_num, label, m.group()))

    if not found:
        sys.exit(0)

    # Deduplicate by line number + word
    seen = set()
    unique = []
    for ln, label, word in found:
        key = (ln, label)
        if key not in seen:
            seen.add(key)
            unique.append(f"  Line {ln}: \"{word}\"")

    basename = os.path.basename(fp)
    msg = (
        f"AI BLACKLIST VIOLATION in {basename}:\n"
        + "\n".join(unique[:15])
        + "\n\nYou MUST replace each flagged word with plain, specific language. "
        "Do NOT move on until every violation is fixed. "
        "Refer to the human-prose skill blacklist for replacements."
    )

    result = {
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": msg,
        }
    }
    print(json.dumps(result))


if __name__ == "__main__":
    main()
