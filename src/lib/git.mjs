import { promises as fs } from "node:fs";
import { run } from "./command.mjs";

async function pathExists(projectPath) {
  try {
    await fs.access(projectPath);
    return true;
  } catch {
    return false;
  }
}

async function git(projectPath, args, timeout = 30000) {
  return run("git", args, { cwd: projectPath, timeout });
}

function clean(value) {
  return String(value ?? "").trim();
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
  return file === ".ai-memory/HANDOFF.md" || file.startsWith(".ai-memory/events/");
}

export async function getProjectStatus(project) {
  const exists = await pathExists(project.path);
  if (!exists) {
    return { ...project, exists: false, isRepo: false, state: "missing", message: "Folder missing" };
  }

  if (project.kind === "context") {
    return {
      ...project,
      exists: true,
      isRepo: false,
      isContext: true,
      branch: null,
      remote: null,
      upstream: null,
      dirtyCount: 0,
      ahead: 0,
      behind: 0,
      state: "context",
      message: "Context space"
    };
  }

  const inside = await git(project.path, ["rev-parse", "--is-inside-work-tree"], 10000);
  if (!inside.ok || clean(inside.stdout) !== "true") {
    return { ...project, exists: true, isRepo: false, state: "not-repo", message: "Not a Git repo" };
  }

  const [branch, remote, porcelain, upstream] = await Promise.all([
    git(project.path, ["rev-parse", "--abbrev-ref", "HEAD"], 10000),
    git(project.path, ["remote", "get-url", "origin"], 10000),
    git(project.path, ["status", "--porcelain=v1"], 10000),
    git(project.path, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"], 10000)
  ]);

  let ahead = 0;
  let behind = 0;
  if (upstream.ok) {
    const counts = await git(project.path, ["rev-list", "--left-right", "--count", "HEAD...@{u}"], 10000);
    if (counts.ok) {
      const [aheadRaw, behindRaw] = clean(counts.stdout).split(/\s+/);
      ahead = Number.parseInt(aheadRaw, 10) || 0;
      behind = Number.parseInt(behindRaw, 10) || 0;
    }
  }

  const changedFiles = parsePorcelainFiles(porcelain.stdout);
  const dirtyCount = changedFiles.length;
  const handoffOnlyDirty = dirtyCount > 0 && changedFiles.every(isAutoHandoffFile);
  let state = "synced";
  let message = "Synced";
  if (!upstream.ok) {
    state = "warning";
    message = "No upstream branch";
  } else if (handoffOnlyDirty) {
    state = "handoff-local";
    message = "Handoff saved locally";
  } else if (dirtyCount > 0) {
    state = "dirty";
    message = `${dirtyCount} local change${dirtyCount === 1 ? "" : "s"}`;
  } else if (ahead > 0 && behind > 0) {
    state = "diverged";
    message = `${ahead} ahead, ${behind} behind`;
  } else if (ahead > 0) {
    state = "ahead";
    message = `${ahead} commit${ahead === 1 ? "" : "s"} to push`;
  } else if (behind > 0) {
    state = "behind";
    message = `${behind} commit${behind === 1 ? "" : "s"} to pull`;
  }

  return {
    ...project,
    exists: true,
    isRepo: true,
    branch: clean(branch.stdout) || "unknown",
    remote: clean(remote.stdout) || null,
    upstream: upstream.ok ? clean(upstream.stdout) : null,
    dirtyCount,
    changedFiles,
    handoffOnlyDirty,
    ahead,
    behind,
    state,
    message
  };
}

export async function runProjectAction(project, action) {
  if (action === "saveHandoff") {
    await git(project.path, ["add", ".ai-memory/HANDOFF.md", ".ai-memory/events"], 30000);
    const commit = await git(project.path, ["commit", "-m", "Update AI handoff"], 120000);
    if (!commit.ok && !/nothing to commit/i.test(commit.stdout + commit.stderr)) {
      return { ok: false, action, stdout: commit.stdout, stderr: commit.stderr, message: commit.stderr || commit.message };
    }
    const push = await git(project.path, ["push"], 120000);
    return {
      ok: push.ok,
      action,
      stdout: `${commit.stdout}\n${push.stdout}`,
      stderr: `${commit.stderr}\n${push.stderr}`,
      message: push.ok ? "Handoff saved and pushed." : push.stderr || push.message
    };
  }

  const commands = {
    fetch: ["fetch", "--all", "--prune"],
    pull: ["pull", "--ff-only"],
    push: ["push"],
    commitWip: ["commit", "-am", `WIP sync ${new Date().toISOString()}`]
  };

  if (!commands[action]) {
    return { ok: false, message: `Unknown Git action: ${action}` };
  }

  if (action === "commitWip") {
    await git(project.path, ["add", "-A"], 30000);
  }

  const result = await git(project.path, commands[action], 120000);
  return {
    ok: result.ok,
    action,
    stdout: result.stdout,
    stderr: result.stderr,
    message: result.ok ? "Done" : result.stderr || result.message
  };
}
