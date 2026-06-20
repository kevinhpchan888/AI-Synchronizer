import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { getMcpSyncStatus, syncClaudeMcpToCodex } from "../src/lib/mcp-sync.mjs";

async function makeFiles() {
  const root = await mkdtemp(path.join(os.tmpdir(), "ai-sync-mcp-"));
  const claudeSettingsPath = path.join(root, "settings.json");
  const codexConfigPath = path.join(root, "config.toml");
  await writeFile(claudeSettingsPath, JSON.stringify({
    mcpServers: {
      selldone: {
        command: "node",
        args: ["C:\\Users\\Kevin Chan\\mcp-servers\\selldone-mcp-server\\dist\\index.js"],
        env: {
          SELLDONE_SHOP_ID: "14492",
          SELLDONE_API_TOKEN: "secret-token"
        }
      },
      "premiere-pro": {
        command: "node",
        args: ["premiere.js"],
        env: { PREMIERE_TEMP_DIR: "tmp" }
      }
    }
  }, null, 2), "utf8");
  await writeFile(codexConfigPath, "[mcp_servers.premiere-pro]\ncommand = \"node\"\nargs = [\"premiere.js\"]\n", "utf8");
  return { root, claudeSettingsPath, codexConfigPath };
}

test("reports Claude MCP servers missing from Codex without exposing env values", async () => {
  const files = await makeFiles();
  try {
    const status = await getMcpSyncStatus(files);
    assert.equal(status.ok, false);
    assert.deepEqual(status.missingInCodex.map((item) => item.name), ["selldone"]);
    assert.deepEqual(status.missingInCodex[0].envKeys, ["SELLDONE_API_TOKEN", "SELLDONE_SHOP_ID"]);
    assert.equal(JSON.stringify(status).includes("secret-token"), false);
  } finally {
    await rm(files.root, { recursive: true, force: true });
  }
});

test("sync adds missing Claude MCP server entries to Codex config", async () => {
  const files = await makeFiles();
  try {
    const result = await syncClaudeMcpToCodex(files);
    assert.equal(result.ok, true);
    assert.equal(result.addedCount, 1);
    assert.equal(result.added[0].name, "selldone");

    const config = await readFile(files.codexConfigPath, "utf8");
    assert.match(config, /\[mcp_servers\.selldone\]/);
    assert.match(config, /SELLDONE_SHOP_ID = "14492"/);
    assert.match(config, /SELLDONE_API_TOKEN = "secret-token"/);

    const status = await getMcpSyncStatus(files);
    assert.equal(status.ok, true);
  } finally {
    await rm(files.root, { recursive: true, force: true });
  }
});
