const state = {
  summary: null
};

const selectors = {
  machineLine: document.querySelector("#machineLine"),
  refreshButton: document.querySelector("#refreshButton"),
  projectSwitcher: document.querySelector("#projectSwitcher"),
  scanProjectsButton: document.querySelector("#scanProjectsButton"),
  scanProjectsPanelButton: document.querySelector("#scanProjectsPanelButton"),
  activeProjectTitle: document.querySelector("#activeProjectTitle"),
  activeProjectSubtitle: document.querySelector("#activeProjectSubtitle"),
  activeProjectPath: document.querySelector("#activeProjectPath"),
  readinessOrb: document.querySelector("#readinessOrb"),
  readinessLabel: document.querySelector("#readinessLabel"),
  readinessTitle: document.querySelector("#readinessTitle"),
  readinessBody: document.querySelector("#readinessBody"),
  workflowFeedback: document.querySelector("#workflowFeedback"),
  gitStep: document.querySelector("#gitStep"),
  activeActionList: document.querySelector("#activeActionList"),
  memoryMissionTile: document.querySelector("#memoryMissionTile"),
  hermesMissionTile: document.querySelector("#hermesMissionTile"),
  agentMissionTile: document.querySelector("#agentMissionTile"),
  projectsCard: document.querySelector("#projectsCard"),
  machinesCard: document.querySelector("#machinesCard"),
  skillsCard: document.querySelector("#skillsCard"),
  configCard: document.querySelector("#configCard"),
  memoryCard: document.querySelector("#memoryCard"),
  cloudCard: document.querySelector("#cloudCard"),
  recommendationsList: document.querySelector("#recommendationsList"),
  machinesList: document.querySelector("#machinesList"),
  cloudFleetList: document.querySelector("#cloudFleetList"),
  setupStatus: document.querySelector("#setupStatus"),
  skillSummary: document.querySelector("#skillSummary"),
  skillMatrix: document.querySelector("#skillMatrix"),
  agentProfileSummary: document.querySelector("#agentProfileSummary"),
  agentProfilesList: document.querySelector("#agentProfilesList"),
  projectsList: document.querySelector("#projectsList"),
  toolsList: document.querySelector("#toolsList"),
  activityLog: document.querySelector("#activityLog"),
  clearLogButton: document.querySelector("#clearLogButton"),
  addProjectButton: document.querySelector("#addProjectButton"),
  adoptWorkspaceButton: document.querySelector("#adoptWorkspaceButton"),
  addMachineButton: document.querySelector("#addMachineButton"),
  projectDialog: document.querySelector("#projectDialog"),
  workspaceDialog: document.querySelector("#workspaceDialog"),
  machineDialog: document.querySelector("#machineDialog"),
  handoffDialog: document.querySelector("#handoffDialog"),
  projectNameInput: document.querySelector("#projectNameInput"),
  projectPathInput: document.querySelector("#projectPathInput"),
  workspaceNameInput: document.querySelector("#workspaceNameInput"),
  workspacePathInput: document.querySelector("#workspacePathInput"),
  machineNameInput: document.querySelector("#machineNameInput"),
  machinePlatformInput: document.querySelector("#machinePlatformInput"),
  glmDialog: document.querySelector("#glmDialog"),
  glmApiKeyInput: document.querySelector("#glmApiKeyInput"),
  handoffSummaryInput: document.querySelector("#handoffSummaryInput"),
  saveProjectButton: document.querySelector("#saveProjectButton"),
  saveWorkspaceButton: document.querySelector("#saveWorkspaceButton"),
  saveMachineButton: document.querySelector("#saveMachineButton"),
  saveGlmButton: document.querySelector("#saveGlmButton"),
  saveHandoffButton: document.querySelector("#saveHandoffButton"),
  configureGlmButton: document.querySelector("#configureGlmButton"),
  restoreClaudeButton: document.querySelector("#restoreClaudeButton"),
  openZaiButton: document.querySelector("#openZaiButton"),
  prepareSetupButton: document.querySelector("#prepareSetupButton"),
  openSetupFolderButton: document.querySelector("#openSetupFolderButton"),
  importSkillsButton: document.querySelector("#importSkillsButton"),
  syncEnvironmentButton: document.querySelector("#syncEnvironmentButton"),
  syncSkillsButton: document.querySelector("#syncSkillsButton"),
  startWorkButton: document.querySelector("#startWorkButton"),
  switchClaudeButton: document.querySelector("#switchClaudeButton"),
  switchCodexButton: document.querySelector("#switchCodexButton"),
  endWorkButton: document.querySelector("#endWorkButton"),
  syncEverythingButton: document.querySelector("#syncEverythingButton"),
  publishCloudButton: document.querySelector("#publishCloudButton"),
  openMemoryButton: document.querySelector("#openMemoryButton")
};

let activeHandoffProjectId = null;
let activeSwitchTarget = null;

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
  if (project.isContext || project.state === "context") return "ok";
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

function isHostedDashboard() {
  return Boolean(state.summary?.cloud?.hostedRuntime);
}

function localConsoleUrl() {
  return "http://127.0.0.1:47831";
}

function activeProject() {
  return state.summary.projects.find((project) => project.id === state.summary.session?.activeProjectId)
    ?? state.summary.projects.find((project) => !String(project.remote || "").includes("AI-Synchronizer") && !/sync console/i.test(project.name))
    ?? state.summary.projects[0]
    ?? null;
}

