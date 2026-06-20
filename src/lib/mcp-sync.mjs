import { promises as fs } from "node:fs";
import path from "node:path";
import { homedir } from "node:os";

const DEFAULT_CLAUDE_SETTINGS = path.join(homedir(), ".claude", "settings.json");
const DEFAULT_CODEX_CONFIG = path.join(homedir(), ".codex", "config.toml");

async function readFileOrNull(file) {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}

async function readJson(file, fallback = {}) {
  const raw = await readFileOrNull(file);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
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

function mcpServersFromClaude(settings) {
  if (!settings?.mcpServers || typeof settings.mcpServers !== "object") return [];
  return Object.entries(settings.mcpServers)
    .filter(([, server]) => server && typeof server === "object" && server.command)
    .map(([name, server]) => ({
      name,
      command: String(server.command),
      args: Array.isArray(server.args) ? server.args.map(String) : [],
      env: server.env && typeof server.env === "object"
        ? Object.fromEntries(Object.entries(server.env).map(([key, value]) => [key, String(value)]))
        : {}
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function codexServerNames(configText = "") {
  const names = new Set();
  const tablePattern = /^\s*\[mcp_servers\.([^\]]+)\]\s*$/gm;
  for (const match of configText.matchAll(tablePattern)) {
    const raw = match[1].replace(/\.env$/, "").trim();
    const name = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1).replace(/\\"/g, '"') : raw;
    if (name) names.add(name);
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

function tomlKey(name) {
  return /^[A-Za-z0-9_-]+$/.test(name) ? name : JSON.stringify(name);
}

function tomlString(value) {
  return JSON.stringify(String(value));
}

function tomlStringArray(values) {
  return `[${values.map(tomlString).join(", ")}]`;
}

function serverToToml(server) {
  const lines = [
    "",
    `[mcp_servers.${tomlKey(server.name)}]`,
    `command = ${tomlString(server.command)}`,
    `args = ${tomlStringArray(server.args)}`
  ];
  const envEntries = Object.entries(server.env ?? {}).sort(([a], [b]) => a.localeCompare(b));
  if (envEntries.length) {
    lines.push("", `[mcp_servers.${tomlKey(server.name)}.env]`);
    for (const [key, value] of envEntries) lines.push(`${key} = ${tomlString(value)}`);
  }
  return lines.join("\n");
}

function redactedServer(server) {
  return {
    name: server.name,
    command: server.command,
    args: server.args,
    envKeys: Object.keys(server.env ?? {}).sort()
  };
}

export async function getMcpSyncStatus(options = {}) {
  const claudeSettingsPath = options.claudeSettingsPath ?? DEFAULT_CLAUDE_SETTINGS;
  const codexConfigPath = options.codexConfigPath ?? DEFAULT_CODEX_CONFIG;
  const claudeSettings = await readJson(claudeSettingsPath, {});
  const codexConfig = await readFileOrNull(codexConfigPath) ?? "";
  const claudeServers = mcpServersFromClaude(claudeSettings);
  const codexNames = codexServerNames(codexConfig);
  const codexSet = new Set(codexNames);
  const missingInCodex = claudeServers.filter((server) => !codexSet.has(server.name));

  return {
    ok: missingInCodex.length === 0,
    claudeSettingsPath,
    codexConfigPath,
    claudeCount: claudeServers.length,
    codexCount: codexNames.length,
    syncedCount: claudeServers.length - missingInCodex.length,
    missingInCodex: missingInCodex.map(redactedServer),
    claudeServers: claudeServers.map(redactedServer),
    codexServers: codexNames
  };
}

export async function syncClaudeMcpToCodex(options = {}) {
  const claudeSettingsPath = options.claudeSettingsPath ?? DEFAULT_CLAUDE_SETTINGS;
  const codexConfigPath = options.codexConfigPath ?? DEFAULT_CODEX_CONFIG;
  const claudeSettings = await readJson(claudeSettingsPath, {});
  const claudeServers = mcpServersFromClaude(claudeSettings);
  const existingConfig = await readFileOrNull(codexConfigPath) ?? "";
  const codexSet = new Set(codexServerNames(existingConfig));
  const missing = claudeServers.filter((server) => !codexSet.has(server.name));

  if (!missing.length) {
    return {
      ok: true,
      message: "Codex already has the Claude MCP servers.",
      addedCount: 0,
      added: [],
      backup: null,
      status: await getMcpSyncStatus({ claudeSettingsPath, codexConfigPath })
    };
  }

  await fs.mkdir(path.dirname(codexConfigPath), { recursive: true });
  const backup = await backupFile(codexConfigPath);
  const prefix = existingConfig.trimEnd();
  const nextConfig = `${prefix}${prefix ? "\n" : ""}\n# Synced from Claude settings by AI Sync Console.\n${missing.map(serverToToml).join("\n")}\n`;
  await fs.writeFile(codexConfigPath, nextConfig, "utf8");

  return {
    ok: true,
    message: `${missing.length} Claude MCP server${missing.length === 1 ? "" : "s"} added to Codex.`,
    addedCount: missing.length,
    added: missing.map(redactedServer),
    backup,
    status: await getMcpSyncStatus({ claudeSettingsPath, codexConfigPath })
  };
}

