import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { getAgentStartupPacket, getSemanticMemoryStatus, rebuildSemanticMemory, searchSemanticMemory } from "../src/lib/semantic-memory.mjs";

async function makeProject() {
  const root = await mkdtemp(path.join(os.tmpdir(), "ai-sync-memory-"));
  await mkdir(path.join(root, ".ai-memory"), { recursive: true });
  await writeFile(path.join(root, ".ai-memory", "HANDOFF.md"), "# Handoff\n\n## Latest Handoff\n\nPrevious agent finished the dashboard shell.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "STATUS.md"), "# Status\n\n## Current Focus\n\nImprove project memory.\n", "utf8");
  await writeFile(path.join(root, ".ai-memory", "DECISIONS.md"), "# Decisions\n\n- Always read AGENT_STARTUP.md first.\n", "utf8");
  await writeFile(path.join(root, "README.md"), "# Demo Project\n\nThis project has a memory console.\n", "utf8");
  await mkdir(path.join(root, "src"), { recursive: true });
  await writeFile(path.join(root, "src", "server.mjs"), "export const route = '/api/memory/briefing';\n", "utf8");
  return {
    id: "demo-project",
    name: "Demo Project",
    path: root,
    exists: true,
    isRepo: true,
    isContext: false,
    state: "synced",
    changedFiles: []
  };
}

test("semantic status becomes stale when project files change after rebuild", async () => {
  const project = await makeProject();
  try {
    const rebuilt = await rebuildSemanticMemory(project, { reason: "test" });
    assert.equal(rebuilt.ok, true);
    assert.equal((await getSemanticMemoryStatus(project)).state, "fresh");

    const changed = path.join(project.path, "src", "server.mjs");
    await writeFile(changed, "export const route = '/api/memory/briefing';\nexport const changed = true;\n", "utf8");
    const future = new Date(Date.now() + 10_000);
    await utimes(changed, future, future);

    const status = await getSemanticMemoryStatus(project);
    assert.equal(status.state, "stale");
    assert.match(status.message, /changed/i);
    assert.equal(status.changedSinceBuild, true);
  } finally {
    await rm(project.path, { recursive: true, force: true });
  }
});

test("startup packet highlights changed files and a next-agent checklist", async () => {
  const project = await makeProject();
  try {
    const old = new Date(Date.now() - 60_000);
    await utimes(path.join(project.path, ".ai-memory", "HANDOFF.md"), old, old);
    const changed = path.join(project.path, "src", "server.mjs");
    const newer = new Date(Date.now() + 5_000);
    await utimes(changed, newer, newer);

    await rebuildSemanticMemory(project, { reason: "test", agent: "codex" });
    const packet = await readFile(path.join(project.path, ".ai-memory", "semantic", "AGENT_STARTUP.md"), "utf8");

    assert.match(packet, /## Changed Since Last Handoff/);
    assert.match(packet, /src\/server\.mjs/);
    assert.match(packet, /## Next Agent Checklist/);
    assert.match(packet, /Search Memory/);
  } finally {
    await rm(project.path, { recursive: true, force: true });
  }
});

test("semantic search returns why a result matched", async () => {
  const project = await makeProject();
  try {
    await rebuildSemanticMemory(project, { reason: "test" });
    const result = await searchSemanticMemory(project, "memory briefing route");

    assert.equal(result.ok, true);
    assert.ok(result.results.length > 0);
    assert.ok(result.results[0].why);
    assert.ok(result.results[0].source);
  } finally {
    await rm(project.path, { recursive: true, force: true });
  }
});
