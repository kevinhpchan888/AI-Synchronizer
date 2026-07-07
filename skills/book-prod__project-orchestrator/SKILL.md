---
name: project-orchestrator
description: "Turns one book request into a finished, preflighted deliverable: builds the brief, scaffolds under BookProjects, then runs brand-system, image-integration, activity-generator, interior-layout, cover-design, preflight, and shopify-deliverable in order with resume support. Trigger on any high-level book request that names no specific sub-skill."

---

# Project Orchestrator

## Project folder (Windows)
```
%USERPROFILE%\BookProjects\<slug>\
├── brief.yaml
├── brand\          (resolved tokens copies)
├── manuscript\     (markdown chapters)
├── assets\
│   ├── source\     (Kevin's NanoBanana drops)
│   ├── processed\
│   └── activities\
├── build\          (engine intermediates)
├── out\            (final deliverables)
├── preflight\
└── state.json
```

## Pipeline steps (state.json keys)
1. `brief_validated`
2. `brand_resolved`
3. `assets_processed`
4. `activities_generated`
5. `interior_built`
6. `cover_built`
7. `preflight_passed`
8. `shopify_packaged`

## Resume rule
On invocation, read `state.json` and skip any step whose value is `done` and whose inputs have not changed (mtime check). If any input is newer, re-run that step and all downstream steps.

## Platform dispatch
The orchestrator's `scripts/run.ps1` (Windows) and `scripts/run.sh` (Mac/Linux) wrap the same `scripts/run.py` so the entry-point command is OS-appropriate. On Windows always invoke via PowerShell.

## Sample invocation
> Kevin: "Produce a 60-page kindergarten phonics workbook for LumosRead, 8.5×11, white paper, color interior. Cover art at %USERPROFILE%\Downloads\lumos-phonics-cover.png."

The orchestrator slugs to `lumosread-phonics-2026-05`, writes `brief.yaml`, then runs the 8 pipeline steps, blocking on preflight failure.

## Examples
- "Produce a 90-day fitness journal for LumosRead, 6×9, cream paper."
- "Resume the phonics workbook project; I dropped new cover art."
