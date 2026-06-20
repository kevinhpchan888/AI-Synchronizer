# APC Article Playbook

> **Single source of truth: [`../ARTICLE-RULES.md`](../ARTICLE-RULES.md).** The hard, executable rules
> (voice, layout, writing, SPARK, selection, illustrations, publish) and the validator live there.
> This playbook is method/detail; if anything here conflicts with ARTICLE-RULES.md, that file wins.

Single source of truth for creating, updating, and publishing blog articles on agingparent.care. Every article, every time. No exceptions.

**Companion file**: `daily-content-routine-v2.md` (the live-truth daily routine: rebuild-from-live inventory, demand-driven research, SEO + dedup gate, and the pillar/cluster gap map in Section H). Read it before any new article work.

---

## 0a. Reddit VOC mining (mandatory, every article)

Before writing or revising ANY article, run the **`research-mastery`** orchestrator, which fuses four layers (cost-disciplined: free filters first, paid enrichment only on survivors):
1. **L1 `google-keyword-research`** skill (`scripts/keyword_backend.py` — functions `expand_autocomplete`, `extract_paa_related`, `cluster_and_score`, `keyword_research_full`; free Google-suggest backend, no key) → demand + the exact PAA/autocomplete questions. The primary keyword and the FAQ questions come from here. Record in a `google_signal:` frontmatter line. Fuse L1+L2+L3 into a brief with `scripts/brief.py`. On established articles, run `scripts/gsc_striking_distance.py` first to refresh page-2 winners before writing anything new.
2. **L2 `reddit-mcp` / `reddit-research-mastery`** → voice-of-customer. The hook comes from the verbatim trigger; body and FAQ from the points and misconceptions; steps from what worked (n=3 triangulation). Record in a `reddit_signal:` frontmatter line.
3. **L3 `googletrends-mastery`** → confirm the topic is rising, not dying. A dying topic is a skip.
4. **L4 `community-research-mastery`** (optional) → audience ownership.

Never ship L1 without L2 (volume with no language) or L2 without L1 (language with no demand). Framing is always actionable, problem-solving, direct, never academic. Every time you mine for a new article, re-check whether the findings improve existing live articles (log them in `LIVE-ARTICLE-IMPROVEMENTS.md`). Not optional; applies to new articles and revisions alike.

## 0. The Four-Test Title Scorecard (mandatory)

Added 2026-06-15. Every title — new, renamed, or consolidated — must score 4/4 before publish. Score ≤3 means rewrite. Score ≤2 cannot be scheduled.

