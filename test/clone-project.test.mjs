import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { run } from "../src/lib/command.mjs";
import { cloneGitProject, normalizeRepoUrl, repoNameFromUrl } from "../src/lib/workspaces.mjs";

async function makeRemoteRepo() {
  const root = await mkdtemp(path.join(os.tmpdir(), "ai-sync-clone-"));
  const source = path.join(root, "source");
  const remote = path.join(root, "remote.git");
  await mkdir(source, { recursive: true });
  await run("git", ["init"], { cwd: source, timeout: 30000 });
  await run("git", ["config", "user.email", "test@example.com"], { cwd: source, timeout: 30000 });
  await run("git", ["config", "user.name", "AI Sync Test"], { cwd: source, timeout: 30000 });
  await writeFile(path.join(source, "README.md"), "# Clone Demo\n\nThis repo proves visual cloning.\n", "utf8");
  await run("git", ["add", "README.md"], { cwd: source, timeout: 30000 });
  await run("git", ["commit", "-m", "Initial commit"], { cwd: source, timeout: 30000 });
  await run("git", ["clone", "--bare", source, remote], { cwd: root, timeout: 30000 });
  return { root, source, remote };
}

test("normalizes GitHub repo input", () => {
  assert.equal(normalizeRepoUrl("kevinhpchan888/APC"), "https://github.com/kevinhpchan888/APC.git");
  assert.equal(normalizeRepoUrl("gh:kevinhpchan888/APC"), "https://github.com/kevinhpchan888/APC.git");
  assert.equal(normalizeRepoUrl("https://github.com/kevinhpchan888/APC"), "https://github.com/kevinhpchan888/APC.git");
  assert.equal(repoNameFromUrl("git@github.com:kevinhpchan888/APC.git"), "APC");
});

test("cloneGitProject clones, registers, and builds memory capsule", async () => {
  const remote = await makeRemoteRepo();
  const projectsHome = path.join(remote.root, "GitHub");
  try {
    const result = await cloneGitProject({
      repoUrl: remote.remote,
      name: "Clone Demo",
      folderName: "Clone-Demo",
      projectsHome
    }, {
      addProject: async (input) => ({
        id: "clone-demo",
        name: input.name,
        path: input.path,
        createdAt: new Date().toISOString()
      })
    });

    assert.equal(result.ok, true);
    assert.equal(result.project.name, "Clone Demo");
    assert.equal(result.status.isRepo, true);
    assert.equal(result.memory.ok, true);
    assert.equal(result.semantic.ok, true);
    assert.equal(result.targetPath, path.join(projectsHome, "Clone-Demo"));
    assert.match(await readFile(path.join(result.targetPath, ".ai-memory", "semantic", "CONTEXT_CAPSULE.md"), "utf8"), /Clone Demo/);
  } finally {
    await rm(remote.root, { recursive: true, force: true });
  }
});
