import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getLocalMachine, readProjects, addProject, removeProject, readSettings } from "./lib/registry.mjs";
import { getProjectStatus, runProjectAction } from "./lib/git.mjs";
import { getToolStatus, installTool, runToolAction } from "./lib/tools.mjs";
import { getCloudStatus, publishMachineStatus } from "./lib/cloud.mjs";
import { addMachine, readMachines, removeMachine } from "./lib/machines.mjs";

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
  const [machine, tools, projects, cloud] = await Promise.all([
    getLocalMachine(),
    getToolStatus(),
    readProjects(),
    getCloudStatus()
  ]);
  const projectStatuses = await Promise.all(projects.map(getProjectStatus));
  const machines = await readMachines();
  return {
    machine,
    machines,
    tools,
    projects: projectStatuses,
    cloud,
    recommendations: buildRecommendations({ tools, projects: projectStatuses, cloud, machines }),
    generatedAt: new Date().toISOString()
  };
}

function buildRecommendations({ tools, projects, cloud, machines }) {
  const items = [];
  const missingTools = tools.filter((tool) => !tool.exists);
  const dirty = projects.filter((project) => project.state === "dirty");
  const behind = projects.filter((project) => project.state === "behind");
  const ahead = projects.filter((project) => project.state === "ahead");
  const diverged = projects.filter((project) => project.state === "diverged");
  const noUpstream = projects.filter((project) => project.message === "No upstream branch");
  const pendingMachines = machines.filter((machine) => machine.status === "pending");

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
  if (pendingMachines.length) {
    items.push({
      level: "info",
      title: "Pair pending machines",
      body: `${pendingMachines.length} machine${pendingMachines.length === 1 ? " is" : "s are"} waiting to be restored and connected.`,
      action: "Use the pairing code on that machine after cloning the sync console repo."
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

    if (req.method === "GET" && url.pathname === "/api/tools") {
      return send(res, 200, await getToolStatus());
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
