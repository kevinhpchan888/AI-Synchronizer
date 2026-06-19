import { promises as fs } from "node:fs";
import path from "node:path";
import { hostname, platform } from "node:os";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = path.join(ROOT, ".env.local");
const LOCAL_MACHINE_FILE = path.join(ROOT, "registry", "local-machine.json");
const POLL_MS = Number(process.env.HERMES_POLL_MS || 30000);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function readEnv() {
  const values = { ...process.env };
  try {
    const raw = await fs.readFile(ENV_FILE, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const index = trimmed.indexOf("=");
      values[trimmed.slice(0, index)] = trimmed.slice(index + 1).replace(/^["']|["']$/g, "");
    }
  } catch {
    // Environment-only mode is fine on hosted or service installs.
  }
  return values;
}

async function readMachine() {
  const env = await readEnv();
  const configuredKey = env.AI_SYNC_MACHINE_KEY || env.AI_SYNC_MACHINE_ID || null;
  const configuredUuid = env.AI_SYNC_MACHINE_UUID || (UUID_PATTERN.test(env.AI_SYNC_MACHINE_ID || "") ? env.AI_SYNC_MACHINE_ID : null);
  if (configuredUuid) {
    return {
      id: configuredUuid,
      key: configuredKey || configuredUuid,
      name: env.AI_SYNC_MACHINE_NAME || hostname(),
      platform: env.AI_SYNC_MACHINE_PLATFORM || platform(),
      role: env.AI_SYNC_MACHINE_ROLE || "Hermes coordinator"
    };
  }

  try {
    const machine = JSON.parse(await fs.readFile(LOCAL_MACHINE_FILE, "utf8"));
    return {
      ...machine,
      key: configuredKey || machine.key || machine.id,
      name: env.AI_SYNC_MACHINE_NAME || machine.name || hostname(),
      platform: env.AI_SYNC_MACHINE_PLATFORM || machine.platform || platform(),
      role: env.AI_SYNC_MACHINE_ROLE || machine.role || "Hermes coordinator"
    };
  } catch {
    const machine = {
      id: randomUUID(),
      key: configuredKey || "hermes",
      name: hostname(),
      platform: platform(),
      role: "Hermes coordinator",
      createdAt: new Date().toISOString()
    };
    await fs.mkdir(path.dirname(LOCAL_MACHINE_FILE), { recursive: true });
    await fs.writeFile(LOCAL_MACHINE_FILE, JSON.stringify(machine, null, 2));
    return machine;
  }
}

async function supabaseFetch(table, options = {}) {
  const env = await readEnv();
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  if (!env.SUPABASE_URL || !key) throw new Error("Supabase service key is not configured.");
  const query = options.query ? `?${options.query}` : "";
  const response = await fetch(`${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}${query}`, {
    method: options.method || "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  if (response.status === 204) return null;
  return response.json();
}

async function publishHeartbeat() {
  const machine = await readMachine();
  const env = await readEnv();
  await supabaseFetch("kevin_sync_machines", {
    method: "POST",
    query: "on_conflict=id",
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      id: machine.id,
      name: machine.name || hostname(),
      platform: machine.platform || platform(),
      role: machine.role || "Hermes coordinator",
      address: env.TAILSCALE_IP || null,
      last_seen: new Date().toISOString(),
      status: {
        hermesWorker: "online",
        host: hostname(),
        key: machine.key,
        pid: process.pid
      }
    }
  });
}

async function getQueuedJobs() {
  const machine = await readMachine();
  const targets = [machine.key, machine.id, "hermes", "mac-mini"]
    .filter(Boolean)
    .map((target) => `target_machine_key.eq.${encodeURIComponent(target)}`)
    .join(",");
  const query = [
    "select=*",
    "status=eq.queued",
    `or=(${targets})`,
    "order=created_at.asc",
    "limit=5"
  ].join("&");
  return supabaseFetch("kevin_sync_jobs", { query });
}

async function markJob(job, status, result) {
  await supabaseFetch("kevin_sync_jobs", {
    method: "PATCH",
    query: `id=eq.${job.id}`,
    prefer: "return=minimal",
    body: {
      status,
      result,
      updated_at: new Date().toISOString()
    }
  });
}

async function handleJob(job) {
  if (job.action === "heartbeat") {
    await publishHeartbeat();
    await markJob(job, "done", { message: "Heartbeat published." });
    return;
  }
  await markJob(job, "skipped", {
    message: `Hermes worker does not know how to run action: ${job.action}`
  });
}

async function tick() {
  await publishHeartbeat();
  const jobs = await getQueuedJobs();
  for (const job of jobs) {
    try {
      await markJob(job, "running", { startedAt: new Date().toISOString() });
      await handleJob(job);
    } catch (error) {
      await markJob(job, "failed", { message: error.message });
    }
  }
}

console.log(`Hermes sync worker running from ${ROOT}`);
for (;;) {
  try {
    await tick();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ${error.message}`);
  }
  await new Promise((resolve) => setTimeout(resolve, POLL_MS));
}
