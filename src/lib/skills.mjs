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
  "output",
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

async function latestTreeMtime(folder) {
  let latest = 0;

  async function walk(currentFolder) {
    let entries = [];
    try {
      entries = await fs.readdir(currentFolder, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory() && EXCLUDED_COPY_DIRS.has(entry.name)) continue;
      const file = path.join(currentFolder, entry.name);
      let stat = null;
      try {
        stat = await fs.stat(file);
      } catch {
        continue;
      }
      latest = Math.max(latest, stat.mtimeMs);
      if (entry.isDirectory()) await walk(file);
    }
  }

  await walk(folder);
  return latest;
}

async function listSkillFoldersWithMeta(folder, source = {}) {
  const skills = await listSkillFolders(folder);
  return Promise.all(skills.map(async (skill) => ({
    ...skill,
    ...source,
    updatedAtMs: await latestTreeMtime(skill.path)
  })));
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

async function projectSkillSources(projects = []) {
  const sources = [];
  const canonicalSkillsPath = path.resolve(ROOT, "skills").toLowerCase();
  for (const project of projects) {
    if (!project?.path || !project.exists) continue;
    const skillsPath = path.join(project.path, "skills");
    if (path.resolve(skillsPath).toLowerCase() === canonicalSkillsPath) continue;
    if (!(await directoryExists(skillsPath))) continue;
    sources.push({
      id: `project:${project.id}`,
      projectId: project.id,
      projectName: project.name,
      label: `${project.name} skills`,
      path: skillsPath
    });
  }
  return sources.sort((a, b) => a.projectName.localeCompare(b.projectName));
}

async function getSkillSource(projects = []) {
  const canonicalPath = path.join(ROOT, "skills");
  const canonical = await listSkillFoldersWithMeta(canonicalPath, {
    origin: "canonical",
    sourceLabel: "Shared skill source",
    sourcePath: canonicalPath
  });
  const sources = await projectSkillSources(projects);
  const projectSkills = [];
  for (const source of sources) {
    const skills = await listSkillFoldersWithMeta(source.path, {
      origin: "project",
      sourceLabel: source.label,
      sourcePath: source.path,
      projectId: source.projectId,
      projectName: source.projectName
    });
    projectSkills.push(...skills);
  }

  const mergedByName = new Map();
  for (const skill of canonical) mergedByName.set(skill.name, skill);
  for (const skill of projectSkills) {
    const existing = mergedByName.get(skill.name);
    if (!existing || skill.updatedAtMs > existing.updatedAtMs) mergedByName.set(skill.name, skill);
  }
  const merged = [...mergedByName.values()].sort((a, b) => a.name.localeCompare(b.name));
  const canonicalByName = new Map(canonical.map((skill) => [skill.name, skill]));
  const pendingProjectImports = projectSkills
    .filter((skill) => {
      const existing = canonicalByName.get(skill.name);
      return !existing || skill.updatedAtMs > existing.updatedAtMs;
    })
    .map((skill) => ({
      name: skill.name,
      projectName: skill.projectName,
      sourcePath: skill.path
    }));

  return {
    canonicalPath,
    canonical,
    merged,
    projectSources: sources,
    projectSkills,
    pendingProjectImports
  };
}

export async function getSkillInventory(machines = [], projects = []) {
  const source = await getSkillSource(projects);
  const canonical = source.merged;
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
      path: source.canonicalPath,
      count: canonical.length,
      validCount: canonical.filter((skill) => skill.hasSkillFile).length,
      physicalCount: source.canonical.length,
      projectSourceCount: source.projectSources.length,
      projectSkillCount: source.projectSkills.length,
      pendingProjectImportCount: source.pendingProjectImports.length,
      pendingProjectImports: source.pendingProjectImports.slice(0, 30)
    },
    sources: source.projectSources.map((item) => ({
      id: item.id,
      label: item.label,
      projectName: item.projectName,
      path: item.path
    })),
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
  await fs.rm(destination, { recursive: true, force: true });
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

async function importProjectSkillsToCanonical(projects = []) {
  const source = await getSkillSource(projects);
  await fs.mkdir(source.canonicalPath, { recursive: true });
  const canonicalByName = new Map(source.canonical.map((skill) => [skill.name, skill]));
  const imported = [];

  for (const skill of source.projectSkills) {
    const existing = canonicalByName.get(skill.name);
    if (existing && existing.updatedAtMs >= skill.updatedAtMs) continue;
    const destination = path.join(source.canonicalPath, skill.name);
    await copyDirectory(skill.path, destination);
    imported.push({
      name: skill.name,
      from: skill.projectName,
      sourcePath: skill.path,
      destination
    });
  }

  return {
    ok: true,
    importedCount: imported.length,
    imported,
    sourceCount: source.projectSources.length,
    projectSkillCount: source.projectSkills.length
  };
}

export async function syncLocalSkills(projects = []) {
  const projectImport = await importProjectSkillsToCanonical(projects);
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
    projectImport,
    targets: results,
    skillshare: {
      ok: skillshareResult.ok,
      message: skillshareResult.ok
        ? (skillshareResult.stdout || "Skillshare sync completed.")
        : "Skillshare is installed but not initialized yet. Local skill copying still completed."
    }
  };
}

export async function importLocalSkillsToCanonical(projects = []) {
  const canonicalPath = path.join(ROOT, "skills");
  await fs.mkdir(canonicalPath, { recursive: true });
  const projectImport = await importProjectSkillsToCanonical(projects);
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
    importedProjectSkillCount: projectImport.importedCount,
    projectImport,
    sourceEvents: imported.length,
    skills: uniqueNames.slice(0, 100)
  };
}
