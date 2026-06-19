const state = {
  summary: null
};

const selectors = {
  machineLine: document.querySelector("#machineLine"),
  refreshButton: document.querySelector("#refreshButton"),
  readinessTitle: document.querySelector("#readinessTitle"),
  readinessBody: document.querySelector("#readinessBody"),
  projectsCard: document.querySelector("#projectsCard"),
  machinesCard: document.querySelector("#machinesCard"),
  skillsCard: document.querySelector("#skillsCard"),
  configCard: document.querySelector("#configCard"),
  memoryCard: document.querySelector("#memoryCard"),
  cloudCard: document.querySelector("#cloudCard"),
  recommendationsList: document.querySelector("#recommendationsList"),
  machinesList: document.querySelector("#machinesList"),
  setupStatus: document.querySelector("#setupStatus"),
  skillSummary: document.querySelector("#skillSummary"),
  skillMatrix: document.querySelector("#skillMatrix"),
  projectsList: document.querySelector("#projectsList"),
  toolsList: document.querySelector("#toolsList"),
  activityLog: document.querySelector("#activityLog"),
  clearLogButton: document.querySelector("#clearLogButton"),
  addProjectButton: document.querySelector("#addProjectButton"),
  addMachineButton: document.querySelector("#addMachineButton"),
  projectDialog: document.querySelector("#projectDialog"),
  machineDialog: document.querySelector("#machineDialog"),
  projectNameInput: document.querySelector("#projectNameInput"),
  projectPathInput: document.querySelector("#projectPathInput"),
  machineNameInput: document.querySelector("#machineNameInput"),
  machinePlatformInput: document.querySelector("#machinePlatformInput"),
  saveProjectButton: document.querySelector("#saveProjectButton"),
  saveMachineButton: document.querySelector("#saveMachineButton"),
  prepareSetupButton: document.querySelector("#prepareSetupButton"),
  openSetupFolderButton: document.querySelector("#openSetupFolderButton"),
  importSkillsButton: document.querySelector("#importSkillsButton"),
  syncSkillsButton: document.querySelector("#syncSkillsButton"),
  startWorkButton: document.querySelector("#startWorkButton"),
  endWorkButton: document.querySelector("#endWorkButton"),
  syncEverythingButton: document.querySelector("#syncEverythingButton"),
  publishCloudButton: document.querySelector("#publishCloudButton"),
  openMemoryButton: document.querySelector("#openMemoryButton")
};

function log(message, data = null) {
  const timestamp = new Date().toLocaleTimeString();
  const lines = [`[${timestamp}] ${message}`];
  if (data) {
    const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    lines.push(text);
  }
  selectors.activityLog.textContent = `${lines.join("\n")}\n\n${selectors.activityLog.textContent}`;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) }
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Request failed");
  return payload;
}

function setCard(card, tone, value, message) {
  const dot = card.querySelector(".status-dot");
  dot.className = `status-dot ${tone}`;
  card.querySelector("strong").textContent = value;
  card.querySelector("p").textContent = message;
}

function toneForProject(project) {
  if (["synced"].includes(project.state)) return "ok";
  if (["dirty", "ahead", "behind", "warning"].includes(project.state)) return "warn";
  if (["diverged", "missing", "not-repo"].includes(project.state)) return "bad";
  return "neutral";
}

function summarizeProjects(projects) {
  if (!projects.length) return ["warn", "0", "No projects"];
  const bad = projects.filter((project) => toneForProject(project) === "bad").length;
  const warn = projects.filter((project) => toneForProject(project) === "warn").length;
  if (bad) return ["bad", String(bad), "Need attention"];
  if (warn) return ["warn", String(warn), "Need sync"];
  return ["ok", String(projects.length), "Synced"];
}

function toolById(id) {
  return state.summary.tools.find((tool) => tool.id === id);
}

