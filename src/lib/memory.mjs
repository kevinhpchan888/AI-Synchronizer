import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { getSemanticMemoryStatus } from "./semantic-memory.mjs";

const MEMORY_DIR = ".ai-memory";
const REQUIRED_FILES = [
  "PROJECT.md",
  "STATUS.md",
  "DECISIONS.md",
  "TASKS.md",
  "HANDOFF.md",
  "RULES.md",
  "CONTEXT_INDEX.json"
];

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function statOrNull(file) {
  try {
    return await fs.stat(file);
  } catch {
    return null;
  }
}

async function writeIfMissing(file, content) {
  if (await exists(file)) return false;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, "utf8");
  return true;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function templateFor(file, project) {
  const now = new Date().toISOString();
  const name = project.name || path.basename(project.path);
  const templates = {
    "PROJECT.md": `# ${name}\n\n## Purpose\n\nDescribe what this project is for.\n\n## Important Paths\n\n- Project root: ${project.path}\n\n## Owners / Agents\n\n- Kevin\n- Claude Code\n- Codex\n- Hermes\n\nLast updated: ${now}\n`,
    "STATUS.md": `# Status\n\nCurrent state: active\n\n## Last Known Good State\n\nNot recorded yet.\n\n## Current Focus\n\nNot recorded yet.\n\n## Blockers\n\nNone recorded.\n\nLast updated: ${now}\n`,
    "DECISIONS.md": `# Decisions\n\nRecord important project decisions here.\n\n`,
    "TASKS.md": `# Tasks\n\n## Active\n\n- [ ] Add current project tasks.\n\n## Done\n\n`,
    "HANDOFF.md": `# Handoff\n\n## Latest Handoff\n\nNo handoff has been written yet.\n\n`,
    "RULES.md": `# Agent Rules\n\n- Read this memory pack before starting substantial work.\n- Update STATUS.md and HANDOFF.md before switching machines, agents, or projects.\n- Record important architectural decisions in DECISIONS.md.\n- Keep this folder committed with the project repo.\n`,
    "CONTEXT_INDEX.json": `${JSON.stringify({
      schemaVersion: 1,
      project: name,
      createdAt: now,
      memoryEngines: {
        cognee: { role: "project knowledge index", rebuildable: true },
        graphiti: { role: "temporal event graph", rebuildable: true },
        hermes: { role: "always-on coordinator", sourceOfTruth: false }
      },
      requiredFiles: REQUIRED_FILES,
      semanticFiles: [
        ".ai-memory/semantic/AGENT_STARTUP.md",
        ".ai-memory/semantic/cognee-index.json",
        ".ai-memory/semantic/graphiti-graph.json",
        ".ai-memory/semantic/graphiti-episodes.jsonl"
      ]
    }, null, 2)}\n`
  };
  return templates[file] ?? "";
}

async function listEventFiles(eventsDir) {
  try {
    const entries = await fs.readdir(eventsDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl"))
      .map((entry) => path.join(eventsDir, entry.name));
  } catch {
    return [];
  }
}

async function hashMemoryPack(memoryPath) {
  const hash = createHash("sha256");
  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(memoryPath, file);
    if (await exists(fullPath)) {
      hash.update(file);
      hash.update(await fs.readFile(fullPath));
    }
  }
  for (const eventFile of await listEventFiles(path.join(memoryPath, "events"))) {
    hash.update(path.basename(eventFile));
    hash.update(await fs.readFile(eventFile));
  }
  return hash.digest("hex");
}

function ageHours(date) {
  if (!date) return null;
  return Math.round((Date.now() - date.getTime()) / 36_000) / 100;
}

