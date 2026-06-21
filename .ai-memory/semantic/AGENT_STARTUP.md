# Agent Startup Packet

Project: Kevin Sync Console
Path: C:\Users\Kevin Chan\Documents\ClaudeCodex Sync
Generated: 2026-06-21T14:13:18.761Z
Intended agent: all

## First Rule

Read this packet before making substantial changes. Treat .ai-memory as the portable source of project context across Claude, Codex, and Hermes.

## Current Memory Health

- Cognee-style semantic index: 260 chunks, 220 entities
- Graphiti-style temporal graph: 450 relations, 5 episodes
- Source hash: a0013b09d8dd9df7f198dfc4f24c43f311681fb2b74643bd5f4a0fc570aed4bd
- Last indexed project file update: 2026-06-21T14:02:41.875Z
- Last handoff update: 2026-06-19T13:40:30.991Z

## Operating Brief

Project state: dirty
Branch: master
Uncommitted files: 25

Status excerpt: # Status

Current state: active

## Last Known Good State

APC cloned and synchronized on AMVPC, MacBook Pro, and Mac Mini at $HOME/Documents/GitHub/APC. All three are on main at 794f77d with .ai-memory present.

## Current Focus

Keep AI-Synchronizer registry/deployment current so APC appears as a first-class visual project in the console on every machine.

## Blockers

None recorded.

Last updated: 2026-06-19T08:54:40.161Z

Handoff excerpt: # Handoff

## Latest Handoff

Start Work feedback fixed. The button now evaluates the active project only and displays a visible command-feedback strip: ready, pull needed, save WIP needed, push needed, memory needed, handoff needed, diverged history, or failure. Browser click test on local console returned "APC is ready. Continue in Claude or Codex." with ok styling. This prevents the Start Work button from feeling dead when the active project is already clean.

Updated: 2026-06-19T13:45:00.000Z

Task excerpt: # Tasks

## Active

- [ ] Add current project tasks.

## Done

Decision excerpt: # Decisions

Record important project decisions here.

## Changed Since Last Handoff

- README.md: updated 2026-06-21T14:02:41.875Z
- supabase/migrations/20260621140104_kevin_sync_control_plane.sql: updated 2026-06-21T14:01:52.716Z
- supabase/config.toml: updated 2026-06-21T13:59:12.136Z
- package.json: updated 2026-06-21T13:50:57.890Z
- scripts/hermes-worker.mjs: updated 2026-06-21T13:50:41.378Z
- src/lib/hermes-worker-routing.mjs: updated 2026-06-21T13:50:31.753Z
- test/hermes-worker-routing.test.mjs: updated 2026-06-21T13:50:07.995Z
- src/lib/cloud.mjs: updated 2026-06-21T13:43:07.469Z
- src/server.mjs: updated 2026-06-21T13:33:23.377Z
- docs/Kevin-Sync-Console-Training.md: updated 2026-06-21T12:53:43.037Z
- public/app.js: updated 2026-06-21T12:53:05.854Z
- public/index.html: updated 2026-06-21T12:52:06.340Z

## Current Local Changes

- .ai-memory/semantic/AGENT_STARTUP.md
- .ai-memory/semantic/cognee-index.json
- .ai-memory/semantic/graphiti-episodes.jsonl
- .ai-memory/semantic/graphiti-graph.json
- context-spaces/general/.ai-memory/semantic/AGENT_STARTUP.md
- context-spaces/general/.ai-memory/semantic/cognee-index.json
- context-spaces/general/.ai-memory/semantic/graphiti-episodes.jsonl
- context-spaces/general/.ai-memory/semantic/graphiti-graph.json
- .ai-memory/semantic/CONTEXT_CAPSULE.md
- .ai-memory/semantic/context-capsule.json
- context-spaces/general/.ai-memory/semantic/CONTEXT_CAPSULE.md
- context-spaces/general/.ai-memory/semantic/context-capsule.json

## Important Files

- .ai-memory/HANDOFF.md: Handoff
- .ai-memory/STATUS.md: Status
- .ai-memory/RULES.md: Agent Rules
- .ai-memory/TASKS.md: Tasks
- .ai-memory/DECISIONS.md: Decisions
- .ai-memory/CONTEXT_INDEX.json: .ai-memory/CONTEXT_INDEX.json
- .ai-memory/PROJECT.md: Kevin Sync Console
- env/portable-agent-profile/claude/CLAUDE.md: How I Work (Kevin Chan, AMVPC)
- env/portable-agent-profile/codex/AGENTS.md: How I Work (Kevin Chan, AMVPC)
- .ai-memory/events/2026-06-20.jsonl: .ai-memory/events/2026-06-20.jsonl
- .ai-memory/events/2026-06-19.jsonl: .ai-memory/events/2026-06-19.jsonl
- src/server.mjs: src/server.mjs

