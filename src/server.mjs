import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getLocalMachine, readProjects, addProject, removeProject, readSettings, readSession, saveSession } from "./lib/registry.mjs";
import { getProjectStatus, runProjectAction } from "./lib/git.mjs";
import { getToolStatus, installTool, runToolAction } from "./lib/tools.mjs";
import { getCloudControlPlaneStatus, getCloudStatus, publishMachineStatus } from "./lib/cloud.mjs";
import { addMachine, readMachines, removeMachine } from "./lib/machines.mjs";
import { getSkillInventory, importLocalSkillsToCanonical, syncLocalSkills } from "./lib/skills.mjs";
import { getSetupStatus, openSetupPackageFolder, prepareSetupPackage } from "./lib/setup.mjs";
import { configureClaudeForGlm52, getAgentProfiles, restoreClaudeRoute } from "./lib/agents.mjs";
import { getMemoryInventory, initializeProjectMemory, writeProjectHandoff } from "./lib/memory.mjs";
import { adoptWorkspace, checkpointWorkspace, switchWorkspaceAgent } from "./lib/workspaces.mjs";
import { syncLocalAgentEnvironment } from "./lib/environment.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const settings = await readSettings();
const PORT = Number(process.env.PORT || settings.port || 47831);

function send(res, status, body, headers = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "Content-Type": typeof body === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(payload);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function summary() {
  const [machine, tools, projects, cloud, setup, session, cloudControl] = await Promise.all([
    getLocalMachine(),
    getToolStatus(),
    readProjects(),
    getCloudStatus(),
    getSetupStatus(),
    readSession(),
    getCloudControlPlaneStatus()
  ]);
  const projectStatuses = await Promise.all(projects.map(getProjectStatus));
  const machines = await readMachines();
  const skills = await getSkillInventory(machines);
  const agents = await getAgentProfiles(tools);
  const memory = await getMemoryInventory(projectStatuses);
  return {
    machine,
    machines,
    skills,
    agents,
    memory,
    session: normalizeSession(session, projectStatuses),
    setup,
    tools,
    projects: projectStatuses,
    cloud,
    cloudControl,
    recommendations: buildRecommendations({ tools, projects: projectStatuses, cloud, machines, skills, agents, memory }),
    generatedAt: new Date().toISOString()
  };
}

function normalizeSession(session, projects) {
  const workflowProject = projects.find((project) => !String(project.remote || "").includes("AI-Synchronizer") && !/sync console/i.test(project.name));
  const activeProject = projects.find((project) => project.id === session.activeProjectId) ?? workflowProject ?? projects[0] ?? null;
  return {
    activeProjectId: activeProject?.id ?? null,
    activeProjectName: activeProject?.name ?? null,
    activeProjectPath: activeProject?.path ?? null,
    activeProjectState: activeProject?.state ?? null,
    activeProjectMessage: activeProject?.message ?? null,
    activeProjectBranch: activeProject?.branch ?? null,
    activeAgent: session.activeAgent ?? "claude",
    lastSwitchAt: session.lastSwitchAt ?? null,
    lastHandoffAt: session.lastHandoffAt ?? null,
    lastProjectSwitchAt: session.lastProjectSwitchAt ?? null
  };
}

function buildRecommendations({ tools, projects, cloud, machines, skills, agents, memory }) {
  const items = [];
  const missingTools = tools.filter((tool) => !tool.exists);
  const dirty = projects.filter((project) => project.state === "dirty");
  const behind = projects.filter((project) => project.state === "behind");
  const ahead = projects.filter((project) => project.state === "ahead");
  const diverged = projects.filter((project) => project.state === "diverged");
  const missingFolders = projects.filter((project) => project.state === "missing");
  const notRepos = projects.filter((project) => project.state === "not-repo" && !project.isContext);
  const noUpstream = projects.filter((project) => project.message === "No upstream branch");
  const pendingMachines = machines.filter((machine) => machine.status === "pending");
  const localSkillTargets = skills?.machines?.find((machine) => machine.status === "online")?.targets ?? [];
  const unevenSkillTargets = localSkillTargets.filter((target) => target.extraCount > 0 || target.missingCanonicalCount > 0);
  const glmProfile = agents?.profiles?.find((profile) => profile.id === "claude-code-glm52");
  const missingMemory = memory?.projects?.filter((project) => project.state === "missing") ?? [];
  const staleMemory = memory?.projects?.filter((project) => ["stale", "incomplete", "handoff-needed"].includes(project.state)) ?? [];

  if (missingTools.length) {
    items.push({
      level: "warning",
      title: "Install missing sync tools",
      body: `${missingTools.map((tool) => tool.label).join(", ")} ${missingTools.length === 1 ? "is" : "are"} missing.`,
      action: "Use the Install buttons in Tools."
    });
  }
  if (diverged.length) {
    items.push({
      level: "critical",
      title: "Resolve diverged project history",
      body: `${diverged.length} project${diverged.length === 1 ? "" : "s"} changed both locally and remotely.`,
      action: "Open the project and resolve the Git conflict before pushing."
    });
  }
  if (missingFolders.length) {
    items.push({
      level: "critical",
      title: "Fix missing project folders",
      body: `${missingFolders.length} project${missingFolders.length === 1 ? " points" : "s point"} to a folder that does not exist on this machine.`,
      action: "Remove the broken entry or add the project again with the correct local folder."
    });
  }
  if (notRepos.length) {
    items.push({
      level: "critical",
      title: "Fix non-Git project folders",
      body: `${notRepos.length} project${notRepos.length === 1 ? " folder is" : " folders are"} not a Git repo, so the console cannot sync it.`,
      action: "Choose the actual cloned repo folder, or clone the project from GitHub first."
    });
  }
  if (dirty.length) {
    items.push({
      level: "warning",
      title: "Save local project changes",
      body: `${dirty.length} project${dirty.length === 1 ? " has" : "s have"} uncommitted local changes.`,
      action: "Use Save WIP, then Push when ready."
    });
  }
  if (behind.length) {
    items.push({
      level: "info",
      title: "Pull newer work",
      body: `${behind.length} project${behind.length === 1 ? " is" : "s are"} behind GitHub.`,
      action: "Use Pull before starting work."
    });
  }
  if (ahead.length) {
    items.push({
      level: "info",
      title: "Push local commits",
      body: `${ahead.length} project${ahead.length === 1 ? " has" : "s have"} commits not on GitHub.`,
      action: "Use Push before switching machines."
    });
  }
  if (noUpstream.length) {
    items.push({
      level: "warning",
      title: "Connect the sync console to GitHub",
      body: "This console repo has no upstream branch yet, so it cannot restore onto another machine from GitHub.",
      action: "Create a private GitHub repo and set it as origin."
    });
  }
  if (missingMemory.length) {
    items.push({
      level: "warning",
      title: "Create project memory packs",
      body: `${missingMemory.length} project${missingMemory.length === 1 ? " has" : "s have"} no portable .ai-memory folder yet.`,
      action: "Use Initialize Memory in Projects."
    });
  } else if (staleMemory.length) {
    items.push({
      level: "info",
      title: "Refresh stale project memory",
      body: `${staleMemory.length} project memory pack${staleMemory.length === 1 ? " needs" : "s need"} a handoff or status update.`,
      action: "Use Prepare Handoff before switching machines or agents."
    });
  }
  if (!cloud.supabase.configured) {
    items.push({
      level: "neutral",
      title: "Cloud control plane is not connected",
      body: "Local sync works. Cross-machine status needs Supabase credentials in .env.local.",
      action: "Add Supabase details when ready, then Publish Cloud Status."
    });
  }
  if (!cloud.vercel.cliAuthenticated) {
    items.push({
      level: "neutral",
      title: "Hosted dashboard is not deployed",
      body: "Vercel is installed but not logged in here.",
      action: "Run Vercel login later from the visual setup flow."
    });
  }
  if (glmProfile && glmProfile.tone !== "ok") {
    items.push({
      level: glmProfile.tone === "bad" ? "warning" : "info",
      title: "GLM 5.2 is not ready yet",
      body: glmProfile.body,
      action: glmProfile.action
    });
  }
  if (pendingMachines.length) {
    items.push({
      level: "info",
      title: "Pair pending machines",
      body: `${pendingMachines.length} machine${pendingMachines.length === 1 ? " is" : "s are"} waiting to be restored and connected.`,
      action: "Use the pairing code on that machine after cloning the sync console repo."
    });
  }
  if (skills?.canonical?.count === 0) {
    items.push({
      level: "warning",
      title: "Choose a canonical skill source",
      body: "The shared skills folder is empty, so the console cannot yet make Claude and Codex skill sets match from one source of truth.",
      action: "Import your preferred Claude/Codex skills into the shared skills folder, then use Sync Local Skills."
    });
  } else if (unevenSkillTargets.length) {
    items.push({
      level: "info",
      title: "Skill coverage differs locally",
      body: `${unevenSkillTargets.length} local agent skill target${unevenSkillTargets.length === 1 ? " differs" : "s differ"} from the shared skills folder.`,
      action: "Use Sync Local Skills to copy canonical skills into Claude, Codex, and Shared Agents."
    });
  }
  if (!items.length) {
    items.push({
      level: "success",
      title: "Everything is level",
      body: "Projects, tools, machines, and cloud status look healthy.",
      action: "You can start work."
    });
  }
  return items;
}

async function handleApi(req, res, url) {
  try {
    if (req.method === "GET" && url.pathname === "/api/summary") {
      return send(res, 200, await summary());
    }

    if (req.method === "POST" && url.pathname === "/api/cloud/publish") {
      return send(res, 200, await publishMachineStatus(await summary()));
    }

    if (req.method === "GET" && url.pathname === "/api/cloud/status") {
      return send(res, 200, await getCloudControlPlaneStatus());
    }

    if (req.method === "GET" && url.pathname === "/api/session") {
      const projects = await readProjects();
      const projectStatuses = await Promise.all(projects.map(getProjectStatus));
      return send(res, 200, normalizeSession(await readSession(), projectStatuses));
    }

    if (req.method === "POST" && url.pathname === "/api/session/project") {
      const body = await readBody(req);
      const projects = await readProjects();
      const projectStatuses = await Promise.all(projects.map(getProjectStatus));
      const project = projectStatuses.find((item) => item.id === body.projectId);
      if (!project) return send(res, 404, { ok: false, message: "Project not found." });
      const session = await readSession();
      const nextSession = {
        ...session,
        activeProjectId: project.id,
        lastProjectSwitchAt: new Date().toISOString()
      };
      await saveSession(nextSession);
      return send(res, 200, { ok: true, session: normalizeSession(nextSession, projectStatuses) });
    }

    if (req.method === "GET" && url.pathname === "/api/tools") {
      return send(res, 200, await getToolStatus());
    }

    if (req.method === "GET" && url.pathname === "/api/setup") {
      return send(res, 200, await getSetupStatus());
    }

    if (req.method === "GET" && url.pathname === "/api/agents") {
      return send(res, 200, await getAgentProfiles(await getToolStatus()));
    }

    if (req.method === "POST" && url.pathname === "/api/agents/glm52/configure") {
      const body = await readBody(req);
      return send(res, 200, await configureClaudeForGlm52(body.apiKey));
    }

    if (req.method === "POST" && url.pathname === "/api/agents/claude/restore") {
      return send(res, 200, await restoreClaudeRoute());
    }

    if (req.method === "POST" && url.pathname === "/api/setup/prepare") {
      return send(res, 200, await prepareSetupPackage());
    }

    if (req.method === "POST" && url.pathname === "/api/setup/open-folder") {
      return send(res, 200, await openSetupPackageFolder());
    }

    if (req.method === "GET" && url.pathname === "/api/skills") {
      return send(res, 200, await getSkillInventory(await readMachines()));
    }

    if (req.method === "GET" && url.pathname === "/api/memory") {
      const projects = await readProjects();
      const projectStatuses = await Promise.all(projects.map(getProjectStatus));
      return send(res, 200, await getMemoryInventory(projectStatuses));
    }

    if (req.method === "POST" && url.pathname.match(/^\/api\/projects\/[^/]+\/memory\/init$/)) {
      const id = decodeURIComponent(url.pathname.split("/")[3]);
      const projects = await readProjects();
      const project = projects.find((item) => item.id === id);
      if (!project) return send(res, 404, { ok: false, message: "Project not found." });
      return send(res, 200, await initializeProjectMemory(await getProjectStatus(project)));
    }

    if (req.method === "POST" && url.pathname.match(/^\/api\/projects\/[^/]+\/memory\/handoff$/)) {
      const id = decodeURIComponent(url.pathname.split("/")[3]);
      const body = await readBody(req);
      const projects = await readProjects();
      const project = projects.find((item) => item.id === id);
      if (!project) return send(res, 404, { ok: false, message: "Project not found." });
      return send(res, 200, await writeProjectHandoff(await getProjectStatus(project), body.summary));
    }

    if (req.method === "POST" && url.pathname === "/api/workspaces/adopt") {
      const body = await readBody(req);
      if (!body.path) return send(res, 400, { ok: false, message: "Workspace folder path is required." });
      return send(res, 200, await adoptWorkspace(body));
    }

    if (req.method === "POST" && url.pathname.match(/^\/api\/projects\/[^/]+\/workspace\/checkpoint$/)) {
      const id = decodeURIComponent(url.pathname.split("/")[3]);
      const projects = await readProjects();
      const project = projects.find((item) => item.id === id);
      if (!project) return send(res, 404, { ok: false, message: "Project not found." });
      return send(res, 200, await checkpointWorkspace(project));
    }

    if (req.method === "POST" && url.pathname.match(/^\/api\/projects\/[^/]+\/switch-agent$/)) {
      const id = decodeURIComponent(url.pathname.split("/")[3]);
      const body = await readBody(req);
      const targetAgent = body.targetAgent === "codex" ? "codex" : "claude";
      const projects = await readProjects();
      const project = projects.find((item) => item.id === id);
      if (!project) return send(res, 404, { ok: false, message: "Project not found." });
      const result = await switchWorkspaceAgent(project, targetAgent, body.summary);
      if (result.ok) {
        const session = await readSession();
        await saveSession({
          ...session,
          activeProjectId: id,
          activeAgent: targetAgent,
          lastSwitchAt: new Date().toISOString(),
          lastHandoffAt: new Date().toISOString(),
          lastProjectSwitchAt: session.activeProjectId === id ? session.lastProjectSwitchAt : new Date().toISOString()
        });
      }
      return send(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/skills/sync-local") {
      return send(res, 200, await syncLocalSkills());
    }

    if (req.method === "POST" && url.pathname === "/api/environment/sync-local") {
      return send(res, 200, await syncLocalAgentEnvironment());
    }

    if (req.method === "POST" && url.pathname === "/api/skills/import-local") {
      return send(res, 200, await importLocalSkillsToCanonical());
    }

    if (req.method === "POST" && url.pathname.match(/^\/api\/tools\/[^/]+\/install$/)) {
      const [, , , toolId] = url.pathname.split("/");
      return send(res, 200, await installTool(toolId));
    }

    if (req.method === "POST" && url.pathname.match(/^\/api\/tools\/[^/]+\/action$/)) {
      const [, , , toolId] = url.pathname.split("/");
      const body = await readBody(req);
      return send(res, 200, await runToolAction(toolId, body.action));
    }

    if (req.method === "GET" && url.pathname === "/api/projects") {
      const projects = await readProjects();
      return send(res, 200, await Promise.all(projects.map(getProjectStatus)));
    }

    if (req.method === "GET" && url.pathname === "/api/machines") {
      return send(res, 200, await readMachines());
    }

    if (req.method === "POST" && url.pathname === "/api/machines") {
      const body = await readBody(req);
      return send(res, 200, await addMachine(body));
    }

    if (req.method === "DELETE" && url.pathname.match(/^\/api\/machines\/[^/]+$/)) {
      const id = decodeURIComponent(url.pathname.split("/").pop());
      return send(res, 200, await removeMachine(id));
    }

    if (req.method === "POST" && url.pathname === "/api/projects") {
      const body = await readBody(req);
      if (!body.path) return send(res, 400, { ok: false, message: "Project path is required." });
      return send(res, 200, await addProject(body));
    }

    if (req.method === "DELETE" && url.pathname.match(/^\/api\/projects\/[^/]+$/)) {
      const id = decodeURIComponent(url.pathname.split("/").pop());
      return send(res, 200, await removeProject(id));
    }

    if (req.method === "POST" && url.pathname.match(/^\/api\/projects\/[^/]+\/action$/)) {
      const id = decodeURIComponent(url.pathname.split("/")[3]);
      const body = await readBody(req);
      const projects = await readProjects();
      const project = projects.find((item) => item.id === id);
      if (!project) return send(res, 404, { ok: false, message: "Project not found." });
      return send(res, 200, await runProjectAction(project, body.action));
    }

    return send(res, 404, { ok: false, message: "Unknown API route." });
  } catch (error) {
    return send(res, 500, { ok: false, message: error.message });
  }
}

async function serveStatic(req, res, url) {
  const requested = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
  const file = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!file.startsWith(PUBLIC_DIR)) return send(res, 403, "Forbidden");

  try {
    const data = await fs.readFile(file);
    const ext = path.extname(file);
    const contentTypes = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8"
    };
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    send(res, 404, "Not found");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) return handleApi(req, res, url);
  return serveStatic(req, res, url);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Kevin Sync Console is running at http://localhost:${PORT}`);
});
