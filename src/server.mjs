import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getLocalMachine, readProjects, addProject, removeProject, readSettings } from "./lib/registry.mjs";
import { getProjectStatus, runProjectAction } from "./lib/git.mjs";
import { getToolStatus, installTool, runToolAction } from "./lib/tools.mjs";
import { getCloudStatus, publishMachineStatus } from "./lib/cloud.mjs";

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
  return { machine, tools, projects: projectStatuses, cloud, generatedAt: new Date().toISOString() };
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
