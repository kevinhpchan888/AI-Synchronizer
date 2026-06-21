import { promises as fs } from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { buildHermesMemoryStatus } from "./hermes-memory.mjs";

export const HERMES_BRIDGE_ACTIONS = new Set([
  "install_hermes_memory_bridge",
  "sync_hermes_memory_bridge",
  "refresh_hermes_bridge"
]);

const BRIDGE_DIR = "ai-sync-memory";
const BRIDGE_FILE = "HERMES_MEMORY_BRIDGE.md";
const PROJECTS_FILE = "projects.json";
const SKILL_DIR = "ai-sync-memory";
const SKILL_FILE = "SKILL.md";
const PROFILE_RULE_FILE = "AI_SYNC_MEMORY.md";
const START_MARKER = "<!-- AI_SYNC_MEMORY_BRIDGE:start -->";
const END_MARKER = "<!-- AI_SYNC_MEMORY_BRIDGE:end -->";

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(file) {
  try {
    return (await fs.stat(file)).isDirectory();
  } catch {
    return false;
  }
}

async function readText(file, fallback = "") {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function getHermesHome(input = {}) {
  return path.resolve(input.hermesHome || process.env.HERMES_HOME || path.join(homedir(), ".hermes"));
}

export function bridgePaths(input = {}) {
  const hermesHome = getHermesHome(input);
  const bridgeRoot = path.join(hermesHome, BRIDGE_DIR);
  return {
    hermesHome,
    bridgeRoot,
    bridgeFile: path.join(bridgeRoot, BRIDGE_FILE),
    projectsFile: path.join(bridgeRoot, PROJECTS_FILE),
    globalSkillDir: path.join(hermesHome, "skills", SKILL_DIR),
    globalSkillFile: path.join(hermesHome, "skills", SKILL_DIR, SKILL_FILE)
  };
}

export async function discoverHermesProfiles(input = {}) {
  const hermesHome = getHermesHome(input);
  const profiles = [];
  if (await exists(path.join(hermesHome, "SOUL.md"))) {
    profiles.push({ name: "default", path: hermesHome });
  }

  const profilesRoot = path.join(hermesHome, "profiles");
  try {
    const entries = await fs.readdir(profilesRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const profilePath = path.join(profilesRoot, entry.name);
      profiles.push({ name: entry.name, path: profilePath });
    }
  } catch {
    // Hermes can run with a single default profile and no profiles directory.
  }
  return profiles;
}

function managedBlock(bridgeFile) {
  return [
    START_MARKER,
    "## AI Sync Project Memory Rule",
    "",
    "Read the AI Sync memory bridge before project work.",
    "",
    `Bridge file: ${bridgeFile}`,
    "",
    "Rules:",
    "- Identify the project first.",
    "- If the project is listed in the bridge, read its CONTEXT_CAPSULE.md before acting.",
    "- For substantial work, also read AGENT_STARTUP.md.",
    "- If memory is missing or stale, report that status before editing files.",
    "- Do not rely only on this Hermes profile memory when a project memory pack exists.",
    END_MARKER
  ].join("\n");
}

function replaceManagedBlock(text, block) {
  const escapedStart = START_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = END_MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}`, "m");
  if (pattern.test(text)) return text.replace(pattern, block);
  const separator = text.trim() ? "\n\n" : "";
  return `${text.trimEnd()}${separator}${block}\n`;
}

function skillMarkdown(bridgeFile) {
  return [
    "---",
    "name: ai-sync-memory",
    "description: Use this before Hermes works on a project managed by AI Sync.",
    "---",
    "",
    "# AI Sync Memory",
    "",
    "Before project work:",
    "",
    `1. Read ${bridgeFile}.`,
    "2. Match the requested project to the project list.",
    "3. Read the project's CONTEXT_CAPSULE.md first.",
    "4. Read AGENT_STARTUP.md before substantial edits, repo actions, or routing work.",
    "5. If the bridge says memory is missing or stale, report that and request a memory refresh before editing.",
    "",
    "This skill exists so every Hermes profile uses the same project memory instead of relying only on its own profile history.",
    ""
  ].join("\n");
}

function profileInstructionMarkdown(profileName, bridgeFile) {
  return [
    `# AI Sync Memory Rule for ${profileName}`,
    "",
    "This profile is connected to AI Sync project memory.",
    "",
    "Before handling project work, read the bridge file, then read the project capsule and startup packet named there.",
    "",
    `Bridge file: ${bridgeFile}`,
    "",
    "If a project is not listed, continue normally but say that no AI Sync project memory was found.",
    ""
  ].join("\n");
}

function bridgeMarkdown(status) {
  const lines = [
    "# AI Sync Hermes Memory Bridge",
    "",
    `Generated: ${status.generatedAt}`,
    `Agent: ${status.agent}`,
    "",
    "## Required Behavior",
    "",
    "Every Hermes profile must use this bridge before project work.",
    "",
    "1. Identify the project.",
    "2. Find the project below.",
    "3. Read `CONTEXT_CAPSULE.md` first.",
    "4. Read `AGENT_STARTUP.md` before substantial edits, handoffs, repo changes, or routing work.",
    "5. If readiness is not `ready`, refresh memory or report the blocker before editing.",
    "",
    "## Project Memory"
  ];

  if (!status.projects.length) {
    lines.push("", "No AI Sync projects are visible to this Hermes worker yet.");
  }

  for (const project of status.projects) {
    lines.push(
      "",
      `### ${project.projectName}`,
      "",
      `- Project id: ${project.projectId}`,
      `- Path: ${project.path}`,
      `- Git state: ${project.gitState}`,
      `- Memory state: ${project.memoryState}`,
      `- Semantic state: ${project.semanticState}`,
      `- Readiness: ${project.readiness}`,
      `- Capsule: ${project.capsulePath || "missing"}`,
      `- Startup packet: ${project.startupPacket || "missing"}`,
      `- Recall prompt: ${project.recallPrompt || "No recall prompt available."}`
    );
    if (project.latestHandoff) lines.push(`- Latest handoff: ${project.latestHandoff}`);
    if (project.changedSinceHandoff?.length) {
      lines.push("- Changed since handoff:");
      for (const item of project.changedSinceHandoff.slice(0, 10)) {
        lines.push(`  - ${item.path}: ${item.updatedAt}`);
      }
    }
  }

  return `${lines.join("\n")}\n`;
}

