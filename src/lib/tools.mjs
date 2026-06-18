import { platform } from "node:os";
import { commandExists, run, runShell } from "./command.mjs";

const TOOL_DEFINITIONS = [
  { id: "git", label: "Git", command: "git", required: true },
  { id: "node", label: "Node.js", command: "node", required: true },
  { id: "npm", label: "npm", command: "npm", required: true },
  { id: "claude", label: "Claude Code", command: "claude", required: false },
  { id: "codex", label: "Codex", command: "codex", required: false },
  { id: "skillshare", label: "Skillshare", command: "skillshare", required: false },
  { id: "aiConfigSync", label: "Claude/Codex Config Sync", command: "ai-config-sync", required: false },
  { id: "memorix", label: "Memorix", command: "memorix", required: false },
  { id: "vercel", label: "Vercel", command: "vercel", required: false },
  { id: "supabase", label: "Supabase", command: "supabase", required: false }
];

export async function getToolStatus() {
  const statuses = [];
  for (const tool of TOOL_DEFINITIONS) {
    const exists = await commandExists(tool.command);
    statuses.push({ ...tool, ...exists, state: exists.exists ? "ok" : tool.required ? "missing-required" : "missing" });
  }
  return statuses;
}

export async function installTool(toolId) {
  const isWindows = platform() === "win32";
  const installers = {
    skillshare: isWindows
      ? "irm https://raw.githubusercontent.com/runkids/skillshare/main/install.ps1 | iex"
      : "curl -fsSL https://raw.githubusercontent.com/runkids/skillshare/main/install.sh | sh",
    aiConfigSync: "npm install -g ai-config-sync-manager",
    memorix: "npm install -g memorix",
    supabase: "npm install -g supabase",
    vercel: "npm install -g vercel"
  };

  if (!installers[toolId]) return { ok: false, message: "No installer configured for this tool." };
  return runShell(installers[toolId], { timeout: 300000 });
}

export async function runToolAction(toolId, action) {
  if (toolId === "skillshare") {
    if (action === "status") return run("skillshare", ["status"], { timeout: 60000 });
    if (action === "sync") return run("skillshare", ["sync"], { timeout: 180000 });
    if (action === "audit") return run("skillshare", ["audit"], { timeout: 180000 });
    if (action === "ui") return run("skillshare", ["ui"], { timeout: 1000 });
  }

  if (toolId === "aiConfigSync") {
    if (action === "status") return run("ai-config-sync", ["status"], { timeout: 60000 });
    if (action === "preview") return run("ai-config-sync", ["sync", "--dry-run"], { timeout: 120000 });
    if (action === "sync") return run("ai-config-sync", ["sync", "--apply"], { timeout: 180000 });
  }

  if (toolId === "memorix") {
    if (action === "doctor") return run("memorix", ["doctor"], { timeout: 60000 });
    if (action === "start") return run("memorix", ["background", "start"], { timeout: 60000 });
    if (action === "stop") return run("memorix", ["background", "stop"], { timeout: 60000 });
  }

  if (toolId === "vercel") {
    if (action === "whoami") return run("vercel", ["whoami"], { timeout: 60000 });
  }

  if (toolId === "supabase") {
    if (action === "version") return run("supabase", ["--version"], { timeout: 60000 });
  }

  return { ok: false, message: `Unsupported action ${action} for ${toolId}` };
}

