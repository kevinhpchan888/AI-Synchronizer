import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getLocalMachine } from "./registry.mjs";

const MACHINES_FILE = path.join(process.cwd(), "registry", "machines.json");

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function readMachines() {
  const local = await getLocalMachine();
  const saved = await readJson(MACHINES_FILE, []);
  const machines = Array.isArray(saved) ? saved : [];
  const withoutLocal = machines.filter((machine) => machine.id !== local.id);
  return [
    {
      ...local,
      role: "This machine",
      status: "online",
      lastSeen: new Date().toISOString(),
      canRunActions: true
    },
    ...withoutLocal
  ];
}

export async function addMachine(input) {
  const machines = await readMachines();
  const machine = {
    id: randomUUID(),
    name: input.name?.trim() || "New machine",
    platform: input.platform?.trim() || "unknown",
    role: input.role?.trim() || "Companion machine",
    status: "pending",
    lastSeen: null,
    canRunActions: false,
    pairingCode: randomUUID().slice(0, 8).toUpperCase(),
    createdAt: new Date().toISOString()
  };
  const saveable = [...machines.filter((item) => item.status !== "online"), machine];
  await writeJson(MACHINES_FILE, saveable);
  return machine;
}

export async function removeMachine(id) {
  const machines = await readMachines();
  const next = machines.filter((machine) => machine.id !== id && machine.status !== "online");
  await writeJson(MACHINES_FILE, next);
  return { removed: next.length !== machines.filter((machine) => machine.status !== "online").length };
}