async function writeSkill(skillFile, bridgeFile) {
  await fs.mkdir(path.dirname(skillFile), { recursive: true });
  await fs.writeFile(skillFile, skillMarkdown(bridgeFile), "utf8");
}

async function enforceProfile(profile, bridgeFile) {
  await fs.mkdir(profile.path, { recursive: true });
  const profileRuleFile = path.join(profile.path, PROFILE_RULE_FILE);
  const soulFile = path.join(profile.path, "SOUL.md");
  const skillFile = path.join(profile.path, "skills", SKILL_DIR, SKILL_FILE);
  const existingSoul = await readText(soulFile, `# ${profile.name}\n`);
  const nextSoul = replaceManagedBlock(existingSoul, managedBlock(bridgeFile));

  await fs.writeFile(soulFile, nextSoul, "utf8");
  await fs.writeFile(profileRuleFile, profileInstructionMarkdown(profile.name, bridgeFile), "utf8");
  await writeSkill(skillFile, bridgeFile);

  return {
    name: profile.name,
    path: profile.path,
    soulFile,
    profileRuleFile,
    skillFile,
    enforced: true
  };
}

export async function installHermesMemoryBridge(options = {}) {
  const paths = bridgePaths(options);
  await fs.mkdir(paths.bridgeRoot, { recursive: true });
  await fs.mkdir(paths.hermesHome, { recursive: true });

  const status = options.memoryStatus || await buildHermesMemoryStatus({
    ...options,
    agent: options.agent ?? "hermes",
    writeCapsules: options.writeCapsules !== false
  });

  await fs.writeFile(paths.bridgeFile, bridgeMarkdown(status), "utf8");
  await writeJson(paths.projectsFile, status);
  await writeSkill(paths.globalSkillFile, paths.bridgeFile);

  const profiles = await discoverHermesProfiles(options);
  const installedProfiles = [];
  for (const profile of profiles) {
    installedProfiles.push(await enforceProfile(profile, paths.bridgeFile));
  }

  return {
    ok: true,
    installed: true,
    hermesHome: paths.hermesHome,
    bridgeFile: paths.bridgeFile,
    projectsFile: paths.projectsFile,
    globalSkillFile: paths.globalSkillFile,
    profileCount: installedProfiles.length,
    projectCount: status.projects.length,
    readyProjects: status.readyProjects,
    needsAttention: status.needsAttention,
    installedProfiles,
    generatedAt: status.generatedAt
  };
}

export async function getHermesMemoryBridgeStatus(options = {}) {
  const paths = bridgePaths(options);
  const profiles = await discoverHermesProfiles(options);
  const bridgeExists = await exists(paths.bridgeFile);
  const projectsExists = await exists(paths.projectsFile);
  const globalSkillExists = await exists(paths.globalSkillFile);
  const profileStatuses = [];

  for (const profile of profiles) {
    const soulFile = path.join(profile.path, "SOUL.md");
    const soul = await readText(soulFile);
    const profileRuleFile = path.join(profile.path, PROFILE_RULE_FILE);
    const skillFile = path.join(profile.path, "skills", SKILL_DIR, SKILL_FILE);
    profileStatuses.push({
      name: profile.name,
      path: profile.path,
      soulFile,
      enforced: soul.includes(START_MARKER) && soul.includes(END_MARKER),
      profileRuleFile,
      profileRuleExists: await exists(profileRuleFile),
      skillFile,
      skillExists: await exists(skillFile)
    });
  }

  let projectCount = 0;
  let readyProjects = 0;
  let needsAttention = 0;
  let generatedAt = null;
  if (projectsExists) {
    try {
      const manifest = JSON.parse(await fs.readFile(paths.projectsFile, "utf8"));
      projectCount = manifest.totalProjects ?? manifest.projects?.length ?? 0;
      readyProjects = manifest.readyProjects ?? 0;
      needsAttention = manifest.needsAttention ?? 0;
      generatedAt = manifest.generatedAt ?? null;
    } catch {
      // Invalid manifests are treated as not installed below.
    }
  }

  const enforcedProfiles = profileStatuses.filter((profile) => profile.enforced && profile.skillExists).length;
  const installed = bridgeExists && projectsExists && globalSkillExists && profiles.length > 0 && enforcedProfiles === profiles.length;

  return {
    ok: true,
    installed,
    hermesHome: paths.hermesHome,
    bridgeFile: paths.bridgeFile,
    projectsFile: paths.projectsFile,
    globalSkillFile: paths.globalSkillFile,
    bridgeExists,
    projectsExists,
    globalSkillExists,
    profileCount: profiles.length,
    enforcedProfiles,
    projectCount,
    readyProjects,
    needsAttention,
    generatedAt,
    profiles: profileStatuses,
    hermesHomeExists: await isDirectory(paths.hermesHome)
  };
}
