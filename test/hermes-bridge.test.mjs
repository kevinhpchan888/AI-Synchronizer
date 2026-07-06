import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { getHermesMemoryBridgeStatus, installHermesMemoryBridge } from "../src/lib/hermes-bridge.mjs";
import { runHermesMemoryJob } from "../src/lib/hermes-memory.mjs";
import { rebuildSemanticMemory } from "../src/lib/semantic-memory.mjs";

async function makeHermesHome() {
  const home = await mkdtemp(path.join(os.tmpdir(), "ai-sync-hermes-home-"));
  for (const profile of ["atlas", "iris"]) {
    const profileDir = path.join(home, "profiles", profile);
    await mkdir(profileDir, { recursive: true });
    await writeFile(path.join(profileDir, "SOUL.md"), `# ${profile}\n\nExisting profile instructions.\n`, "utf8");
  }
  return home;
}

async function makeProject() {
  const root = await mkdtemp(path.join(os.tmpdir(), "ai-sync-hermes-bridge-project-"));
  await mkdir(path.join(root, ".ai-memory"), { recursive: true });
  await writeFile(path.join(root, ".ai-memory", "PROJECT.md"), "# Hermes Bridge Project\n\n## Purpose\n\nTest enforced Hermes memory.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "HANDOFF.md"), "# Handoff\n\n## Latest Handoff\n\nBuild the bridge.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "STATUS.md"), "# Status\n\n## Current Focus\n\nForce profile memory recall.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "TASKS.md"), "# Tasks\n\n## Active\n\n- [ ] Install bridge in every Hermes profile.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "DECISIONS.md"), "# Decisions\n\n- Hermes profiles must read the capsule first.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "RULES.md"), "# Rules\n\n- Read memory before work.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "CONTEXT_INDEX.json"), "{}\n", "utf8");
  const project = {
    id: "hermes-bridge-project",
    name: "Hermes Bridge Project",
    path: root,
    exists: true,
    isRepo: true,
    isContext: false,
    state: "synced",
    changedFiles: []
  };
  await rebuildSemanticMemory(project, { reason: "test", agent: "hermes" });
  return project;
}

test("installHermesMemoryBridge writes a shared bridge and profile rules", async () => {
  const hermesHome = await makeHermesHome();
  const project = await makeProject();
  try {
    const result = await installHermesMemoryBridge({ hermesHome, projectStatuses: [project], agent: "hermes" });
    assert.equal(result.ok, true);
    assert.equal(result.profileCount, 2);
    assert.equal(result.projectCount, 1);

    const bridge = await readFile(path.join(hermesHome, "ai-sync-memory", "HERMES_MEMORY_BRIDGE.md"), "utf8");
    assert.match(bridge, /AI Sync Hermes Memory Bridge/);
    assert.match(bridge, /Hermes Bridge Project/);
    assert.match(bridge, /CONTEXT_CAPSULE\.md/);

    for (const profile of ["atlas", "iris"]) {
      const soul = await readFile(path.join(hermesHome, "profiles", profile, "SOUL.md"), "utf8");
      assert.match(soul, /AI_SYNC_MEMORY_BRIDGE:start/);
      assert.match(soul, /Read the AI Sync memory bridge before project work/);
      assert.match(soul, /HERMES_MEMORY_BRIDGE\.md/);
      const skill = await readFile(path.join(hermesHome, "profiles", profile, "skills", "ai-sync-memory", "SKILL.md"), "utf8");
      assert.match(skill, /Use this before Hermes works on a project/);
    }
  } finally {
    await rm(hermesHome, { recursive: true, force: true });
    await rm(project.path, { recursive: true, force: true });
  }
});

test("bridge stays a compact routing table and defers detail to the capsule", async () => {
  const hermesHome = await makeHermesHome();
  const project = await makeProject();
  try {
    await installHermesMemoryBridge({ hermesHome, projectStatuses: [project], agent: "hermes" });

    const bridge = await readFile(path.join(hermesHome, "ai-sync-memory", "HERMES_MEMORY_BRIDGE.md"), "utf8");

    // Routing essentials are present.
    assert.match(bridge, /Hermes Bridge Project/);
    assert.match(bridge, /Readiness:/);
    assert.match(bridge, /CONTEXT_CAPSULE\.md/);
    assert.match(bridge, /AGENT_STARTUP\.md/);

    // Bulky content stays out of the bridge; it belongs in the capsule.
    assert.doesNotMatch(bridge, /Recall prompt:/);
    assert.doesNotMatch(bridge, /Latest handoff:/);
    assert.doesNotMatch(bridge, /Changed since handoff:/);

    // Size guard: a ready project entry stays a small pointer block.
    const entry = bridge.slice(bridge.indexOf("### Hermes Bridge Project"));
    assert.ok(entry.length < 600, `bridge entry too large: ${entry.length} bytes`);

    // No context is lost: the capsule the bridge points to still carries the handoff.
    const capsuleLine = bridge.split("\n").find((line) => line.startsWith("- Capsule: "));
    const capsulePath = capsuleLine.replace("- Capsule: ", "").trim();
    const capsule = await readFile(capsulePath, "utf8");
    assert.match(capsule, /Build the bridge/);

    // The data plane keeps the full detail for workers and the cloud.
    const manifest = JSON.parse(await readFile(path.join(hermesHome, "ai-sync-memory", "projects.json"), "utf8"));
    assert.ok(manifest.projects[0].latestHandoff, "projects.json must keep latestHandoff");
    assert.ok(manifest.projects[0].recallPrompt, "projects.json must keep recallPrompt");
  } finally {
    await rm(hermesHome, { recursive: true, force: true });
    await rm(project.path, { recursive: true, force: true });
  }
});

test("bridge readiness stays honest across stale and refresh", async () => {
  // Mirrors the worker lifecycle: memory jobs rebuild project memory, and
  // handleJob rewrites the bridge afterward (via installHermesMemoryBridge).
  // The bridge snapshot must flip to attention when a project goes stale
  // and back to ready after a memory refresh.
  const hermesHome = await makeHermesHome();
  const project = await makeProject();
  const bridgeFile = path.join(hermesHome, "ai-sync-memory", "HERMES_MEMORY_BRIDGE.md");
  try {
    await installHermesMemoryBridge({ hermesHome, projectStatuses: [project], agent: "hermes" });
    let bridge = await readFile(bridgeFile, "utf8");
    assert.match(bridge, /- Readiness: ready/);
    assert.doesNotMatch(bridge, /- Attention:/);

    // Project changes after the build: semantic memory is now stale.
    const changed = path.join(project.path, "AGENTS.md");
    await writeFile(changed, "# Agent Rules\n\nRead the memory capsule first. Updated.\n", "utf8");
    const future = new Date(Date.now() + 10_000);
    await utimes(changed, future, future);

    await installHermesMemoryBridge({ hermesHome, projectStatuses: [project], agent: "hermes" });
    bridge = await readFile(bridgeFile, "utf8");
    assert.doesNotMatch(bridge, /- Readiness: ready/);
    assert.match(bridge, /- Attention:/);

    // A memory job heals the project, then the bridge rewrite reports ready.
    const job = await runHermesMemoryJob(
      { action: "refresh_memory", project_id: project.id, payload: { agent: "hermes" } },
      { projectStatuses: [project] }
    );
    assert.equal(job.ok, true);
    await installHermesMemoryBridge({ hermesHome, projectStatuses: [project], agent: "hermes" });
    bridge = await readFile(bridgeFile, "utf8");
    assert.match(bridge, /- Readiness: ready/);
    assert.doesNotMatch(bridge, /- Attention:/);
  } finally {
    await rm(hermesHome, { recursive: true, force: true });
    await rm(project.path, { recursive: true, force: true });
  }
});

test("installHermesMemoryBridge updates the managed block without duplicating it", async () => {
  const hermesHome = await makeHermesHome();
  const project = await makeProject();
  try {
    await installHermesMemoryBridge({ hermesHome, projectStatuses: [project], agent: "hermes" });
    await installHermesMemoryBridge({ hermesHome, projectStatuses: [project], agent: "hermes" });

    const soul = await readFile(path.join(hermesHome, "profiles", "atlas", "SOUL.md"), "utf8");
    assert.equal((soul.match(/AI_SYNC_MEMORY_BRIDGE:start/g) || []).length, 1);
    assert.equal((soul.match(/AI_SYNC_MEMORY_BRIDGE:end/g) || []).length, 1);

    const status = await getHermesMemoryBridgeStatus({ hermesHome });
    assert.equal(status.ok, true);
    assert.equal(status.installed, true);
    assert.equal(status.profileCount, 2);
    assert.equal(status.enforcedProfiles, 2);
  } finally {
    await rm(hermesHome, { recursive: true, force: true });
    await rm(project.path, { recursive: true, force: true });
  }
});
