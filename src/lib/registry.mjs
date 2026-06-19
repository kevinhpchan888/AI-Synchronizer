import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { homedir, hostname, platform } from "node:os";
import { run } from "./command.mjs";

const ROOT = process.cwd();
const REGISTRY_DIR = path.join(ROOT, "registry");
const PROJECTS_FILE = path.join(REGISTRY_DIR, "projects.json");
const SETTINGS_FILE = path.join(REGISTRY_DIR, "settings.json");
const LOCAL_MACHINE_FILE = path.join(REGISTRY_DIR, "local-machine.json");
const SESSION_FILE = path.join(REGISTRY_DIR, "session.json");
const ENV_FILE = path.join(ROOT, ".env.local");

async function readJson(file, fallback) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function readEnvLocal() {
  const values = {};
  try {
    const raw = await fs.readFile(ENV_FILE, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const index = trimmed.indexOf("=");
      values[trimmed.slice(0, index)] = trimmed.slice(index + 1).replace(/^["']|["']$/g, "");
    }
  } catch {
    // Local env is optional.
  }
  return values;
}

function expandProjectPath(projectPath) {
  if (projectPath === "$AI_SYNC_ROOT") return ROOT;
  if (typeof projectPath === "string" && projectPath.startsWith("$AI_SYNC_ROOT/")) {
    return path.join(ROOT, projectPath.slice("$AI_SYNC_ROOT/".length));
  }
  if (projectPath === "$HOME") return homedir();
  if (typeof projectPath === "string" && projectPath.startsWith("$HOME/")) {
    return path.join(homedir(), projectPath.slice("$HOME/".length));
  }
  const projectsHome = getProjectsHome();
  if (projectPath === "$PROJECTS_HOME") return projectsHome;
  if (typeof projectPath === "string" && projectPath.startsWith("$PROJECTS_HOME/")) {
    return path.join(projectsHome, projectPath.slice("$PROJECTS_HOME/".length));
  }
  return projectPath;
}

function getProjectsHome() {
  return process.env.AI_SYNC_PROJECTS_HOME || path.join(homedir(), platform() === "win32" ? "Documents/GitHub" : "GitHub");
}

function collapseProjectPath(projectPath) {
  const resolved = path.resolve(projectPath);
  const root = path.resolve(ROOT);
  const home = path.resolve(homedir());
  const projectsHome = path.resolve(getProjectsHome());

  if (resolved === root) return "$AI_SYNC_ROOT";
  if (resolved.startsWith(`${root}${path.sep}`)) return `$AI_SYNC_ROOT/${path.relative(root, resolved).replaceAll("\\", "/")}`;
  if (resolved === projectsHome) return "$PROJECTS_HOME";
  if (resolved.startsWith(`${projectsHome}${path.sep}`)) return `$PROJECTS_HOME/${path.relative(projectsHome, resolved).replaceAll("\\", "/")}`;
  if (resolved === home) return "$HOME";
  if (resolved.startsWith(`${home}${path.sep}`)) return `$HOME/${path.relative(home, resolved).replaceAll("\\", "/")}`;
  return projectPath;
}

async function readRawProjects() {
  const projects = await readJson(PROJECTS_FILE, []);
  return Array.isArray(projects) ? projects : projects && typeof projects === "object" ? [projects] : [];
}

export async function readProjects() {
  const list = await readRawProjects();
  return list.map((project) => ({
    ...project,
    path: expandProjectPath(project.path)
  }));
}

export async function saveProjects(projects) {
  await writeJson(PROJECTS_FILE, projects);
}

export async function readSettings() {
  return readJson(SETTINGS_FILE, {
    schemaVersion: 1,
    port: 47831,
    safeMode: true,
    skillSource: "skills",
    cloud: { enabled: false, provider: "supabase-vercel" }
  });
}

export async function getLocalMachine() {
  const env = await readEnvLocal();
  let machine = await readJson(LOCAL_MACHINE_FILE, null);
  if (!machine?.id) {
    machine = {
      id: randomUUID(),
      key: env.AI_SYNC_MACHINE_KEY || null,
      name: hostname(),
      platform: platform(),
      createdAt: new Date().toISOString()
    };
    await writeJson(LOCAL_MACHINE_FILE, machine);
  }
  const next = {
    ...machine,
    key: env.AI_SYNC_MACHINE_KEY || machine.key || null,
    name: env.AI_SYNC_MACHINE_NAME || machine.name,
    platform: env.AI_SYNC_MACHINE_PLATFORM || machine.platform,
    role: env.AI_SYNC_MACHINE_ROLE || machine.role || null,
    address: env.TAILSCALE_IP || machine.address || null
  };
  if (JSON.stringify(next) !== JSON.stringify(machine)) await writeJson(LOCAL_MACHINE_FILE, next);
  return next;
}

export async function addProject(input) {
  const rawProjects = await readRawProjects();
  const projects = rawProjects.map((project) => ({ ...project, path: expandProjectPath(project.path) }));
  const projectPath = path.resolve(input.path);
  const existing = projects.find((project) => path.resolve(project.path) === projectPath);
  if (existing) return existing;

  const project = {
    id: randomUUID(),
    name: input.name?.trim() || path.basename(projectPath),
    path: collapseProjectPath(projectPath),
    createdAt: new Date().toISOString()
  };
  rawProjects.push(project);
  await saveProjects(rawProjects);
  return { ...project, path: expandProjectPath(project.path) };
}

export async function removeProject(id) {
  const projects = await readRawProjects();
  const next = projects.filter((project) => project.id !== id);
  await saveProjects(next);
  return { removed: projects.length !== next.length };
}

async function isDirectory(file) {
  try {
    return (await fs.stat(file)).isDirectory();
  } catch {
    return false;
  }
}

async function repoRemote(projectPath) {
  const result = await run("git", ["remote", "get-url", "origin"], { cwd: projectPath, timeout: 10000 });
  if (!result.ok) return null;
  return String(result.stdout || "")
    .trim()
    .replace(/\.git$/i, "")
    .toLowerCase();
}

export async function discoverProjectsHomeRepos() {
  const projectsHome = getProjectsHome();
  await fs.mkdir(projectsHome, { recursive: true });
  const rawProjects = await readRawProjects();
  const expandedProjects = rawProjects.map((project) => ({ ...project, path: expandProjectPath(project.path) }));
  const existingPaths = new Set(expandedProjects.map((project) => path.resolve(project.path).toLowerCase()));
  const existingRemotes = new Set((await Promise.all(expandedProjects.map((project) => repoRemote(project.path)))).filter(Boolean));
  const entries = await fs.readdir(projectsHome, { withFileTypes: true });
  const discovered = [];
  const added = [];
  const skipped = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const repoPath = path.join(projectsHome, entry.name);
    if (!(await isDirectory(path.join(repoPath, ".git")))) continue;
    const remote = await repoRemote(repoPath);
    const collapsedPath = collapseProjectPath(repoPath);
    const repo = {
      id: randomUUID(),
      name: entry.name,
      path: collapsedPath,
      createdAt: new Date().toISOString()
    };
    discovered.push({ ...repo, path: expandProjectPath(collapsedPath), remote });
    if (existingPaths.has(path.resolve(repoPath).toLowerCase())) {
      skipped.push({ ...repo, path: expandProjectPath(collapsedPath), remote, reason: "already tracked path" });
      continue;
    }
    if (remote && existingRemotes.has(remote)) {
      skipped.push({ ...repo, path: expandProjectPath(collapsedPath), remote, reason: "already tracked remote" });
      continue;
    }
    rawProjects.push(repo);
    existingPaths.add(path.resolve(repoPath).toLowerCase());
    if (remote) existingRemotes.add(remote);
    added.push({ ...repo, path: expandProjectPath(collapsedPath), remote });
  }

  if (added.length) await saveProjects(rawProjects);
  return {
    ok: true,
    projectsHome,
    discoveredCount: discovered.length,
    addedCount: added.length,
    skippedCount: skipped.length,
    added,
    skipped,
    discovered
  };
}

export async function readSession() {
  return readJson(SESSION_FILE, {
    activeProjectId: null,
    activeAgent: "claude",
    lastSwitchAt: null,
    lastHandoffAt: null,
    lastProjectSwitchAt: null
  });
}

export async function saveSession(session) {
  await writeJson(SESSION_FILE, {
    activeProjectId: session.activeProjectId ?? null,
    activeAgent: session.activeAgent ?? "claude",
    lastSwitchAt: session.lastSwitchAt ?? null,
    lastHandoffAt: session.lastHandoffAt ?? null,
    lastProjectSwitchAt: session.lastProjectSwitchAt ?? null
  });
}