function memoryForProject(project) {
  if (!project) return null;
  return state.summary.memory.projects.find((item) => item.projectId === project.id) ?? null;
}

function setFlowStep(step, tone, title, detail) {
  step.querySelector(".status-dot").className = `status-dot ${tone}`;
  step.querySelector("strong").textContent = title;
  step.querySelector("small").textContent = detail;
}

function setWorkflowFeedback(message, tone = "neutral") {
  selectors.workflowFeedback.className = `command-feedback ${tone}`;
  selectors.workflowFeedback.textContent = message;
}

function toneForMemory(memory) {
  if (!memory) return "neutral";
  if (memory.state === "fresh") return "ok";
  if (["missing", "unavailable"].includes(memory.state)) return "bad";
  return "warn";
}

function activeReadiness(project, memory) {
  if (!project) return { tone: "warn", label: "SETUP", title: "Choose a project", body: "Add or select a workspace before starting." };
  const projectTone = toneForProject(project);
  const memoryTone = toneForMemory(memory);
  if (!memory || memory.state === "missing") {
    return { tone: "warn", label: "SETUP", title: "Memory needed", body: "Create the memory pack before switching tools." };
  }
  if (projectTone === "bad" || memoryTone === "bad") {
    return { tone: "bad", label: "STOP", title: "Do not switch yet", body: "Fix the project or memory issue first." };
  }
  if (projectTone === "warn" || memoryTone === "warn") {
    return { tone: "warn", label: "SYNC", title: "Needs leveling", body: "Run the highlighted action before switching." };
  }
  return { tone: "ok", label: "READY", title: "Ready to work", body: "Files, memory, and project context are level." };
}

function actionButton(label, attributes, primary = false) {
  const attrs = Object.entries(attributes).map(([key, value]) => `${key}="${escapeHtml(value)}"`).join(" ");
  return `<button class="${primary ? "primary" : ""}" ${attrs}>${escapeHtml(label)}</button>`;
}

function activeActions(project, memory) {
  if (!project) {
    return [{ tone: "warn", title: "Add a project", body: "Track a repo or adopt a workspace first.", action: "" }];
  }
  if (!project.exists) {
    return [{ tone: "bad", title: "Project folder missing", body: "This machine cannot find the selected project folder.", action: actionButton("Add Project", { "data-open-add-project": "true" }, true) }];
  }
  if (!project.isRepo) {
    if (project.isContext) {
      if (!memory || memory.state === "missing") {
        return [{ tone: "warn", title: "Create context memory", body: "This space needs its portable memory pack.", action: actionButton("Initialize Memory", { "data-memory-init": project.id }, true) }];
      }
      if (["stale", "incomplete", "handoff-needed"].includes(memory.state)) {
        return [{ tone: "warn", title: "Refresh context handoff", body: "One click updates this context memory before you move it elsewhere.", action: actionButton("Refresh Handoff", { "data-auto-handoff": project.id }, true) }];
      }
      return [{ tone: "ok", title: "Context is ready", body: "Use this for non-project work, then promote it to a repo later if needed.", action: actionButton("Use Codex", { "data-switch-agent": "codex", "data-project-id": project.id }, true) }];
    }
    return [{ tone: "bad", title: "Repo not connected", body: "This folder needs Git before it can sync cleanly.", action: actionButton("Adopt Workspace", { "data-open-adopt-workspace": "true" }, true) }];
  }

  const actions = [];
  if (project.state === "behind") {
    actions.push({ tone: "warn", title: "Pull newer work", body: `${project.name} has changes on GitHub.`, action: actionButton("Pull", { "data-project-action": "pull", "data-project-id": project.id }, true) });
  }
  if (project.state === "dirty") {
    actions.push({ tone: "warn", title: "Save local work", body: "There are uncommitted local changes.", action: actionButton("Save WIP", { "data-project-action": "commitWip", "data-project-id": project.id }, true) });
  }
  if (project.state === "ahead") {
    actions.push({ tone: "warn", title: "Push local commits", body: "This machine has commits not yet on GitHub.", action: actionButton("Push", { "data-project-action": "push", "data-project-id": project.id }, true) });
  }
  if (project.state === "diverged") {
    actions.push({ tone: "bad", title: "History diverged", body: "Local and GitHub both changed. Resolve this before switching machines.", action: actionButton("Fetch", { "data-project-action": "fetch", "data-project-id": project.id }, true) });
  }
  if (!memory || memory.state === "missing") {
    actions.push({ tone: "warn", title: "Create memory pack", body: "This project has no portable .ai-memory context yet.", action: actionButton("Initialize Memory", { "data-memory-init": project.id }, true) });
  } else if (["stale", "incomplete", "handoff-needed"].includes(memory.state)) {
    actions.push({ tone: "warn", title: "Refresh handoff", body: "One click updates project memory before switching tools or machines.", action: actionButton("Refresh Handoff", { "data-auto-handoff": project.id }, true) });
  }
  if (!actions.length) {
    actions.push({ tone: "ok", title: "Project is level", body: "You can continue here or switch to Claude/Codex.", action: actionButton("Use Codex", { "data-switch-agent": "codex", "data-project-id": project.id }, true) });
  }
  return actions;
}