async function newestProjectFile(projectPath) {
  let newest = null;
  async function walk(folder) {
    let entries = [];
    try {
      entries = await fs.readdir(folder, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if ([
        ".git",
        MEMORY_DIR,
        "node_modules",
        ".venv",
        "venv",
        "__pycache__",
        "logs",
        "backups",
        "setup-package",
        ".vercel"
      ].includes(entry.name)) continue;
      const fullPath = path.join(folder, entry.name);
      const relativePath = path.relative(projectPath, fullPath).replaceAll("\\", "/");
      if ([".env.local", "registry/local-machine.json", "registry/session.json"].includes(relativePath)) continue;
      const stat = await statOrNull(fullPath);
      if (!stat) continue;
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (!newest || stat.mtime > newest) {
        newest = stat.mtime;
      }
    }
  }
  await walk(projectPath);
  return newest;
}

export async function getProjectMemoryStatus(project) {
  if (!project.exists || (!project.isRepo && !project.isContext)) {
    return {
      projectId: project.id,
      state: "unavailable",
      tone: "neutral",
      message: project.kind === "context" ? "Context space unavailable" : "Project repo unavailable",
      freshness: 0,
      path: null,
      missing: REQUIRED_FILES,
      semantic: {
        state: "unavailable",
        tone: "neutral",
        message: "Semantic memory unavailable",
        chunks: 0,
        entities: 0,
        relations: 0,
        episodes: 0,
        lastBuiltAt: null,
        packetPath: null
      },
      resume: {
        ready: false,
        headline: "Project folder unavailable",
        detail: "Fix the project path before relying on memory.",
        lastBuiltAt: null
      }
    };
  }

  const memoryPath = path.join(project.path, MEMORY_DIR);
  const handoffPath = path.join(memoryPath, "HANDOFF.md");
  const files = [];
  const missing = [];
  let newest = null;
  const handoffStat = await statOrNull(handoffPath);

  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(memoryPath, file);
    const stat = await statOrNull(fullPath);
    if (!stat) {
      missing.push(file);
    } else {
      files.push({ file, updatedAt: stat.mtime.toISOString() });
      if (!newest || stat.mtime > newest) newest = stat.mtime;
    }
  }

  const eventFiles = await listEventFiles(path.join(memoryPath, "events"));
  for (const eventFile of eventFiles) {
    const stat = await statOrNull(eventFile);
    if (stat && (!newest || stat.mtime > newest)) newest = stat.mtime;
  }

  const packExists = await exists(memoryPath);
  const staleHours = ageHours(newest);
  const handoffAge = ageHours(handoffStat?.mtime ?? null);
  const newestProjectUpdate = await newestProjectFile(project.path);
  const handoffBehindWork = project.state !== "synced"
    && Boolean(handoffStat?.mtime && newestProjectUpdate && handoffStat.mtime < newestProjectUpdate);
  let state = "fresh";
  let tone = "ok";
  let message = "Project memory is ready";
  let freshness = 100;

  if (!packExists || missing.length === REQUIRED_FILES.length) {
    state = "missing";
    tone = "bad";
    message = "No project memory pack";
    freshness = 0;
  } else if (missing.length) {
    state = "incomplete";
    tone = "warn";
    message = `${missing.length} memory file${missing.length === 1 ? "" : "s"} missing`;
    freshness = Math.max(25, Math.round(((REQUIRED_FILES.length - missing.length) / REQUIRED_FILES.length) * 100));
  } else if (staleHours !== null && staleHours > 24) {
    state = "stale";
    tone = "warn";
    message = `Memory last updated ${Math.round(staleHours)}h ago`;
    freshness = 70;
  } else if (!handoffStat || handoffBehindWork || (handoffAge !== null && handoffAge > 8)) {
    state = "handoff-needed";
    tone = "warn";
    message = "Handoff recommended before switching tools";
    freshness = 85;
  }

  const semantic = await getSemanticMemoryStatus(project);

  return {
    projectId: project.id,
    projectName: project.name,
    state,
    tone,
    message,
    freshness,
    path: memoryPath,
    missing,
    files,
    eventFiles: eventFiles.length,
    lastUpdated: newest?.toISOString() ?? null,
    handoffUpdatedAt: handoffStat?.mtime?.toISOString() ?? null,
    handoffAgeHours: handoffAge,
    handoffBehindWork,
    packHash: packExists ? await hashMemoryPack(memoryPath) : null,
    semantic,
    resume: resumeVerdict(state, semantic)
  };
}

