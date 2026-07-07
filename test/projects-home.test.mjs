import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { getProjectsHome } from "../src/lib/registry.mjs";

// Regression: on macOS the resolver defaulted to ~/GitHub while GitHub Desktop
// (and this user) keep repos under ~/Documents/GitHub, so every project showed
// "folder missing". getProjectsHome must find the folder that actually exists.

const ORIGINAL_HOME = process.env.HOME;
const ORIGINAL_OVERRIDE = process.env.AI_SYNC_PROJECTS_HOME;

test("prefers ~/Documents/GitHub when it exists", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "ph-home-"));
  try {
    await mkdir(path.join(home, "Documents", "GitHub"), { recursive: true });
    process.env.HOME = home;
    delete process.env.AI_SYNC_PROJECTS_HOME;
    assert.equal(getProjectsHome(), path.join(home, "Documents", "GitHub"));
  } finally {
    process.env.HOME = ORIGINAL_HOME;
    if (ORIGINAL_OVERRIDE !== undefined) process.env.AI_SYNC_PROJECTS_HOME = ORIGINAL_OVERRIDE;
    await rm(home, { recursive: true, force: true });
  }
});

test("falls back to bare ~/GitHub when that is the layout", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "ph-home-"));
  try {
    await mkdir(path.join(home, "GitHub"), { recursive: true });
    process.env.HOME = home;
    delete process.env.AI_SYNC_PROJECTS_HOME;
    assert.equal(getProjectsHome(), path.join(home, "GitHub"));
  } finally {
    process.env.HOME = ORIGINAL_HOME;
    if (ORIGINAL_OVERRIDE !== undefined) process.env.AI_SYNC_PROJECTS_HOME = ORIGINAL_OVERRIDE;
    await rm(home, { recursive: true, force: true });
  }
});

test("when both roots exist, picks the one that actually holds repos (the Mac Mini case)", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "ph-home-"));
  try {
    // ~/Documents/GitHub holds only the console; ~/GitHub holds the real repos.
    await mkdir(path.join(home, "Documents", "GitHub", "AI-Synchronizer"), { recursive: true });
    for (const repo of ["APC", "AutoResearch", "DuoSages"]) {
      await mkdir(path.join(home, "GitHub", repo), { recursive: true });
    }
    process.env.HOME = home;
    delete process.env.AI_SYNC_PROJECTS_HOME;
    assert.equal(getProjectsHome(), path.join(home, "GitHub"));
  } finally {
    process.env.HOME = ORIGINAL_HOME;
    if (ORIGINAL_OVERRIDE !== undefined) process.env.AI_SYNC_PROJECTS_HOME = ORIGINAL_OVERRIDE;
    await rm(home, { recursive: true, force: true });
  }
});

test("an explicit AI_SYNC_PROJECTS_HOME override always wins", async () => {
  try {
    process.env.AI_SYNC_PROJECTS_HOME = "/custom/projects/root";
    assert.equal(getProjectsHome(), "/custom/projects/root");
  } finally {
    if (ORIGINAL_OVERRIDE === undefined) delete process.env.AI_SYNC_PROJECTS_HOME;
    else process.env.AI_SYNC_PROJECTS_HOME = ORIGINAL_OVERRIDE;
  }
});
