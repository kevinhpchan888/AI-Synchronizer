import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { rebuildSemanticMemory } from "../src/lib/semantic-memory.mjs";

// M1: the executable definition of "memory works".
// A cold agent (compressed session, or switched Claude<->Codex, or PC<->Mac)
// must be able to resume from ONLY these two files:
//   .ai-memory/semantic/CONTEXT_CAPSULE.md
//   .ai-memory/semantic/AGENT_STARTUP.md
// This test builds memory for a fixture project, then reads only those two
// files and asserts every recoverable fact a resuming agent needs is present.

async function makeProject() {
  const root = await mkdtemp(path.join(os.tmpdir(), "ai-sync-roundtrip-"));
  await mkdir(path.join(root, ".ai-memory"), { recursive: true });
  await writeFile(
    path.join(root, ".ai-memory", "HANDOFF.md"),
    "# Handoff\n\n## Latest Handoff\n\nFinished the checkout flow refactor; payment webhook still unverified.\n",
    "utf8"
  );
  await writeFile(
    path.join(root, ".ai-memory", "STATUS.md"),
    "# Status\n\n## Current Focus\n\nShip the payment webhook verification.\n",
    "utf8"
  );
  await writeFile(
    path.join(root, ".ai-memory", "TASKS.md"),
    "# Tasks\n\n- [ ] Verify payment webhook signature end to end\n- [x] Refactor checkout flow\n",
    "utf8"
  );
  await writeFile(
    path.join(root, ".ai-memory", "DECISIONS.md"),
    "# Decisions\n\n- Webhook handlers live in src/webhooks.mjs.\n",
    "utf8"
  );
  await writeFile(path.join(root, "README.md"), "# Storefront\n\nCheckout and payments service.\n", "utf8");
  await mkdir(path.join(root, "src"), { recursive: true });
  await writeFile(
    path.join(root, "src", "webhooks.mjs"),
    "export const route = '/api/webhooks/payment';\n",
    "utf8"
  );
  return {
    id: "storefront",
    name: "Storefront",
    path: root,
    exists: true,
    isRepo: true,
    isContext: false,
    state: "dirty",
    branch: "feature/webhook-verify",
    dirtyCount: 2,
    changedFiles: ["src/webhooks.mjs", "README.md"]
  };
}

test("cold agent can resume from capsule + startup packet alone", async () => {
  const project = await makeProject();
  try {
    const rebuilt = await rebuildSemanticMemory(project, { reason: "roundtrip-test", agent: "all" });
    assert.equal(rebuilt.ok, true);

    // Read ONLY the two recovery files. Nothing else is allowed as input.
    const capsule = await readFile(path.join(project.path, ".ai-memory", "semantic", "CONTEXT_CAPSULE.md"), "utf8");
    const packet = await readFile(path.join(project.path, ".ai-memory", "semantic", "AGENT_STARTUP.md"), "utf8");
    const recovered = `${capsule}\n${packet}`;

    // 1. What is this project?
    assert.match(recovered, /Storefront/, "project name must be recoverable");

    // 2. What branch am I on, and is the tree dirty?
    assert.match(recovered, /feature\/webhook-verify/, "current branch must be recoverable");
    assert.match(recovered, /dirty/i, "dirty state must be recoverable");
    assert.match(recovered, /src\/webhooks\.mjs/, "uncommitted files must be listed");

    // 3. What was the last handoff?
    assert.match(recovered, /payment webhook still unverified/i, "last handoff must be recoverable");

    // 4. What do I do next?
    assert.match(recovered, /Verify payment webhook signature/i, "open tasks must be recoverable");

    // 5. Where does the relevant code live?
    assert.match(recovered, /webhooks\.mjs/, "code location pointer must be recoverable");

    // The capsule alone must at least identify the project and point to the packet.
    assert.match(capsule, /Storefront/);
    assert.match(capsule, /AGENT_STARTUP\.md/);
  } finally {
    await rm(project.path, { recursive: true, force: true });
  }
});
