# APC COVERAGE & NOVELTY SYSTEM — the anti-duplication / topical-range engine (HARD RULE)

The problem this solves, permanently: we keep publishing the same underlying article under new
titles (Medicare costs again, burnout again, "caregiving is expensive" again), and we keep
orbiting the same few themes instead of expanding into relevant territory the brand has never
touched (e.g. exercise and mobility for aging parents). Lexical dedup (title words, keyword
collisions) does NOT catch this, because the *concept* repeats even when the words differ.

This system is a HARD GATE in the daily routine (Phase D). Research, SEO, and the design template
do NOT change — this sits in front of selection and decides what is allowed to be written.

It has three parts: the **Coverage Universe** (a map far broader than the 7 Selldone themes), the
**Concept Ledger** (memory of what we've actually said), and the **Novelty & Range Gate** (the
rules every run must pass).

---

## 1. The Coverage Universe (the map we expand against)

Every article occupies one CELL = one **Domain** × one **Care Stage**. The 7 Selldone themes are
only publishing categories; the Domain axis is wider on purpose, so the system is forced outward.

**Domains (11)** — with the Selldone category each publishes under:
1. **Money & Benefits** → Financial 7921
2. **Legal & Documents** → Legal 7922
3. **Medical & Conditions** → Medical 7924
4. **Physical Wellness & Mobility** (exercise, strength, balance, nutrition, sleep, pain, vision/hearing) → Medical 7924
5. **Daily Living & ADLs** (bathing, dressing, meds routine, continence, eating, hygiene) → Getting Started 7927
6. **Housing & Environment** (where they live, home mods, facility types, moving) → Housing 7923
7. **Safety & Risk** (driving, fraud, wandering, home hazards, emergency prep) → Getting Started 7927 / Legal 7922
8. **Social & Purpose** (isolation, friendship, hobbies, intimacy, meaning, faith) → Emotional Health 7926 / Family 7925
9. **Technology & Tools** (telehealth, monitoring, apps, devices, AI in care) → Medical 7924 / Getting Started 7927
10. **The Caregiver's Own Life** (caregiver health, burnout, career/FMLA, marriage, money, identity) → Emotional Health 7926 / Family 7925
11. **End of Life & After** (hospice, palliative, grief, estate, funeral, the after) → Medical 7924 / Emotional Health 7926

**Care Stages (6):** Early signs / pre-need · Crisis · New normal · The long middle · Hard decisions / decline · After.

11 domains × 6 stages = 66 cells. A filled cell is covered; an empty or thin cell is **frontier**
and is the highest-value place to write. "Exercise for aging parents" = Physical Wellness & Mobility
× New normal — currently empty, therefore high priority. That is how range gets enforced
structurally instead of by taste.

---

## 2. The Concept Ledger (`coverage-ledger.json`) — memory of what we've said

Rebuilt FROM LIVE every run (same self-healing rule as the inventory; live store wins). One record
per live/published article:
```
{ "id", "title", "domain", "stage", "category_id",
  "core_problem": "one plain sentence, reader-side",
  "central_data_point": "the ONE stat/claim the piece is built on (or 'none')",
  "key_entities": ["Medicare","premiums", ...],
  "angle": "the one-sentence unique take" }
```
The ledger also stores a **coverage summary**: article count per domain, per cell, and the ranked
list of least-covered domains (the current frontier). The routine prints this each run.

---

## 3. The Novelty & Range Gate (HARD RULE — every run, no exceptions)

Runs in Phase D, replacing the old lexical-only dedup. A candidate must pass BOTH gates.

### Gate A — Novelty (kills concept-level duplicates)
KILL a candidate if ALL of these are true against any ledger record:
- same **cell** (domain + stage), AND
- overlapping **core_problem** (same reader problem), AND
- same **central_data_point** OR the same dominant **key_entities** with no genuinely new angle.

A candidate survives only if it brings a **new cell**, a **new problem within a cell**, or a
**materially new angle/data point**. "Different title, same issue/data point" = KILL.

### Gate B — Range / Frontier (forces expansion outward)
The final 5 each run MUST satisfy:
- **≥4 distinct Domains** across the 5 (never 3 Money pieces wearing different titles).
- **≥2 from frontier domains** = the 5 least-covered domains in the ledger this run.
- **≤1 per Domain**, unless the second is a clearly distinct, empty cell (justify in GAP_ANALYSIS).
- At least one **"reach" pick** from a Domain the brand has 0–1 articles in (deliberate boundary-push).

### Gate C — Saturated-data-point ban (kills the "same data point five times" problem)
A candidate may NOT use a saturated data point as its **central** spine (it may cite it in passing).
Seed ban list (extend as the ledger grows):
- Medicare premium / Part B cost increases
- the $X,XXX monthly nursing-home / assisted-living cost figure
- "78% of caregivers report burnout" (and sibling burnout %s)
- "$1 trillion / invisible labor" unpaid-care valuation
- "caregiving is expensive / financial strain" as the whole thesis
If the figure IS the literal, never-covered news, it can pass with explicit justification in
GAP_ANALYSIS.

### Output (added to GAP_ANALYSIS.md every run)
- Coverage snapshot: articles per Domain + the 5 frontier domains this run.
- For each candidate: cell, novelty verdict (NEW-CELL / NEW-PROBLEM / NEW-ANGLE / DUPLICATE-KILL), and the ledger id it was checked against.
- Final 5: domains represented (must be ≥4), frontier picks (must be ≥2), reach pick (≥1), saturated-data-point check (pass).

STOP CHECK before writing: ≥4 domains, ≥2 frontier, ≥1 reach, 0 concept-duplicates, 0 saturated central data points. If it fails, re-select — do not write.

---

## 4. How "exercise for aging parents" now gets in
Phase B rebuilds the ledger → the coverage summary shows Physical Wellness & Mobility at ~0. Gate B
flags it as a frontier domain → Phase C is REQUIRED to surface candidates there (exercise/strength/
balance/nutrition/sleep) → they pass Novelty (new cell) and outrank a 6th Money piece on Gap value.
The same mechanism keeps pulling us into Daily Living, Social & Purpose, and Technology over time.

## 5. Maintenance
- The routine rebuilds `coverage-ledger.json` from live each run and appends new saturated data
  points it observes.
- This file is the HARD RULE. The daily routine (Phase D) and any manual article work must pass the
  Novelty & Range Gate. Referenced as non-negotiable in `CLAUDE.md`, the playbook, and `PIPELINE.md`.
