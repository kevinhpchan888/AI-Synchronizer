# APC ARTICLE RULES — the single source of truth (HARD, EXECUTABLE)

This is the ONE place the rules live. Everything else (playbook, daily-routine, CLAUDE.md)
points here. If a rule is not here, it is not a rule. Every article — new, edited, or
back-scrubbed — must PASS `scripts/validate_article.py` before it ships. No exceptions,
no eyeballing, no "this one's fine."

Run: `python scripts/validate_article.py <body.html> --title "..." --page-title "..." --description "..." --category <id>`
Exit 0 = compliant. Exit non-zero = does not ship. The validator is the rule; this doc explains it.

---

## 0. Selldone reality (why the template is adapted, not copied)
The Claude Design template (`blog/article.html` + `css/apc.css`) targets a custom-coded site.
The live blog is **Selldone**, which renders only the article **body** field and does NOT load
`apc.css`. Therefore:
- We reproduce the design in **self-contained body HTML with inline styles** using the brand
  hex values below. We do NOT rely on external classes (they would be unstyled).
- The page shell — nav, footer, narrow reading column, "On this page" TOC, Starter-Kit rail,
  related grid, newsletter — is **Selldone's blog theme** and is out of scope for the body.
- Brand palette (use these exact values; never invent colors):
  `ink #26332e` · `body-ink #2c343b` · `muted #66746d` · `slate #3F6476` ·
  `slate-dark #2D4655` · `gold #C49A3C` · `gold-soft #EAD9AE` · `cream #F7F4EE` ·
  `stone #ECE7DE` · `line #dfe6df`. Headlines feel serif (Georgia/Source Serif fallback); body default sans.

---

## 1. VOICE — written by a person, for a person (HARD, NEW)
Every APC article reads as if **one sibling who did the homework is talking to another** — warm,
plain, human, and unmistakably written by a person. Heart connection is a requirement, not a
garnish. Dryness is a defect.
- **Talk to one human.** Direct address ("your mom," "your dad," "your family"), contractions,
  short and varied sentences. Plain words over clinical ones (say "the bill," not "the financial obligation").
- **Open with a human beat, then the data.** The first lines land on the real situation a family
  is in before any statistic. Warmth first, facts immediately after — never one without the other.
- **Carry the reader.** Each section should feel like guidance from someone who has sat in the
  same kitchen, not a policy brief. Name the hard thing honestly; offer the next step gently.
- **Accuracy is non-negotiable alongside warmth.** Every number, law, and claim stays exactly as
  rigorous and cited as before. Heart raises the delivery; it never softens or fudges a fact.
