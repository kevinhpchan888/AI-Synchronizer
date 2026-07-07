#!/usr/bin/env node
// SessionStart hook: inject the active project's AI Sync memory capsule.
// Fires on startup, clear, and compact so a fresh or compressed session
// recovers project context without relying on instruction-following.
// Works for any folder that carries .ai-memory (repos, adopted
// workspaces, context spaces). Prints nothing outside a project.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

function readStdinJson() {
  try {
    const raw = readFileSync(0, "utf8");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const input = readStdinJson();
let dir = input.cwd || process.cwd();
let capsule = null;

for (let i = 0; i < 12; i++) {
  const candidate = join(dir, ".ai-memory", "semantic", "CONTEXT_CAPSULE.md");
  if (existsSync(candidate)) { capsule = candidate; break; }
  const parent = dirname(dir);
  if (parent === dir) break;
  dir = parent;
}

if (capsule) {
  let text = "";
  try {
    text = readFileSync(capsule, "utf8");
  } catch {
    process.exit(0);
  }
  const MAX = 8000;
  if (text.length > MAX) text = text.slice(0, MAX) + "\n[capsule truncated]";
  process.stdout.write(
    "AI Sync project memory capsule (auto-injected from " + capsule + "). " +
    "Treat this as the project's portable context; read AGENT_STARTUP.md before substantial work.\n\n" + text
  );
}
process.exit(0);
