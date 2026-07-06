import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, utimes, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { getProjectMemoryStatus } from "../src/lib/memory.mjs";
import { rebuildSemanticMemory } from "../src/lib/semantic-memory.mjs";

// M4: the dashboard shows one honest answer instead of memory jargon.
// The resume verdict must say yes only when a fresh agent could actually
// recover from the capsule and startup packet, and must flip to a plain
// "rebuild" instruction the moment the project outruns the build.

async function makeProject() {
  const root = await mkdtemp(path.join(os.tmpdir(), "ai-sync-resume-"));
  const memory = path.join(root, ".ai-memory");
  await mkdir(memory, { recursive: true });
  await writeFile(path.join(memory, "PROJECT.md"), "# Verdict Project\n\n## Purpose\n\nTest the resume verdict.\n", "utf8");
  await writeFile(path.join(memory, "HANDOFF.md"), "# Handoff\n\n## Latest Handoff\n\nVerdict wiring in progress.\n", "utf8");
  await writeFile(path.join(memory, "STATUS.md"), "# Status\n\n## Current Focus\n\nShip the verdict.\n", "utf8");
  await writeFile(path.join(memory, "TASKS.md"), "# Tasks\n\n- [ ] Show one honest memory answer.\n", "utf8");
  await writeFile(path.join(memory, "DECISIONS.md"), "# Decisions\n\n- Plain words beat entity counts.\n", "utf8");
  await writeFile(path.join(memory, "RULES.md"), "# Rules\n\n- Read memory before work.\n", "utf8");
  await writeFile(path.join(memory, "CONTEXT_INDEX.json"), "{}\n", "utf8");
  await writeFile(path.join(root, "README.md"), "# Verdict Project\n", "utf8");
  return {
    id: "verdict-project",
    name: "Verdict Project",
    path: root,
    exists: true,
    isRepo: true,
    isContext: false,
    state: "synced",
    changedFiles: []
  };
}

test("resume verdict is honest across build and stale states", async () => {
  const project = await makeProject();
  try {
    // Before any semantic build: no recovery memory.
    let status = await getProjectMemoryStatus(project);
    assert.equal(status.resume.ready, false);
    assert.match(status.resume.headline, /No recovery memory/i);

    // After a build: a fresh agent can resume.
    await rebuildSemanticMemory(project, { reason: "test" });
    status = await getProjectMemoryStatus(project);
    assert.equal(status.resume.ready, true);
    assert.match(status.resume.headline, /fresh agent can resume/i);
    assert.ok(status.resume.lastBuiltAt, "verdict must carry the build timestamp");

    // Project outruns the build: verdict says rebuild, in plain words.
    const changed = path.join(project.path, "README.md");
    await writeFile(changed, "# Verdict Project\n\nChanged after build.\n", "utf8");
    const future = new Date(Date.now() + 10_000);
    await utimes(changed, future, future);
    status = await getProjectMemoryStatus(project);
    assert.equal(status.resume.ready, false);
    assert.match(status.resume.headline, /rebuild memory before switching/i);
    assert.match(status.resume.detail, /miss recent work/i);
  } finally {
    await rm(project.path, { recursive: true, force: true });
  }
});
