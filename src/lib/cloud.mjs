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
      const [key] = trimmed.split("=");
      keys[key.trim()] = true;
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
      configured: Boolean(envKeys.SUPABASE_URL && (envKeys.SUPABASE_ANON_KEY || envKeys.SUPABASE_PUBLISHABLE_KEY)),
      hasUrl: Boolean(envKeys.SUPABASE_URL),
      hasPublicKey: Boolean(envKeys.SUPABASE_ANON_KEY || envKeys.SUPABASE_PUBLISHABLE_KEY),
      hasServiceKey: Boolean(envKeys.SUPABASE_SERVICE_ROLE_KEY)
    },
    envLocalPresent: Object.keys(envKeys).length > 0
  };
}

