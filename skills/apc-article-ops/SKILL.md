# /apc-article-ops — APC Blog Article Operations

Part of the **three-skill APC system**. Route tasks correctly:

| Task | Skill |
|------|-------|
| Blog articles (this skill) | `apc-article-ops` |
| Homepage edits | `apc-homepage` |
| Everything else (products, orders, emails, discounts, analytics) | `selldone` |

## NON-NEGOTIABLE: The Article Playbook

**Before generating, updating, auditing, or publishing ANY article**, read `~/.claude/skills/apc-article-ops/references/article-playbook.md`. This is the single source of truth for every article operation. It covers voice, banned words, prose pipeline, HTML structure, illustrations, citations, categories, API workflow, Notion sync, and the full publishing checklist. No exceptions. No shortcuts. No skipping sections. Every article, every time.

**Before calling ANY Selldone API**, check `~/.claude/skills/selldone/references/api-quirks.md` for known bugs and workarounds.

**This applies to ALL execution contexts**: manual sessions, daily routines, subagent dispatches, batch operations, and any automated pipeline that touches APC articles. If you are creating or modifying an article and have not read the playbook in this session, stop and read it now.

Operational skill for managing Aging Parent Care blog articles across all three synchronized locations. Covers the full lifecycle: create, update, audit, illustration management, and three-way sync.

## The Three Locations (all must stay in sync)

| Location | What it is | How to access |
|---|---|---|
| **Selldone Blog** | Live published articles on agingparent.care | XAPI: `xapi.selldone.com` |
| **Selldone Articles Page** | CMS page ID 27877, name "Articles" | Dynamic -- pulls from XAPI at runtime. No separate maintenance needed. |
| **Notion Blog Articles DB** | Internal content store | Data source: `collection://5f63d4f0-61ba-4532-8c49-5e1979fca28f` |

**Rule**: Any article change on Selldone is automatically reflected on the Articles Page (it's dynamic). Notion must be updated separately.

## Selldone API Reference

### Authentication
```powershell
$settings = Get-Content "$env:USERPROFILE\.claude\settings.json" -Raw | ConvertFrom-Json
$token = $settings.mcpServers.selldone.env.SELLDONE_API_TOKEN
```
Bearer token, same for both XAPI and ERP. Always include `-H "Accept: application/json"` or the XAPI returns HTML.

### Shop Constants
- Shop ID: `14492`
- Shop name: `apc-nprUqKnD`
- XAPI base: `https://xapi.selldone.com`
- ERP base: `https://api.selldone.com`

### Key Endpoints

| Operation | Method | URL | Notes |
|---|---|---|---|
| List all articles | GET | `/shops/@apc-nprUqKnD/blogs?limit=100&offset=0` | Response key is `articles`, NOT `blogs` |
| Get single article | GET | `/shops/@apc-nprUqKnD/blogs/{parent_id}` | Use `parent_id` from list, NOT article `id` |
| Create article | POST | `/article/shop-blog/edit` | Body: `{title, body, image, shop_id, published, private, lang, tags, category}` |
| Delete article | DELETE | `/article/shop-blog/{article_id}` | Uses article `id`, NOT `parent_id`. Returns 200 on success. |

### CRITICAL BUG: No In-Place Update

**The XAPI edit endpoint with an `id` field ALWAYS creates a NEW article instead of updating.** There is no working update endpoint.

**Workaround for any article update:**
1. GET the full article (body, image, tags, title, category)
2. DELETE the old article by its `id`
3. POST a new article with modified fields

```powershell
# Pattern: delete + recreate
$resp = & curl -s -H "Authorization: Bearer $token" -H "Accept: application/json" `
    "https://xapi.selldone.com/shops/@apc-nprUqKnD/blogs/$parentId"
$d = $resp | ConvertFrom-Json
$art = $d.article

# Modify $art.body / $art.image / $art.title as needed, then:
& curl -s -X DELETE -H "Authorization: Bearer $token" -H "Accept: application/json" `
    "https://xapi.selldone.com/article/shop-blog/$($art.id)"

$payload = @{
    title = $art.title; body = $newBody; image = $art.image
    shop_id = 14492; published = $true; private = $false; lang = "en"
    tags = @($art.tags); category = $categoryId
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "https://xapi.selldone.com/article/shop-blog/edit" `
    -Method POST -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    } -Body $payload
