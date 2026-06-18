# Kevin Sync Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visual, cross-platform sync console that lets Kevin manage project Git sync, Claude/Codex skill sync, Claude/Codex config drift, Memorix memory health, and cloud readiness without typing terminal commands.

**Architecture:** A dependency-light local Node service serves a browser dashboard and exposes REST endpoints that run safe, logged local actions. GitHub remains the durable source of truth for project files and the sync-console repo; Vercel/Supabase are treated as an optional hosted control plane added after the local companion is reliable.

**Tech Stack:** Node.js 20+, built-in HTTP/fs/child_process modules, vanilla HTML/CSS/JS, Git CLI, optional Skillshare, ai-config-sync-manager, Memorix, Vercel CLI, Supabase CLI.

---

### Task 1: Project Skeleton

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `README.md`
- Create: `registry/projects.json`
- Create: `registry/settings.json`
- Create: `logs/.gitkeep`
- Create: `backups/.gitkeep`
- Create: `skills/.gitkeep`

- [x] Create a dependency-light Node package with `start` and `check` scripts.
- [x] Ignore local secrets, logs, backups, dependencies, and OS cache files.
- [x] Add registry files that are safe to commit and portable across Windows/Mac.

### Task 2: Local API Server

**Files:**
- Create: `src/server.mjs`
- Create: `src/lib/command.mjs`
- Create: `src/lib/registry.mjs`
- Create: `src/lib/tools.mjs`
- Create: `src/lib/git.mjs`
- Create: `src/lib/cloud.mjs`

- [x] Serve static UI files from `public/`.
- [x] Add JSON API helpers with safe error responses.
- [x] Add command execution with timeouts and redacted output handling.
- [x] Add tool detection for Git, Node, Claude, Codex, Skillshare, ai-config-sync, Memorix, Vercel, Supabase.
- [x] Add Git project status detection without modifying repos.
- [x] Add project action endpoints for fetch, pull, push, and WIP commit.
- [x] Add cloud readiness detection without exposing secret values.

### Task 3: Visual Dashboard

**Files:**
- Create: `public/index.html`
- Create: `public/styles.css`
- Create: `public/app.js`

- [x] Show overall status cards: Projects, Skills, Config Sync, Memory, Cloud.
- [x] Show tool health and install/action buttons.
- [x] Show registered projects with green/yellow/red state.
- [x] Add visual buttons for refresh, add project, fetch, pull, push, WIP commit, and tool actions.
- [x] Display progress and logs without requiring terminal use.

### Task 4: Launchers

**Files:**
- Create: `Start-KevinSyncConsole.ps1`
- Create: `start-kevin-sync-console.sh`

- [x] Windows launcher starts the local server and opens the dashboard.
- [x] Mac/Linux launcher starts the local server and opens the dashboard.
- [x] Launchers avoid showing command output unless there is a startup failure.

### Task 5: Verification

**Files:**
- Use: all created files

- [ ] Run syntax checks.
- [ ] Start server locally.
- [ ] Call `/api/summary`.
- [ ] Verify dashboard static assets load.
- [ ] Register at least the current sync-console folder as a test project if it becomes a Git repo.
- [ ] Record any missing external tools in the final status.
