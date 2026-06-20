import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildHermesMemoryStatus, runHermesMemoryJob } from "../src/lib/hermes-memory.mjs";
import { rebuildSemanticMemory } from "../src/lib/semantic-memory.mjs";

async function makeProject() {
  const root = await mkdtemp(path.join(os.tmpdir(), "ai-sync-hermes-memory-"));
  await mkdir(path.join(root, ".ai-memory"), { recursive: true });
  await writeFile(path.join(root, ".ai-memory", "PROJECT.md"), "# Hermes Project\n\n## Purpose\n\nTest Hermes memory.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "HANDOFF.md"), "# Handoff\n\n## Latest Handoff\n\nClaude finished the checkout fix.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "STATUS.md"), "# Status\n\n## Current Focus\n\nKeep Hermes context current.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "TASKS.md"), "# Tasks\n\n## Active\n\n- [ ] Verify Hermes memory recall.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "DECISIONS.md"), "# Decisions\n\n- Hermes must read the memory capsule before routing work.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "RULES.md"), "# Rules\n\n- Read memory before work.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "CONTEXT_INDEX.json"), "{}\n", "utf8");
  await writeFile(path.join(root, "AGENTS.md"), "# Agent Rules\n\nRead the memory capsule first.\n", "utf8");
  return {
    id: "hermes-project",
    name: "Hermes Project",
    path: root,
    exists: true,
    isRepo: true,
    isContext: false,
    state: "synced",
    changedFiles: []
  };
}

test("Hermes memory status publishes compact capsules for ready projects", async () => {
  const project = await makeProject();
  try {
    await rebuildSemanticMemory(project, { reason: "test", agent: "hermes" });
    const status = await buildHermesMemoryStatus({ projectStatuses: [project], agent: "hermes" });

    assert.equal(status.ok, true);
    assert.equal(status.readyProjects, 1);
    assert.equal(status.projects[0].projectName, "Hermes Project");
    assert.equal(status.projects[0].readiness, "ready");
    assert.match(status.projects[0].recallPrompt, /CONTEXT_CAPSULE\.md/);
    assert.match(status.projects[0].summary, /Keep Hermes context current/);
  } finally {
    await rm(project.path, { recursive: true, force: true });
  }
});

test("Hermes memory job refreshes semantic memory and writes a capsule", async () => {
  const project = await makeProject();
  try {
    const result = await runHermesMemoryJob(
      { action: "refresh_memory", project_id: project.id, payload: { agent: "hermes" } },
      { projectStatuses: [project] }
    );
    const capsule = await readFile(path.join(project.path, ".ai-memory", "semantic", "CONTEXT_CAPSULE.md"), "utf8");

    assert.equal(result.handled, true);
    assert.equal(result.ok, true);
    assert.equal(result.projectName, "Hermes Project");
    assert.match(result.capsule.recallPrompt, /AGENT_STARTUP\.md/);
    assert.match(capsule, /Hermes Project/);
  } finally {
    await rm(project.path, { recursive: true, force: true });
  }
});
