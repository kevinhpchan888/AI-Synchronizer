const state = {
  summary: null
};

const selectors = {
  machineLine: document.querySelector("#machineLine"),
  refreshButton: document.querySelector("#refreshButton"),
  projectsCard: document.querySelector("#projectsCard"),
  skillsCard: document.querySelector("#skillsCard"),
  configCard: document.querySelector("#configCard"),
  memoryCard: document.querySelector("#memoryCard"),
  cloudCard: document.querySelector("#cloudCard"),
  projectsList: document.querySelector("#projectsList"),
  toolsList: document.querySelector("#toolsList"),
  activityLog: document.querySelector("#activityLog"),
  clearLogButton: document.querySelector("#clearLogButton"),
  addProjectButton: document.querySelector("#addProjectButton"),
  projectDialog: document.querySelector("#projectDialog"),
  projectNameInput: document.querySelector("#projectNameInput"),
  projectPathInput: document.querySelector("#projectPathInput"),
  saveProjectButton: document.querySelector("#saveProjectButton"),
  startWorkButton: document.querySelector("#startWorkButton"),
  endWorkButton: document.querySelector("#endWorkButton"),
  syncEverythingButton: document.querySelector("#syncEverythingButton"),
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

function setCard(card, tone, title, message) {
  const dot = card.querySelector(".status-dot");
  dot.className = `status-dot ${tone}`;
  card.querySelector("h2").textContent = title;
  card.querySelector("p").textContent = message;
}

function toneForProject(project) {
  if (["synced"].includes(project.state)) return "ok";
  if (["dirty", "ahead", "behind", "warning"].includes(project.state)) return "warn";
  if (["diverged", "missing", "not-repo"].includes(project.state)) return "bad";
  return "neutral";
}

function summarizeProjects(projects) {
  if (!projects.length) return ["warn", "Projects", "No projects registered yet"];
  const bad = projects.filter((project) => toneForProject(project) === "bad").length;
  const warn = projects.filter((project) => toneForProject(project) === "warn").length;
  if (bad) return ["bad", "Projects", `${bad} project${bad === 1 ? "" : "s"} need attention`];
  if (warn) return ["warn", "Projects", `${warn} project${warn === 1 ? "" : "s"} need sync`];
  return ["ok", "Projects", `${projects.length} project${projects.length === 1 ? "" : "s"} synced`];
}

function toolById(id) {
  return state.summary.tools.find((tool) => tool.id === id);
}

function renderCards() {
  const [projectTone, projectTitle, projectMessage] = summarizeProjects(state.summary.projects);
  setCard(selectors.projectsCard, projectTone, projectTitle, projectMessage);

  const skillshare = toolById("skillshare");
  setCard(selectors.skillsCard, skillshare?.exists ? "ok" : "warn", "Skills", skillshare?.exists ? "Skillshare installed" : "Skillshare not installed");

  const config = toolById("aiConfigSync");
  setCard(selectors.configCard, config?.exists ? "ok" : "warn", "Claude / Codex", config?.exists ? "Config sync tool installed" : "Config sync tool not installed");

  const memorix = toolById("memorix");
  setCard(selectors.memoryCard, memorix?.exists ? "ok" : "warn", "Memory", memorix?.exists ? "Memorix installed" : "Memorix not installed");

  const cloud = state.summary.cloud;
  const cloudReady = cloud.vercel.cliAuthenticated && cloud.supabase.configured;
  const cloudPartial = cloud.vercel.cliAuthenticated || cloud.supabase.configured || cloud.envLocalPresent;
  setCard(
    selectors.cloudCard,
    cloudReady ? "ok" : cloudPartial ? "warn" : "neutral",
    "Cloud",
    cloudReady ? "Vercel and Supabase configured" : cloudPartial ? "Partially configured" : "Local mode"
  );
}

function pill(text, tone) {
  return `<span class="pill ${tone}">${text}</span>`;
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
          <button data-project-action="fetch" data-project-id="${project.id}">Fetch</button>
          <button data-project-action="pull" data-project-id="${project.id}">Pull</button>
          <button data-project-action="push" data-project-id="${project.id}">Push</button>
          <button data-project-action="commitWip" data-project-id="${project.id}">Save WIP</button>
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
    renderProjects();
    renderTools();
    log("Status refreshed.");
  } catch (error) {
    log("Refresh failed.", error.message);
  } finally {
    selectors.refreshButton.disabled = false;
  }
}

async function projectAction(projectId, action) {
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

document.addEventListener("click", async (event) => {
  const projectActionButton = event.target.closest("[data-project-action]");
  const removeButton = event.target.closest("[data-remove-project]");
  const installButton = event.target.closest("[data-install-tool]");
  const toolActionButton = event.target.closest("[data-tool-action]");

  try {
    if (projectActionButton) {
      await projectAction(projectActionButton.dataset.projectId, projectActionButton.dataset.projectAction);
    } else if (removeButton) {
      await removeProject(removeButton.dataset.removeProject);
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

selectors.openMemoryButton.addEventListener("click", () => {
  window.open("http://localhost:3211", "_blank", "noopener,noreferrer");
});

refresh();