function renderCards() {
  const [projectTone, projectTitle, projectMessage] = summarizeProjects(state.summary.projects);
  setCard(selectors.projectsCard, projectTone, projectTitle, projectMessage);

  const pendingMachines = state.summary.machines.filter((machine) => machine.status === "pending").length;
  const onlineMachines = state.summary.machines.filter((machine) => machine.status === "online").length;
  setCard(
    selectors.machinesCard,
    pendingMachines ? "warn" : "ok",
    `${onlineMachines}/${state.summary.machines.length}`,
    pendingMachines ? "Pending pair" : "Online"
  );

  const skillshare = toolById("skillshare");
  setCard(selectors.skillsCard, skillshare?.exists ? "ok" : "warn", skillshare?.exists ? "Ready" : "Missing", "Skillshare");

  const config = toolById("aiConfigSync");
  setCard(selectors.configCard, config?.exists ? "ok" : "warn", config?.exists ? "Ready" : "Missing", "Config sync");

  const memorix = toolById("memorix");
  setCard(selectors.memoryCard, memorix?.exists ? "ok" : "warn", memorix?.exists ? "Ready" : "Missing", "Memorix");

  const cloud = state.summary.cloud;
  const cloudReady = cloud.vercel.cliAuthenticated && cloud.supabase.configured;
  const cloudPartial = cloud.vercel.cliAuthenticated || cloud.supabase.configured || cloud.envLocalPresent;
  setCard(
    selectors.cloudCard,
    cloudReady ? "ok" : cloudPartial ? "warn" : "neutral",
    cloudReady ? "Ready" : cloudPartial ? "Partial" : "Local",
    cloudReady ? "Control plane" : cloudPartial ? "Needs setup" : "Local mode"
  );

  renderReadiness();
  renderRecommendations();
}

function renderReadiness() {
  const critical = state.summary.recommendations.filter((item) => item.level === "critical").length;
  const warnings = state.summary.recommendations.filter((item) => item.level === "warning").length;
  const info = state.summary.recommendations.filter((item) => item.level === "info").length;
  if (critical) {
    selectors.readinessTitle.textContent = "Stop before switching machines";
    selectors.readinessBody.textContent = "There is a conflict-style sync issue that needs attention before you continue elsewhere.";
  } else if (warnings) {
    selectors.readinessTitle.textContent = "Almost ready, but not level";
    selectors.readinessBody.textContent = "Some setup or project sync work remains. Follow the action list before moving machines.";
  } else if (info) {
    selectors.readinessTitle.textContent = "Ready with minor follow-ups";
    selectors.readinessBody.textContent = "Core tools are healthy. A few optional sync actions can make the environment cleaner.";
  } else {
    selectors.readinessTitle.textContent = "Everything is level";
    selectors.readinessBody.textContent = "You can start work here or move to another machine.";
  }
}

function toneForRecommendation(level) {
  if (level === "success") return "ok";
  if (level === "critical") return "bad";
  if (level === "warning") return "warn";
  if (level === "info") return "neutral";
  return "neutral";
}

function renderRecommendations() {
  selectors.recommendationsList.innerHTML = state.summary.recommendations.map((item) => {
    const tone = toneForRecommendation(item.level);
    return `
      <article class="recommendation">
        <span class="status-dot ${tone}"></span>
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
        </div>
        <p class="action-note">${escapeHtml(item.action)}</p>
      </article>
    `;
  }).join("");
}

function pill(text, tone) {
  return `<span class="pill ${tone}">${text}</span>`;
}

function toneForMachine(machine) {
  if (machine.status === "online") return "ok";
  if (machine.status === "pending") return "warn";
  if (machine.status === "offline") return "bad";
  return "neutral";
}

function renderMachines() {
  selectors.machinesList.innerHTML = state.summary.machines.map((machine) => {
    const tone = toneForMachine(machine);
    const details = [
      machine.role ? `Role: ${machine.role}` : null,
      machine.platform ? `Platform: ${machine.platform}` : null,
      machine.address ? `Address: ${machine.address}` : null,
      machine.lastSeen ? `Last seen: ${new Date(machine.lastSeen).toLocaleString()}` : "Waiting for first connection",
      machine.pairingCode ? `Pairing code: ${machine.pairingCode}` : null
    ].filter(Boolean).join("\n");
    const remove = machine.status === "online" ? "" : `<button class="danger" data-remove-machine="${machine.id}">Remove</button>`;
    return `
      <article class="row">
        <div class="row-title">
          <span class="status-dot ${tone}"></span>
          <div>
            <strong>${escapeHtml(machine.name)}</strong>
            <div>${pill(escapeHtml(machine.status), tone)}</div>
          </div>
        </div>
        <div class="row-detail">${escapeHtml(details)}</div>
        <div class="row-actions">${remove}</div>
      </article>
    `;
  }).join("");
}

function targetTone(target) {
  if (target.pending) return "neutral";
  if (target.missingCanonicalCount > 0 || target.extraCount > 0) return "warn";
  return "ok";
}

