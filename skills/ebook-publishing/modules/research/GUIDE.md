
# ebook-research

## When to load

- Kevin is scoping a new e-book (authority play or KDP info product) and needs the research layer before writing.
- He asks "what's already out there on X", "find gaps", "who are the experts", "what should I read first".
- Before ebook-authoring. Research is the input. Do not let Kevin start writing without a research file.

## Scope for Kevin specifically

Kevin is a Singapore operator writing either:
- **Authority / brand-building e-books** tied to his dropshipping-to-brand transition (70-150 pages, 25-45k words)
- **Standalone KDP info products** (100-200 pages, 35-70k words)

Both need credibility. Both compete against thousands of AI-slop books on Amazon. The research bar has to be higher than the competition's, not lower.

## Output of this skill

By the end of the research phase, Kevin has a `research/` folder with:

```
research/
  topic.md              # hypothesis, target reader, positioning
  competitive.md        # top 10 existing books, ratings, gaps
  sources-primary.md    # interviews, own data, original research
  sources-secondary.md  # peer-reviewed papers, authoritative books, data
  sources-tertiary.md   # quality journalism, expert blogs, YouTube transcripts
  interviews/           # raw transcripts (one file per subject)
  quotes.md             # hand-picked quotable passages with citations
  open-questions.md     # what he still does not know
  outline-inputs.md     # structural ideas that emerged from research
```

This IS the deliverable of the research phase. No writing starts until this folder is populated.

## Step 1: Topic scoping (before any search)

Write `research/topic.md` with three sections. Challenge Kevin on each one.

### 1a. The one-sentence book

"This book is for [reader] who wants [outcome] and currently struggles with [specific pain]. By page 200 they will know how to [transformation]."

If he cannot write this sentence, the book is not ready. Help him narrow. Vague targets make mediocre books.

### 1b. The reader awareness level

Eugene Schwartz's five awareness stages. Place the target reader:

1. **Unaware** of the problem (hardest sell, broadest book)
2. **Problem-aware** but not solution-aware
3. **Solution-aware** but do not know your solution
4. **Your-solution aware** but not convinced
5. **Most aware** (ready to buy / act)

Authority plays usually target 2-3. KDP info products usually target 3-4. Tell Kevin which and tailor the hook.

### 1c. Why Kevin specifically

What does Kevin bring that 99% of authors on this topic cannot? Singapore operator perspective, global dropshipping lens, X years of operating data, Y specific wins and Z specific losses. This is the positioning wedge. Without it the book is commodity.

## Step 2: Competitive teardown (before own research)

Write `research/competitive.md` after reading the market. Do NOT skip this. Writing without knowing the market is how Kevin produces another me-too book.

### Process:

1. **Amazon search** the primary keyword. Open top 20 results.
2. **Record for each**: title, author, publication year, page count, Amazon rank (BSR in Top 100 Kindle Nonfiction if bestseller), review count, star rating.
3. **Read the top 3**. Fully. Not skim. Note chapter structure, voice, what works, what does not.
4. **Read the 1-star and 3-star reviews** of the top 3. These are gold. This is what readers hated. Your book solves those complaints.
5. **Check "Look Inside"** on the next 7. Get TOC, intro, first chapter.
6. **Identify patterns**: what ALL of them do, what NONE of them do, what's been recycled for a decade.

### Deliverable table:

| Rank | Title | Author | Year | Pages | BSR | Reviews | Rating | 1-star themes | Gap for Kevin |
|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | |

### Synthesis paragraph (bottom of file):

"The market is crowded/thin in X ways. The dominant frames are [A, B, C]. Readers consistently complain about [D, E]. The gap Kevin can exploit is [specific angle]. This makes the book's wedge: [one sentence]."

If there is no gap, tell Kevin. Refuse to proceed. A commodity book is a dead book.

## Step 3: Source hierarchy

### Primary (highest credibility, hardest to get)

- Interviews Kevin conducts himself
- Kevin's own operating data (Shopify exports, Meta ad numbers, supplier contracts, P&Ls with PII redacted)
- Original analysis of public datasets
- Direct access to subject-matter experts

Write `research/sources-primary.md` listing each with: source, what it confirms, date obtained, consent status (for interviews).

### Secondary (peer-reviewed and authoritative)

- Peer-reviewed papers (Google Scholar, JSTOR, SSRN for finance/biz)
- Industry reports (McKinsey, BCG, Gartner, Forrester, government statistics)
- Books by recognized experts (check author credentials, publication year)
- Official regulatory/government sources (ACRA, IRAS, FTC, EU Commission, US Census, Statista paid tier)

Write `research/sources-secondary.md` with: title, author/publisher, year, URL or DOI, relevant finding, page/section reference.

### Tertiary (supporting, use sparingly)

- High-quality journalism (FT, WSJ, Bloomberg, The Economist — not blog aggregations)
- Expert blogs with demonstrable track record
- Conference talks and YouTube videos (use `yt-dlp` to pull transcripts, see below)
- Podcasts (transcribe via Otter.ai or Whisper)

Write `research/sources-tertiary.md` with the same structure.

## Step 4: YouTube transcript research

When an expert has a canonical talk on the topic:

