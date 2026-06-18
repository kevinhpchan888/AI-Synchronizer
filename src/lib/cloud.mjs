import { promises as fs } from "node:fs";
import path from "node:path";
import { run } from "./command.mjs";

async function readEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  try {
    const raw = await fs.readFile(file, "utf8");
    const keys = {};
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
    return {};
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

export async function getCloudStatus() {
  const envKeys = await readEnvLocal();
  const vercelProjectFile = path.join(process.cwd(), ".vercel", "project.json");
  const vercelLinked = await exists(vercelProjectFile);
  const vercelWhoami = await run("vercel", ["whoami"], { timeout: 15000 });

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
    envLocalPresent: Object.keys(envKeys).length > 0
  };
}

export async function publishMachineStatus(summary) {
  const env = await readEnvLocal();
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    return { ok: false, message: "Supabase is not connected yet. Add the Supabase connection details, then try Publish Cloud Status again." };
  }

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/sync_machines?on_conflict=id`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates"
    },
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
        cloud: summary.cloud
      }
    })
  });

  if (!response.ok) {
    return { ok: false, status: response.status, message: await response.text() };
  }

  return { ok: true, message: "Machine status published." };
}
