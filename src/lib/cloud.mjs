import { promises as fs } from "node:fs";
import path from "node:path";
import { commandExists, run, runShell } from "./command.mjs";

async function readEnvLocal() {
  const keys = {};
  for (const key of [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SECRET_KEY",
    "SUPABASE_ANON_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_PROJECT_REF",
    "VERCEL_TEAM",
    "VERCEL_PROJECT"
  ]) {
    if (process.env[key]) keys[key] = process.env[key];
  }

  const file = path.join(process.cwd(), ".env.local");
  try {
    const raw = await fs.readFile(file, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
      keys[key] = value;
    }
    return keys;
  } catch {
    return keys;
  }
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

// "vercel whoami" is a network call and was the slowest part of every
// dashboard refresh (1.7s+ per /api/summary). CLI auth only changes when
// the user logs in or out, so cache the answer and re-check occasionally.
const VERCEL_AUTH_TTL_MS = 10 * 60 * 1000;
let vercelAuthCache = { checkedAt: 0, ok: false };

export async function checkVercelAuth(options = {}) {
  const now = Date.now();
  if (!options.force && vercelAuthCache.checkedAt && now - vercelAuthCache.checkedAt < VERCEL_AUTH_TTL_MS) {
    return vercelAuthCache.ok;
  }
  const runner = options.runner || (async () => {
    const vercelCommand = await commandExists("vercel");
    if (!vercelCommand.exists) return { ok: false };
    return runShell("vercel whoami", { timeout: 5000 });
  });
  const result = await runner();
  vercelAuthCache = { checkedAt: now, ok: Boolean(result.ok) };
  return vercelAuthCache.ok;
}

export async function getCloudStatus() {
  const envKeys = await readEnvLocal();
  const vercelProjectFile = path.join(process.cwd(), ".vercel", "project.json");
  const vercelLinked = await exists(vercelProjectFile);
  const vercelWhoami = { ok: await checkVercelAuth() };

  return {
    vercel: {
      cliAuthenticated: vercelWhoami.ok,
      linked: vercelLinked
    },
    supabase: {
      configured: Boolean(envKeys.SUPABASE_URL && (envKeys.SUPABASE_SERVICE_ROLE_KEY || envKeys.SUPABASE_SECRET_KEY)),
      hasUrl: Boolean(envKeys.SUPABASE_URL),
      hasPublicKey: Boolean(envKeys.SUPABASE_ANON_KEY || envKeys.SUPABASE_PUBLISHABLE_KEY),
      hasServiceKey: Boolean(envKeys.SUPABASE_SERVICE_ROLE_KEY || envKeys.SUPABASE_SECRET_KEY)
    },
    envLocalPresent: Object.keys(envKeys).length > 0,
    hostedRuntime: Boolean(process.env.VERCEL)
  };
}

async function cloudFetch(table, query = "select=*") {
  const env = await readEnvLocal();
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || env.SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { ok: false, rows: [], message: "Supabase is not connected." };
  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/${table}?${query}`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });
  if (!response.ok) return { ok: false, rows: [], status: response.status, message: await response.text() };
  return { ok: true, rows: await response.json() };
}

export async function getCloudControlPlaneStatus() {
  const [machines, projects, snapshots, jobs] = await Promise.all([
    cloudFetch("kevin_sync_machines", "select=*&order=last_seen.desc&limit=25"),
    cloudFetch("kevin_sync_projects", "select=*&order=updated_at.desc&limit=50"),
    cloudFetch("kevin_sync_memory_snapshots", "select=*&order=created_at.desc&limit=50"),
    cloudFetch("kevin_sync_jobs", "select=*&order=created_at.desc&limit=50")
  ]);
  return {
    ok: machines.ok && projects.ok,
    hostedRuntime: Boolean(process.env.VERCEL),
    machines: machines.rows,
    projects: projects.rows,
    memorySnapshots: snapshots.rows,
    jobs: jobs.rows,
    errors: [machines, projects, snapshots, jobs].filter((item) => !item.ok).map((item) => item.message)
  };
}

export async function publishMachineStatus(summary) {
  const env = await readEnvLocal();
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    return { ok: false, message: "Supabase is not connected yet. Add the Supabase connection details, then try Publish Cloud Status again." };
  }

  const base = url.replace(/\/$/, "");
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates"
  };

  const machineEndpoint = `${base}/rest/v1/kevin_sync_machines?on_conflict=id`;
  const response = await fetch(machineEndpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      id: summary.machine.id,
      name: summary.machine.name,
      platform: summary.machine.platform,
      last_seen: new Date().toISOString(),
      status: {
        tools: summary.tools.map((tool) => ({ id: tool.id, exists: tool.exists, state: tool.state })),
        projects: summary.projects.map((project) => ({
          id: project.id,
          name: project.name,
          state: project.state,
          message: project.message,
          branch: project.branch,
          remote: project.remote
        })),
        memory: summary.memory,
        hermesBridge: summary.hermesBridge,
        cloud: summary.cloud
      }
    })
  });

  if (!response.ok) {
    return { ok: false, status: response.status, message: await response.text() };
  }

  const projectRows = summary.projects
    .filter((project) => project.isRepo || project.isContext)
    .map((project) => {
      const memory = summary.memory?.projects?.find((item) => item.projectId === project.id);
      return {
        id: project.id,
        name: project.name,
        local_path: project.path,
        repo_remote: project.remote,
        branch: project.branch,
        git_state: project.state,
        memory_state: memory?.state ?? "unknown",
        memory_freshness: memory?.freshness ?? 0,
        memory_hash: memory?.packHash ?? null,
        last_memory_at: memory?.lastUpdated ?? null,
        status: { project, memory }
      };
    });

  if (projectRows.length) {
    const projectsResponse = await fetch(`${base}/rest/v1/kevin_sync_projects?on_conflict=id`, {
      method: "POST",
      headers,
      body: JSON.stringify(projectRows)
    });
    if (!projectsResponse.ok) {
      return { ok: false, status: projectsResponse.status, message: await projectsResponse.text() };
    }

    const snapshots = projectRows.map((project) => ({
      project_id: project.id,
      machine_id: summary.machine.id,
      memory_state: project.memory_state,
      memory_freshness: project.memory_freshness,
      memory_hash: project.memory_hash,
      status: project.status
    }));
    const snapshotsResponse = await fetch(`${base}/rest/v1/kevin_sync_memory_snapshots`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify(snapshots)
    });
    if (!snapshotsResponse.ok) {
      return { ok: false, status: snapshotsResponse.status, message: await snapshotsResponse.text() };
    }
  }

  return { ok: true, message: "Machine and memory status published.", projects: projectRows.length };
}

export async function queueCloudJob(input) {
  const env = await readEnvLocal();
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    return { ok: false, message: "Supabase is not connected yet. Add the Supabase connection details, then try again." };
  }
  const targetMachineKey = input.targetMachineKey || "mac-mini";
  const action = input.action;
  if (!action) return { ok: false, message: "Job action is required." };

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/kevin_sync_jobs`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      target_machine_key: targetMachineKey,
      project_id: input.projectId || input.project_id || null,
      action,
      status: "queued",
      payload: input.payload || {}
    })
  });

  if (!response.ok) {
    return { ok: false, status: response.status, message: await response.text() };
  }
  const rows = await response.json();
  return {
    ok: true,
    message: `${action} queued for ${targetMachineKey}.`,
    job: Array.isArray(rows) ? rows[0] : rows
  };
}