```bash
# Pull transcript
yt-dlp --write-auto-subs --write-subs --sub-lang en --skip-download --sub-format "vtt" -o "research/transcripts/yt-%(id)s.%(ext)s" "<URL>"

# Convert VTT to clean text
for f in research/transcripts/*.vtt; do
    awk '/-->/{skip=1;next} skip{skip=0;next} NF' "$f" > "${f%.vtt}.txt"
done

# Fallback if yt-dlp fails
python3 -c "from youtube_transcript_api import YouTubeTranscriptApi; import sys; print('\n'.join(x['text'] for x in YouTubeTranscriptApi.get_transcript(sys.argv[1])))" "<VIDEO_ID>" > research/transcripts/yt-<id>.txt
```

Cite as: `[Speaker], "[Talk title]", [Conference/Channel], [Year]. Transcript at research/transcripts/yt-<id>.txt`.

## Step 5: Interviews (primary research — highest-value effort)

### Who to interview

Five archetypes per topic:
1. **The practitioner** (someone doing it now at scale)
2. **The expert** (academic or institutional authority)
3. **The survivor** (someone who failed and learned)
4. **The contrarian** (disagrees with consensus)
5. **The customer/beneficiary** (on the receiving end)

Kevin's Singapore operator network + Tailscale cold outreach + LinkedIn Sales Navigator + Twitter DMs. Small book-focused outreach sequence (3-touch, no automation bloat).

### Interview protocol

- **Consent** explicit, in writing (email confirmation): "recording for research, may be quoted in book with your approval on specific quotes"
- **Record** via Zoom cloud, Riverside, or phone call with `call-recorder` apps (SG: legal to record your own calls)
- **Transcribe** via Otter.ai ($20/mo) or Whisper local (`whisper audio.mp3 --model medium --output_format txt`)
- **Structure**: 3 open questions, 5 focused questions, 2 "anything I missed" questions
- **Length**: 45-60 minutes. Longer drifts. Shorter misses depth.
- **File**: `research/interviews/YYYY-MM-DD-<name>.md` with metadata header, raw transcript, Kevin's synthesis notes at bottom.

### Interview synthesis

After each interview, write 3 paragraphs in the bottom of the file:
1. The one thing this interviewee said that nobody else has
2. The one claim Kevin should verify independently
3. The book chapter this interview most serves

## Step 6: Fact verification (non-negotiable)

Every non-trivial claim in the manuscript must trace to a source. Rules:

1. **Triangulate**: no standalone citation for load-bearing claims. Two sources minimum for statistics, three for contentious claims.
2. **Check publication year**: a 2018 statistic in a 2026 book is a red flag unless the book is historical.
3. **Trace through chains**: if Book A cites Study B, read Study B. Do not inherit citations.
4. **Flag AI hallucination risk**: if a citation was surfaced via LLM (including this agent), verify by opening the actual source. LLMs fabricate plausible-looking references.
5. **Keep a bibliography file** in BibTeX or simple markdown from day one. Retrofitting is hell.

Write `research/quotes.md` with this format:

```markdown
## Q: [short slug]

> "[exact quote, no paraphrasing]"
>
> — [Author], *[Book/Paper/Talk]*, [Year], p. [page] / [URL]

**Context:** [one line — what the author was arguing]
**Use in manuscript:** Chapter [N], section [name], to support [claim].
```

## Step 7: Open questions

Write `research/open-questions.md` throughout the research phase. Every time a source raises a question you cannot yet answer, log it. Before starting ebook-authoring, every question must be either answered or explicitly marked "out of scope, acknowledge in book".

This file is the gate. Research is not done until this file is clean.

## Step 8: Outline inputs

Write `research/outline-inputs.md` with bullet-list ideas for chapters and sections that emerged from research. This feeds directly into ebook-authoring. It is not yet an outline, just raw structural material.

## Anti-patterns to refuse

- **Skipping competitive teardown.** "I already know the market" is a lie. Read the top 10 first.
- **Single-source claims.** One paper, one book, one blog. That is not research, that is parroting.
- **AI-generated research bibliographies.** LLMs fabricate. Every citation verified by opening the real source.
- **"I don't have time to interview anyone."** Then Kevin writes a me-too book. Interviews are the wedge.
- **Starting to write before the research folder is populated.** Premature writing produces drift. Refuse.
- **Singapore myopia.** Kevin's perspective is the wedge, not the whole book. Include non-SG perspectives to avoid provincialism.

## Tools wired

- Web search (Gemini grounding) for initial scans
- `yt-dlp` for YouTube transcript pulls
- `youtube_transcript_api` (Python) as fallback
- QMD (`qmd query "<q>" --collection donny`) for own workspace recall
- Mnemon (`MNEMON_STORE=donny mnemon remember "<fact>" --cat research`) for durable facts
- SearXNG for broader unaggregated search
- Otter.ai or Whisper for interview transcription

## Handoff to ebook-authoring

The research phase is complete when:

- [ ] topic.md has all three sections filled
- [ ] competitive.md has top 10 teardown + gap synthesis
- [ ] sources-primary.md has ≥3 entries (interviews or original data)
- [ ] sources-secondary.md has ≥10 entries (peer-reviewed or authoritative)
- [ ] interviews/ has ≥5 transcripts (for authority books) or ≥3 (for KDP info products)
- [ ] quotes.md has ≥30 hand-picked passages with full citations
- [ ] open-questions.md has zero unanswered gate items
- [ ] outline-inputs.md has raw structural material

Only then load `ebook-authoring`.

## Cite back in text

When Donny uses this skill's guidance in a reply, cite: `(from ebook-research)`.