```

### ERP API Notes
- Blog article endpoints DO NOT EXIST on the ERP API (`api.selldone.com/shops/14492/blogs` returns 404)
- ERP is only for CMS pages, products, orders, categories, etc.
- Page fetch works: `GET api.selldone.com/shops/14492/pages/27877`

## Article HTML Structure

Every article body follows this structure:
```html
<img src="{starting_illustration_url}" alt="Starting Illustration"
     style="width:100%;max-width:2400px;height:auto;border-radius:12px;margin-bottom:24px">

[First half of article body -- paragraphs, headings, lists]

<img src="{midpoint_illustration_url}" alt="Midpoint Illustration"
     style="width:100%;max-width:2400px;height:auto;border-radius:12px;margin:32px 0">

[Second half of article body]

<h2>Sources</h2>
<ol>
  <li><a href="..." target="_blank">Citation text</a></li>
  ...
</ol>

<em>This article is for educational purposes only and does not constitute [medical/legal/financial] advice...</em>

<p style="font-size:0.8rem;color:#6A8799;margin-top:1rem;">&copy; 2026 Aging Parent Care. All rights reserved. No portion of this article may be reproduced, distributed, or used in any form without the explicit written permission of Aging Parent Care.</p>
```

**Key rules:**
- Starting illustration: first element in body, before any text
- Midpoint illustration: inserted before the middle section heading (roughly halfway through)
- Card/thumbnail image (`image` field): always the starting illustration URL
- Sources: numbered `<ol>` with linked citations
- Disclaimer: final `<em>` block
- Copyright notice: final element in body, after disclaimer. Always present.

## Article Categories (Selldone category IDs)

| Theme | Category ID | Color |
|---|---|---|
| Financial | 7921 | green |
| Legal | 7922 | blue |
| Housing | 7923 | purple |
| Medical | 7924 | red |
| Family | 7925 | yellow |
| Emotional Health | 7926 | pink |
| Getting Started | 7927 | orange |

## Illustration Pipeline

### SIGNATURE GATE — NON-NEGOTIABLE (before any CDN upload)
Every illustration is signed with the APC signature (bottom-right) by the ONE canonical tool before it touches the CDN. Do not hand-roll this.
- Tool: `scripts/sign_illustrations.py` · Spec: 10% width, 1.5% padding, SouthEast, JPEG q82 · Asset: `…/brand/APC Signature Transparent.png`.
- Sign the drop folder: `python scripts/sign_illustrations.py --in "<NEW ARTICLE IMAGES>" --sig "<APC Signature Transparent.png>" --out <signed>`
- **Gate:** `python scripts/sign_illustrations.py --check <signed>` MUST exit 0 (signed files carry the `APC-SIG-v1` marker). Upload ONLY from the signed folder; never upload a raw/unsigned image.

### CDN Upload (Selldone Dashboard API)

Upload via Chrome browser context on a `selldone.com` dashboard page (session cookies + XSRF token required):

- **Endpoint**: `POST /api/shops/14492/blogs/upload`
- **Field**: multipart form, field name `photo`
- **Format**: JPEG only, under ~1MB. Convert PNG to JPEG via canvas before upload.
- **Auth**: Session cookies + XSRF token (use `javascript_tool` in Chrome on a Selldone dashboard page)
- **Returns**: Selldone CDN URL for the uploaded image

**Do NOT use Higgsfield MCP, fal.ai, or any external CDN.** All article images go through Selldone.

Legacy images may still reference `v3b.fal.media`, `d2ol7oe51mr4n9.cloudfront.net`, or `d8j0ntlcm91z4.cloudfront.net` domains. These should be migrated to Selldone CDN when articles are next updated.

### Illustration Rules
Full rules in `memory/illustration_prompt_rules.md`. Quick reference:
- **Style**: Tomi Um, warm sienna/sepia ink, honey/amber/sage green watercolor on cream paper
- **Palette**: LOCKED May 2026. Old dark-navy/Oxford navy palette is DEPRECATED.
- **Two per article**: Starting (emotional weight/opening) + Midpoint (shift toward agency/connection/resolve)
- **Figures**: No distinct facial features. Seen from behind, silhouetted, hands-only, or turned away.
- **Text-free**: No readable text surfaces. Closed folders, face-down phones, sealed envelopes.
- **Dimensions**: NanoBanana Pro aspect ratios ONLY: 16:9, 4:3, 1:1, 3:4, 9:16. Never quote pixel dimensions. Always 4x quality.
- **Negative prompt**: no text, no watermark, no logos, no lettering, no writing, no words, no readable text, no photographic realism, no flat vector clip-art, no 3D render, no plastic skin, no oversaturated colors, no distinct facial features

### Image File Naming Convention
```
BA-{number}_{slug}_{starting|midpoint}.png
```
Example: `BA-1_78-percent-burnout-98-say-fine_midpoint.png`

## Notion Sync

### Database
- DB URL: `https://www.notion.so/a9cc88409d4d4bdbaf584d50c5d66166`
- Data source: `collection://5f63d4f0-61ba-4532-8c49-5e1979fca28f`
- Default view: `view://f2db6607-a3b8-4d9b-b282-de51c4f4ceb6`