### SPARK content structure (MANDATORY — every article embodies this)
Added 2026-06-18. Every article is built on the SPARK arc so it hooks and converts, not just informs:
- **S — Solution (lead promise):** the title + first paragraph promise the specific fix the reader gets. Hook hard: name the problem in the first line, promise the payoff by sentence three.
- **P — Problem:** make the specific situation and the cost of doing nothing concrete and recognizable (the hook's engine). No abstract framing.
- **A — Action:** the core of the body is concrete, numbered, do-this-now steps — what to do, in what order. Actionability over explanation.
- **R — Results:** show what the actions produce — proof, data, a real example, the outcome a family can expect. This is where cited evidence lives.
- **K — Key Takeaway:** close with one crisp, memorable takeaway + the single next step (link to the matching product or the free Starter Kit).
On-page SEO, citations/accuracy, the FAQ H2, internal links, the 3-skill prose pipeline, illustrations, and the page template are unchanged — SPARK governs how the content is *shaped and ordered*. Run the hook check on title + first paragraph every time; if either doesn't grip, restructure before publishing.

| Test | Pass condition |
|---|---|
| **Hook** | Title states a specific, urgent problem OR a specific actionable outcome in ≤70 chars. Stat-as-hook is allowed only when the stat IS the problem (e.g., $202.90 Part B premium). |
| **Specificity** | Title names a concrete situation: dollar, decision, document, diagnosis, deadline, demographic. No abstractions ("the math of," "the conversation," "the journey," "emotional whiplash"). |
| **Action** | Title implies the reader will leave knowing what to DO. Not what to feel, what to know, what to consider. |
| **SEO** | Title contains the target keyword phrase verbatim (or a verbatim long-tail). The target keyword is named in the Notion page properties before the article is written. |

### The Hook Title Formula (apply to EVERY title, every time)

A title is not a label, it's a promise. It must make the reader think "if I read this, I'll learn something that changes a decision I'm facing." Build every title with these steps:

1. **Open with the payoff or a question, never a statistic or abstraction.** The benefit lands in the first three words.
2. **Use one of the proven structures** (pick the one that fits the search intent):
   - `How to [achieve specific outcome]` — *How to Protect Your Parent From Scams Before Someone Drains Their Account*
   - `Will / Why / What [question that hits the exact worry]` — *Will the 2026 Medicaid Cuts Hit Your Parent's Care?*
   - `What [thing] actually costs / buys / does` — *What Does $75,000-a-Year Assisted Living Actually Buy?*
   - `[N] signs / ways / documents + concrete object (+ curiosity)` — *11 Signs It's Time to Move Your Parent. Number 6 Is the One Families Miss.*
   - `What happens when [reader-side event]` — *What Happens When Medicaid Stops Paying for the Nursing Home*
3. **Front-load the primary keyword** (from L1 google-keyword-research).
4. **Promise a material, decision-changing takeaway** — pair the hook with the benefit in a parenthetical or second clause when it sharpens it: *(Scripts That Actually Work)*, *(and How to Recover)*, *(and What It Can't Do)*.
5. **Keep it ≤ ~65 characters** where possible so it doesn't truncate in search/social.
6. **The first paragraph is the second hook**: name the reader's exact situation → the cost of doing nothing → the specific payoff this article delivers. No opening statistic unless the stat IS the problem.

**Banned title openers (retired permanently):** "[Stat]% of caregivers report [emotion]"; "$N in/of [thing]" as the headline noun ("$1 Trillion in Invisible Labor"); "The [abstract noun] of [situation]" ("The Math of Staying Home," "The Algorithm Deciding…"); "Nobody told you / nobody warned you"; any title that rewards the research instead of the reader; recycling the same dollar amounts as the headline noun.

**The ship test for every title:** would a tired caregiver scrolling at 11 p.m. click this because it promises to solve the exact thing keeping them up? If not, rewrite.

### Title-Body Integrity (mandatory — the title is a contract)

A hook the body can't deliver is bait-and-switch: the reader bounces, trust is gone, and Google reads the fast bounce as a ranking penalty. So the promise in the title MUST be paid off in the body. Two enforcement rules:

1. **Every title is checked against its body before publish.** For each promise the title makes, the body must contain the goods. If the title says *"How to Fight a Denial and Win,"* the body must contain the actual appeal steps. If it says *"Scripts That Actually Work,"* there must be real scripts. If it says *"7 Ways,"* there must be seven concrete ways. No promise without payoff.
2. **A retitle is never cosmetic.** When you sharpen a title into a stronger promise, you must read the body and, if it doesn't yet deliver, upgrade the body to match before publishing. Strengthening the hook and strengthening the substance happen together, never separately. (The Selldone upsert requires the full body anyway, so this is enforced by the mechanism too.)

The integrity test: *if a reader does exactly what the title promised they'd learn, did the article actually give them that?* If not, fix the body or soften the title until the two match.

**Hook paragraph**. The first paragraph is the second hook. Name the specific situation, name the cost of doing nothing, promise the specific outcome the next 5 minutes of reading delivers. No statistics in the lede unless the statistic IS the problem.

**Meta description**. 140-160 chars, contains the target keyword, names the action the reader will be able to take.

---

## 1. Voice and Tone

**Primary register**: Atul Gawande (Being Mortal). Specific. Story-first. Move between a human moment and the system that created it. When covering grief or loss, shift to Joan Didion register: short declarative sentences, no cushioning, no comfort language.

**Tone**: Nurturing but direct. Write as equals under pressure. Not patronizing. Not clinical. Not cheerful. Not preachy.

**Core principles**:
- **Never project feelings onto the individual reader.** Do not tell the reader what THEY are feeling, doing, or failing to do right now. The reader brings their own emotions; your job is to give them information. However, acknowledging the general difficulty of caregiving or attributing experiences to the collective is fine.
  - **Banned (projecting onto "you"):** "so you are not spinning," "makes it less terrifying," "the conversation you have been putting off," "your worries," "the weight you carry." These tell the individual reader their emotional state or accuse them of inaction.
  - **Allowed (general truth or attributed to others):** "one of the hardest things most people will ever do," "what most caregivers say is hardest," "almost no one gets handed instructions." These state facts about the world or attribute to collective experience.
  - **The test:** Is the sentence telling the individual reader what they feel, fear, or have failed to do? Rewrite. Is it a general truth about caregiving or attributed to others? Fine.
  - **Fix pattern:** Replace "you" feeling-claims with what the resource IS or DOES. "A week-by-week action plan." "A framework for starting the conversation."
- No moralizing. No "treasure every moment." No religious framing.
- Ground abstract claims in specific images. "Costs vary" becomes "A room in rural Alabama runs $4,100. The same room in D.C. could cost $9,000."

**Named characters**: A tool, not a requirement. Use only when the scene strengthens the piece. Never force a character onto a short explainer or checklist. When used: full first and last names, culturally broad, concrete city/occupation/objects, fresh per piece, never recurring.

---

## 2. Banned Words and Patterns

### Words (zero tolerance)

delve, navigate (as metaphor), realm, crucial, landscape (metaphor), embark, foster, leverage (verb), robust (emotions), moreover, furthermore, underscores, multifaceted, game-changer, utilize, facilitate, synergy, paradigm, optimize (for emotions), empower, streamline, holistic, unpack, deep dive, touch base, circle back, move the needle, low-hanging fruit, tapestry (metaphor), crucible, echoed through, fractured (emotional), whispered promises, dance of [X], symphony of, shattered (emotional), resonated, navigating (emotions), uncharted territory, landscape (emotional), "a weight she couldn't name", something shifted, meaningful, transformative, seamless, curated, invaluable, heartfelt, impactful, profound, luminous, gossamer, broken hymn, journey (caregiving/personal growth), comprehensive (in openings), it's important to note, in today's world, it's worth noting, at the end of the day, when it comes to, in terms of

### Banned openings

"In today's...", "When it comes to...", "In the world of...", "As a caregiver...", "In today's world...", "As we all know...", "It goes without saying...", "Let's face it..."

### Banned patterns

- **No em dashes (U+2014).** Brand rule. Use periods, commas, colons, semicolons, or parentheses. En dashes for numeric ranges are fine.
- **"Not X. It's Y" construction**: max 1 per article. Rewrite as direct statement.
- **"Not X, not Y, but Z"**: max 0 per article.
- **"Didn't just X, she Y'd"**: max 0 per article.
- **"And yet"**: max 0 per article.
- **"There was something about"**: max 0.
- **"It was as if"**: max 0.
- **Triplets** (three adjectives, three parallel fragments, three-item lists with identical structure): max 2 per article. Break extras into pairs or singles.

---

## 3. Three-Skill Prose Pipeline

Every article passes three quality gates in this exact order before publishing. No article skips a pass.

### Pass 1: Clarity (writing-well)

- Active verbs. Cut passive constructions.
- No adverb/adjective bloat. One adjective per noun max.
- No clutter: throat-clearing, redundant pairs ("each and every"), pompous inflation ("at this point in time").
- Positive form: "she was usually late" not "she was not often on time."
- Lead sentence must pull the reader into the second sentence.
- Ending closes the door without summarizing.

### Pass 2: AI Tell Removal (human-prose)

Run the 6-point scan on the finished body:

1. **Metaphor audit.** Can you explain the literal comparison in one plain sentence? If not, cut or replace it.
2. **Temperature check.** Factual sections should be flat and direct. Emotional sections earn their heat. Not everything at the same register.
3. **Decoration count.** Max one adjective per noun. Max one simile per paragraph. Zero simile stacking per sentence.
4. **Pattern scan.** Check every pattern from Section 2 above. Rewrite all violations as direct statements.
5. **Triplet sweep.** Count groups of three. Max 2 per article.
6. **Vocabulary blacklist.** Zero tolerance for every word in Section 2.

### Pass 3: Conversational Voice (human-pro)

- Contract all eligible forms by default ("it's" not "it is" unless emphasizing).
- 2 to 4 reader questions per article: setup, challenge, redirect, or rhetorical gut-check.
- Vary sentence rhythm. Mix 3-word punches with 40-word runs. Fragments are intentional tools.
- Use "you/your" direct address. "Families often find..." becomes "You'll probably find..."
- Informal transitions: "And" not "Furthermore"; "But" not "However"; "Here's the thing:" not "It is worth noting that."
- Kill formal filler: "It is important to understand that...", "Research suggests that...", "It should be emphasized that...", "As previously mentioned...", "With regard to..."
- Add 2 to 3 parenthetical asides per article (caveats, acknowledgments, shortcuts, dry observations).
- Do NOT touch: named characters' stories/dialogue, data/statistics, Sources section, disclaimer, copyright, `<img>` tags.

---

## 4. Article HTML Structure

Every article body follows this exact order:

```html
<!-- 1. Starting illustration (first element, before any text) -->
<img src="{starting_illustration_cdn_url}" alt="Starting Illustration"
     style="width:100%;max-width:2400px;height:auto;border-radius:12px;margin-bottom:24px">

<!-- 2. First half of article body -->
<h2>...</h2>
<p>...</p>
...

<!-- 3. Midpoint illustration (before the middle section heading) -->
<img src="{midpoint_illustration_cdn_url}" alt="Midpoint Illustration"
     style="width:100%;max-width:2400px;height:auto;border-radius:12px;margin:32px 0">

<!-- 4. Second half of article body -->
<h2>...</h2>
<p>...</p>
...

<!-- 5. Sources section -->
<h2>Sources</h2>
<ol>
  <li><a href="..." target="_blank">Author/Org. "Title." Publication, Year.</a></li>
  ...
</ol>

<!-- 6. Disclaimer -->
<em>This content is for educational and informational purposes only. It is not a substitute for professional medical, legal, or financial advice. Always consult qualified healthcare providers, attorneys, or financial advisors for guidance specific to your situation. Statistics and policy details cited were accurate at the time of publication and may have changed.</em>

<!-- 7. Copyright (always last) -->
<p style="font-size:0.8rem;color:#6A8799;margin-top:1rem;">&copy; 2026 Aging Parent Care. All rights reserved. No portion of this article may be reproduced, distributed, or used in any form without the explicit written permission of Aging Parent Care.</p>
```

**Card/thumbnail image** (`image` field in the API): always the starting illustration URL.

---

## 5. Illustrations

### Requirements

- **Two per article, mandatory.** Starting + Midpoint.
- **Starting**: emotional opening, the weight of the problem, the human moment before information.
- **Midpoint**: shift toward agency, clarity, connection, or quiet resolve. Complementary to the starting scene (same palette, different emotional register and composition). Never duplicate the starting scene.

### Style

- **Artist model**: Tomi Um
- **Medium**: Hand-drawn warm sienna and sepia ink linework, painterly watercolor washes on warm cream paper
- **Palette** (locked May 2026): Soft honey, warm amber, sage green, cream highlights, gentle natural tones
- **Deprecated palette** (do not use): Oxford navy, dark-navy, aged brass

### Style line (append to every prompt)

> Hand-drawn warm sienna and sepia ink linework, painterly watercolor washes on warm cream paper. Soft honey, warm amber, and sage green palette with cream highlights, gentle natural tones. No visible text, no lettering, no legible words anywhere in the image.

### Negative prompt (always include)

> no text, no watermark, no logos, no lettering, no writing, no words, no readable text, no photographic realism, no flat vector clip-art, no 3D render, no plastic skin, no oversaturated colors, no distinct facial features

### Figure rules

- No distinct facial features. Approved poses: seen from behind, high-angle/overhead, silhouetted, hands-only, three-quarter turned away.
- Include sibling pairs in roughly 1 of every 6 illustrations.

### Text prevention

No readable text surfaces. Use closed folders, sealed envelopes, face-down papers, screen-off phones, folded letters. Run the 3-step validation gate before submitting any prompt:

1. **Text-surface scan**: every noun that could display text must be described as closed/sealed/face-down/folded/seen-from-behind.
2. **Banned-phrase check**: against the full list in `memory/illustration_prompt_rules.md`.
3. **Caption check**: no embedded text, titles, captions, or dialogue implied.

### Technical specs

- Generator: NanoBanana Pro
- Aspect ratios: 16:9, 4:3, 1:1, 3:4, 9:16 only. Never quote pixel dimensions.
- Quality: 4x
- File naming: `BA-{number}_{slug}_{starting|midpoint}.png`

### Signature watermark

Every illustration gets the calligraphic "APC" signature composited at the bottom-right corner before upload:
- Signature size: 10% of illustration width
- Padding from edge: 1.5% of illustration width
- Source file: `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\brand\APC Signature Transparent.png`

### CDN upload (Selldone Dashboard API)

Upload via Chrome browser context on a `selldone.com` dashboard page (session cookies + XSRF token required):

```javascript
// 1. Read signed image as blob (from local file or fetch from disk)
const resp = await fetch('file:///path/to/signed-image.png');
const blob = await resp.blob();

// 2. Compress if over 1MB (blog upload limit)
// Use canvas compression helper from api-quirks.md if needed

// 3. Upload to Selldone blog CDN
const xsrf = document.cookie.match(/XSRF-TOKEN=([^;]+)/)[1];
const formData = new FormData();
formData.append('photo', blob, 'filename.jpeg');
const result = await fetch('/api/shops/14492/blogs/upload', {
  method: 'POST',
  headers: { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) },
  body: formData
});
const data = await result.json();
// data contains the Selldone CDN URL for the uploaded image
```

**Format**: JPEG only, under ~1MB. Convert PNG to JPEG via canvas before upload.
**Do NOT use**: Higgsfield MCP, fal.ai, or any external CDN. All article images go through Selldone.

---

## 6. Citations and Disclaimer

### Citation rules

- Every data claim (statistic, dollar amount, percentage, study finding, policy detail) requires a numbered, linked citation.
- "A study found..." is not acceptable without identifying the study, journal, and year.
- If a source cannot be verified, remove or rephrase the claim. No unverified data.
- Include inline links in article text where natural. The Sources `<ol>` at the end collects all citations.
- Dollar amounts must include the year they apply to.

### 4-Round revision process

1. **Data accuracy**: Verify every stat, dollar figure, and policy claim. Remove anything unverifiable. Check that dollar amounts include the year.
2. **Citations**: Add Sources section with working URLs. Add inline links to relevant paragraphs.
3. **AI language and voice scrub**: Run banned word list. Check rhythm. Remove hedging and filler. Verify no em dashes. Confirm Gawande/Didion register.
4. **Final read**: Full top-to-bottom read. Verify Sources matches all inline claims. Verify HTML structure order (Section 4 above).

---

## 7. Categories

Every article must be assigned to exactly one category.

| Category | ID | Use for |
|---|---|---|
| Financial | 7921 | Medicare, Medicaid, insurance, costs, budgets, paying for care |
| Legal | 7922 | Regulations, policy changes, prior authorization, eligibility rules, rights |
| Housing | 7923 | Assisted living, nursing homes, home care, when to move |
| Medical | 7924 | Dementia, diagnoses, medications, clinical conditions, burnout symptoms |
| Family | 7925 | Sibling dynamics, family conflict, difficult conversations between relatives |
| Emotional Health | 7926 | Grief, guilt, burnout (emotional), anticipatory loss, caregiver identity |
| Getting Started | 7927 | First steps, care team building, orientation, the "I just became a caregiver" articles |

**Category can only be set via Dashboard API** (session cookies + XSRF token). XAPI ignores the `category` field. See Section 8.

---

## 8. Publishing (API Rules)

### Authentication

```
Bearer token: from ~/.claude/settings.json > mcpServers.selldone.env.SELLDONE_API_TOKEN
Always include: -H "Accept: application/json" (XAPI returns HTML without it)
```

### Constants

- Shop ID: `14492`
- Shop name: `apc-nprUqKnD`
- XAPI: `https://xapi.selldone.com`
- Dashboard API: `https://selldone.com/api` (session cookies + XSRF token required)

### Critical bugs

1. **No in-place update.** Both XAPI and Dashboard API create a NEW article when `id` is included. There is no working update endpoint on either API.
2. **XAPI ignores categories.** The `category` field is silently dropped.
3. **Missing fields get nulled.** Any field not in the payload is set to null. Always include ALL fields.

### Create a new article (correct pattern)

Use the Dashboard API (for category support):

```
POST selldone.com/api/article/shop-blog/edit
```

Payload (no `id` field):
```json
{
  "title": "...",
  "body": "full HTML",
  "image": "starting illustration CDN URL",
  "shop_id": 14492,
  "published": true,
  "private": false,
  "lang": "en",
  "tags": [],
  "category": 7926
}
```

If Dashboard API is unavailable (no browser session), use XAPI for create, then set category later via Dashboard API.

### Update an existing article (correct pattern)

1. GET full article via XAPI: `GET /shops/@apc-nprUqKnD/blogs/{parent_id}`
2. DELETE via Dashboard API: `DELETE /api/article/shop-blog/{article_id}`
3. CREATE via Dashboard API (without `id`): `POST /api/article/shop-blog/edit` with all fields including `category`

### Delete an article

`DELETE /api/article/shop-blog/{article_id}` (uses article `id`, NOT `parent_id`)

### URL format

`/blog/{slug}-{parent_id}`

---

## 9. Notion Sync

Every article published to Selldone must also exist in the Notion Blog Articles database.

- Database: `collection://5f63d4f0-61ba-4532-8c49-5e1979fca28f`
- Default view: `view://f2db6607-a3b8-4d9b-b282-de51c4f4ceb6`

### Properties to set

| Property | Value |
|---|---|
| Title | Article title |
| Article ID | BA-{n} (auto-increment) |
| Status | Published |
| Theme | Category name (Financial, Legal, etc.) |
| Date Created | ISO-8601 date |
| Word Count | Body word count |
| SEO Keywords | Comma-separated |
| Trend Source | Source URLs/descriptions |

### Page cover

Set to the starting illustration CDN URL via `notion-update-page`.

---

## 10. Registration Gate and Email Funnel

Every article on agingparent.care is gated behind an email registration wall. Articles are free, but readers must register to read past the first 3 paragraphs.

### How it works

- Custom article reader at `/pages/Read#articleId` shows 3 teaser paragraphs, then blurs the rest
- Registration card appears: "Get the Aging Parent Caregiving Starter Kit"
- Reader enters email, which POSTs to Kit form endpoint
- localStorage flag is set, article unlocks with animation
- BookFunnel delivers the Starter Kit via Kit's welcome email

### Integration points

| System | Role |
|--------|------|
| Selldone | Stores articles, serves the custom pages |
| Kit | Captures emails, runs welcome sequence, nurture campaigns |
| BookFunnel | Hosts and delivers the Starter Kit (ebooks, audiobooks) |

### Config values (in article_reader_code.html)

- `KIT_FORM_ACTION`: Kit form submission URL (public, no API key)
- `BOOKFUNNEL_URL`: BookFunnel Starter Kit landing page URL
- `REG_KEY`: `apc_registered` (localStorage key)
- `TEASER_PARAGRAPHS`: 3 (number of visible paragraphs before gate)

### SEO strategy

- Native `/blog/` URLs remain ungated for Google crawling and indexing
- On-site navigation routes through the gated custom reader
- All internal links (homepage, articles page, related articles) point to `/pages/Read#articleId`

### Pages and push scripts

| Page | Selldone ID | Push script |
|------|-------------|-------------|
| Articles listing | 27877 | `push-articles-page.py` |
| Article reader (with gate) | 28097 | `push-reader-page.py` |

---

## 11. Publishing Workflow and Approval Process

### Relationship to the Daily Content Routine

**One daily routine, one time (`apc-content`, 6 AM ET).** It runs the whole loop in a single pass: FIRST it publishes any Draft whose two images are already in the drop folder (the continuation, Steps 3-11), THEN it researches + drafts the next 5 (Steps 1-2) and pings Kevin. The image handoff is carried across days by Notion `Status` (`Draft` → `Needs Images` → `Published`) plus the drop folder — not by a second scheduled task. Kevin's only manual step is generating the images. (Topic selection in Step 1 must pass the Novelty & Range Gate in `references/coverage-and-novelty-system.md`.)

**Notion is the canonical source of truth for all article content.** Every article lives in the Blog Articles database first. Selldone receives a copy at publish time. If content needs updating, update Notion first, then sync to Selldone.

### End-to-end flow

```
Step 1: [6 PM Routine] Research (Reddit, Trends, news) → Notion research page
Step 2: [6 PM Routine] Draft 5 articles in Notion (with illustration prompts, citations, disclaimer, copyright) → Status: "Draft"
Step 3: Claude extracts illustration prompts from Notion drafts
Step 4: Claude notifies Kevin via Telegram with prompts and filenames
Step 5: Kevin generates images in NanoBanano Pro, drops in NEW ARTICLE IMAGES folder
Step 6: Kevin signals "ready" via Telegram
Step 7: Claude moves images from NEW folder to main Images folder, watermarks, uploads to Selldone CDN
Step 8: Claude publishes articles to Selldone blog (Dashboard API with category field)
Step 9: Claude runs pre-publish validation checklist
Step 10: Claude updates Notion status to "Published", adds Selldone article ID and live URL
Step 11: Claude confirms publication via Telegram with live URLs
```

### Step 4: Telegram notification format

Claude sends to Kevin via @AMVCreator_Bot:

```
APC Articles Ready for Illustrations

{N} articles need illustrations. Prompts below:

Article: "{title}"
Category: {category}

Starting illustration:
{filename}
{prompt + negative prompt}
Settings: NanoBanana Pro, 16:9, 4x quality

Midpoint illustration:
{filename}
{prompt + negative prompt}
Settings: NanoBanana Pro, 16:9, 4x quality

---
(repeat for each article)

Drop completed images to:
H:\My Drive\...\ARTICLES\Article_Images\NEW ARTICLE IMAGES\

Signal "ready" when done.
```

### Step 5: Kevin's image generation process

1. Open NanoBanana Pro
2. Select Google Flow as the model
3. Copy the prompt from Telegram (prompt + negative prompt are in one block)
4. Set aspect ratio and 4x quality as specified
5. Generate, review for quality (no text artifacts, correct composition, right palette)
6. Download the image
7. Rename to the exact filename provided (e.g., `BA-51_medicaid-cliff_starting.png`)
8. Save to the NEW ARTICLE IMAGES drop folder (see below)
9. Repeat for all illustrations
10. Signal via Telegram: "Images ready" (or reply to the original notification)

### Image folders

**Drop folder** (Kevin saves new images here):
```
H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\ARTICLES\Article_Images\NEW ARTICLE IMAGES\
```

**Main folder** (Claude moves processed images here after watermarking):
```
H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\Website and Store\Images\Blog\
```

**Workflow**: Kevin drops raw images in NEW ARTICLE IMAGES. Claude picks them up, applies the APC signature watermark, converts to JPEG, moves the processed files to the main Images/Blog folder, then uploads to Selldone CDN.

### Handoff files (written by the 6 PM routine, read by the 10 AM check)

The single daily content routine writes two files to the NEW ARTICLE IMAGES folder after drafting articles:

1. **PENDING_ILLUSTRATIONS.md**: Human-readable list of all needed illustrations with filenames, prompts, and Notion page IDs. Kevin uses this to generate images in NanoBanana Pro.
2. **STATUS.json**: Machine-readable state file tracking the handoff status (`WAITING_FOR_KEVIN` → `PROCESSING` → `COMPLETED`), expected image count, found image count, article titles, and Notion page IDs.

The NEXT day's run (Phase A, the start of the same single task) reads STATUS.json first: if images are present it watermarks/uploads/publishes them, then proceeds to draft the new batch. No separate task.

### Scheduled tasks

| Task | Schedule | What it does |
|------|----------|--------------|
| `apc-content` | **once daily, 6 AM ET (single run)** | The whole loop in one pass: (1) publish any drafts whose images are now in the drop folder, (2) rebuild inventory + coverage ledger from live, (3) demand research, (4) Novelty & Range Gate → pick 5, (5) write + revise + validate, (6) hand off prompts + Telegram ping. Kevin generates images whenever; the next day's run publishes them. |

(Reconciled 2026-06-18: the old split `apc-daily-content` 6 PM + `apc-image-check` 10 AM is retired — one task, one time. Publish-then-write in a single sequence; the image handoff is carried across days by Notion `Status` + the drop folder, not by a second scheduled task.)

### Step 10: Notion sync after publishing

After publishing each article to Selldone, update the Notion Blog Articles database entry:
- Status: "Draft" → "Published"
- Add Selldone article ID to the page properties (if property exists)
- Add live URL: `https://agingparent.care/blog/{parent_id}`
- Set page cover to the starting illustration CDN URL
- Confirm illustration prompts in the page content still match the published images

### Step 11: Publication confirmation

Claude sends via Telegram:

```
APC Articles Published

{N} articles live:

1. "{title}" - {url}
2. "{title}" - {url}
...

All passed validation checklist.
Images watermarked and uploaded to Selldone CDN.
Notion updated (Status: Published, URLs added).
```

---

## 12. Content Gap Analysis (Deduplication)

Before writing any new article, check what already exists. This prevents duplicate or overlapping content.

### Process

1. **Pull existing inventory**: Query the Notion Blog Articles database for all article titles, themes, and SEO keywords.
2. **Build coverage map**: Count articles per category. Mark categories with fewer than 5 articles as UNDERSERVED (prioritize). Mark categories with 15+ as SATURATED (only add if the angle is truly novel).
3. **Deduplicate**: For each proposed angle, compare against existing titles and keywords:
   - **Exact match** (same topic, same angle): SKIP.
   - **Partial overlap** (same topic, different angle or new data): ALLOWED, but must clearly differentiate. Note the existing article.
   - **No overlap**: PROCEED.
4. **Select final articles**: At least 2 must be in underserved categories. No more than 2 in any single category per day.

### The test

"Would a reader who already read the existing article learn something meaningfully new from this one?" If no, skip it.

### Pillar/cluster architecture (added 2026-06-15)

Every article must have a documented pillar parent before it is scheduled. The pillar/cluster taxonomy lives in `daily-content-routine-v2.md` Section H. Pillars are definitive guides targeting head terms; spokes are scenario articles targeting long-tail. Every spoke links up to its pillar; every pillar links down to its spokes. New articles outside the pillar map are not authored without a documented expansion in that day's GAP_ANALYSIS.md.

### Documentation

Record the gap analysis in the daily research page under "## Content Gap Analysis" with a table: Proposed Angle | Existing Coverage | Decision (Write/Skip/Differentiate) | Justification.

---

## 13. Full Publishing Checklist

Run this checklist for every new article. No step is optional.

### Content

- [ ] Article follows Gawande/Didion voice register
- [ ] Pass 1 complete (writing-well: clarity, active verbs, no clutter)
- [ ] Pass 2 complete (human-prose: 6-point scan passes all limits)
- [ ] Pass 3 complete (human-pro: contractions, questions, rhythm, you/your, asides)
- [ ] No em dashes anywhere in the body
- [ ] No banned words (full list, Section 2)
- [ ] No banned patterns exceed their limits (Section 2)

### Structure

- [ ] Starting illustration is the first element in body
- [ ] Midpoint illustration placed before the middle section
- [ ] Both illustrations have APC signature watermark
- [ ] Sources section with numbered, linked citations
- [ ] Every data claim has a corresponding citation
- [ ] Disclaimer present (exact wording, Section 4)
- [ ] Copyright notice is the last element (exact HTML, Section 4)

### Publishing

- [ ] Category assigned (one of the 7 categories, Section 7)
- [ ] Card image field set to starting illustration URL
- [ ] Published via Dashboard API with `category` field (not XAPI)
- [ ] Article renders correctly on agingparent.care/blog
- [ ] Article appears under correct Topic in sidebar

### Notion

- [ ] Page created in Blog Articles database
- [ ] All properties filled (Title, Article ID, Status, Theme, Date, Word Count, SEO Keywords)
- [ ] Page cover set to starting illustration URL
