import { promises as fs } from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { syncLocalSkills } from "./skills.mjs";

const ROOT = process.cwd();
const PROFILE_DIR = path.join(ROOT, "env", "portable-agent-profile");

const ENV_TARGETS = [
  { label: "Claude global instructions", source: ["claude", "CLAUDE.md"], target: [".claude", "CLAUDE.md"], type: "file" },
  { label: "Claude commands", source: ["claude", "commands"], target: [".claude", "commands"], type: "directory" },
  { label: "Claude hooks", source: ["claude", "hooks"], target: [".claude", "hooks"], type: "directory" },
  { label: "Codex global instructions", source: ["codex", "AGENTS.md"], target: [".codex", "AGENTS.md"], type: "file" },
  { label: "Codex hooks config", source: ["codex", "hooks.json"], target: [".codex", "hooks.json"], type: "file" },
  { label: "Codex hooks", source: ["codex", "hooks"], target: [".codex", "hooks"], type: "directory" },
  { label: "Codex rules", source: ["codex", "rules"], target: [".codex", "rules"], type: "directory" }
];

async function exists(targetPath) {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function copyPath(source, target) {
  const stat = await fs.stat(source);
  if (stat.isDirectory()) {
    await fs.rm(target, { recursive: true, force: true });
    await fs.cp(source, target, { recursive: true });
  } else {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(source, target);
  }
}

async function backupPath(target, backupRoot) {
  if (!(await exists(target))) return null;
  const relative = path.relative(homedir(), target);
  const backupTarget = path.join(backupRoot, relative);
  await fs.mkdir(path.dirname(backupTarget), { recursive: true });
  await fs.cp(target, backupTarget, { recursive: true });
  return backupTarget;
}

export async function syncLocalAgentEnvironment() {
  const backupRoot = path.join(homedir(), ".ai-sync-backups", `agent-env-${timestamp()}`);
  const applied = [];
  const skipped = [];

  for (const item of ENV_TARGETS) {
    const source = path.join(PROFILE_DIR, ...item.source);
    const target = path.join(homedir(), ...item.target);
    if (!(await exists(source))) {
      skipped.push({ label: item.label, reason: "Profile item missing" });
      continue;
    }
    const backup = await backupPath(target, backupRoot);
    await copyPath(source, target);
    applied.push({
      label: item.label,
      target,
      backup
    });
  }

  const skills = await syncLocalSkills();
  return {
    ok: true,
    message: "Claude, Codex, shared instructions, hooks, rules, and skills were synced locally.",
    backupRoot,
    applied,
    skipped,
    skills
  };
}
