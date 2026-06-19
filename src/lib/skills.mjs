import { promises as fs } from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { runToolAction } from "./tools.mjs";

const ROOT = process.cwd();

const SKILL_TARGETS = [
  { id: "claude", label: "Claude Code", path: path.join(homedir(), ".claude", "skills") },
  { id: "codex", label: "Codex", path: path.join(homedir(), ".codex", "skills") },
  { id: "agents", label: "Shared Agents", path: path.join(homedir(), ".agents", "skills") }
];

const EXCLUDED_COPY_DIRS = new Set([
  ".git",
  ".venv",
  "venv",
  "node_modules",
  "__pycache__",
  ".mypy_cache",
  ".pytest_cache"
]);

async function directoryExists(folder) {
  try {
    const stat = await fs.stat(folder);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function listSkillFolders(folder) {
  if (!(await directoryExists(folder))) return [];
  const skillsByName = new Map();

  async function walk(currentFolder, parts = []) {
    const entries = await fs.readdir(currentFolder, { withFileTypes: true });
    if (parts.length && await fileExists(path.join(currentFolder, "SKILL.md"))) {
      const name = parts.join("__");
      skillsByName.set(name, { name, path: currentFolder, hasSkillFile: true });
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || EXCLUDED_COPY_DIRS.has(entry.name)) continue;
      await walk(path.join(currentFolder, entry.name), [...parts, entry.name]);
    }
  }

  await walk(folder);
  return [...skillsByName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function fileExists(file) {
  try {
    const stat = await fs.stat(file);
    return stat.isFile();
  } catch {
    return false;
  }
}

function compareSkills(canonical, targetSkills) {
  const canonicalNames = new Set(canonical.map((skill) => skill.name));
  const targetNames = new Set(targetSkills.map((skill) => skill.name));
  const missing = [...canonicalNames].filter((name) => !targetNames.has(name)).sort();
  const extra = [...targetNames].filter((name) => !canonicalNames.has(name)).sort();
  return { missing, extra };
}

export async function getSkillInventory(machines = []) {
  const canonicalPath = path.join(ROOT, "skills");
  const canonical = await listSkillFolders(canonicalPath);
  const localTargets = [];

  for (const target of SKILL_TARGETS) {
    const skills = await listSkillFolders(target.path);
    const comparison = compareSkills(canonical, skills);
    localTargets.push({
      ...target,
      exists: await directoryExists(target.path),
      count: skills.length,
      validCount: skills.filter((skill) => skill.hasSkillFile).length,
      missingCanonicalCount: comparison.missing.length,
      extraCount: comparison.extra.length,
      missingCanonical: comparison.missing.slice(0, 20),
      extra: comparison.extra.slice(0, 20)
    });
  }

  return {
    canonical: {
      path: canonicalPath,
      count: canonical.length,
      validCount: canonical.filter((skill) => skill.hasSkillFile).length
    },
    machines: machines.map((machine) => ({
      id: machine.id,
      name: machine.name,
      platform: machine.platform,
      status: machine.status,
      targets: machine.canRunActions ? localTargets : SKILL_TARGETS.map((target) => ({
        id: target.id,
        label: target.label,
        exists: false,
        count: null,
        validCount: null,
        missingCanonicalCount: null,
        extraCount: null,
        pending: true
      }))
    }))
  };
}

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && EXCLUDED_COPY_DIRS.has(entry.name)) continue;
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

export async function syncLocalSkills() {
  const canonicalPath = path.join(ROOT, "skills");
  const canonical = await listSkillFolders(canonicalPath);
  const results = [];

  for (const target of SKILL_TARGETS) {
    await fs.mkdir(target.path, { recursive: true });
    let copied = 0;
    for (const skill of canonical) {
      await copyDirectory(skill.path ?? path.join(canonicalPath, skill.name), path.join(target.path, skill.name));
      copied += 1;
    }
    results.push({ target: target.label, copied });
  }

  const skillshareResult = await runToolAction("skillshare", "sync");
  return {
    ok: true,
    copiedFromCanonical: canonical.length,
    targets: results,
    skillshare: {
      ok: skillshareResult.ok,
      message: skillshareResult.ok
        ? (skillshareResult.stdout || "Skillshare sync completed.")
        : "Skillshare is installed but not initialized yet. Local skill copying still completed."
    }
  };
}

export async function importLocalSkillsToCanonical() {
  const canonicalPath = path.join(ROOT, "skills");
  await fs.mkdir(canonicalPath, { recursive: true });
  const imported = [];

  for (const target of SKILL_TARGETS) {
    const skills = await listSkillFolders(target.path);
    for (const skill of skills) {
      const source = skill.path ?? path.join(target.path, skill.name);
      const destination = path.join(canonicalPath, skill.name);
      await copyDirectory(source, destination);
      imported.push({ name: skill.name, from: target.label });
    }
  }

  const uniqueNames = [...new Set(imported.map((item) => item.name))].sort();
  return {
    ok: true,
    importedCount: uniqueNames.length,
    sourceEvents: imported.length,
    skills: uniqueNames.slice(0, 100)
  };
}
