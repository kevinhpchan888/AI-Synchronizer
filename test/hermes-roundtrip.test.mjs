import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { installHermesMemoryBridge } from "../src/lib/hermes-bridge.mjs";
import { rebuildSemanticMemory } from "../src/lib/semantic-memory.mjs";

// H2: the executable definition of "memory works for Hermes".
// A cold Hermes profile knows nothing but its own SOUL.md. The chain
//   SOUL.md managed block -> bridge file -> project capsule -> startup packet
// must be navigable by following pointers found in each file, and the
// destination files must carry the full project context. This test walks
// the chain exactly like an agent would: every path is parsed out of the
// previous file's text, never constructed by the test.

async function makeProject() {
  const root = await mkdtemp(path.join(os.tmpdir(), "hermes-roundtrip-project-"));
  await mkdir(path.join(root, ".ai-memory"), { recursive: true });
  await writeFile(
    path.join(root, ".ai-memory", "HANDOFF.md"),
    "# Handoff\n\n## Latest Handoff\n\nRouting table refactored; the retry queue drain is still unverified.\n",
    "utf8"
  );
  await writeFile(
    path.join(root, ".ai-memory", "STATUS.md"),
    "# Status\n\n## Current Focus\n\nVerify the retry queue drain.\n",
    "utf8"
  );
  await writeFile(
    path.join(root, ".ai-memory", "TASKS.md"),
    "# Tasks\n\n- [ ] Verify retry queue drain under load\n",
    "utf8"
  );
  await mkdir(path.join(root, "src"), { recursive: true });
  await writeFile(path.join(root, "src", "queue.mjs"), "export const route = '/api/queue/drain';\n", "utf8");
  const project = {
    id: "relay",
    name: "Relay",
    path: root,
    exists: true,
    isRepo: true,
    isContext: false,
    state: "dirty",
    branch: "feature/queue-drain",
    dirtyCount: 1,
    changedFiles: ["src/queue.mjs"]
  };
  await rebuildSemanticMemory(project, { reason: "hermes-roundtrip", agent: "hermes" });
  return project;
}

function pointerAfter(text, label) {
  const line = text.split("\n").find((item) => item.includes(label));
  assert.ok(line, `expected a "${label}" pointer`);
  return line.slice(line.indexOf(label) + label.length).trim();
}

test("cold Hermes profile recovers full context by following the bridge chain", async () => {
  const hermesHome = await mkdtemp(path.join(os.tmpdir(), "hermes-roundtrip-home-"));
  const project = await makeProject();
  try {
    await installHermesMemoryBridge({ hermesHome, projectStatuses: [project], agent: "hermes" });
    await mkdir(path.join(hermesHome, "profiles", "atlas"), { recursive: true });
    await installHermesMemoryBridge({ hermesHome, projectStatuses: [project], agent: "hermes" });

    // Step 1: the agent starts from its own SOUL.md and nothing else.
    const soul = await readFile(path.join(hermesHome, "profiles", "atlas", "SOUL.md"), "utf8");
    const bridgePath = pointerAfter(soul, "memory bridge before project work:");
    assert.ok(bridgePath.endsWith("HERMES_MEMORY_BRIDGE.md"));

    // Step 2: follow the pointer to the bridge and find the project entry.
    const bridge = await readFile(bridgePath, "utf8");
    assert.match(bridge, /### Relay/);
    const capsulePath = pointerAfter(bridge, "- Capsule: ");
    const packetPath = pointerAfter(bridge, "- Startup packet: ");
    assert.notEqual(capsulePath, "missing");
    assert.notEqual(packetPath, "missing");

    // Step 3: read only the capsule and packet the bridge named.
    const capsule = await readFile(capsulePath, "utf8");
    const packet = await readFile(packetPath, "utf8");
    const recovered = `${capsule}\n${packet}`;

    // The five recoverable facts, same contract as the M1 round-trip.
    assert.match(recovered, /Relay/, "project name must be recoverable");
    assert.match(recovered, /feature\/queue-drain/, "branch must be recoverable");
    assert.match(recovered, /dirty/i, "dirty state must be recoverable");
    assert.match(recovered, /retry queue drain is still unverified/i, "last handoff must be recoverable");
    assert.match(recovered, /Verify retry queue drain under load/i, "open tasks must be recoverable");
    assert.match(recovered, /queue\.mjs/, "code location pointer must be recoverable");
  } finally {
    await rm(hermesHome, { recursive: true, force: true });
    await rm(project.path, { recursive: true, force: true });
  }
});
