# How I Work (Kevin Chan, AMVPC)

## Tool Awareness (NEVER FORGET)

Before doing ANYTHING manually, check this list. If an MCP tool or skill covers it, use it. Never say "I can't do that" without checking here first. Tools are deferred; use `ToolSearch` to load schemas before calling.

### MCP Tool Registry (UUID to Name)
| Prefix | Platform | Use When |
|--------|----------|----------|
| `mcp__cf1e6b0d...` | **Shopify** | Products, collections, orders, discounts, inventory, analytics for APC Shopify store |
| `mcp__f20bd4ea...` | **Notion** | Pages, databases, comments, search, views. APC scripts DB, article tracking, canonical messaging |
| `mcp__a9719f77...` | **Supabase** | SQL queries, migrations, edge functions, branches, project management |
| `mcp__735c6322...` | **Vercel** | Deployments, projects, domains, build logs, runtime logs, toolbar threads |
| `mcp__2e5098c2...` | **Google Calendar** | Create/edit/delete events, list calendars, find free time, RSVP |
| `mcp__15143a06...` | **Google Drive** | Create/read/search/copy files, download content, file metadata/permissions |
| `mcp__d25f2757...` | **MuaPi** | AI image/video generation, Seedance, lip sync, marketing studio, Soul characters |
| `mcp__premiere-pro__` | **Premiere Pro** | Video editing: clips, effects, transitions, export, timeline, markers, sequences |
| `mcp__Claude_in_Chrome__` | **Chrome** | Browser automation: navigate, click, type, read pages, screenshots, JS execution |
| `mcp__Claude_Preview__` | **Codex Preview** | Web app preview: start/stop, screenshots, click, console logs, network |
| `mcp__computer-use__` | **Computer Use** | Desktop automation: screenshots, mouse, keyboard, native app control |
| `mcp__Windows-MCP__` | **Windows MCP** | Windows desktop: apps, clicks, typing, clipboard, screenshots, registry, processes |
| `mcp__pencil__` | **Pencil** | .pen file design editor: batch_design, batch_get, style guides, screenshots |
| `mcp__excalidraw-app-demo__` | **Excalidraw** | Diagrams: create views, export, checkpoints |
| `mcp__Figma__` | **Figma** | Design context, screenshots, variables, code connect maps |
| `mcp__canva__` | **Canva** | Design (requires auth flow) |
| `mcp__cloudflare__` | **Cloudflare** | Workers, DNS, CDN (requires auth flow) |
| `mcp__plugin_gitlab_gitlab__` | **GitLab** | Git repos, MRs, issues (requires auth flow) |
| `mcp__scheduled-tasks__` | **Scheduled Tasks** | Create/list/update cron-based remote agents |
| `mcp__mcp-registry__` | **MCP Registry** | Search for new MCP integrations to install |
| `mcp__ccd_session_mgmt__` | **Session Mgmt** | Archive, list, search past session transcripts |

### Loading Tools
- To load a platform's tools: `ToolSearch` with the UUID prefix or keyword, `max_results: 30`
- Example: `ToolSearch("mcp__f20bd4ea", 30)` loads all Notion tools
- Example: `ToolSearch("premiere-pro", 30)` loads all Premiere Pro tools
- Load in BULK, not one-by-one. One query per platform.

### Tool-First Rules
1. **Notion task?** Use Notion MCP, not manual API calls or web scraping.
2. **Google Drive file?** Use Drive MCP, not PowerShell file operations on mounted drive.
3. **Video generation?** Use MuaPi MCP, not manual API calls.
4. **Calendar?** Use Calendar MCP, not browser automation.
5. **Shopify/APC store?** Use Shopify MCP (and invoke selldone skill first for Selldone API).
6. **Edit video?** Use Premiere Pro MCP if Premiere is open.
7. **Web interaction?** Use Chrome MCP before falling back to computer-use.
8. **Desktop app?** Use computer-use MCP. Request access first.
9. **Diagram?** Use Excalidraw MCP.
10. **Design?** Use Pencil or Figma MCP depending on file type.

---

## Behavioral Rules (ALWAYS ACTIVE)

### Project Memory
1. Before substantial project work, check for `.ai-memory/semantic/AGENT_STARTUP.md` in the active repo and read it first.
2. Treat `.ai-memory/semantic/cognee-index.json` as the local Cognee-style semantic index.
3. Treat `.ai-memory/semantic/graphiti-graph.json` and `.ai-memory/semantic/graphiti-episodes.jsonl` as the local Graphiti-style temporal project graph.
4. If the startup packet or semantic graph is missing or stale, ask AI Sync Console to build semantic memory before switching agents or machines.
5. Do not treat chat history as source of truth. Project memory lives in the repo and travels with it.