### Schema
| Property | Type | Notes |
|---|---|---|
| Title | title | Article title |
| Article ID | auto_increment | BA-{n} |
| Status | select | Draft, Review, Published, Archived |
| Theme | select | Financial, Legal, Housing, Medical, Family, Emotional Health, Getting Started |
| Date Created | date | ISO-8601 |
| Word Count | number | |
| SEO Keywords | text | Comma-separated |
| Trend Source | text | Source URLs/descriptions |
| Full Article | text | (unused -- body lives in page content) |
| Newsletter Version | text | |
| Website Copy Version | text | |

### Page Cover
Every Notion article page cover should be set to the **starting illustration URL**:
```
mcp__f20bd4ea...notion-update-page(
    page_id: "{notion_page_id}",
    command: "update_properties",
    cover: "{starting_illustration_cdn_url}",
    properties: {},
    content_updates: [],
    position: {"type": "end"}
)
```

### Searching Notion
Use `notion-search` with `data_source_url: "collection://5f63d4f0-61ba-4532-8c49-5e1979fca28f"` to search within the database. Use `notion-query-database-view` with the default view URL for full listing.

## Human-Prose Quality Gate (MANDATORY)

Every article — new or updated — MUST pass the human-prose audit before publishing. This is not optional. The gate catches the specific patterns that make AI-generated text recognizable to agents, editors, and readers.

### The 6-Point Scan (run on every article body before POST)

1. **Metaphor audit.** Read every metaphor. Can you explain the literal comparison in one plain sentence? If not, cut or replace it.
2. **Temperature check.** Does the article have tonal variation? Not every section should hum at the same "warm concern" register. Factual sections should be flat and direct. Emotional sections should earn their heat.
3. **Decoration count.** No more than one adjective per noun. No more than one simile per paragraph. No simile stacking in a single sentence.
4. **Pattern scan — the #1 priority.** Search the body for these LLM rhetorical constructions:
   - "is not X. It is Y" / "isn't X. It's Y" / "was not X. It was Y" — **max 1 per article**
   - "not X, not Y, but Z" — **max 0 per article**
   - "She didn't just X — she Y'd" — **max 0 per article**
   - "And yet" — **max 0 per article**
   - "There was something about" — **max 0 per article**
   - Rewrite violations as direct statements. "It is not a risk factor. It is a near-certainty." → "It is a near-certainty."
5. **Triplet sweep.** Count groups of three (adjective triplets, parallel sentence triplets, three-item lists with identical structure). **Max 2 triplets per article.** Break extras into pairs or singles.
6. **Vocabulary blacklist.** Zero tolerance for: tapestry (metaphorical), delve/delved, crucible, echoed through, fractured (emotional), whispered promises, dance of, symphony of, shattered (emotional), resonated, navigating (emotional), uncharted, journey (personal growth), landscape (emotional), "a weight she couldn't name", "something shifted."

### Enforcement

- **New articles**: Run the 6-point scan on the finished HTML body BEFORE the POST to Selldone. Fix all violations first.
- **Updated articles**: Same scan on the modified body before delete+recreate.
- **Batch audits**: When auditing existing articles, scan for Tell 4 ("not X, it's Y" patterns) and Tell 6 (triplets) first — these are the most common issues across the current 50-article set.
- **Routine/scheduled runs**: Any automated article creation pipeline MUST load the `human-prose` skill and apply its full self-check before publishing. The `creative-storytelling` and `writing-well` skills should also be loaded for structure and clarity.

### Quick Regex Check (PowerShell)
```powershell
# Count "not X, it's Y" patterns in article body
$notXitsY = ([regex]::Matches($body, '(?i)(is not|isn.t|was not|wasn.t|are not|aren.t|does not|doesn.t|did not|didn.t|not a |not about|not the |not really|not just)[^.!?]{3,60}\.\s*(It is|It was|It.s|They are|That is|This is)')).Count
# Count triplet adjective patterns
$triplets = ([regex]::Matches($body, '(?i)\b\w+,\s+\w+,\s+(and\s+)?\w+[.\s]')).Count
# Flag if over limits
if ($notXitsY -gt 1 -or $triplets -gt 2) { Write-Warning "HUMAN-PROSE GATE FAILED: $notXitsY not-X-its-Y patterns, $triplets triplets" }
```

