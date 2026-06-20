# APC ARTICLE PIPELINE: the one flow (canonical, supersedes scattered runbooks)

A single, predictable path from idea to a live, illustrated, signed article. Three roles, one
status field, one image folder. Fully automatic except the images: Kevin generates them, and
the scheduled publisher ships everything else with no command to run.

## Roles (who does what, fixed)
- **Claude (cloud)** does everything except make the images: research, write to template,
  compelling problem→solution title, SEO title + slug + meta, full sourced body, the 2
  illustration prompts, and the publish-prep. Updates Notion. Sends Kevin ONE ping.
- **Kevin** does ONE thing: generate the images in NanoBanana from the ping and save them in
  the drop folder using the EXACT filenames in the ping. Nothing else. This is the ONLY manual
  step in the engine.
- **The `apc-publish` task** (UNATTENDED, every ~2h on the always-on Mac Mini) ships everything
  ready: the moment both images for an article are in the drop folder, the next run signs them,
  uploads them, creates the post, syncs Notion, and archives the images. Nobody runs a command.

## The status field (Notion `Status` = the single source of truth for stage)
`Draft` → being written. → `Needs Images` → written, prompts sent, waiting on Kevin.
→ `Published` → live (parent_id + URL + cover recorded). That's it. No other states in play.

## Deterministic image names (kills all matching guesswork)
Every article has an Article ID (BA-N) and slug. Its two images are ALWAYS:
- `BA-{N}_{slug}_starting.png`
- `BA-{N}_{slug}_midpoint.png`
Saved into the ONE drop folder:
`H:\My Drive\DIGITAL PRODUCTS\THE AGING PARENT CARE GIVING SYSTEM\ARTICLES\Article_Images\NEW ARTICLE IMAGES`
The ping tells Kevin the exact filename for each prompt, so there is never a "which image goes
where" question.

## The flow, step by step
0. **Run cadence (two automatic tasks, decoupled by the drop folder + `Status`).**
   `apc-content` (6 AM ET, daily) runs the writing leg (steps 1-2): research, Novelty gate, write,
   export manifest, ping. `apc-publish` (every ~2h, UNATTENDED on the always-on Mac) runs the
   shipping leg (step 4): it publishes any ready article whose two images are now in the drop
   folder. A dropped pair goes live within about two hours, no command, no human. Neither task
   waits on the other.
1. **Write (Claude/cloud).** Demand-checked topic that **passes the Novelty & Range Gate**
   (`references/coverage-and-novelty-system.md`: no concept-duplicate, ≥4 Domains, ≥2 frontier
   picks, ≥1 reach, no saturated data-point spine) → article to the template (title, SEO, body,
   2 prompts). Save to Notion, set `Status = Needs Images`. Export a publish manifest + body
   to the repo (`output/<date>/ready/`) so the PC needs no Notion token.
2. **Ping (Claude/cloud).** ONE message to Kevin: per article, the 2 prompts in copy blocks,
   each labeled with its exact target filename, plus the one drop folder. (Canonical warm
   style is baked into the prompts; signature is NOT in the prompt, it is composited later.)
3. **Generate (Kevin).** NanoBanana from the prompts, save with the exact filenames in the drop
   folder. Done.
4. **Publish (automatic, unattended).** The scheduled `apc-publish` task runs
   `python skills/apc-article-ops/scripts/apc_publish.py` every ~2h. For every ready article
   (manifest in `output/**/ready/`) whose two files are present, it: sign (canonical
   `sign_illustrations.py`, 10% APC mark, HARD gate), upload both to the blog CDN (Bearer-token
   multipart), build the body from the manifest (start img at top + as cover, midpoint before the
   middle H2), CREATE the post in its Theme category, sync Notion (`Status = Published` + cover) if
   `NOTION_API_TOKEN` is set, and move the two images to the archive folder. It is idempotent
   (skips slugs already live), skips articles whose images are not in the folder yet and prints a
   "still waiting on: ..." list, and is safe to re-run. The same command works for a manual one-off.

## Theme → Selldone category id
Financial 7921 · Legal 7922 · Housing 7923 · Medical 7924 · Family 7925 · Emotional Health 7926 · Getting Started 7927

## Why only the images stay manual
The old two-machine boundary is gone. The signature asset now ships in the repo (`assets/`) and
composites here with Pillow; the blog CDN accepts a Bearer-token multipart upload from any host
(no browser, no XSRF); and the drop folder is a normal directory the always-on Mac reads natively.
So `apc-publish` runs unattended wherever it is scheduled, and the publish leg needs no human. The
one thing no machine does is invent the illustrations: that stays Kevin's, by choice, as the
visual quality gate. (To go fully hands-off later, point the routine at an image generator; the
choice was deliberately left manual.)

## Activation (one-time, on a Mac/PC session with the scheduled-tasks MCP)
1. Register a scheduled task `apc-publish` running `python skills/apc-article-ops/scripts/apc_publish.py`
   every 2 hours on the always-on Mac Mini.
2. Env it needs: `SELLDONE_API_TOKEN` (already in `~/.claude/settings.json`; the script falls back
   to it). Optional: `NOTION_API_TOKEN` for auto Notion sync, `APC_DROP_DIR` if the drop folder
   path differs on the Mac. The signature asset defaults to the repo `assets/` copy.
3. First run: `... apc_publish.py --dry` to confirm image matching, then let the schedule take over.