- **Coexists with the no-projection rule (§4).** Speak to the *shared* experience ("this is one of
  the hardest stretches most families hit"), never tell the individual what THEY feel ("you're
  terrified"). Warmth about the collective and the situation: yes. Narrating the reader's emotions: no.
- Test (human, applied every article): read the first paragraph aloud. If it sounds like a brochure
  or a wiki, rewrite it until it sounds like a person who cares and knows.
- **NEVER academic, textbook, or corporate (HARD).** Banned constructions: "A study found that…",
  "research points to…", "the findings confirmed…", "the data suggest…", naked study/journal names
  or identifiers dropped into a sentence ("a 2026 study in the Journal of X", "PMC 4449135 found").
  When a fact comes from research, say it as a person would ("Doctors who study this keep finding the
  same thing:" or just state the fact) and let the superscript marker carry the citation. The proof
  lives in Sources, not in robotic in-line attributions.
- **Specifics over hedges.** Real example, real number, plain claim. No "it is worth noting,"
  "it is important to," "studies show," or sourceless "experts say."
- **The humaneness pass is mandatory, every article, every time:** run it through writing-well
  (clarity) → human-prose (kill AI tells) → human-pro (conversational warmth). An article that reads
  like an explainer has not passed, even if every other gate is green.

---

## 1b. STORYTELLING IS PARAMOUNT (HARD — the soul of every article)
This matters more than any other stylistic rule. An APC article is **human storytelling first** and an
information resource second. It must never read like a clinical write-up, an academic journal, a white
paper, or anything a business would publish. If it sounds like WebMD, a policy brief, or a textbook, it
has failed, no matter how accurate or well-structured it is.
- **Every article carries a real human story, woven through.** Open on a specific person in a specific
  moment (the cold coffee, the third pharmacy hold, the text that went unanswered), let that person
  thread through the piece, and close the loop with them at the end. The facts live *inside* the story,
  not in a separate clinical section beside it.
- **First names only, ever. No last names.** The people are specific and relatable, not case studies.
- **No fiction/non-fiction label, and none needed.** This is not a documentary and not a courtroom. We
  do not declare it, footnote it, or hedge it. We just tell it like a person who has lived it.
- **Authentic, relevant, relatable.** Specific lived detail over generic sentiment (the sympathy card
  still on the fridge from 2019, the twelve jars of mustard). The aging parent is a person with agency
  and the occasional last word, never a prop or a patient-object. No saviorism (the heroic child saving
  the helpless parent). No greeting-card lines, no "treasure every moment," no moralizing.
- **Warm, frank, never bleak.** Knowing, tired humor is welcome where it fits. The reader is already
  exhausted; meet them like a sibling at the kitchen table, not a clinician across a desk.
- **The hard line that keeps storytelling honest:** the *story* is human narrative (first-name people,
  lived scenes); the *facts, numbers, laws, and citations* inside it are real and verified (§4b). Never
  attach a statistic or a study to a named character as if they were a documented data point, and never
  invent a fact to make a scene land. Warmth in the telling, truth in the substance. Both, always.
- Test (applied every article): if you stripped the callouts and read just the prose aloud, would it
  feel like a story a real person is telling you, or like an explainer? If it's an explainer, it is not
  done.

---

## 2. SELECTION — Novelty & Range Gate (HARD)
Full spec: `references/coverage-and-novelty-system.md`. Before writing, the pick MUST pass:
no concept-duplicate (same Domain×Stage + same problem/data point = KILL); ≥4 distinct domains
across the run; ≥2 frontier-domain picks; ≥1 reach pick; no saturated data point (Medicare hikes,
$X facility cost, 78% burnout, $1T invisible labor, "caregiving is expensive") as the spine.

---

## 3. TITLE + FIRST PARAGRAPH (HARD)
- **Title scores 4/4** on the scorecard (Hook · Specificity · Action · SEO) — `article-playbook.md` §0.
  Banned openers: "[Stat]% report [emotion]", "$N in [thing]" as headline noun, "The [abstract] of
  [situation]", "Nobody told you."
- **First paragraph = the second hook AND the voice's first proof:** S1 names the exact situation,
  S2 the cost of doing nothing, S3 the specific payoff — delivered in the sibling voice (§1). No
  opening statistic unless the stat IS the problem.

## 4. WRITING RULES (HARD — mechanically gated)
- **No em dash or en dash, anywhere it ships** (body, headings, alt text, page_title, description).
  Use commas, periods, colons, semicolons. (validator: hard fail)
- **No markdown-escape leaks** (`\$`, `\%`, etc. rendering literally). (validator: hard fail)
- **Banned vocabulary** (CLAUDE.md rule 1 + `article-playbook.md` l.97): journey, navigate (metaphor),
  meaningful, transformative, seamless, curated, impactful, profound, delve, tapestry, etc. (validator: warn;
  fix unless inside a verbatim external citation title/URL)
- **No projecting feelings onto the individual reader** (§1 coexistence clause).
- **No AI patterns**: "not X, but Y" pseudo-profundity, compulsive triplets (max 2/article),
  adjective stacking, "and yet," "something shifted."

## 4b. CITATION TRUTH (HARD — the cardinal rule, partially gated)
A fabricated, misattributed, or dead citation is the single worst defect an APC article can ship.
It destroys the one thing a caregiving brand sells: trust. This happened (2026-06-19: articles cited
real-looking PMC/DOI numbers attached to unrelated papers, with invented findings and source links
that pointed only to homepages). It must never happen again.
- **Every citation must be real, must resolve, and must actually support the exact claim it backs.**
  Before an article ships, every source is opened and read by whoever writes it. If you did not open
  it, you may not cite it. No exceptions, no "this looks right."
- **The link goes to the document, not the homepage.** `pmc.ncbi.nlm.nih.gov` or `caregiver.org`
  alone is not a citation. Link the actual article/page (deep URL that loads the cited content).
  (validator: homepage-only Sources link = HARD fail.)
- **No invented identifiers.** A PMC ID, DOI, journal name, year, author, or title that you cannot
  verify against the live source is forbidden. When unsure, do not manufacture precision.
- **Match the claim to what the source says.** If the real source does not support the sentence,
  change the sentence to what the source does support, find a source that genuinely supports it, or
  cut the claim. Never the reverse (never bend a real source to a sentence you wanted to write).
- **No machine-style identifiers in the prose.** "PMC 4449135 found…" / "DOI: 10.x…" in the body is
  a HARD fail (validator) and a §1 voice violation. The number + link live only in Sources; the
  prose reads like a person and carries a superscript marker.
- **Prefer durable, authoritative sources:** peer-reviewed (with a resolving DOI/PMC deep link),
  `.gov` (CMS, NIH/NIA, CDC, SSA, VA), and established nonprofits (AARP, Alzheimer's Association,
  Family Caregiver Alliance) linked to the specific page. Avoid citing anything you cannot open today.
- Mechanically gated: bare `PMC ####` / `DOI:` in prose, and homepage-only Sources links, are HARD
  fails. Truth and claim-match are a **process gate** the writer performs (open every source) — the
  validator cannot read the paper for you.

## 5. SPARK ARC (MANDATORY) — `article-playbook.md` l.23-30
Solution (lead promise) · Problem (concrete cost) · **Action = real do-this-now steps** · Results
(cited proof/example) · Key Takeaway (one line + single next step). SPARK governs shape; voice (§1)
governs how it sounds.

---

## 6. STRUCTURE + LAYOUT (HARD — the part that regressed) — validator-enforced
Body HTML, in this exact order. Each callout is inline-styled (see §0 palette); copy the canonical
snippets from `references/selldone-article-template.html`.

1. **Starting illustration** — `<img>` first element (cover; signed; CDN url).
2. **Lead paragraph** — `post-lead` styling (21px, ink). The §1 human open.
3. **Body, first half** — `<h2>` sections. **Rhythm rule: no run of >3 short paragraphs without a
   heading, list, or callout.** Short paragraphs (2-4 sentences). Real `<h2>`/`<h3>` subheads,
   phrased as the questions families actually ask (PAA-friendly).
4. **At least one real list** — `<ul>` for points, `<ol>` for steps/sequences. **Never** fake a list
   as `<strong>Label.</strong>` run-ons inside a `<p>`. The Action steps (§5) are a real `<ol>`.
5. **Key box** ("THE SHORT ANSWER") — exactly one: cream card, slate left border, eyebrow, `<h3>`,
   and a `<ul>` of the things to confirm.
6. **Midpoint illustration** — `<figure>` + `<figcaption>` (signed; CDN url).
7. **Body, second half** — more `<h2>` sections, same rhythm.
8. **≥1 pull-quote** — `<blockquote>` styled italic serif with gold left border; the single most
   human or most important line.
9. **FAQ** — one `<h2>Frequently Asked Questions</h2>` with 3-4 `<h3>` Q + `<p>` A targeting the
   secondary long-tails (FAQ-schema friendly).
10. **Bottom line** — dark slate card, eyebrow "THE BOTTOM LINE", one tight paragraph with one bold
    sentence and the single next step (links to the matching product or the free Starter Kit).
11. **Related** — `<h2>Related from Aging Parent Care</h2>` + `<ul>` of 3 canonical `/blog/<slug>` links.
12. **Sources** — `<h2>Sources</h2>` + `<ol>`, each `<li id="src-N">`; inline claims use a
    `<sup><a href="#src-N">N</a></sup>` citation marker.
13. **Disclaimer** — `<hr>` then category-appropriate `<em>` disclaimer.
14. **Copyright** — final `<p>` (muted, small).

**Optional (reserved):** an affiliate/sponsorship seam (`<aside data-apc="aff">`) may sit between the
bottom line and Related. It is OFF until activated, clearly labeled, and NOT required by the validator.

Internal links: up to the pillar + across to 1-2 live articles + forward to product/Starter Kit.
Primary keyword in title, page_title, slug, description, first 100 words, ≥1 H2.

## 7. ILLUSTRATIONS + SIGNATURE (HARD gate) — `apc-illustrations/SKILL.md`, `scripts/sign_illustrations.py`
Tomi Um style; 2 per article (starting + midpoint, never the same composition); APC signature
bottom-right; `sign_illustrations.py --check` must exit 0 before any upload; batch variety.

## 8. PUBLISH = NOTION SYNC + CORRECT CATEGORY (HARD) — CLAUDE.md
On go-live: Notion Status→Published, write parent_id + live `/blog/<slug>-<id>` URL + cover; publish
in the correct theme category so it auto-promotes into the hub, Articles feed, and home block.

## 8b. EMAIL CAPTURE / STARTER KIT (HARD — the funnel objective)
Every article exists to do two jobs: help the reader, and capture the email. The free **Starter Kit**
(`https://agingparent.care/pages/starter-kit`) is the email-capture surface, so every article must
promote it prominently and make signing up effortless. Required, validator-gated:
- **At least TWO Starter Kit calls to action**, both linking to `https://agingparent.care/pages/starter-kit`:
  1. a **mid-article sign-up callout** (`data-apc="cta"`): a warm, button-style invitation placed after
     the midpoint figure / first half, framed around getting the free kit sent to their inbox; and
  2. the **bottom-line card** CTA (already required in §6).
- Frame it as a gift, not a sell: free, plain-language, sent to your inbox. Signal email capture
  ("sent straight to your inbox," "get the free kit"). Never fabricate the kit's specific contents;
  keep the value line honest and general.
- Canonical mid-article block (copy from `references/selldone-article-template.html`, `data-apc="cta"`).
- It must read as a natural offer inside the story, never a flashing banner. Two strong, well-placed
  CTAs beat five desperate ones.

---

## What the validator checks mechanically (the executable contract)
HARD FAIL (exit 2): em/en dash; markdown-escape leak; missing FAQ H2; zero in-body lists; no key
box; no pull-quote; no bottom-line card; <2 illustrations; oversized `<p>` (wall-of-text); missing
Sources; **bare `PMC ####` / `DOI:` identifier in body prose; any Sources entry with no link or a
homepage-only link; missing mid-article Starter Kit CTA (`data-apc="cta"`); fewer than 2 Starter Kit
sign-up links (§8b email capture).** WARN (exit 0, surfaced): banned vocabulary outside citations; thin section
(>3 paragraphs, no break); missing inline citations. The validator is the single enforcement point;
CI, the daily routine, and any manual edit all call it.

**Two gates it CANNOT replace (process, on the writer):** (1) **citation truth** — open and read every
source, confirm it exists and supports the exact claim (§4b); (2) **humaneness** — the writing-well →
human-prose → human-pro pass so it reads like a person, not an explainer (§1). Green validator + a
robotic or fabricated article = not shipped.