## Important Entities

- Path (concept, 55 mentions)
- JSON (concept, 41 mentions)
- Codex (concept, 39 mentions)
- True (concept, 39 mentions)
- Claude (concept, 37 mentions)
- Kevin (concept, 30 mentions)
- Generate (concept, 30 mentions)
- None (concept, 29 mentions)
- ArgumentParser (concept, 28 mentions)
- Read (concept, 27 mentions)
- SKILL (concept, 26 mentions)
- Every (concept, 23 mentions)
- Handoff (concept, 22 mentions)
- PROJECT (concept, 22 mentions)
- GitHub (concept, 21 mentions)
- Shopify (concept, 21 mentions)
- Install (concept, 20 mentions)
- Source (concept, 20 mentions)

## Decisions And Rules Found

- "role": "always-on coordinator",
- Tool Awareness (NEVER FORGET)
- Before doing ANYTHING manually, check this list. If an MCP tool or skill covers it, use it. Never say "I can't do that" without checking here first. Tools are deferred; use `ToolSearch` to load schemas before calling.
- Behavioral Rules (ALWAYS ACTIVE)
- 5. Do not treat chat history as source of truth. Project memory lives in the repo and travels with it.
- 2. **No AI patterns.** Never use: "not X, Y" pseudo-profundity, "and yet", "there was something about", "it was as if", "something shifted", compulsive triplets, adjective stacking, emotional flatlining.
- 3. **No em dashes.** Brand rule. Use commas, periods, semicolons, or colons instead.
- AI image/video prompts**: same rule. Code blocks with copy buttons. Always include pixel dimensions.
- Canonical messaging**: product content changes update Notion canonical first, then sync all surfaces. Notion is single source of truth.
- Selldone**: invoke `skill: "selldone"` BEFORE any Selldone API call. The skill has all three API layers, MCP tools, image upload procedures, and quirks. Never rediscover from scratch.
- APC video pipeline**: never use synthetic TTS (edge-tts) for production. Always ElevenLabs Cassidy voice. Save video outputs to `H:\My Drive\...\CAMPAIGN\Reels\`.
- Tool Awareness (NEVER FORGET)

## Open Tasks Found

- Add current project tasks.
- Add current project tasks.
- **Homepage** — title is brand-only ("Aging Parent Care"), **meta description empty**. Set keyword-led title + meta.
- **8 category hubs** (`/pages/category-*`) — generic titles, no meta descriptions. Set keyword-led title + meta per category.
- **Articles page** (`/pages/Articles`) — title "Articles", no meta. Optimize.
- **Renamed POA article** — currently a **302**; change to **301**.
- **Product pages** — remove the stray `BlogPosting` schema; keep `Product`/`Offer`/`Review`.
- All links point to correct destinations (especially `/product/680234`)
- Prices are consistent across all 3 locations
- Images have proper `alt` text
- No broken CSS (check responsive styles)
- No accidental removal of the `<script>` block at the bottom

## API Routes Found

- No API routes indexed yet.

## Packages Found

- No package manifest indexed yet.

## Recent Memory Events

- 2026-06-20T03:15:27.866Z: memory_initialized
- 2026-06-20T03:12:31.764Z: memory_initialized
- 2026-06-19T11:09:02.401Z: agent_switch
- 2026-06-19T11:09:02.366Z: handoff_written
- 2026-06-19T11:09:02.324Z: memory_initialized
- 2026-06-19T10:55:37.393Z: agent_switch
- 2026-06-19T10:55:37.349Z: handoff_written
- 2026-06-19T10:55:37.303Z: memory_initialized

## Search Memory Recipes

- Search Memory: Kevin Sync Console current focus
- Search Memory: open tasks decisions rules
- Search Memory: handoff changed files
- Search Memory: Add current project tasks.
- Search Memory: source of truth rules

## Next Agent Checklist

- Confirm this is the intended local folder before editing: C:\Users\Kevin Chan\Documents\ClaudeCodex Sync
- Read Changed Since Last Handoff and Current Local Changes before touching files.
- Use Search Memory before asking Kevin to repeat project context.
- Update HANDOFF.md through AI Sync before switching tools, machines, or agents.
- Rebuild Semantic Memory after substantial file, decision, task, or skill changes.

## Agent Instructions

- Claude Code: use this packet when resuming the project after a switch or context reset.
- Codex: use this packet as the starting context when Kevin Sync Console is opened locally.
- Hermes: use this packet for routing, monitoring, and handoff decisions. Do not treat it as a replacement for the repo.
- If the packet is stale or missing, rebuild Semantic Memory from AI Sync Console before starting work.
