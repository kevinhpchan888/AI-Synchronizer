import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { homedir, hostname, platform } from "node:os";

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
  return projectPath;
}

export async function readProjects() {
  const projects = await readJson(PROJECTS_FILE, []);
  const list = Array.isArray(projects) ? projects : projects && typeof projects === "object" ? [projects] : [];
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
  const projects = await readProjects();
  const projectPath = path.resolve(input.path);
  const existing = projects.find((project) => path.resolve(project.path) === projectPath);
  if (existing) return existing;

  const project = {
    id: randomUUID(),
    name: input.name?.trim() || path.basename(projectPath),
    path: projectPath,
    createdAt: new Date().toISOString()
  };
  projects.push(project);
  await saveProjects(projects);
  return project;
}

export async function removeProject(id) {
  const projects = await readProjects();
  const next = projects.filter((project) => project.id !== id);
  await saveProjects(next);
  return { removed: projects.length !== next.length };
}

export async function readSession() {
  return readJson(SESSION_FILE, {
    activeProjectId: null,
    activeAgent: "claude",
    lastSwitchAt: null,
    lastHandoffAt: null
  });
}

export async function saveSession(session) {
  await writeJson(SESSION_FILE, {
    activeProjectId: session.activeProjectId ?? null,
    activeAgent: session.activeAgent ?? "claude",
    lastSwitchAt: session.lastSwitchAt ?? null,
    lastHandoffAt: session.lastHandoffAt ?? null
  });
}