function targetLabel(target) {
  if (target.pending) return "Pending setup";
  if (target.count === null) return "Unknown";
  if (state.summary.skills.canonical.count === 0) return `${target.count} skills`;
  if (target.missingCanonicalCount > 0) return `${target.count} skills, ${target.missingCanonicalCount} missing`;
  if (target.extraCount > 0) return `${target.count} skills, ${target.extraCount} extra`;
  return `${target.count} skills`;
}

function renderSkillCoverage() {
  const inventory = state.summary.skills;
  selectors.skillSummary.innerHTML = `
    <div class="skill-source">
      <span class="status-dot ${inventory.canonical.count > 0 ? "ok" : "warn"}"></span>
      <div>
        <strong>Shared skill source</strong>
        <p>${inventory.canonical.count} skill${inventory.canonical.count === 1 ? "" : "s"} in ${escapeHtml(inventory.canonical.path)}</p>
      </div>
    </div>
  `;

  selectors.skillMatrix.innerHTML = inventory.machines.map((machine) => `
    <article class="skill-machine">
      <div class="skill-machine-heading">
        <span class="status-dot ${toneForMachine(machine)}"></span>
        <div>
          <strong>${escapeHtml(machine.name)}</strong>
          <p>${escapeHtml(machine.platform)} · ${escapeHtml(machine.status)}</p>
        </div>
      </div>
      <div class="skill-targets">
        ${machine.targets.map((target) => `
          <div class="skill-target">
            <span class="status-dot ${targetTone(target)}"></span>
            <div>
              <strong>${escapeHtml(target.label)}</strong>
              <p>${escapeHtml(targetLabel(target))}</p>
            </div>
          </div>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function renderProjects() {
  if (!state.summary.projects.length) {
    selectors.projectsList.innerHTML = `<div class="row"><div class="row-detail">No projects yet. Add a project folder to monitor an existing GitHub repo.</div></div>`;
    return;
  }

  selectors.projectsList.innerHTML = state.summary.projects.map((project) => {
    const tone = toneForProject(project);
    const details = [
      project.path,
      project.remote ? `Remote: ${project.remote}` : null,
      project.branch ? `Branch: ${project.branch}` : null
    ].filter(Boolean).join("\n");

    const canRunGit = project.exists && project.isRepo;
    const disabled = canRunGit ? "" : "disabled";
    return `
      <article class="row">
        <div class="row-title">
          <span class="status-dot ${tone}"></span>
          <div>
            <strong>${escapeHtml(project.name)}</strong>
            <div>${pill(escapeHtml(project.message || project.state), tone)}</div>
          </div>
        </div>
        <div class="row-detail">${escapeHtml(details)}</div>
        <div class="row-actions">
          <button data-project-action="fetch" data-project-id="${project.id}" ${disabled}>Fetch</button>
          <button data-project-action="pull" data-project-id="${project.id}" ${disabled}>Pull</button>
          <button data-project-action="push" data-project-id="${project.id}" ${disabled}>Push</button>
          <button data-project-action="commitWip" data-project-id="${project.id}" ${disabled}>Save WIP</button>
          <button class="danger" data-remove-project="${project.id}">Remove</button>
        </div>
      </article>
    `;
  }).join("");
}

function toolActions(tool) {
  const install = tool.exists ? "" : `<button data-install-tool="${tool.id}">Install</button>`;
  const actions = {
    skillshare: [
      ["status", "Status"],
      ["audit", "Audit"],
      ["sync", "Sync"]
    ],
    aiConfigSync: [
      ["status", "Status"],
      ["preview", "Preview"],
      ["sync", "Apply Sync"]
    ],
    memorix: [
      ["doctor", "Doctor"],
      ["start", "Start"],
      ["stop", "Stop"]
    ],
    vercel: [["whoami", "Check Login"]],
    supabase: [["version", "Version"]]
  }[tool.id] ?? [];

  return `${install}${actions.map(([action, label]) => `<button data-tool-action="${action}" data-tool-id="${tool.id}" ${tool.exists ? "" : "disabled"}>${label}</button>`).join("")}`;
}

function renderTools() {
  selectors.toolsList.innerHTML = state.summary.tools.map((tool) => {
    const tone = tool.exists ? "ok" : tool.required ? "bad" : "warn";
    return `
      <article class="row">
        <div class="row-title">
          <span class="status-dot ${tone}"></span>
          <div>
            <strong>${escapeHtml(tool.label)}</strong>
            <div>${pill(tool.exists ? "Installed" : tool.required ? "Required" : "Missing", tone)}</div>
          </div>
        </div>
        <div class="row-detail">${escapeHtml(tool.path || tool.command)}</div>
        <div class="row-actions">${toolActions(tool)}</div>
      </article>
    `;
  }).join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function refresh() {
  selectors.refreshButton.disabled = true;
  try {
    state.summary = await api("/api/summary");
    selectors.machineLine.textContent = `${state.summary.machine.name} (${state.summary.machine.platform}) · ${new Date(state.summary.generatedAt).toLocaleString()}`;
  renderCards();
  renderSetupStatus();
  renderMachines();
    renderSkillCoverage();
    renderProjects();
    renderTools();
    log("Status refreshed.");
  } catch (error) {
    log("Refresh failed.", error.message);
  } finally {
    selectors.refreshButton.disabled = false;
  }
}

function renderSetupStatus() {
  const setup = state.summary.setup;
  const tone = setup.ready ? "ok" : setup.remoteReady ? "warn" : "bad";
  const headline = setup.ready
    ? "Setup files are ready"
    : setup.remoteReady
      ? "GitHub is connected. Generate setup files next."
      : "Connect this console to GitHub first";
  const body = setup.ready
    ? "Copy the Mac or Windows setup file to a new machine and double-click it."
    : setup.remoteReady
      ? "Click Prepare Setup Files to create one-click installers for Mac and Windows."
      : "A new machine needs a GitHub repo URL so it can clone and restore this console.";

  selectors.setupStatus.innerHTML = `
    <div class="setup-card">
      <span class="status-dot ${tone}"></span>
      <div>
        <strong>${escapeHtml(headline)}</strong>
        <p>${escapeHtml(body)}</p>
        <p>${escapeHtml(setup.remoteUrl || "No GitHub remote connected yet.")}</p>
      </div>
    </div>
  `;
}

async function projectAction(projectId, action) {
  if (["push", "commitWip"].includes(action)) {
    const ok = window.confirm(action === "push"
      ? "Push local commits to GitHub for this project?"
      : "Save all current local file changes into a WIP commit?");
    if (!ok) return;
  }
  log(`Running project action: ${action}`);
  const result = await api(`/api/projects/${encodeURIComponent(projectId)}/action`, {
    method: "POST",
    body: JSON.stringify({ action })
  });
  log(result.ok ? "Project action completed." : "Project action failed.", result);
  await refresh();
}

async function removeProject(projectId) {
  await api(`/api/projects/${encodeURIComponent(projectId)}`, { method: "DELETE" });
  log("Project removed.");
  await refresh();
}

async function removeMachine(machineId) {
  await api(`/api/machines/${encodeURIComponent(machineId)}`, { method: "DELETE" });
  log("Machine removed.");
  await refresh();
}

async function installTool(toolId) {
  log(`Installing tool: ${toolId}`);
  const result = await api(`/api/tools/${encodeURIComponent(toolId)}/install`, { method: "POST" });
  log(result.ok ? "Install completed." : "Install failed.", result);
  await refresh();
}

async function toolAction(toolId, action) {
  log(`Running ${toolId}: ${action}`);
  const result = await api(`/api/tools/${encodeURIComponent(toolId)}/action`, {
    method: "POST",
    body: JSON.stringify({ action })
  });
  log(result.ok ? "Tool action completed." : "Tool action failed.", result);
  await refresh();
}

selectors.refreshButton.addEventListener("click", refresh);
selectors.clearLogButton.addEventListener("click", () => {
  selectors.activityLog.textContent = "Ready.";
});

selectors.addProjectButton.addEventListener("click", () => {
  selectors.projectNameInput.value = "";
  selectors.projectPathInput.value = "";
  selectors.projectDialog.showModal();
});

selectors.addMachineButton.addEventListener("click", () => {
  selectors.machineNameInput.value = "";
  selectors.machinePlatformInput.value = "";
  selectors.machineDialog.showModal();
});

selectors.saveProjectButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const path = selectors.projectPathInput.value.trim();
  const name = selectors.projectNameInput.value.trim();
  if (!path) {
    log("Project path is required.");
    return;
  }
  await api("/api/projects", { method: "POST", body: JSON.stringify({ name, path }) });
  selectors.projectDialog.close();
  log("Project added.");
  await refresh();
});

selectors.saveMachineButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const name = selectors.machineNameInput.value.trim();
  const platform = selectors.machinePlatformInput.value.trim();
  if (!name) {
    log("Machine name is required.");
    return;
  }
  const machine = await api("/api/machines", { method: "POST", body: JSON.stringify({ name, platform }) });
  selectors.machineDialog.close();
  log(`Machine added: ${machine.name}. Pairing code: ${machine.pairingCode}`);
  await refresh();
});

