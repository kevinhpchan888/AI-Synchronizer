import { promises as fs } from "node:fs";
import path from "node:path";
import { addProject, getProjectsHome } from "./registry.mjs";
import { getProjectStatus, runProjectAction } from "./git.mjs";
import { run } from "./command.mjs";
import { appendMemoryEvent, initializeProjectMemory, writeProjectHandoff } from "./memory.mjs";
import { rebuildSemanticMemory } from "./semantic-memory.mjs";

async function exists(folder) {
  try {
    await fs.access(folder);
    return true;
  } catch {
    return false;
  }
}

async function ensureReadme(projectPath, name) {
  const readme = path.join(projectPath, "README.md");
  if (await exists(readme)) return false;
  await fs.writeFile(readme, `# ${name}\n\nAI workspace initialized by Kevin Sync Console.\n`, "utf8");
  return true;
}

async function isGitRepo(projectPath) {
  const result = await run("git", ["rev-parse", "--is-inside-work-tree"], { cwd: projectPath, timeout: 10000 });
  return result.ok && result.stdout.trim() === "true";
}

async function isEmptyDirectory(folder) {
  try {
    const entries = await fs.readdir(folder);
    return entries.length === 0;
  } catch {
    return false;
  }
}

function sanitizeFolderName(value) {
  return String(value ?? "")
    .trim()
    .replace(/\.git$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function repoNameFromUrl(repoUrl) {
  const text = String(repoUrl ?? "").trim();
  if (!text) return "";
  const cleaned = text.replace(/[?#].*$/, "").replace(/\/+$/, "");
  const match = cleaned.match(/[:/]([^/:]+?)(?:\.git)?$/);
  return sanitizeFolderName(match?.[1] ?? "");
}

export function normalizeRepoUrl(repoUrl) {
  const text = String(repoUrl ?? "").trim();
  if (!text) return "";
  if (/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+(?:\.git)?$/i.test(text)) {
    return text.endsWith(".git") ? text : `${text}.git`;
  }
  if (/^git@github\.com:[^/\s]+\/[^/\s]+(?:\.git)?$/i.test(text)) {
    return text.endsWith(".git") ? text : `${text}.git`;
  }
  if (/^gh:[^/\s]+\/[^/\s]+$/i.test(text)) {
    return `https://github.com/${text.slice(3)}.git`;
  }
  if (/^[^/\s]+\/[^/\s]+$/i.test(text)) {
    return `https://github.com/${text}.git`;
  }
  return text;
}

function isLikelyCloneSource(repoUrl) {
  const text = String(repoUrl ?? "").trim();
  return /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+(?:\.git)?$/i.test(text)
    || /^git@github\.com:[^/\s]+\/[^/\s]+(?:\.git)?$/i.test(text)
    || /^gh:[^/\s]+\/[^/\s]+$/i.test(text)
    || /^[^/\s]+\/[^/\s]+$/i.test(text)
    || path.isAbsolute(text);
}

async function gitLine(projectPath, args) {
  const result = await run("git", args, { cwd: projectPath, timeout: 10000 });
  return result.ok ? String(result.stdout || "").trim() : "";
}

async function gitLines(projectPath, args, limit = 12) {
  const output = await gitLine(projectPath, args);
  return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, limit);
}

function agentLabel(agent) {
  if (agent === "codex") return "Codex";
  if (agent === "claude") return "Claude Code";
  if (agent === "glm") return "GLM 5.2";
  return "the next AI tool";
}

function parsePorcelainFiles(output) {
  return String(output ?? "").split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const file = line.slice(3).trim();
      const normalized = file.includes(" -> ") ? file.split(" -> ").pop() : file;
      return normalized.replace(/\\/g, "/");
    });
}

function isAutoHandoffFile(file) {
  return file === ".ai-memory/HANDOFF.md" || file.startsWith(".ai-memory/events/") || file.startsWith(".ai-memory/semantic/");
}

async function saveHandoffIfIsolated(status) {
  if (!status.isRepo || !status.upstream) return { saved: false, pushed: false, message: "Handoff saved locally." };
  const porcelain = await run("git", ["status", "--porcelain=v1"], { cwd: status.path, timeout: 10000 });
  if (!porcelain.ok) return { saved: false, pushed: false, message: porcelain.stderr || porcelain.message };
  const changedFiles = parsePorcelainFiles(porcelain.stdout);
  if (!changedFiles.length || !changedFiles.every(isAutoHandoffFile)) {
    return { saved: false, pushed: false, message: "Handoff saved locally with other project changes present." };
  }

  await run("git", ["add", ".ai-memory/HANDOFF.md", ".ai-memory/events", ".ai-memory/semantic"], { cwd: status.path, timeout: 30000 });
  const commit = await run("git", ["commit", "-m", "Update AI handoff"], { cwd: status.path, timeout: 120000 });
  if (!commit.ok && !/nothing to commit/i.test(`${commit.stdout}\n${commit.stderr}`)) {
    return { saved: false, pushed: false, message: commit.stderr || commit.message };
  }
  const push = await run("git", ["push"], { cwd: status.path, timeout: 120000 });
  return {
    saved: commit.ok,
    pushed: push.ok,
    message: push.ok ? "Handoff saved and pushed." : push.stderr || push.message
  };
}

export async function generateWorkspaceHandoff(project, targetAgent) {
  const status = await getProjectStatus(project);
  if (!status.exists || (!status.isRepo && !status.isContext)) return "";

  const target = agentLabel(targetAgent);
  const changedFiles = status.isRepo ? await gitLines(status.path, ["status", "--short"], 10) : [];
  const latestCommit = status.isRepo ? await gitLine(status.path, ["log", "-1", "--oneline"]) : "";
  const remoteLine = status.remote ? `Remote: ${status.remote}` : "Remote: none / context-only";
  const branchLine = status.branch ? `Branch: ${status.branch}` : "Branch: not applicable";
  const changeLine = changedFiles.length
    ? `Working tree changes (${changedFiles.length}${changedFiles.length === 10 ? "+" : ""}): ${changedFiles.join("; ")}`
    : "Working tree: clean or not repo-based.";
  const commitLine = latestCommit ? `Latest commit: ${latestCommit}` : "Latest commit: not available.";

  return [
    `Auto-generated handoff for ${target}.`,
    `Project: ${status.name}`,
    `Path: ${status.path}`,
    `${branchLine}`,
    `${remoteLine}`,
    `Sync state: ${status.message || status.state}`,
    `${changeLine}`,
    `${commitLine}`,
    "Memory instruction: read .ai-memory/semantic/AGENT_STARTUP.md first, then .ai-memory/PROJECT.md, STATUS.md, HANDOFF.md, RULES.md, TASKS.md, and CONTEXT_INDEX.json before making substantial changes.",
    `Next step: continue ${status.name} from the current project state in ${target}. If the console shows red or yellow for this active project, fix that first.`,
    `Generated by AI Sync Console at ${new Date().toISOString()}.`
  ].join("\n");
}

export async function adoptWorkspace(input) {
  const projectPath = path.resolve(input.path);
  const name = input.name?.trim() || path.basename(projectPath);
  await fs.mkdir(projectPath, { recursive: true });

  let initializedGit = false;
  if (!(await isGitRepo(projectPath))) {
    const init = await run("git", ["init"], { cwd: projectPath, timeout: 30000 });
    if (!init.ok) return { ok: false, message: init.stderr || init.message || "Could not initialize local Git." };
    initializedGit = true;
  }

  const createdReadme = await ensureReadme(projectPath, name);
  const project = await addProject({ name, path: projectPath });
  const status = await getProjectStatus(project);
  const memory = await initializeProjectMemory(status);
  const semantic = await rebuildSemanticMemory(status, { reason: "workspace_adopted", agent: "all" });
  await appendMemoryEvent(status, "workspace_adopted", {
    initializedGit,
    createdReadme,
    adoptedFor: "Claude Code and Codex shared workspace"
  });

  return {
    ok: true,
    message: initializedGit ? "Workspace adopted with local Git and memory." : "Workspace adopted with memory.",
    project,
    status: await getProjectStatus(project),
    memory,
    semantic
  };
}

export async function cloneGitProject(input, options = {}) {
  const repoUrl = normalizeRepoUrl(input.repoUrl);
  if (!repoUrl || !isLikelyCloneSource(input.repoUrl)) {
    return { ok: false, message: "Enter a GitHub repo URL, SSH URL, or owner/repo name." };
  }

  const projectsHome = path.resolve(input.projectsHome || getProjectsHome());
  const folderName = sanitizeFolderName(input.folderName || input.name || repoNameFromUrl(repoUrl));
  if (!folderName) return { ok: false, message: "Could not determine the project folder name." };

  const targetPath = path.resolve(projectsHome, folderName);
  if (!targetPath.startsWith(`${projectsHome}${path.sep}`) && targetPath !== projectsHome) {
    return { ok: false, message: "Project folder must stay inside the GitHub projects folder." };
  }

  await fs.mkdir(projectsHome, { recursive: true });
  const targetExists = await exists(targetPath);
  if (targetExists && !(await isEmptyDirectory(targetPath))) {
    return {
      ok: false,
      message: `Folder already exists: ${targetPath}. Use Scan GitHub Folder if it is already cloned.`
    };
  }

  const runner = options.run ?? run;
  const clone = await runner("git", ["clone", repoUrl, targetPath], { cwd: projectsHome, timeout: options.timeout ?? 300000 });
  if (!clone.ok) {
    return {
      ok: false,
      message: clone.stderr || clone.message || "Git clone failed.",
      clone
    };
  }

  const registerProject = options.addProject ?? addProject;
  const project = await registerProject({ name: input.name?.trim() || folderName, path: targetPath });
  const status = await getProjectStatus(project);
  const memory = await initializeProjectMemory(status);
  const semantic = await rebuildSemanticMemory(status, { reason: "project_cloned", agent: "all" });
  await appendMemoryEvent(status, "project_cloned", {
    repoUrl,
    targetPath,
    projectsHome
  });

  return {
    ok: true,
    message: `${status.name} cloned and prepared for Claude, Codex, and Hermes.`,
    repoUrl,
    targetPath,
    project,
    status: await getProjectStatus(project),
    memory,
    semantic
  };
}

export async function checkpointWorkspace(project, label = "AI workspace checkpoint") {
  const status = await getProjectStatus(project);
  if (!status.exists || !status.isRepo) return { ok: false, message: "Workspace must be an available Git repo first." };
  const commit = await runProjectAction(status, "commitWip");
  if (!commit.ok && !String(commit.message).includes("nothing to commit")) return commit;
  await appendMemoryEvent(status, "workspace_checkpoint", { label });
  return { ok: true, message: "Workspace checkpoint saved.", commit };
}

export async function switchWorkspaceAgent(project, targetAgent, handoffSummary) {
  const status = await getProjectStatus(project);
  if (!status.exists || (!status.isRepo && !status.isContext)) return { ok: false, message: "Workspace or context space must be available first." };
  const summary = handoffSummary?.trim() || await generateWorkspaceHandoff(project, targetAgent);
  const handoff = await writeProjectHandoff(status, summary);
  const semantic = await rebuildSemanticMemory(status, { reason: "agent_switch", agent: targetAgent });
  await appendMemoryEvent(status, "agent_switch", {
    targetAgent,
    handoffSummary: summary,
    generated: !handoffSummary?.trim()
  });
  const handoffSync = await saveHandoffIfIsolated(status);
  return {
    ok: true,
    message: handoffSync.pushed ? `Ready to continue in ${agentLabel(targetAgent)}. Handoff saved and pushed.` : `Ready to continue in ${agentLabel(targetAgent)}.`,
    generatedHandoff: summary,
    handoffSync,
    handoff,
    semantic
  };
}

export async function refreshWorkspaceHandoff(project, targetAgent = "handoff") {
  const status = await getProjectStatus(project);
  if (!status.exists || (!status.isRepo && !status.isContext)) return { ok: false, message: "Workspace or context space must be available first." };
  const summary = await generateWorkspaceHandoff(project, targetAgent);
  const handoff = await writeProjectHandoff(status, summary);
  const semantic = await rebuildSemanticMemory(status, { reason: "handoff_refresh", agent: targetAgent });
  return {
    ok: true,
    message: "Automatic handoff refreshed.",
    generatedHandoff: summary,
    handoff,
    semantic
  };
}