## Common Workflows

### Create a New Article
**Follow the full playbook** (`references/article-playbook.md`). The condensed steps:
1. Write article content following playbook Section 1 (Voice and Tone)
2. **Three-skill prose pipeline (MANDATORY, in order, playbook Section 3):**
   a. **writing-well pass**: Clarity, economy, active verbs, cut clutter (Zinsser)
   b. **human-prose pass**: Scan for 6 AI tells + vocabulary blacklist. Fix all violations. Max 1 "not X, it's Y", max 2 triplets, zero blacklist words.
   c. **human-pro pass**: Make it conversational. Contractions, direct questions (2-4 per article), varied sentence rhythm, "you/your" direct address, informal transitions, parenthetical asides, cut formal phrasing. Must sound like a person talking, not a textbook.
3. Scan against banned words list (playbook Section 2). Zero tolerance.
4. Generate 2 illustration prompts following playbook Section 5
5. Generate images, sign with APC watermark, upload to Selldone CDN via Dashboard API
6. Build HTML body per playbook Section 4 (exact element order: starting img, body, midpoint img, body, Sources, Disclaimer, Copyright)
7. **Final three-skill scan** on the complete HTML body before POST. No article publishes without passing all three.
8. POST to Selldone via Dashboard API with `category` field (playbook Section 8). NOT XAPI for category support.
9. Create Notion page in Blog Articles DB (playbook Section 9)
10. Set Notion page cover to starting illustration URL
11. Run playbook Section 10 checklist. Every checkbox must pass.

### Update an Existing Article
1. GET full article from XAPI by parent_id
2. Modify body/title/image as needed
3. **Run three-skill prose pipeline** (writing-well, human-prose, human-pro) on modified body before pushing
4. DELETE old article by article `id`
5. POST new article with all fields
6. Update corresponding Notion page if needed

### Full Audit
```powershell
# 1. Get Selldone count + image status
$resp = curl ... "https://xapi.selldone.com/shops/@apc-nprUqKnD/blogs?limit=100&offset=0"
# Check: total count, every article has image field, body has 2 <img> tags

# 2. Get Notion count
# Use notion-query-database-view with default view, page_size=100

# 3. Cross-check titles (normalize: replace '' with ', trim whitespace)
# Flag any title in one location but not the other
```

### Article Approval Workflow (New Articles)
New articles go through an approval gate before publishing:

1. **Daily routine** creates article in Notion (`Status = Draft`) with illustration prompts + filenames in fenced code blocks (copy-button ready)
2. **Kevin generates images** using the prompts, drops them in:
   `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\ARTICLES\Article_Images\NEW ARTICLE IMAGES`
3. **Kevin signals** "images are ready" (or sets Notion Status to `Review`)
4. **Claude picks up**: reads images from the folder, composites APC signature watermark (ImageMagick), converts to JPEG, uploads to Selldone CDN via Dashboard API, builds HTML body per playbook Section 4, runs final three-skill scan, publishes via Dashboard API with category, updates Notion (cover, Selldone Parent ID, Status = Published)
5. **Claude moves images** from `NEW ARTICLE IMAGES` to the parent `Article_Images` folder after successful publish (keeps the drop zone clean)

