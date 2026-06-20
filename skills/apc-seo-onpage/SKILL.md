---
name: apc-seo-onpage
author: Kevin Chan (AMVPC)
version: 1.0.0
last_updated: 2026-06-17
description: >
  MANDATORY on-page SEO contract for every agingparent.care page and article.
  ALWAYS apply this whenever creating, editing, renaming, retitling, or
  publishing ANY surface on the site: blog articles, the homepage, category
  hubs, the Articles page, product pages, and standalone pages. Trigger on any
  task that touches a page title, H1, meta description, slug/URL, canonical,
  schema/structured data, internal links, or image alt text; on any "publish",
  "update the page", "rename", "fix SEO", or "why isn't this ranking" request;
  and as the publish gate inside apc-article-ops. This skill encodes the rule
  that APC content is written to be SEARCHED, not just shared: the real keyword
  must live in the title, H1, and slug, sourced from google-keyword-research.
  Pairs with: google-keyword-research (L1 demand), apc-article-ops (publish
  pipeline), apc-homepage (homepage edits).
---

# APC On-Page SEO Contract (always applied)

**Rule:** No APC page or article ships or gets edited without passing this
contract. Great prose that targets no search query is a missed ranking. The
hook can stay punchy, but the page must also say the words people type.

This exists because the live-site audit (2026-06-17) found a structurally
excellent site whose pages were written to be shared, not searched: titles/H1s
were curiosity/stat hooks ("$1 Trillion in Invisible Labor", "78% of
Caregivers...") with no search phrase in the title, H1, or URL; the homepage and
category hubs had generic titles and missing meta descriptions.

## The contract — every page must pass all of these

| # | Element | Pass condition |
|---|---|---|
| 1 | **Title tag** | ≤ 60 chars. **Primary keyword front-loaded** (from google-keyword-research). The keyword phrase appears verbatim. A hook is allowed only *after* the keyword, or via the SEO-title field while the on-page H1 keeps the hook. |
| 2 | **Meta description** | 140-160 chars, contains the primary keyword, names the action/answer the reader gets. **Never empty.** |
| 3 | **H1** | Exactly one. Contains the primary keyword (or an exact long-tail of it). |
| 4 | **URL slug** | Short, lowercase-hyphen, contains the keyword. Don't bury it under narrative words. (Selldone appends the numeric id — that's fine.) |
| 5 | **Canonical** | Self-referencing, https, exact. |
| 6 | **Structured data** | Articles: `BlogPosting` + `BreadcrumbList`. Products: `Product` + `Offer` + `AggregateRating` only — **no stray `BlogPosting` on product pages.** Homepage: `Organization`/`WebSite`. |
| 7 | **Internal links** | ≥ 3 contextual in-body links to related articles or the matching category hub, plus ≥ 1 link into the funnel (Starter Kit / product). Use descriptive anchor text with the target's keyword, never "click here". |
| 8 | **Image alt** | Every content image has descriptive alt text; include the keyword where it reads naturally, never stuffed. |
| 9 | **Redirects** | Any rename/slug change ships a **301** (permanent), never a 302. |
| 10 | **Hub/landing pages** | Homepage, Articles page, and the 8 category hubs each have a keyword-targeted title + a real meta description — not "Articles" / generic / empty. |

## How to apply it (the workflow)

1. **Get the keyword first.** Run `google-keyword-research` (`keyword_backend.py`)
   on the topic. The primary keyword + FAQ wording come from there. Record it in
   the `primary_keyword` / `google_signal` frontmatter.
2. **Write/keep the hook, then make it findable.** Keep the human headline, but
   ensure the keyword is front-loaded in the **title tag**, present in the **H1**,
   and in the **slug**. If the editorial headline can't carry the keyword
   cleanly, set a distinct SEO title tag (keyword-led) while the on-page H1 keeps
   the hook.
3. **Fill meta.** 140-160 char description with keyword + the action delivered.
4. **Link.** Add ≥3 contextual internal links + 1 funnel link before publish.
5. **Verify schema + canonical + alt** match the table above.
6. **On rename:** issue a 301 from the old slug; never leave a 302.
7. **Gate:** an article/page that fails any row is not done. This runs *inside*
   `apc-article-ops` (it's the publish gate) and on every standalone page edit.

## Standing remediation worklist (from the 2026-06-17 audit)

Apply the contract retroactively, highest leverage first. Track status here.

- [ ] **Homepage** — title is brand-only ("Aging Parent Care"), **meta description empty**. Set keyword-led title + meta.
- [ ] **8 category hubs** (`/pages/category-*`) — generic titles, no meta descriptions. Set keyword-led title + meta per category.
- [ ] **Articles page** (`/pages/Articles`) — title "Articles", no meta. Optimize.
- [ ] **22 live blog articles** — retrofit so the primary keyword is in the title tag, H1, and slug. Keep the hook; lead with the keyword. Do in controlled batches with a 301 on any slug change; re-mine each with `keyword_backend.py` first. **Do not mass-rewrite blindly** — each retitle is a deliberate, keyword-sourced change.
- [ ] **Renamed POA article** — currently a **302**; change to **301**.
- [ ] **Product pages** — remove the stray `BlogPosting` schema; keep `Product`/`Offer`/`Review`.

## Hard rules
- Never publish a page with an empty meta description or a keyword-less title.
- Never change a live slug without a 301 from the old URL.
- The keyword is sourced from `google-keyword-research`, not guessed.
- This contract is subordinate to the APC prose rules (writing-well → human-prose
  → human-pro, banned-words list): optimize for search **without** violating voice
  or the "never project feelings onto the reader" rule.