// One honest answer to "can a fresh agent resume this project from memory?"
// The dashboard shows this verbatim instead of asking the user to interpret
// memory percentages, entity counts, and graph states.
function resumeVerdict(memoryState, semantic) {
  if (memoryState === "missing" || !semantic || ["missing", "unavailable"].includes(semantic.state)) {
    return {
      ready: false,
      headline: "No recovery memory yet",
      detail: "Build semantic memory before switching tools or machines.",
      lastBuiltAt: null
    };
  }
  if (semantic.state === "invalid") {
    return {
      ready: false,
      headline: "Recovery memory is broken",
      detail: "Rebuild semantic memory; the saved index cannot be read.",
      lastBuiltAt: semantic.lastBuiltAt ?? null
    };
  }
  if (semantic.state === "stale") {
    return {
      ready: false,
      headline: "Rebuild memory before switching",
      detail: "Files changed since the last build; a fresh agent would miss recent work.",
      lastBuiltAt: semantic.lastBuiltAt ?? null
    };
  }
  return {
    ready: true,
    headline: "A fresh agent can resume from memory",
    detail: `Capsule and startup packet are current (built ${semantic.lastBuiltAt ? new Date(semantic.lastBuiltAt).toLocaleString() : "recently"}).`,
    lastBuiltAt: semantic.lastBuiltAt ?? null
  };
}

export async function getMemoryInventory(projects) {
  const projectsMemory = await Promise.all(projects.map(getProjectMemoryStatus));
  const missing = projectsMemory.filter((item) => item.state === "missing").length;
  const stale = projectsMemory.filter((item) => ["stale", "incomplete", "handoff-needed"].includes(item.state)).length;
  const fresh = projectsMemory.filter((item) => item.state === "fresh").length;
  const lowestFreshness = projectsMemory.length ? Math.min(...projectsMemory.map((item) => item.freshness)) : 0;
  return {
    rootFolderName: MEMORY_DIR,
    projects: projectsMemory,
    summary: {
      total: projectsMemory.length,
      fresh,
      stale,
      missing,
      lowestFreshness,
      state: missing ? "missing" : stale ? "stale" : projectsMemory.length ? "fresh" : "empty"
    }
  };
}

export async function initializeProjectMemory(project) {
  if (!project?.exists || (!project?.isRepo && !project?.isContext)) {
    return { ok: false, message: "Project or context space must be available first." };
  }
  const memoryPath = path.join(project.path, MEMORY_DIR);
  await fs.mkdir(path.join(memoryPath, "events"), { recursive: true });
  await fs.mkdir(path.join(memoryPath, "sources"), { recursive: true });
  const created = [];
  for (const file of REQUIRED_FILES) {
    const didCreate = await writeIfMissing(path.join(memoryPath, file), templateFor(file, project));
    if (didCreate) created.push(file);
  }
  await appendMemoryEvent(project, "memory_initialized", {
    createdFiles: created,
    memoryPath
  });
  return {
    ok: true,
    message: created.length ? "Project memory pack created." : "Project memory pack already exists.",
    created,
    memory: await getProjectMemoryStatus(project)
  };
}

export async function appendMemoryEvent(project, eventType, payload = {}) {
  const memoryPath = path.join(project.path, MEMORY_DIR);
  const eventsDir = path.join(memoryPath, "events");
  await fs.mkdir(eventsDir, { recursive: true });
  const event = {
    id: randomUUID(),
    type: eventType,
    projectId: project.id,
    projectName: project.name,
    occurredAt: new Date().toISOString(),
    payload
  };
  const file = path.join(eventsDir, `${today()}.jsonl`);
  await fs.appendFile(file, `${JSON.stringify(event)}\n`, "utf8");
  return event;
}

export async function writeProjectHandoff(project, summaryText) {
  if (!project?.exists || (!project?.isRepo && !project?.isContext)) {
    return { ok: false, message: "Project or context space must be available first." };
  }
  await initializeProjectMemory(project);
  const now = new Date().toISOString();
  const memoryPath = path.join(project.path, MEMORY_DIR);
  const body = `# Handoff\n\n## Latest Handoff\n\n${summaryText || "No summary entered."}\n\nUpdated: ${now}\n`;
  await fs.writeFile(path.join(memoryPath, "HANDOFF.md"), body, "utf8");
  const event = await appendMemoryEvent(project, "handoff_written", { summary: summaryText || "" });
  return { ok: true, message: "Handoff written.", event, memory: await getProjectMemoryStatus(project) };
}