### Writing
1. **No AI words.** Never use: journey, navigate, tapestry, delve, crucible, meaningful, resonate, empower, holistic, transformative, seamless, curated, invaluable, heartfelt, impactful, profound, game-changer, deep dive, uncharted, embark, symphony of, dance of, luminous, gossamer, broken hymn.
2. **No AI patterns.** Never use: "not X, Y" pseudo-profundity, "and yet", "there was something about", "it was as if", "something shifted", compulsive triplets, adjective stacking, emotional flatlining.
3. **No em dashes.** Brand rule. Use commas, periods, semicolons, or colons instead.
4. **Never project feelings onto the individual reader.** Do not tell the reader what THEY are feeling, doing, or failing to do right now. The reader brings their own emotions; your job is to give them information. However, acknowledging the general difficulty of caregiving or attributing experiences to the collective is fine.
   - **Banned (projecting onto "you"):** "so you are not spinning" (assumes their state), "makes it less terrifying" (tells them they're terrified), "the conversation you have been putting off" (accuses them of procrastinating), "your worries" (names their emotions), "the weight you carry" (narrates their pain).
   - **Allowed (general truth or attributed to others):** "one of the hardest things most people will ever do" (general acknowledgment), "what most caregivers say is hardest" (attributed to others' experience), "almost no one gets handed instructions for it" (states a fact about the world).
   - **The test:** Is the sentence telling the individual reader what they feel, fear, or have failed to do? Rewrite. Is it stating a general truth about caregiving or attributing to the collective experience? Fine.
   - **Fix pattern:** Replace "you" feeling-claims with what the resource IS or DOES. "A week-by-week action plan." "A framework for starting the conversation."
   - **Scope:** ALL APC content: articles, product descriptions, PDFs, video scripts, CTAs, landing pages, social posts. No exceptions.
5. **Scan before delivering.** All prose gets scanned against rules 1-4 before output.
6. **PostToolUse hook scans every file you write.** If it flags violations, fix immediately.
7. **Prose pipeline for APC content:** writing-well (clarity) then human-prose (remove AI tells) then human-pro (conversational voice). All three, every time.

### Coding
1. **Think before coding.** State assumptions. If uncertain, ASK. Don't silently guess scope, format, or fields.
2. **Simplicity first.** No features beyond what was asked. No abstractions for single-use code. If 200 lines could be 50, rewrite. Three similar lines beat a premature abstraction.
3. **Surgical changes.** Don't refactor adjacent code. Match existing style. Every changed line traces to the user's request.
4. **Goal-driven execution.** Transform tasks into verifiable goals. For bugs, reproduce first. For features, test first.
5. **Superpowers workflow.** Use brainstorm, plan, TDD, systematic debugging, verify before completion. RED-GREEN-REFACTOR.

### Output Delivery
- **Copyable content** (prompts, scripts, dialogue, descriptions, any text the user asks you to write): deliver inline in chat inside a code block so the copy button appears. NEVER create separate .txt files. NEVER use Set-Clipboard. The code block IS the delivery method.
- **AI image/video prompts**: same rule. Code blocks with copy buttons. Always include pixel dimensions.
- **Funnel-first thinking**: every content piece connects to email capture, nurture, conversion. Ask "where does this drive traffic?" before producing content in isolation.
- **Canonical messaging**: product content changes update Notion canonical first, then sync all surfaces. Notion is single source of truth.

### Platform Expertise
- **Selldone**: invoke `skill: "selldone"` BEFORE any Selldone API call. The skill has all three API layers, MCP tools, image upload procedures, and quirks. Never rediscover from scratch.
- **APC video pipeline**: never use synthetic TTS (edge-tts) for production. Always ElevenLabs Cassidy voice. Save video outputs to `H:\My Drive\...\CAMPAIGN\Reels\`.

---

## This Machine (AMVPC)
- Windows 11 GPU PC, Kevin Chan's creative workstation
- Tailscale IP: 100.90.169.6
- Mac Mini (hub): 100.88.103.85

### Services
- ClaudeMaxProxy (:3456): Codex Max subscription proxy (localhost). Restart: `nssm restart ClaudeMaxProxy`
- Hermes Gateway (:18789): AMVCreator agent, @AMVCreator_Bot. Runs via Scheduled Task.
- Model chain: Codex-max/sonnet-4 > Codex-max/haiku-4 > gemini-flash > gemini-pro > openrouter/sonnet > featherless/kimi

### Mac Mini Hub
- 100.88.103.85 runs main Hermes fleet (11 agents)
- MM agents can dispatch work to AMVCreator via Telegram or HTTP
- MM has SSH access to this machine

### PC Behavior
- PC is turned OFF when not in use. Offline is normal.
- All services auto-start on boot (NSSM + Scheduled Task), Windows auto-logon, no sleep.
- AE Pipeline decommissioned 2026-04-20. Templates at C:\AEPipeline\ if needed.

---

## Skills
- **graphify** - any input to knowledge graph. Trigger: `/graphify`
- **selldone** - Selldone e-commerce expert for APC store (agingparent.care). Auto-trigger on any Selldone/APC store mention.
- **ai-video-prompt** - AI video/image prompt builder (Seedance, Gemini Omni, Higgsfield, Artlist, Veo, fal.ai). Trigger on video/image prompt requests.
- **apc-article-ops** - APC blog article operations + three-way sync (Selldone Blog + Articles Page + Notion). Trigger: `/apc-article-ops`
- **creative-storytelling** - Storytelling + viral scriptwriting + APC Honey Hour Stories. Trigger on any script/story/content work.
- **writing-well** - Clarity, simplicity, brevity. Auto-applied to all prose.
- **human-prose** - Eliminates 6 AI writing tells + vocabulary blacklist. MANDATORY on all prose.
- **human-pro** - Conversational warmth (contractions, direct address, varied rhythm). MANDATORY on APC articles.
- **apc-illustrations** - APC Tomi Um editorial illustration prompts. Auto-trigger on any APC illustration request. Delivers filename, prompt, negative prompt in isolated copy-ready blocks.
- **apc-homepage** - Homepage section editing + push to Selldone. Trigger: `/apc-homepage`
