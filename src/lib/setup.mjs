import { promises as fs } from "node:fs";
import path from "node:path";
import { platform } from "node:os";
import { run, runShell } from "./command.mjs";

const ROOT = process.cwd();
const PACKAGE_DIR = path.join(ROOT, "setup-package");

async function fileExists(file) {
  try {
    const stat = await fs.stat(file);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function getRemoteUrl() {
  const result = await run("git", ["remote", "get-url", "origin"], { cwd: ROOT, timeout: 10000 });
  if (!result.ok) return null;
  const url = result.stdout.trim();
  return url || null;
}

export async function getSetupStatus() {
  const remoteUrl = await getRemoteUrl();
  const windowsPackage = path.join(PACKAGE_DIR, "Setup-KevinSync-Windows.ps1");
  const macPackage = path.join(PACKAGE_DIR, "Setup-KevinSync-Mac.command");
  return {
    remoteReady: Boolean(remoteUrl),
    remoteUrl,
    packageDir: PACKAGE_DIR,
    windowsPackageReady: await fileExists(windowsPackage),
    macPackageReady: await fileExists(macPackage),
    ready: Boolean(remoteUrl && await fileExists(windowsPackage) && await fileExists(macPackage))
  };
}

export async function prepareSetupPackage() {
  const remoteUrl = await getRemoteUrl();
  if (!remoteUrl) {
    return {
      ok: false,
      message: "Connect this sync-console folder to a private GitHub repo first. Then this button can generate one-click setup files."
    };
  }

  await fs.mkdir(PACKAGE_DIR, { recursive: true });
  const templates = [
    {
      source: path.join(ROOT, "templates", "setup-new-machine-windows.ps1"),
      destination: path.join(PACKAGE_DIR, "Setup-KevinSync-Windows.ps1")
    },
    {
      source: path.join(ROOT, "templates", "setup-new-machine-mac.command"),
      destination: path.join(PACKAGE_DIR, "Setup-KevinSync-Mac.command")
    }
  ];

  for (const template of templates) {
    const raw = await fs.readFile(template.source, "utf8");
    await fs.writeFile(template.destination, raw.replaceAll("__REPO_URL__", remoteUrl), "utf8");
  }

  return {
    ok: true,
    message: "One-click setup files generated.",
    remoteUrl,
    packageDir: PACKAGE_DIR,
    files: templates.map((template) => template.destination)
  };
}

export async function openSetupPackageFolder() {
  await fs.mkdir(PACKAGE_DIR, { recursive: true });
  if (platform() === "win32") {
    return run("explorer.exe", [PACKAGE_DIR], { timeout: 10000 });
  }
  if (platform() === "darwin") {
    return run("open", [PACKAGE_DIR], { timeout: 10000 });
  }
  return runShell(`xdg-open ${JSON.stringify(PACKAGE_DIR)}`, { timeout: 10000 });
}