function renderCards() {
  if (isHostedDashboard()) {
    renderHostedCards();
    renderHostedCockpit();
    renderRecommendations();
    return;
  }

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

  const memoryState = state.summary.memory.summary.state;
  const memoryTone = memoryState === "fresh" ? "ok" : memoryState === "missing" ? "bad" : memoryState === "empty" ? "neutral" : "warn";
  const memoryLabel = memoryState === "fresh" ? "Fresh" : memoryState === "missing" ? "Missing" : memoryState === "stale" ? "Stale" : "Local";
  setCard(selectors.memoryCard, memoryTone, memoryLabel, "Project memory");

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
  renderMissionControl();
  renderProjectSwitcher();
  renderActiveProjectCockpit();
  renderRecommendations();
}

function renderHostedCards() {
  const cloud = state.summary.cloudControl;
  const machines = cloud?.machines ?? [];
  const projects = cloud?.projects ?? [];
  const fresh = projects.filter((project) => project.memory_state === "fresh").length;
  const missing = projects.filter((project) => project.memory_state === "missing").length;
  setCard(selectors.projectsCard, missing ? "warn" : "ok", String(projects.length), "Cloud projects");
  setCard(selectors.machinesCard, machines.length ? "ok" : "warn", String(machines.length), "Published machines");
  setCard(selectors.skillsCard, "neutral", "Local", "Open local console");
  setCard(selectors.configCard, "neutral", "Local", "Open local console");
  setCard(selectors.memoryCard, missing ? "warn" : "ok", `${fresh}/${projects.length}`, "Fresh memory");
  setCard(selectors.cloudCard, "ok", "Online", "Cloud view");
}

function renderHostedCockpit() {
  selectors.projectSwitcher.innerHTML = `<option>Cloud Fleet View</option>`;
  selectors.projectSwitcher.disabled = true;
  selectors.scanProjectsButton.textContent = "Open Local Console";

  selectors.readinessOrb.className = "readiness-gauge neutral";
  selectors.readinessLabel.textContent = "VIEW";
  selectors.readinessTitle.textContent = "Read-only cloud view";
  selectors.readinessBody.textContent = "Use local console for file actions.";
  selectors.activeProjectTitle.textContent = "AI Sync Cloud";
  selectors.activeProjectSubtitle.textContent = "This page shows fleet status only. It cannot touch files on your PC or Mac.";
  selectors.activeProjectPath.textContent = localConsoleUrl();

  const cloud = state.summary.cloudControl;
  const machineCount = cloud?.machines?.length ?? 0;
  const projectCount = cloud?.projects?.length ?? 0;
  const staleCount = (cloud?.projects ?? []).filter((project) => project.memory_state !== "fresh").length;
  setFlowStep(selectors.gitStep, projectCount ? "ok" : "warn", `${projectCount} tracked`, "Cloud projects");
  setFlowStep(selectors.memoryMissionTile, staleCount ? "warn" : "ok", staleCount ? `${staleCount} need memory` : "Memory fresh", "Published state");
  setFlowStep(selectors.hermesMissionTile, machineCount ? "ok" : "warn", `${machineCount} machines`, "Cloud fleet");
  setFlowStep(selectors.agentMissionTile, "neutral", "Local only", "Claude / Codex actions");

  selectors.activeActionList.innerHTML = `
    <article class="active-action warn">
      <span class="status-dot warn"></span>
      <div>
        <strong>Open the local console to click action buttons</strong>
        <small>The hosted domain cannot read or change your PC files.</small>
      </div>
      <div><button class="primary" data-open-local-console="true">Open Local Console</button></div>
    </article>
  `;
}

function renderMissionControl() {
  const project = activeProject();
  const memoryItem = memoryForProject(project);
  const projectTone = project ? toneForProject(project) : "warn";
  setFlowStep(
    selectors.gitStep,
    projectTone,
    project?.isContext ? "Context only" : project?.message || "No project",
    project?.isContext ? "No repo required" : project?.branch ? `Branch ${project.branch}` : "Select a project"
  );

  const memoryTone = toneForMemory(memoryItem);
  const memoryTitle = memoryItem?.state === "fresh" ? `${memoryItem.freshness}% fresh` : memoryItem?.message || "Memory unknown";
  const memoryDetail = memoryItem?.handoffUpdatedAt ? `Handoff ${new Date(memoryItem.handoffUpdatedAt).toLocaleTimeString()}` : "Portable project context";
  setFlowStep(selectors.memoryMissionTile, memoryTone, memoryTitle, memoryDetail);

  const cloudMachines = state.summary.cloudControl?.machines ?? [];
  const visibleMachines = cloudMachines.length || state.summary.machines.length;
  const onlineCloud = cloudMachines.filter((machine) => machine.status?.hermesWorker === "online" || machine.status?.projects?.length).length;
  const hermesTone = visibleMachines === 0 ? "neutral" : onlineCloud >= 2 ? "ok" : "warn";
  setFlowStep(selectors.hermesMissionTile, hermesTone, `${onlineCloud || visibleMachines} visible`, "Fleet status");

  const route = state.summary.agents.activeRoute === "glm" ? "GLM 5.2" : "Claude";
  const glmReady = state.summary.agents.glm.configuredFor52;
  const sessionAgent = state.summary.session?.activeAgent === "codex" ? "Codex" : route;
  setFlowStep(selectors.agentMissionTile, route === "GLM 5.2" && !glmReady ? "warn" : "ok", sessionAgent, project?.name || "No active project");
}

