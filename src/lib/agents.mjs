import { promises as fs } from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { commandExists } from "./command.mjs";

const CLAUDE_DIR = path.join(homedir(), ".claude");
const CLAUDE_SETTINGS = path.join(CLAUDE_DIR, "settings.json");
const GLM_BASE_URL = "https://api.z.ai/api/anthropic";
const GLM_CODING_BASE_URL = "https://api.z.ai/api/coding/paas/v4";
const GLM_OPUS_MODEL = "glm-5.2[1m]";
const GLM_SONNET_MODEL = "glm-5.2[1m]";
const GLM_HAIKU_MODEL = "glm-4.7";

async function readJson(file, fallback = {}) {
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

async function fileExists(file) {
  try {
    const stat = await fs.stat(file);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function backupFile(file) {
  if (!(await fileExists(file))) return null;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = `${file}.backup-${stamp}`;
  await fs.copyFile(file, backup);
  return backup;
}

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getClaudeEnv(settings) {
  return settings && typeof settings.env === "object" && settings.env ? settings.env : {};
}

function isGlmConfigured(env) {
  return env.ANTHROPIC_BASE_URL === GLM_BASE_URL && hasValue(env.ANTHROPIC_AUTH_TOKEN);
}

function isGlm52Configured(env) {
  return isGlmConfigured(env)
    && env.ANTHROPIC_DEFAULT_SONNET_MODEL === GLM_SONNET_MODEL
    && env.ANTHROPIC_DEFAULT_OPUS_MODEL === GLM_OPUS_MODEL
    && env.CLAUDE_CODE_AUTO_COMPACT_WINDOW === "1000000";
}

function status(tone, statusText, body, action) {
  return { tone, statusText, body, action };
}

function summarizeClaudeClaude(claudeTool, env) {
  if (!claudeTool.exists) {
    return status("bad", "Missing", "Claude Code is not installed on this machine.", "Install Claude Code first.");
  }
  if (isGlmConfigured(env)) {
    return status("warn", "Routed to GLM", "Claude Code is currently pointed at Z.ai instead of Claude models.", "Use Switch Back To Claude when you want Opus/Sonnet again.");
  }
  return status("ok", "Ready", "Claude Code will use your normal Claude model setup.", "Use Claude Code as usual.");
}

function summarizeGlm(claudeTool, env) {
  if (!claudeTool.exists) {
    return status("bad", "Missing", "Claude Code is required before GLM 5.2 can run inside it.", "Install Claude Code first.");
  }
  if (isGlm52Configured(env)) {
    return status("ok", "Ready", "Claude Code is configured for GLM 5.2 with 1M context.", "Open Claude Code and use /status to confirm.");
  }
  if (isGlmConfigured(env)) {
    return status("warn", "Partial", "Z.ai is connected, but the GLM 5.2 1M model mapping is not fully set.", "Click Configure GLM 5.2.");
  }
  return status("warn", "Needs key", "GLM 5.2 is not connected on this machine yet.", "Click Configure GLM 5.2.");
}

function summarizeCodex(codexTool) {
  if (!codexTool.exists) {
    return status("warn", "Missing", "Codex command-line access was not detected.", "Install or open Codex on this machine.");
  }
  return status("ok", "Ready", "Codex is available and uses the shared skills folder through the console.", "Use Sync Local Skills before switching tools.");
}

function summarizeCline(tools) {
  const codeTool = tools.find((tool) => tool.id === "vscode");
  if (!codeTool?.exists) {
    return status("neutral", "Optional", "VS Code is not required. It is only needed if you want Cline or Roo Code for GLM.", "Install later only if you want a VS Code-based GLM workflow.");
  }
  return status("warn", "Visual editor ready", "VS Code is present. Cline or Roo Code still needs a GLM provider setup.", "Use Z.ai OpenAI-compatible settings if you add Cline/Roo.");
}

export async function getAgentProfiles(tools = []) {
  const settings = await readJson(CLAUDE_SETTINGS, {});
  const env = getClaudeEnv(settings);
  const claudeTool = tools.find((tool) => tool.id === "claude") ?? { exists: (await commandExists("claude")).exists };
  const codexTool = tools.find((tool) => tool.id === "codex") ?? { exists: (await commandExists("codex")).exists };

  return {
    settingsPath: CLAUDE_SETTINGS,
    glmBaseUrl: GLM_BASE_URL,
    glmCodingBaseUrl: GLM_CODING_BASE_URL,
    activeRoute: isGlmConfigured(env) ? "glm" : "claude",
    profiles: [
      {
        id: "claude-code-claude",
        label: "Claude Code + Claude Models",
        provider: "Anthropic / Claude",
        ...summarizeClaudeClaude(claudeTool, env)
      },
      {
        id: "claude-code-glm52",
        label: "Claude Code + GLM 5.2",
        provider: "Z.ai GLM Coding Plan",
        ...summarizeGlm(claudeTool, env)
      },
      {
        id: "codex-openai",
        label: "Codex + OpenAI Models",
        provider: "OpenAI Codex",
        ...summarizeCodex(codexTool)
      },
      {
        id: "vscode-glm52",
        label: "VS Code + Cline/Roo + GLM 5.2",
        provider: "Optional visual GLM workspace",
        ...summarizeCline(tools)
      }
    ],
    glm: {
      configured: isGlmConfigured(env),
      configuredFor52: isGlm52Configured(env),
      hasToken: hasValue(env.ANTHROPIC_AUTH_TOKEN),
      baseUrl: env.ANTHROPIC_BASE_URL === GLM_BASE_URL ? GLM_BASE_URL : null,
      sonnetModel: env.ANTHROPIC_DEFAULT_SONNET_MODEL ?? null,
      opusModel: env.ANTHROPIC_DEFAULT_OPUS_MODEL ?? null,
      compactWindow: env.CLAUDE_CODE_AUTO_COMPACT_WINDOW ?? null
    }
  };
}

export async function configureClaudeForGlm52(apiKey) {
  if (!hasValue(apiKey)) return { ok: false, message: "Paste your Z.ai API key first." };
  const settings = await readJson(CLAUDE_SETTINGS, {});
  const backup = await backupFile(CLAUDE_SETTINGS);
  const env = {
    ...getClaudeEnv(settings),
    ANTHROPIC_AUTH_TOKEN: apiKey.trim(),
    ANTHROPIC_BASE_URL: GLM_BASE_URL,
    API_TIMEOUT_MS: "3000000",
    CLAUDE_CODE_AUTO_COMPACT_WINDOW: "1000000",
    ANTHROPIC_DEFAULT_HAIKU_MODEL: GLM_HAIKU_MODEL,
    ANTHROPIC_DEFAULT_SONNET_MODEL: GLM_SONNET_MODEL,
    ANTHROPIC_DEFAULT_OPUS_MODEL: GLM_OPUS_MODEL
  };

  await writeJson(CLAUDE_SETTINGS, { ...settings, env });
  return {
    ok: true,
    message: "Claude Code is now configured for GLM 5.2.",
    backup,
    settingsPath: CLAUDE_SETTINGS
  };
}

export async function restoreClaudeRoute() {
  const settings = await readJson(CLAUDE_SETTINGS, {});
  const backup = await backupFile(CLAUDE_SETTINGS);
  const env = { ...getClaudeEnv(settings) };
  for (const key of [
    "ANTHROPIC_AUTH_TOKEN",
    "ANTHROPIC_BASE_URL",
    "API_TIMEOUT_MS",
    "CLAUDE_CODE_AUTO_COMPACT_WINDOW",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL",
    "ANTHROPIC_DEFAULT_SONNET_MODEL",
    "ANTHROPIC_DEFAULT_OPUS_MODEL"
  ]) {
    delete env[key];
  }

  const next = { ...settings };
  if (Object.keys(env).length) next.env = env;
  else delete next.env;
  await writeJson(CLAUDE_SETTINGS, next);

  return {
    ok: true,
    message: "Claude Code is routed back to the normal Claude model setup.",
    backup,
    settingsPath: CLAUDE_SETTINGS
  };
}