document.addEventListener("click", async (event) => {
  const projectActionButton = event.target.closest("[data-project-action]");
  const removeButton = event.target.closest("[data-remove-project]");
  const installButton = event.target.closest("[data-install-tool]");
  const toolActionButton = event.target.closest("[data-tool-action]");
  const removeMachineButton = event.target.closest("[data-remove-machine]");

  try {
    if (projectActionButton) {
      await projectAction(projectActionButton.dataset.projectId, projectActionButton.dataset.projectAction);
    } else if (removeButton) {
      await removeProject(removeButton.dataset.removeProject);
    } else if (removeMachineButton) {
      await removeMachine(removeMachineButton.dataset.removeMachine);
    } else if (installButton) {
      await installTool(installButton.dataset.installTool);
    } else if (toolActionButton) {
      await toolAction(toolActionButton.dataset.toolId, toolActionButton.dataset.toolAction);
    }
  } catch (error) {
    log("Action failed.", error.message);
  }
});

selectors.startWorkButton.addEventListener("click", async () => {
  log("Start Work: refreshing status and pulling behind projects.");
  await refresh();
  const pullTargets = state.summary.projects.filter((project) => project.state === "behind");
  for (const project of pullTargets) await projectAction(project.id, "pull");
  log("Start Work complete.");
});

