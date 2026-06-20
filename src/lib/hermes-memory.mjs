import { readProjects } from "./registry.mjs";
import { getProjectStatus } from "./git.mjs";
import { getProjectMemoryStatus, initializeProjectMemory } from "./memory.mjs";
import { getContextCapsule, rebuildSemanticMemory } from "./semantic-memory.mjs";

const MEMORY_JOB_ACTIONS = new Set([
  "refresh_memory",
  "refresh_project_memory",
  "build_semantic_memory",
  "memory_briefing"
]);

async function projectStatusesFromOptions(options = {}) {
  if (Array.isArray(options.projectStatuses)) return options.projectStatuses;
  const projects = Array.isArray(options.projects) ? options.projects : await readProjects();
  return Promise.all(projects.map(getProjectStatus));
}

function summarizeCapsule(capsule) {
  if (!capsule?.data) return null;
  return {
    generatedAt: capsule.data.generatedAt,
    path: capsule.path,
    jsonPath: capsule.jsonPath,
    startupPacket: capsule.data.files.startupPacket,
    summary: capsule.data.summary,
    latestHandoff: capsule.data.latestHandoff,
    openTasks: capsule.data.openTasks,
    rulesAndDecisions: capsule.data.rulesAndDecisions,
    changedSinceHandoff: capsule.data.changedSinceHandoff,
    recallPrompt: capsule.data.recallPrompt
  };
}

function readinessFor(status, memory) {
  if (!status?.exists || (!status.isRepo && !status.isContext)) return "unavailable";
  if (!memory || memory.state === "missing") return "missing";
  if (["incomplete", "stale", "handoff-needed"].includes(memory.state)) return memory.state;
  if (["missing", "invalid", "stale"].includes(memory.semantic?.state)) return "semantic-stale";
  return "ready";
}

export async function buildHermesMemoryStatus(options = {}) {
  const agent = options.agent ?? "hermes";
  const statuses = await projectStatusesFromOptions(options);
  const projects = [];

  for (const status of statuses.slice(0, options.limit ?? 25)) {
    const memory = await getProjectMemoryStatus(status);
    const readiness = readinessFor(status, memory);
    let capsule = null;
    if (memory.semantic?.state === "fresh") {
      capsule = await getContextCapsule(status, {
        agent,
        write: options.writeCapsules !== false,
        rebuildIfMissing: false
      });
    }
    const compact = summarizeCapsule(capsule);
    projects.push({
      projectId: status.id,
      projectName: status.name,
      path: status.path,
      gitState: status.state,
      memoryState: memory.state,
      semanticState: memory.semantic?.state ?? "unknown",
      freshness: memory.freshness,
      readiness,
      capsulePath: compact?.path ?? memory.semantic?.capsulePath ?? null,
      startupPacket: compact?.startupPacket ?? memory.semantic?.packetPath ?? null,
      summary: compact?.summary ?? memory.message,
      latestHandoff: compact?.latestHandoff ?? null,
      recallPrompt: compact?.recallPrompt ?? null,
      changedSinceHandoff: compact?.changedSinceHandoff ?? []
    });
  }

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    agent,
    totalProjects: projects.length,
    readyProjects: projects.filter((project) => project.readiness === "ready").length,
    needsAttention: projects.filter((project) => project.readiness !== "ready").length,
    projects
  };
}

function jobProjectId(job) {
  return job?.project_id || job?.payload?.projectId || job?.payload?.project_id || null;
}

function jobProjectName(job) {
  return job?.payload?.projectName || job?.payload?.project || job?.payload?.name || null;
}

async function resolveJobProject(job, options = {}) {
  const statuses = await projectStatusesFromOptions(options);
  const id = jobProjectId(job);
  const name = jobProjectName(job);
  if (id) {
    const match = statuses.find((project) => project.id === id);
    if (match) return match;
  }
  if (name) {
    const normalized = String(name).toLowerCase();
    const match = statuses.find((project) => String(project.name).toLowerCase() === normalized);
    if (match) return match;
  }
  return statuses[0] ?? null;
}

export async function runHermesMemoryJob(job, options = {}) {
  if (!MEMORY_JOB_ACTIONS.has(job?.action)) {
    return { handled: false };
  }

  const status = await resolveJobProject(job, options);
  if (!status?.exists || (!status.isRepo && !status.isContext)) {
    return {
      handled: true,
      ok: false,
      message: "Project folder or context space is unavailable."
    };
  }

  const agent = job?.payload?.agent || options.agent || "hermes";
  await initializeProjectMemory(status);
  if (job.action !== "memory_briefing") {
    await rebuildSemanticMemory(status, { reason: `hermes_${job.action}`, agent });
  }
  const memory = await getProjectMemoryStatus(status);
  const capsule = await getContextCapsule(status, { agent, rebuildIfMissing: true });
  const compact = summarizeCapsule(capsule);

  return {
    handled: true,
    ok: true,
    projectId: status.id,
    projectName: status.name,
    memoryState: memory.state,
    semanticState: memory.semantic?.state ?? "unknown",
    freshness: memory.freshness,
    capsule: compact
  };
}
