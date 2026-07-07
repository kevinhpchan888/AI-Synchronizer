---
name: guru-watch
description: "Kevin's mentor knowledge base: 17 gurus across dropshipping and ebook/digital products (Hormozi anchor; Wold, Mithwani, Hampton, Sattar, Dobbins, Yu, Eng; Pawliw, Denney, Cottrell; Roberts, Dollwet, Moran, Harrison-Sund, Broad). Obsidian vault on Google Drive. Trigger when Kevin names a mentor or asks what gurus say, whether they agree, or if a tactic is backed."

---

# guru-watch — Kevin's mentor knowledge base

Kevin maintains a synthesized knowledge base of 15 mentors covering his two
business lines: e-commerce/dropshipping (Shopify, Meta ads) and digital
products (Selldone, KDP, ebooks/audiobooks/workbooks). The vault lives on
Google Drive and is human-readable as Obsidian markdown.

**You (Claude Code in any session) read this vault to ground answers in what
Kevin's actual mentors say, with raw-transcript citations and risk flags. You
do NOT freelance about these mentors from training data.**

## Where the vault lives

The vault is at the same logical location on every device (Google Drive syncs
the underlying content). Use the path that matches your OS:

| Platform | Path |
|---|---|
| Windows (this machine, AMVPC) | `G:\My Drive\Obsidian\20-Guru-Watch\` |
| Windows git-bash | `/g/My Drive/Obsidian/20-Guru-Watch/` |
| Mac Mini (amvserver) | `/Users/amvserver/Library/CloudStorage/GoogleDrive-kevinhpchan@gmail.com/My Drive/Obsidian/20-Guru-Watch/` |
| Mac Mini (project symlink) | `/Users/amvserver/guru-watch/vault/` |

If you are uncertain which platform you are on, run `uname` (Mac: `Darwin`,
Windows git-bash: `MINGW64_NT-*`). Choose the path that exists.

## Vault layout

```
20-Guru-Watch/
├── CLAUDE.md                    # wiki schema (read this first if confused)
├── wiki/
│   ├── gurus/                   # one synthesis page per mentor
│   │   ├── ac-hampton.md
│   │   ├── andrew-yu.md
│   │   ├── book-launchers.md    # may be empty pre-synthesis
│   │   ├── brian-moran.md
│   │   ├── dale-l-roberts.md
│   │   ├── dara-denney.md
│   │   ├── ecom-king.md
│   │   ├── ethan-dobbins.md
│   │   ├── fraser-cottrell.md
│   │   ├── henrik-wold.md
│   │   ├── rachel-harrison-sund.md   # may be empty pre-synthesis
│   │   ├── saamir-ir.md
│   │   ├── sean-dollwet.md
│   │   ├── shaun-eng.md
│   │   └── spencer-pawliw.md
│   ├── comparisons/             # cross-mentor topic pages
│   │   ├── creative-strategy.md
│   │   ├── meta-ads-testing.md
│   │   ├── one-product-vs-general.md
│   │   ├── product-research.md
│   │   ├── scaling.md
│   │   ├── store-design.md
│   │   └── supplier-fulfillment.md
│   └── audits/                  # lint reports, quarantine
├── raw/                         # original transcripts (1 file per video/post)
│   ├── ac_hampton/youtube/*.md  # note: underscore-vs-hyphen between dirs and slugs
│   ├── ... (15 mentor folders)
│   └── ...
```

Slug-to-folder mapping: `ac-hampton.md` (wiki slug) → `raw/ac_hampton/...`
(folder name uses underscores). Always use the right form for the right path.

## The 15 mentors, organized by cohort

### E-COMMERCE / DROPSHIPPING cohort (7) — Shopify, Meta ads, branded ecom

- **Henrik Wold** — one-country EU dropshipping (Norway-based)
- **Saamir Mithwani** — built-to-sell branded dropshipping
- **AC Hampton** — one-product Meta stores, Supreme Ecom. BBB complaints flagged.
- **Kamil Sattar (Ecom King)** — long-form generalist tutorials
- **Ethan Dobbins** — TikTok-primary creative (downweight for Meta-only contexts)
- **Andrew Yu** — Meta + lifestyle marketing, branded named methods
- **Shaun Eng** — brand-scaling, market sophistication (Eugene Schwartz applied to ecom)

### AD CRAFT + STRATEGY cohort (4) — applies to BOTH verticals

- **Alex Hormozi** (Acquisition.com) — **CROSS-VERTICAL STRATEGY ANCHOR**. $100M Offers framework (value equation: dream outcome / likelihood / time-delay / effort-sacrifice), $100M Leads framework (4 lead sources: warm outreach / cold outreach / post free content / run paid ads), book-as-lead-magnet at-cost funnel methodology. APPLIES TO BOTH VERTICALS — offer construction for APC Guide+Workbook, dropship offer/upsell architecture, ebook-as-funnel pipelines. Pairs with `ebook-authoring`, `dropship-pricing-strategy`, `ebook-distribution`, `dropship-email-sms`. Risk: revenue claims operator-claimed (Gym Launch exit, Acquisition.com $100M+), high commercial intent (funnels to School of Acquisition + books), frameworks tend to be over-applied.
- **Spencer Pawliw** — script architecture: curiosity gap, rehook, open loops, awareness ladder, named enemy, founder belief. $100k/day operator. He is the first-party source behind the `storytelling-ads` skill.
- **Dara Denney** — creative strategy / diagnostics ("20,000+ ads"). 5 levels of creative diversity. Andromeda/GEM era diagnostics. "Why isn't this ad working" goes here.
- **Fraser Cottrell** — AI-creative production (Poppy AI, Seedance, Claude). $300M ad-spend backstory (unverified). Production tooling for high-volume iteration.

### DIGITAL PRODUCTS / EBOOK cohort (5) — Selldone, KDP, info-product funnels

- **Brian Moran** (SamCart founder) — digital product funnels, $7B-sales-data niche selection, Instagram-to-product, simple-ebook strategy. APC Guide+Workbook IS his playbook.
- **Dale L. Roberts** (Archangel Ink) — KDP wide-publishing, IngramSpark, paperback specs, Amazon review acquisition without TOS violations. Most operational of the cohort.
- **Sean Dollwet** (formerly Royalty Hero) — KDP niche-hunting, low-content books, ebook-to-audiobook pivots. High promo density (course funnel).
- **Rachel Harrison-Sund** — low-content KDP, niche reverse-engineering (spot-the-difference, public domain art, daily-revenue teardowns). Relevant for LumosBooks workbook lines.
- **Book Launchers (Julie Broad)** — non-fiction AUTHORITY-BOOK marketing, book as business asset, podcast tour mechanics, post-launch monetization. HIGHEST-QUALITY signal for authority/professional non-fiction. Pairs strongly with `ebook-authoring` and `dropship-brand-transition` (book as authority lever).
- **Adam Enfroy** (AI affiliate marketing + course-platform expertise) — pivoted from Blog Growth Engine to AI-leveraged affiliate marketing. Strong signal on LMS/course-platform comparisons (Kajabi vs Thinkific vs Teachable vs Skool) — directly relevant to APC distribution choice for Guide+Workbook. Pairs with ebook-distribution and Brian Moran. Risk: $10K/month claims operator-self-reported, beginner-funnel framing, heavy Blog Growth Engine course commercial intent.

## Routing rules (mandatory)

1. **E-commerce / dropshipping / Meta ads / Shopify / suppliers / pricing for physical goods** → DROPSHIPPING cohort + relevant `dropship-*` skill(s).
2. **Ad scripts / hooks / UGC / creative diagnostics / production tooling** → AD CRAFT cohort + `storytelling-ads` + `dropship-creative-engine`. Applies to BOTH verticals.
3. **KDP / self-publishing / digital products / ebook funnels / info-product pricing / authority book marketing** → EBOOK cohort + relevant `ebook-*` skill(s).
4. **Cross-vertical** (ebook as lead magnet for Shopify, brand transition from dropship to digital, etc.) → load BOTH cohorts and synthesize transparently.
5. **APC (agingparent.care) marketing** → EBOOK cohort first (Brian Moran + Book Launchers especially), then AD CRAFT for ad creative, then `dropship-email-sms` for nurture sequences.

## Situation-driven retrieval (THE PRIMARY USE CASE)

What Kevin actually wants from this knowledge base is **tactics and strategies
applied to his specific situation**, not biographical summaries of each
mentor. When his question has a *situation* in it ("I want to launch a $30
ebook on the APC store", "my ROAS dropped from 2.3 to 0.7", "how do I scale
this winning creative"), do this:

1. **If MCP is available** (Claude Desktop, web Claude.ai with the
   `guru-watch` MCP server configured), call:
   ```
   situation_brief(situation="<Kevin's exact situation>")
   ```
   That returns each mentor's relevant content as structured data.
2. **If MCP is NOT available** (e.g. plain Claude Code without MCP), grep
   the vault directly:
   ```bash
   rg --color=never -li "<keyword1>|<keyword2>" "$VAULT/wiki/gurus/" | head -10
   rg --color=never -ni "<keyword1>|<keyword2>" "$VAULT/wiki/comparisons/"
   ```
3. **Answer in this structure**:
   - **What each mentor would do** (cite by slug; surface contradictions)
   - **Where the cohort converges**
   - **Where the cohort diverges** (don't anoint a winner — Kevin wants the diversity)
   - **Kevin-specific recommendation** combining cohort signal with his
     verticals (Singapore Meta-ads dropship + APC digital products)

Contradictions are FEATURES, not bugs. Kevin explicitly wants to see "Spencer
says X, but Dara says Y, and here's why each is right for different stages."

## How to use this skill in your session

When Kevin asks a question that matches the routing rules above, do this in
order — DO NOT freelance answers about these mentors from training data:

1. **Identify which page to read.** Single-mentor question → `wiki/gurus/<slug>.md`. Cross-mentor consensus question → `wiki/comparisons/<topic>.md`.
2. **Read the file fully.** On Windows:
   ```bash
   cat "/g/My Drive/Obsidian/20-Guru-Watch/wiki/gurus/<slug>.md"
   ```
   On Mac:
   ```bash
   cat "/Users/amvserver/guru-watch/vault/wiki/gurus/<slug>.md"
   ```
3. **Surface frontmatter risk_flags and meta_ads_relevance** in your reply.
4. **Cite raw transcripts** for every numerical claim. Citations look like `raw/spencer_pawliw/youtube/2026-XX-XX_<id>.md` — verify they exist before quoting.
5. **No mentor gets a free pass.** All 15 are flat peers. Surface disagreements honestly; do not anoint a winner. Operator-claimed revenue numbers ($98M/yr, $300M, $7B sales data, $1.2M, $3,610/day, etc.) are NOT verified — pass through with `risk_note`.
6. **If the wiki page does not exist yet** (e.g. for Rachel Harrison-Sund or Book Launchers if Pass 2 hasn't synthesized them yet), say so. Fall back to grep over the raw transcripts:
   ```bash
   rg --color=never -n "<keyword>" "/g/My Drive/Obsidian/20-Guru-Watch/raw/<guru_id>/"
   ```
   Quote the transcript directly. Do not invent.

## Hard rules

1. **Never validate a mentor claim without surfacing risk.** Numerical claims (revenue, conversion, timelines) are unverified by default.
2. **All 15 mentors are flat peers.** No trust weighting. When they disagree, surface disagreement; let Kevin decide.
3. **Meta-ads context for Kevin's dropship line:** Kevin runs Meta only. Downweight TikTok-organic tactics. The synthesis frontmatter scores `meta_ads_relevance`; prefer high-relevance bullets.
4. **No em-dashes.** Kevin hates them. Use commas, semicolons, parentheses, or sentence breaks.
5. **Cite raw transcripts** with their path. Format:
   > [[spencer-pawliw]]: "Test 3 listicles, scale the third if CTR > 1.5%."
   > Source: `raw/spencer_pawliw/youtube/2026-03-12_xxxxx.md`
   > Risk note: tactic-specific to native ads, not 1:1 to Meta.

## What this skill is NOT

- Not a real-time alert system. Ingest runs every 6 hours.
- Not a recommender. It surfaces what 15 mentors have said. Kevin decides.
- Not authoritative. The LLM can mis-extract. When Kevin disputes a quote, follow the citation into the raw transcript and read the actual text.

## Pipeline ops (only if Kevin asks)

The synthesis pipeline lives on the Mac Mini at `/Users/amvserver/guru-watch/`. Project source on Windows lives at `C:\Users\Kevin Chan\Downloads\dropship-skills\guru-watch\`. Standard ops commands (SSH to macmini first if running from Windows):

```bash
# Status
cd /Users/amvserver/guru-watch && /opt/homebrew/bin/uv run guru-watch status

# Refresh one mentor
/opt/homebrew/bin/uv run guru-watch ingest --guru <guru_id>
/opt/homebrew/bin/uv run guru-watch run --pass 1
/opt/homebrew/bin/uv run guru-watch run --pass 2 --guru <guru_id>

# Cross-mentor comparison rebuild
/opt/homebrew/bin/uv run guru-watch run --pass 3 --topic <topic>
```
