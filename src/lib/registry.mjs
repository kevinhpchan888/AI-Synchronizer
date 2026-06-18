import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { hostname, platform } from "node:os";

const ROOT = process.cwd();
const REGISTRY_DIR = path.join(ROOT, "registry");
const PROJECTS_FILE = path.join(REGISTRY_DIR, "projects.json");
const SETTINGS_FILE = path.join(REGISTRY_DIR, "settings.json");
const LOCAL_MACHINE_FILE = path.join(REGISTRY_DIR, "local-machine.json");

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

export async function readProjects() {
  const projects = await readJson(PROJECTS_FILE, []);
  return Array.isArray(projects) ? projects : [];
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
  let machine = await readJson(LOCAL_MACHINE_FILE, null);
  if (!machine?.id) {
    machine = {
      id: randomUUID(),
      name: hostname(),
      platform: platform(),
      createdAt: new Date().toISOString()
    };
    await writeJson(LOCAL_MACHINE_FILE, machine);
  }
  return machine;
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

