# Agent Startup Packet

Project: Kevin Sync Console
Path: C:\Users\Kevin Chan\Documents\ClaudeCodex Sync
Generated: 2026-06-20T03:15:28.367Z
Intended agent: all

## First Rule

Read this packet before making substantial changes. Treat .ai-memory as the portable source of project context across Claude, Codex, and Hermes.

## Current Memory Health

- Cognee-style semantic index: 260 chunks, 220 entities
- Graphiti-style temporal graph: 450 relations, 2 episodes
- Source hash: 1dd4394472e9b675d5424a8079a2ff4e68e0441300b4da1044e4cedfd0a586ef

## Important Files

- .ai-memory/CONTEXT_INDEX.json: .ai-memory/CONTEXT_INDEX.json
- .ai-memory/DECISIONS.md: Decisions
- .ai-memory/events/2026-06-19.jsonl: .ai-memory/events/2026-06-19.jsonl
- .ai-memory/events/2026-06-20.jsonl: .ai-memory/events/2026-06-20.jsonl
- .ai-memory/HANDOFF.md: Handoff
- .ai-memory/PROJECT.md: Kevin Sync Console
- .ai-memory/RULES.md: Agent Rules
- .ai-memory/STATUS.md: Status
- .ai-memory/TASKS.md: Tasks
- cloud/supabase-schema.sql: cloud/supabase-schema.sql
- context-spaces/general/.ai-memory/CONTEXT_INDEX.json: context-spaces/general/.ai-memory/CONTEXT_INDEX.json
- context-spaces/general/.ai-memory/DECISIONS.md: Decisions

## Important Entities

- Path (concept, 54 mentions)
- True (concept, 43 mentions)
- None (concept, 40 mentions)
- Codex (concept, 34 mentions)
- Usage (concept, 34 mentions)
- ArgumentParser (concept, 31 mentions)
- JSON (concept, 30 mentions)
- Kevin (concept, 26 mentions)
- Generate (concept, 25 mentions)
- Shopify (concept, 24 mentions)
- Windows (concept, 23 mentions)
- Also (concept, 22 mentions)
- Kevin Chan (concept, 21 mentions)
- HOME (concept, 21 mentions)
- Never (concept, 21 mentions)
- Claude (concept, 20 mentions)
- Features (section, 19 mentions)
- Read (concept, 18 mentions)

## Decisions And Rules Found

- "role": "always-on coordinator",
- "role": "always-on coordinator",
- Capture non-repo work, loose ideas, temporary investigations, cross-project notes, and "Other" sessions that do not yet deserve their own project repo.
- Promotion Rule
- The Color Rule
- The rule is simple:
- Do not switch tools from chat memory. Switch through the workspace folder, semantic startup packet, and handoff.
- Red project warning: do not switch machines until it is fixed.
- Tool Awareness (NEVER FORGET)
- Before doing ANYTHING manually, check this list. If an MCP tool or skill covers it, use it. Never say "I can't do that" without checking here first. Tools are deferred; use `ToolSearch` to load schemas before calling.
- Behavioral Rules (ALWAYS ACTIVE)
- 5. Do not treat chat history as source of truth. Project memory lives in the repo and travels with it.

## Open Tasks Found

- Add current project tasks.
- Add current project tasks.
- Run syntax checks.
- Start server locally.
- Call `/api/summary`.
- Verify dashboard static assets load.
- Register at least the current sync-console folder as a test project if it becomes a Git repo.
- Record any missing external tools in the final status.
- Article follows Gawande/Didion voice register
- Pass 1 complete (writing-well: clarity, active verbs, no clutter)
- Pass 2 complete (human-prose: 6-point scan passes all limits)
- Pass 3 complete (human-pro: contractions, questions, rhythm, you/your, asides)

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

## Agent Instructions

- Claude Code: use this packet when resuming the project after a switch or context reset.
- Codex: use this packet as the starting context when Kevin Sync Console is opened locally.
- Hermes: use this packet for routing, monitoring, and handoff decisions. Do not treat it as a replacement for the repo.
- If the packet is stale or missing, rebuild Semantic Memory from AI Sync Console before starting work.