selectors.endWorkButton.addEventListener("click", async () => {
  log("End Work: refreshing status. Use Save WIP and Push on projects that need it.");
  await refresh();
});

selectors.syncEverythingButton.addEventListener("click", async () => {
  log("Sync Everything: running safe checks and pulls where possible.");
  await refresh();
  for (const project of state.summary.projects.filter((item) => item.state === "behind")) {
    await projectAction(project.id, "pull");
  }
  const skillshare = toolById("skillshare");
  if (skillshare?.exists) await toolAction("skillshare", "sync");
  const config = toolById("aiConfigSync");
  if (config?.exists) await toolAction("aiConfigSync", "preview");
  log("Sync Everything complete.");
});

selectors.syncSkillsButton.addEventListener("click", async () => {
  const ok = window.confirm("Copy shared skills into local Claude, Codex, and Shared Agents folders?");
  if (!ok) return;
  log("Syncing local skills.");
  const result = await api("/api/skills/sync-local", { method: "POST" });
  log(result.ok ? "Local skill sync finished." : "Local skill sync failed.", result);
  await refresh();
});

selectors.importSkillsButton.addEventListener("click", async () => {
  const ok = window.confirm("Build the shared skill source from local Claude, Codex, and Shared Agents skills?");
  if (!ok) return;
  log("Building shared skill source from local skills.");
  const result = await api("/api/skills/import-local", { method: "POST" });
  log(result.ok ? `Shared skill source built with ${result.importedCount} skills.` : "Shared skill import failed.", result);
  await refresh();
});

selectors.prepareSetupButton.addEventListener("click", async () => {
  log("Preparing one-click setup files.");
  const result = await api("/api/setup/prepare", { method: "POST" });
  log(result.ok ? "Setup files prepared." : `Setup files not ready: ${result.message}`, result);
  await refresh();
});

selectors.openSetupFolderButton.addEventListener("click", async () => {
  log("Opening setup folder.");
  const result = await api("/api/setup/open-folder", { method: "POST" });
  log(result.ok ? "Setup folder opened." : "Could not open setup folder.", result);
});

selectors.openMemoryButton.addEventListener("click", () => {
  window.open("http://localhost:3211", "_blank", "noopener,noreferrer");
});

selectors.publishCloudButton.addEventListener("click", async () => {
  log("Publishing this machine status to Supabase.");
  const result = await api("/api/cloud/publish", { method: "POST" });
  log(result.ok ? "Cloud status published." : `Cloud publish failed: ${result.message || "needs setup"}`);
  await refresh();
});

refresh();
