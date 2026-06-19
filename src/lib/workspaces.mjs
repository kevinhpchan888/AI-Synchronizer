import { promises as fs } from "node:fs";
import path from "node:path";
import { addProject } from "./registry.mjs";
import { getProjectStatus, runProjectAction } from "./git.mjs";
import { run } from "./command.mjs";
import { appendMemoryEvent, initializeProjectMemory, writeProjectHandoff } from "./memory.mjs";

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
    memory
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
  if (!status.exists || !status.isRepo) return { ok: false, message: "Workspace must be an available Git repo first." };
  const handoff = await writeProjectHandoff(status, handoffSummary || `Switching to ${targetAgent}.`);
  await appendMemoryEvent(status, "agent_switch", {
    targetAgent,
    handoffSummary: handoffSummary || ""
  });
  return {
    ok: true,
    message: `Ready to continue in ${targetAgent}.`,
    handoff
  };
}