**Paths**:
- Drop zone: `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\ARTICLES\Article_Images\NEW ARTICLE IMAGES`
- Archive: `H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\ARTICLES\Article_Images\`
- File naming: `BA-{n}_{slug}_{starting|midpoint}.png` (matches playbook Section 5)

### Replace an Illustration
1. Upload new image to CDN
2. GET article body, regex-replace the old `src="..."` with new CDN URL
3. If replacing starting illustration, also update the `image` field (card/thumbnail)
4. Delete + recreate article on Selldone
5. Update Notion page cover if starting illustration changed

## Selldone Blog URL Format

Correct article URL: `/blog/{slug}-{parent_id}`
Example: `/blog/78-of-caregivers-are-burned-out-98-say-theyre-fine-27458`

- `slug` from the XAPI does NOT include the parent_id (e.g., `78-of-caregivers-are-burned-out-98-say-theyre-fine`)
- `parent_id` is a numeric ID (e.g., `27458`)
- The full URL is constructed as: `slug + '-' + parent_id`

## Custom Articles Page (CMS Page 27877)

The Articles page at `/pages/Articles` is a CMS page containing an XCode component with ~39KB of custom HTML/CSS/JS. It dynamically fetches articles from the XAPI and renders them with a featured article hero, category filters, search, and a card grid.

### Key JavaScript function
```javascript
function getArticleUrl(article) {
    const slug = article.slug || article.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    return BLOG_BASE + slug + '-' + (article.parent_id || article.id);
}
```

### CRITICAL: Updating CMS Page Content via API

Selldone stores page `content` as a **JSON object** (not a string). When updating via the ERP PUT API, you MUST:

1. **Send content as a JSON object**, not a stringified JSON
2. **Use Python** for JSON manipulation (PowerShell's `ConvertTo-Json` / `ConvertFrom-Json` pipeline corrupts the content structure)
3. **Always save a backup** of the raw API response before any update

**Working update pattern (Python only):**
```python
import json, urllib.request

# 1. GET the raw response and save as backup
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    raw = resp.read().decode()
with open("backup.json", "w") as f:
    f.write(raw)

# 2. Parse, modify the content OBJECT directly
data = json.loads(raw)
content_obj = data["page"]["content"]  # dict, NOT string
content_obj["sections"][0]["object"]["children"][0]["data"]["code"] = modified_code

# 3. PUT with content as object (not json.dumps(content_obj))
body = json.dumps({
    "title": data["page"]["title"],
    "content": content_obj,   # OBJECT, not string!
    "published": True,
    "name": data["page"]["name"]
}, ensure_ascii=False)
```

**NEVER do any of these (they all corrupt the page and render it blank):**
- PowerShell `Invoke-RestMethod` with `$body | ConvertTo-Json` (double-encodes nested JSON)
- PowerShell `curl -F "content=<file"` (form-data mangles the JSON structure)
- Python with `"content": json.dumps(content_obj)` (wraps object in string)

## PowerShell Gotchas

- `$PID` is a read-only reserved variable -- use `$artParent` or similar
- Dollar signs in double-quoted here-strings (`@"..."@`) get interpolated -- use single-quoted (`@'...'@`) for literal `$` in titles/body, or escape as `` `$ ``
- `curl` exit code 23 on large file uploads is a partial-transfer warning but the upload succeeds (HTTP 200) -- not a real error
- When one parallel PowerShell call fails (non-zero exit), other parallel calls get cancelled -- run sensitive batches separately
- Always use `-H "Accept: application/json"` with XAPI or it returns an HTML error page

## Cross-References

### The Canonical Source (supersedes all scattered files below)
- **`references/article-playbook.md`** — THE single source of truth. Consolidated from all 11 source files below. Voice, banned words, prose pipeline, HTML structure, illustrations, citations, categories, API workflow, Notion sync, publishing checklist. **If this playbook conflicts with any other file, the playbook wins.**

### API Reference (separate because it covers more than articles)
- **`~/.claude/skills/selldone/references/api-quirks.md`** — XAPI edit bug, missing-field-clearing, category field name, body-required rule, image upload, three API layers. **Read before any API call.**

### Legacy Source Files (now consolidated into the playbook; kept for deep-dive reference only)
- `~/.claude/skills/selldone/references/apc-content-rules.md` — Voice/tone summary (subsumed by playbook Sections 1-2)
- `memory/illustration_prompt_rules.md` — Full illustration prompt schema (subsumed by playbook Section 5)
- `memory/content_engine_voice.md` — Voice details (subsumed by playbook Section 1)
- `memory/citations_and_disclaimer.md` — Citation format (subsumed by playbook Section 6)
- `memory/project_notion_content_engine.md` — Notion workspace structure, database IDs, daily routine

### Sibling Skills
- **`selldone`** — Integration hub. 47 MCP tools, three API layers, product/order/email/discount CRUD, page builder model
- **`apc-homepage`** — Homepage edit→push workflow, 12-section map, design system, illustration placement
- **`human-prose`** — Eliminates the 6 AI writing tells (nonsensical metaphors, emotional flatlining, adjective overload, LLM rhetorical patterns, missing grounding, compulsive triplets). Auto-applied to all creative prose. MANDATORY gate for article publishing.
- **`writing-well`** — Zinsser/Strunk & White clarity principles. Auto-applied to all prose.
- **`creative-storytelling`** — Story structure, character, dialogue, viral scriptwriting. Load for narrative-heavy articles.