function renderProjectSwitcher() {
  const currentId = activeProject()?.id ?? "";
  selectors.projectSwitcher.innerHTML = state.summary.projects.map((project) => {
    const marker = project.id === currentId ? " selected" : "";
    return `<option value="${escapeHtml(project.id)}"${marker}>${escapeHtml(project.name)}</option>`;
  }).join("");
}

function renderActiveProjectCockpit() {
  const project = activeProject();
  const memoryItem = memoryForProject(project);
  const readiness = activeReadiness(project, memoryItem);
  selectors.readinessOrb.className = `readiness-gauge ${readiness.tone}`;
  selectors.readinessLabel.textContent = readiness.label;
  selectors.readinessTitle.textContent = readiness.title;
  selectors.readinessBody.textContent = readiness.body;

  selectors.activeProjectTitle.textContent = project?.name || "No active project";
  selectors.activeProjectSubtitle.textContent = project
    ? `${project.isContext ? "Context space" : project.message || project.state} · ${memoryItem?.message || "Memory unknown"}`
    : "Add a project or adopt a workspace to begin.";
  selectors.activeProjectPath.textContent = project?.path || "No project path";

  selectors.activeActionList.innerHTML = activeActions(project, memoryItem).map((item) => `
    <article class="active-action ${item.tone}">
      <span class="status-dot ${item.tone}"></span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.body)}</small>
      </div>
      <div>${item.action}</div>
    </article>
  `).join("");
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
  if (isHostedDashboard()) {
    selectors.recommendationsList.innerHTML = `
      <article class="recommendation">
        <span class="status-dot warn"></span>
        <div>
          <h3>Hosted dashboard is read-only</h3>
          <p>Use this page to see which machines and projects are out of sync. Use the local console on the machine you are sitting at to fix them.</p>
        </div>
        <p class="action-note">Open ${escapeHtml(localConsoleUrl())}</p>
      </article>
    `;
    return;
  }

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
  if (isHostedDashboard()) {
    const machines = state.summary.cloudControl?.machines ?? [];
    selectors.machinesList.innerHTML = machines.map((machine) => {
      const projectCount = machine.status?.projects?.length ?? 0;
      const heartbeat = machine.status?.hermesWorker === "online" ? "online" : "published";
      return `
        <article class="row compact-row">
          <div class="row-title">
            <span class="status-dot ok"></span>
            <div>
              <strong>${escapeHtml(machine.name)}</strong>
              <div>${pill(escapeHtml(heartbeat), "ok")}</div>
            </div>
          </div>
          <div class="row-detail">${projectCount} tracked projects · Last seen: ${escapeHtml(machine.last_seen ? new Date(machine.last_seen).toLocaleString() : "unknown")}</div>
          <div class="row-actions"></div>
        </article>
      `;
    }).join("");
    return;
  }

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

function renderCloudFleet() {
  const cloud = state.summary.cloudControl;
  if (!cloud?.ok || (!cloud.machines.length && !cloud.projects.length)) {
    selectors.cloudFleetList.innerHTML = `<div class="row"><div class="row-detail">No published cloud status yet. Use Publish Cloud Status on this PC.</div></div>`;
    return;
  }

  const machineRows = cloud.machines.map((machine) => {
    const age = machine.last_seen ? new Date(machine.last_seen).toLocaleString() : "No heartbeat yet";
    return `
      <article class="row compact-row">
        <div class="row-title">
          <span class="status-dot ok"></span>
          <div>
            <strong>${escapeHtml(machine.name)}</strong>
            <div>${pill("published", "ok")}</div>
          </div>
        </div>
        <div class="row-detail">Last seen: ${escapeHtml(age)}</div>
        <div class="row-actions"></div>
      </article>
    `;
  });

  const projectRows = cloud.projects.map((project) => {
    const tone = project.memory_state === "fresh" ? "ok" : project.memory_state === "missing" ? "bad" : "warn";
    return `
      <article class="row compact-row">
        <div class="row-title">
          <span class="status-dot ${tone}"></span>
          <div>
            <strong>${escapeHtml(project.name)}</strong>
            <div>${pill(escapeHtml(project.memory_state), tone)}</div>
          </div>
        </div>
        <div class="row-detail">Git: ${escapeHtml(project.git_state)} · Memory: ${escapeHtml(project.memory_freshness)}%</div>
        <div class="row-actions"></div>
      </article>
    `;
  });

  selectors.cloudFleetList.innerHTML = [...machineRows, ...projectRows].join("");
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
  if (isHostedDashboard()) {
    selectors.skillSummary.innerHTML = `
      <div class="setup-card">
        <span class="status-dot neutral"></span>
        <div>
          <strong>Skill sync is local-only</strong>
          <p>Open ${escapeHtml(localConsoleUrl())} on the machine you are using to sync Claude/Codex skills.</p>
        </div>
      </div>
    `;
    selectors.skillMatrix.innerHTML = "";
    return;
  }

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

function renderAgentProfiles() {
  if (isHostedDashboard()) {
    selectors.agentProfileSummary.innerHTML = `
      <div class="setup-card">
        <span class="status-dot neutral"></span>
        <div>
          <strong>Agent switching is local-only</strong>
          <p>Open ${escapeHtml(localConsoleUrl())} to switch Claude, Codex, or GLM on your current machine.</p>
        </div>
      </div>
    `;
    selectors.agentProfilesList.innerHTML = "";
    return;
  }

  const agents = state.summary.agents;
  const active = agents.activeRoute === "glm"
    ? "Claude Code currently routes to GLM 5.2"
    : "Claude Code currently routes to Claude models";
  const glmTone = agents.glm.configuredFor52 ? "ok" : agents.glm.configured ? "warn" : "neutral";

  selectors.agentProfileSummary.innerHTML = `
    <div class="setup-card">
      <span class="status-dot ${glmTone}"></span>
      <div>
        <strong>${escapeHtml(active)}</strong>
        <p>Claude settings: ${escapeHtml(agents.settingsPath)}</p>
        <p>GLM endpoint: ${escapeHtml(agents.glmBaseUrl)}</p>
      </div>
    </div>
  `;

  selectors.agentProfilesList.innerHTML = agents.profiles.map((profile) => {
    const tone = profile.tone === "ok" ? "ok" : profile.tone === "bad" ? "bad" : profile.tone === "warn" ? "warn" : "neutral";
    const label = profile.statusText || (profile.tone === "ok" ? "Ready" : profile.tone === "warn" ? "Needs setup" : profile.tone === "bad" ? "Blocked" : "Optional");
    return `
      <article class="agent-card">
        <div class="agent-card-heading">
          <span class="status-dot ${tone}"></span>
          <div>
            <strong>${escapeHtml(profile.label)}</strong>
            <p>${escapeHtml(profile.provider)}</p>
          </div>
        </div>
        <div>${pill(escapeHtml(label), tone)}</div>
        <p>${escapeHtml(profile.body)}</p>
        <p class="action-note">${escapeHtml(profile.action)}</p>
      </article>
    `;
  }).join("");
}

function renderProjects() {
  if (isHostedDashboard()) {
    const projects = state.summary.cloudControl?.projects ?? [];
    if (!projects.length) {
      selectors.projectsList.innerHTML = `<div class="row"><div class="row-detail">No cloud project status has been published yet. Open the local console and click Publish Cloud Status.</div></div>`;
      return;
    }
    selectors.projectsList.innerHTML = projects.map((project) => {
      const tone = project.memory_state === "fresh" && project.git_state !== "missing" ? "ok" : project.git_state === "diverged" || project.git_state === "missing" ? "bad" : "warn";
      return `
        <article class="row compact-row">
          <div class="row-title">
            <span class="status-dot ${tone}"></span>
            <div>
              <strong>${escapeHtml(project.name)}</strong>
              <div>${pill(escapeHtml(project.git_state || "unknown"), tone)} ${pill(escapeHtml(project.memory_state || "unknown"), project.memory_state === "fresh" ? "ok" : "warn")}</div>
            </div>
          </div>
          <div class="row-detail">Cloud status only. Local actions run at ${escapeHtml(localConsoleUrl())}</div>
          <div class="row-actions">
            <button data-open-local-console="true">Open Local Console</button>
          </div>
        </article>
      `;
    }).join("");
    return;
  }

  if (!state.summary.projects.length) {
    selectors.projectsList.innerHTML = `<div class="row"><div class="row-detail">No projects yet. Add a project folder to monitor an existing GitHub repo.</div></div>`;
    return;
  }

  selectors.projectsList.innerHTML = state.summary.projects.map((project) => {
    const tone = toneForProject(project);
    const isActive = project.id === activeProject()?.id;
    const details = [
      project.path,
      project.isContext ? "Mode: Context space, no repo required" : null,
      project.remote ? `Remote: ${project.remote}` : null,
      project.branch ? `Branch: ${project.branch}` : null
    ].filter(Boolean).join("\n");

    const canRunGit = project.exists && project.isRepo;
    const canUseMemory = project.exists && (project.isRepo || project.isContext);
    const disabled = canRunGit ? "" : "disabled";
    const memoryDisabled = canUseMemory ? "" : "disabled";
    const memory = state.summary.memory.projects.find((item) => item.projectId === project.id);
    const memoryTone = memory?.tone ?? "neutral";
    const memoryLabel = memory ? memory.message : "Memory unknown";
    return `
      <article class="row project-row ${isActive ? "active" : ""}">
        <div class="row-title">
          <span class="status-dot ${tone}"></span>
          <div>
            <strong>${escapeHtml(project.name)}${isActive ? " · Active" : ""}</strong>
            <div>${pill(escapeHtml(project.message || project.state), tone)} ${pill(escapeHtml(memoryLabel), memoryTone)}</div>
          </div>
        </div>
        <div class="row-detail">${escapeHtml(details)}</div>
        <div class="row-actions">
          <button data-select-project="${project.id}" ${isActive ? "disabled" : ""}>Set Active</button>
          <button data-project-action="fetch" data-project-id="${project.id}" ${disabled}>Fetch</button>
          <button data-project-action="pull" data-project-id="${project.id}" ${disabled}>Pull</button>
          <button data-project-action="push" data-project-id="${project.id}" ${disabled}>Push</button>
          <button data-project-action="commitWip" data-project-id="${project.id}" ${disabled}>Save WIP</button>
          <button data-memory-init="${project.id}" ${memoryDisabled}>Initialize Memory</button>
          <button data-auto-handoff="${project.id}" ${memoryDisabled}>Refresh Handoff</button>
          <button data-switch-agent="claude" data-project-id="${project.id}" ${memoryDisabled}>Use Claude</button>
          <button data-switch-agent="codex" data-project-id="${project.id}" ${memoryDisabled}>Use Codex</button>
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
  if (isHostedDashboard()) {
    selectors.toolsList.innerHTML = `
      <article class="row">
        <div class="row-title">
          <span class="status-dot neutral"></span>
          <div>
            <strong>Local tools</strong>
            <div>${pill("local-only", "neutral")}</div>
          </div>
        </div>
        <div class="row-detail">Tool installs and checks run on your PC or Mac local console.</div>
        <div class="row-actions"><button data-open-local-console="true">Open Local Console</button></div>
      </article>
    `;
    return;
  }

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
  renderCloudFleet();
    renderSkillCoverage();
    renderAgentProfiles();
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
  if (isHostedDashboard()) {
    selectors.setupStatus.innerHTML = `
      <div class="setup-card">
        <span class="status-dot neutral"></span>
        <div>
          <strong>Setup actions run locally</strong>
          <p>Open ${escapeHtml(localConsoleUrl())} on the machine you are setting up, then prepare or run setup files there.</p>
        </div>
      </div>
    `;
    return;
  }

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

async function selectProject(projectId) {
  const project = state.summary.projects.find((item) => item.id === projectId);
  if (!project) return;
  const result = await api("/api/session/project", {
    method: "POST",
    body: JSON.stringify({ projectId })
  });
  log(result.ok ? `Active project switched to ${project.name}.` : "Project switch failed.", result.message);
  await refresh();
}

async function autoSwitchAgent(projectId, targetAgent) {
  const project = state.summary.projects.find((item) => item.id === projectId);
  if (!project) return;
  const label = targetAgent === "codex" ? "Codex" : "Claude Code";
  setWorkflowFeedback(`Generating handoff and switching ${project.name} to ${label}...`, "neutral");
  const result = await api(`/api/projects/${encodeURIComponent(projectId)}/switch-agent`, {
    method: "POST",
    body: JSON.stringify({ targetAgent })
  });
  log(result.ok ? `Auto handoff saved. ${project.name} is ready for ${label}.` : "Switch failed.", result.message);
  setWorkflowFeedback(`${project.name} is ready for ${label}. Auto handoff saved.`, result.ok ? "ok" : "bad");
  await refresh();
}

async function autoRefreshHandoff(projectId) {
  const project = state.summary.projects.find((item) => item.id === projectId);
  if (!project) return;
  setWorkflowFeedback(`Refreshing ${project.name} handoff automatically...`, "neutral");
  const result = await api(`/api/projects/${encodeURIComponent(projectId)}/memory/handoff`, {
    method: "POST",
    body: JSON.stringify({})
  });
  log(result.ok ? `Automatic handoff refreshed for ${project.name}.` : "Handoff refresh failed.", result.message);
  setWorkflowFeedback(result.ok ? `${project.name} handoff refreshed. No typing needed.` : `Could not refresh ${project.name} handoff.`, result.ok ? "ok" : "bad");
  await refresh();
}

async function scanProjectsHome() {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  selectors.scanProjectsButton.disabled = true;
  selectors.scanProjectsPanelButton.disabled = true;
  try {
    log("Scanning GitHub folder for cloned repos.");
    const result = await api("/api/projects/discover", { method: "POST" });
    log(
      `Scan complete: ${result.discoveredCount} found, ${result.addedCount} added.`,
      result.added?.map((project) => project.name).join(", ") || "No new repos added."
    );
    await refresh();
    if (result.addedCount === 1 && result.added?.[0]?.id) {
      await selectProject(result.added[0].id);
    }
  } catch (error) {
    log("GitHub folder scan failed.", error.message);
  } finally {
    selectors.scanProjectsButton.disabled = false;
    selectors.scanProjectsPanelButton.disabled = false;
  }
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
selectors.projectSwitcher.addEventListener("change", async () => {
  try {
    await selectProject(selectors.projectSwitcher.value);
  } catch (error) {
    log("Project switch failed.", error.message);
  }
});
selectors.scanProjectsButton.addEventListener("click", scanProjectsHome);
selectors.scanProjectsPanelButton.addEventListener("click", scanProjectsHome);
selectors.clearLogButton.addEventListener("click", () => {
  selectors.activityLog.textContent = "Ready.";
});

selectors.addProjectButton.addEventListener("click", () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  selectors.projectNameInput.value = "";
  selectors.projectPathInput.value = "";
  selectors.projectDialog.showModal();
});

selectors.adoptWorkspaceButton.addEventListener("click", () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  selectors.workspaceNameInput.value = "";
  selectors.workspacePathInput.value = "";
  selectors.workspaceDialog.showModal();
});

selectors.addMachineButton.addEventListener("click", () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  selectors.machineNameInput.value = "";
  selectors.machinePlatformInput.value = "";
  selectors.machineDialog.showModal();
});

selectors.configureGlmButton.addEventListener("click", () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  selectors.glmApiKeyInput.value = "";
  selectors.glmDialog.showModal();
});

selectors.openZaiButton.addEventListener("click", () => {
  window.open("https://z.ai/manage-apikey/apikey-list", "_blank", "noopener,noreferrer");
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

selectors.saveWorkspaceButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const path = selectors.workspacePathInput.value.trim();
  const name = selectors.workspaceNameInput.value.trim();
  if (!path) {
    log("Workspace folder path is required.");
    return;
  }
  const result = await api("/api/workspaces/adopt", { method: "POST", body: JSON.stringify({ name, path }) });
  selectors.workspaceDialog.close();
  log(result.ok ? "Workspace adopted." : "Workspace adoption failed.", result.message);
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

selectors.saveGlmButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const apiKey = selectors.glmApiKeyInput.value.trim();
  if (!apiKey) {
    log("Paste the Z.ai API key first.");
    return;
  }
  const result = await api("/api/agents/glm52/configure", {
    method: "POST",
    body: JSON.stringify({ apiKey })
  });
  selectors.glmApiKeyInput.value = "";
  selectors.glmDialog.close();
  log(result.ok ? "GLM 5.2 configured for Claude Code." : "GLM setup failed.", result.message);
  await refresh();
});

selectors.saveHandoffButton.addEventListener("click", async (event) => {
  event.preventDefault();
  if (!activeHandoffProjectId) return;
  const summary = selectors.handoffSummaryInput.value.trim();
  const endpoint = activeSwitchTarget
    ? `/api/projects/${encodeURIComponent(activeHandoffProjectId)}/switch-agent`
    : `/api/projects/${encodeURIComponent(activeHandoffProjectId)}/memory/handoff`;
  const body = activeSwitchTarget ? { summary, targetAgent: activeSwitchTarget } : { summary };
  const result = await api(endpoint, {
    method: "POST",
    body: JSON.stringify(body)
  });
  selectors.handoffSummaryInput.value = "";
  selectors.handoffDialog.close();
  activeHandoffProjectId = null;
  activeSwitchTarget = null;
  log(result.ok ? "Handoff saved." : "Handoff failed.", result.message);
  await refresh();
});

selectors.restoreClaudeButton.addEventListener("click", async () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  const ok = window.confirm("Switch Claude Code on this PC back to the normal Claude model setup?");
  if (!ok) return;
  const result = await api("/api/agents/claude/restore", { method: "POST" });
  log(result.ok ? "Claude Code switched back to Claude models." : "Switch back failed.", result.message);
  await refresh();
});

document.addEventListener("click", async (event) => {
  const projectActionButton = event.target.closest("[data-project-action]");
  const removeButton = event.target.closest("[data-remove-project]");
  const installButton = event.target.closest("[data-install-tool]");
  const toolActionButton = event.target.closest("[data-tool-action]");
  const removeMachineButton = event.target.closest("[data-remove-machine]");
  const memoryInitButton = event.target.closest("[data-memory-init]");
  const memoryHandoffButton = event.target.closest("[data-memory-handoff]");
  const autoHandoffButton = event.target.closest("[data-auto-handoff]");
  const switchAgentButton = event.target.closest("[data-switch-agent]");
  const selectProjectButton = event.target.closest("[data-select-project]");
  const openAddProjectButton = event.target.closest("[data-open-add-project]");
  const openAdoptWorkspaceButton = event.target.closest("[data-open-adopt-workspace]");
  const openLocalConsoleButton = event.target.closest("[data-open-local-console]");

  try {
    if (openLocalConsoleButton) {
      window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    } else if (isHostedDashboard()) {
      log("This hosted dashboard is read-only. Open the local console for actions.");
    } else if (projectActionButton) {
      await projectAction(projectActionButton.dataset.projectId, projectActionButton.dataset.projectAction);
    } else if (selectProjectButton) {
      await selectProject(selectProjectButton.dataset.selectProject);
    } else if (openAddProjectButton) {
      selectors.addProjectButton.click();
    } else if (openAdoptWorkspaceButton) {
      selectors.adoptWorkspaceButton.click();
    } else if (removeButton) {
      await removeProject(removeButton.dataset.removeProject);
    } else if (removeMachineButton) {
      await removeMachine(removeMachineButton.dataset.removeMachine);
    } else if (installButton) {
      await installTool(installButton.dataset.installTool);
    } else if (toolActionButton) {
      await toolAction(toolActionButton.dataset.toolId, toolActionButton.dataset.toolAction);
    } else if (memoryInitButton) {
      const result = await api(`/api/projects/${encodeURIComponent(memoryInitButton.dataset.memoryInit)}/memory/init`, { method: "POST" });
      log(result.ok ? "Project memory initialized." : "Memory initialization failed.", result.message);
      await refresh();
    } else if (autoHandoffButton) {
      await autoRefreshHandoff(autoHandoffButton.dataset.autoHandoff);
    } else if (memoryHandoffButton) {
      activeHandoffProjectId = memoryHandoffButton.dataset.memoryHandoff;
      activeSwitchTarget = null;
      document.querySelector("#handoffHelp").textContent = "Optional manual note. Use this only when you want to add extra context beyond the automatic handoff.";
      selectors.handoffSummaryInput.value = "";
      selectors.handoffDialog.showModal();
    } else if (switchAgentButton) {
      await autoSwitchAgent(switchAgentButton.dataset.projectId, switchAgentButton.dataset.switchAgent);
    }
  } catch (error) {
    log("Action failed.", error.message);
  }
});

selectors.startWorkButton.addEventListener("click", async () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  selectors.startWorkButton.disabled = true;
  setWorkflowFeedback("Checking the active project...", "neutral");
  try {
    await refresh();
    const project = activeProject();
    const memory = memoryForProject(project);
    if (!project) {
      setWorkflowFeedback("No active project selected. Choose a project first.", "warn");
      return;
    }
    if (project.state === "behind") {
      setWorkflowFeedback(`${project.name} is behind GitHub. Pulling latest work now...`, "warn");
      await projectAction(project.id, "pull");
      setWorkflowFeedback(`${project.name} pulled latest work. Review readiness again.`, "ok");
      return;
    }
    if (project.state === "dirty") {
      setWorkflowFeedback(`${project.name} has unsaved local changes. Use Save WIP before switching machines.`, "warn");
      return;
    }
    if (project.state === "ahead") {
      setWorkflowFeedback(`${project.name} has commits to push. Use Push before switching machines.`, "warn");
      return;
    }
    if (project.state === "diverged") {
      setWorkflowFeedback(`${project.name} has diverged history. Stop and resolve before continuing.`, "bad");
      return;
    }
    if (!memory || memory.state === "missing") {
      setWorkflowFeedback(`${project.name} needs a memory pack. Click Initialize Memory.`, "warn");
      return;
    }
    if (["stale", "incomplete", "handoff-needed"].includes(memory.state)) {
      setWorkflowFeedback(`${project.name} needs a fresh handoff. Click Refresh Handoff; the console will write it automatically.`, "warn");
      return;
    }
    setWorkflowFeedback(`${project.name} is ready. Continue in Claude or Codex.`, "ok");
    log(`Start Work complete: ${project.name} is ready.`);
  } catch (error) {
    setWorkflowFeedback(`Start Work failed: ${error.message}`, "bad");
    log("Start Work failed.", error.message);
  } finally {
    selectors.startWorkButton.disabled = false;
  }
});

async function switchActiveProject(targetAgent) {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  await refresh();
  const projectId = state.summary.session?.activeProjectId || state.summary.projects[0]?.id;
  if (!projectId) {
    log("Add or adopt a workspace first.");
    return;
  }
  await autoSwitchAgent(projectId, targetAgent);
}

selectors.switchClaudeButton.addEventListener("click", () => switchActiveProject("claude"));
selectors.switchCodexButton.addEventListener("click", () => switchActiveProject("codex"));

selectors.endWorkButton.addEventListener("click", async () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  log("End Work: refreshing status. Use Save WIP and Push on projects that need it.");
  await refresh();
});

selectors.syncEverythingButton.addEventListener("click", async () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  log("Sync Everything: running safe checks and pulls where possible.");
  await refresh();
  for (const project of state.summary.projects.filter((item) => item.state === "behind")) {
    await projectAction(project.id, "pull");
  }
  const environment = await api("/api/environment/sync-local", { method: "POST" });
  log(environment.ok ? "Agent environment sync finished." : "Agent environment sync failed.", environment);
  const skillshare = toolById("skillshare");
  if (skillshare?.exists) await toolAction("skillshare", "sync");
  const config = toolById("aiConfigSync");
  if (config?.exists) await toolAction("aiConfigSync", "preview");
  log("Sync Everything complete.");
});

selectors.syncSkillsButton.addEventListener("click", async () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  const ok = window.confirm("Copy shared skills into local Claude, Codex, and Shared Agents folders?");
  if (!ok) return;
  log("Syncing local skills.");
  const result = await api("/api/skills/sync-local", { method: "POST" });
  log(result.ok ? "Local skill sync finished." : "Local skill sync failed.", result);
  await refresh();
});

selectors.syncEnvironmentButton.addEventListener("click", async () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  const ok = window.confirm("Sync Claude/Codex shared instructions, hooks, rules, and skills on this machine? Local auth, sessions, logs, and databases will be left alone.");
  if (!ok) return;
  log("Syncing Claude/Codex agent environment.");
  const result = await api("/api/environment/sync-local", { method: "POST" });
  log(result.ok ? "Agent environment sync finished." : "Agent environment sync failed.", result);
  await refresh();
});

selectors.importSkillsButton.addEventListener("click", async () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  const ok = window.confirm("Build the shared skill source from local Claude, Codex, and Shared Agents skills?");
  if (!ok) return;
  log("Building shared skill source from local skills.");
  const result = await api("/api/skills/import-local", { method: "POST" });
  log(result.ok ? `Shared skill source built with ${result.importedCount} skills.` : "Shared skill import failed.", result);
  await refresh();
});

selectors.prepareSetupButton.addEventListener("click", async () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  log("Preparing one-click setup files.");
  const result = await api("/api/setup/prepare", { method: "POST" });
  log(result.ok ? "Setup files prepared." : `Setup files not ready: ${result.message}`, result);
  await refresh();
});

selectors.openSetupFolderButton.addEventListener("click", async () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  log("Opening setup folder.");
  const result = await api("/api/setup/open-folder", { method: "POST" });
  log(result.ok ? "Setup folder opened." : "Could not open setup folder.", result);
});

selectors.openMemoryButton.addEventListener("click", () => {
  window.open("http://localhost:3211", "_blank", "noopener,noreferrer");
});

selectors.publishCloudButton.addEventListener("click", async () => {
  if (isHostedDashboard()) {
    window.open(localConsoleUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  log("Publishing this machine status to Supabase.");
  const result = await api("/api/cloud/publish", { method: "POST" });
  log(result.ok ? "Cloud status published." : `Cloud publish failed: ${result.message || "needs setup"}`);
  await refresh();
});

refresh();
