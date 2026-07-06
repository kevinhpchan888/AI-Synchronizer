import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";

const MEMORY_DIR = ".ai-memory";
const SEMANTIC_DIR = "semantic";
const INDEX_FILE = "cognee-index.json";
const GRAPH_FILE = "graphiti-graph.json";
const EPISODES_FILE = "graphiti-episodes.jsonl";
const PACKET_FILE = "AGENT_STARTUP.md";
const CAPSULE_FILE = "CONTEXT_CAPSULE.md";
const CAPSULE_JSON_FILE = "context-capsule.json";
const MAX_FILES = 260;
const MAX_CANDIDATE_FILES = 4000;
const MAX_FILE_BYTES = 160_000;
const MAX_TOTAL_BYTES = 2_200_000;
const PREVIEW_CHARS = 360;

const TEXT_EXTENSIONS = new Set([
  ".md",
  ".mdx",
  ".txt",
  ".json",
  ".jsonl",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".html",
  ".css",
  ".scss",
  ".yml",
  ".yaml",
  ".toml",
  ".sql",
  ".py",
  ".ps1",
  ".sh",
  ".csv"
]);

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  ".claude",
  ".codex",
  ".agents",
  ".venv",
  "venv",
  "__pycache__",
  ".next",
  ".vercel",
  "dist",
  "build",
  "output",
  "coverage",
  "logs",
  "backups",
  "tmp",
  "temp",
  "setup-package"
]);

const SKIP_FILES = new Set([
  ".env",
  ".env.local",
  ".env.production",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "uv.lock"
]);

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "agent",
  "also",
  "and",
  "any",
  "are",
  "because",
  "been",
  "before",
  "being",
  "between",
  "but",
  "can",
  "code",
  "console",
  "could",
  "current",
  "data",
  "does",
  "each",
  "file",
  "from",
  "has",
  "have",
  "here",
  "into",
  "its",
  "local",
  "make",
  "memory",
  "must",
  "need",
  "needs",
  "not",
  "now",
  "one",
  "only",
  "other",
  "project",
  "repo",
  "same",
  "should",
  "sync",
  "that",
  "the",
  "their",
  "then",
  "there",
  "this",
  "tool",
  "use",
  "used",
  "using",
  "when",
  "where",
  "with",
  "work",
  "will",
  "you",
  "your"
]);

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function statOrNull(targetPath) {
  try {
    return await fs.stat(targetPath);
  } catch {
    return null;
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function semanticPath(project) {
  return path.join(project.path, MEMORY_DIR, SEMANTIC_DIR);
}

function normalizeSlash(value) {
  return String(value ?? "").replaceAll("\\", "/");
}

function escapeMarkdown(value) {
  return String(value ?? "").replace(/\r?\n/g, " ").trim();
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n/g, "\n")
    .trim();
}

function tokenize(value) {
  return cleanText(value).toLowerCase()
    .match(/[a-z0-9][a-z0-9_-]{2,}/g)
    ?.filter((word) => !STOP_WORDS.has(word) && !/^\d+$/.test(word))
    ?? [];
}

function topKeywords(text, limit = 14) {
  const counts = new Map();
  for (const word of tokenize(text)) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

function shouldSkipFile(name, relativePath) {
  if (SKIP_FILES.has(name)) return true;
  if (relativePath.startsWith(`${MEMORY_DIR}/semantic/`) || relativePath.includes(`/${MEMORY_DIR}/semantic/`)) return true;
  if (relativePath.startsWith(`${MEMORY_DIR}/events/`)) return false;
  if (name.endsWith(".log")) return true;
  return false;
}

function shouldIndexFile(name) {
  return TEXT_EXTENSIONS.has(path.extname(name).toLowerCase());
}

function filePriority(file) {
  const relativePath = normalizeSlash(file.relativePath);
  const name = path.basename(relativePath);
  let score = 0;

  if (relativePath.startsWith(`${MEMORY_DIR}/`)) score += 700;
  if ([
    `${MEMORY_DIR}/PROJECT.md`,
    `${MEMORY_DIR}/STATUS.md`,
    `${MEMORY_DIR}/DECISIONS.md`,
    `${MEMORY_DIR}/TASKS.md`,
    `${MEMORY_DIR}/HANDOFF.md`,
    `${MEMORY_DIR}/RULES.md`,
    `${MEMORY_DIR}/CONTEXT_INDEX.json`
  ].includes(relativePath)) score += 800;
  if (/^(README|AGENTS|CLAUDE|RULES|STATUS|TASKS|DECISIONS|HANDOFF)\.md$/i.test(name)) score += 500;
  if (/package\.json$|requirements\.txt$|pyproject\.toml$|vite\.config|next\.config|server\.mjs$|server\.js$/i.test(relativePath)) score += 420;
  if (/^(src|app|pages|components|lib|scripts|templates|env)\//.test(relativePath)) score += 220;
  if (/skills\/[^/]+\/SKILL\.md$/i.test(relativePath)) score += 260;
  if (/test|spec/i.test(relativePath)) score += 90;
  if (file.size <= 12_000) score += 60;
  if (file.size > 80_000) score -= 80;

  const ageHours = Math.max(0, (Date.now() - new Date(file.updatedAt).getTime()) / 3_600_000);
  if (Number.isFinite(ageHours)) score += Math.max(0, 180 - Math.min(180, ageHours));
  return score;
}

async function walkProjectFiles(root) {
  const candidates = [];

  async function walk(folder) {
    if (candidates.length >= MAX_CANDIDATE_FILES) return;
    let entries = [];
    try {
      entries = await fs.readdir(folder, { withFileTypes: true });
    } catch {
      return;
    }

    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (candidates.length >= MAX_CANDIDATE_FILES) break;
      const fullPath = path.join(folder, entry.name);
      const relativePath = normalizeSlash(path.relative(root, fullPath));
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        if (relativePath === `${MEMORY_DIR}/semantic` || relativePath.endsWith(`/${MEMORY_DIR}/semantic`)) continue;
        await walk(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (shouldSkipFile(entry.name, relativePath)) continue;
      if (!shouldIndexFile(entry.name)) continue;
      const stat = await statOrNull(fullPath);
      if (!stat || stat.size > MAX_FILE_BYTES) continue;
      candidates.push({ fullPath, relativePath, size: stat.size, updatedAt: stat.mtime.toISOString() });
    }
  }

  await walk(root);
  candidates.sort((a, b) => filePriority(b) - filePriority(a) || a.relativePath.localeCompare(b.relativePath));

  const files = [];
  let totalBytes = 0;
  for (const file of candidates) {
    if (files.length >= MAX_FILES || totalBytes >= MAX_TOTAL_BYTES) break;
    totalBytes += file.size;
    files.push(file);
  }
  return files;
}

async function readTextFile(file) {
  const raw = await fs.readFile(file.fullPath, "utf8");
  return cleanText(raw.slice(0, MAX_FILE_BYTES));
}

function sourceHash(items) {
  // Event logs are indexed for search, but they are bookkeeping the console
  // writes on Start Work, tool switches, and checkpoints. Keep them out of
  // the staleness hash or memory turns stale right after every switch.
  const hash = createHash("sha256");
  const hashable = [...items]
    .filter((item) => !normalizeSlash(item.relativePath).includes(`${MEMORY_DIR}/events/`))
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  for (const item of hashable) {
    hash.update(item.relativePath);
    hash.update(String(item.size));
    hash.update(item.updatedAt);
  }
  return hash.digest("hex");
}

function newestUpdatedAt(items) {
  const newest = items
    .map((item) => new Date(item.updatedAt))
    .filter((date) => Number.isFinite(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  return newest?.toISOString() ?? null;
}

function headingEntities(text, file) {
  const entities = [];
  const lines = text.split("\n");
  for (const line of lines) {
    const match = line.match(/^\s{0,3}#{1,4}\s+(.{3,96})$/);
    if (!match) continue;
    entities.push({
      name: match[1].replace(/[#`*_]/g, "").trim(),
      type: "section",
      source: file.relativePath,
      confidence: 0.84
    });
  }
  return entities;
}

function urlEntities(text, file) {
  const matches = text.match(/https?:\/\/[^\s)"']+/g) ?? [];
  return [...new Set(matches)].slice(0, 20).map((url) => ({
    name: url,
    type: "url",
    source: file.relativePath,
    confidence: 0.9
  }));
}

function apiRouteEntities(text, file) {
  const matches = text.match(/["'`](\/api\/[A-Za-z0-9_./:{}?-]+)["'`]/g) ?? [];
  return [...new Set(matches.map((item) => item.slice(1, -1)))].slice(0, 30).map((route) => ({
    name: route,
    type: "api_route",
    source: file.relativePath,
    confidence: 0.88
  }));
}

function properNameEntities(text, file) {
  const matches = text.match(/\b[A-Z][A-Za-z0-9]+(?:[ -][A-Z][A-Za-z0-9]+){0,4}\b/g) ?? [];
  const ignore = new Set(["The", "This", "That", "For", "Use", "When", "What", "How", "If", "In"]);
  return [...new Set(matches)]
    .filter((name) => !ignore.has(name) && name.length >= 4 && name.length <= 80)
    .slice(0, 35)
    .map((name) => ({
      name,
      type: "concept",
      source: file.relativePath,
      confidence: 0.58
    }));
}

function packageEntities(text, file) {
  if (!file.relativePath.endsWith("package.json")) return [];
  try {
    const parsed = JSON.parse(text);
    const deps = { ...(parsed.dependencies ?? {}), ...(parsed.devDependencies ?? {}) };
    return Object.keys(deps).slice(0, 60).map((name) => ({
      name,
      type: "package",
      source: file.relativePath,
      confidence: 0.92
    }));
  } catch {
    return [];
  }
}

function extractEntities(text, file) {
  return [
    {
      name: file.relativePath,
      type: "file",
      source: file.relativePath,
      confidence: 1
    },
    ...headingEntities(text, file),
    ...urlEntities(text, file),
    ...apiRouteEntities(text, file),
    ...packageEntities(text, file),
    ...properNameEntities(text, file)
  ];
}

function relation(source, verb, target, file, evidence, confidence = 0.72) {
  return {
    id: createHash("sha1").update(`${source}|${verb}|${target}|${file.relativePath}|${evidence}`).digest("hex"),
    source,
    relation: verb,
    target,
    file: file.relativePath,
    evidence: escapeMarkdown(evidence).slice(0, 220),
    confidence
  };
}

function importRelations(text, file) {
  const items = [];
  const importMatches = text.matchAll(/(?:import\s+.*?\s+from\s+|require\()\s*["']([^"']+)["']/g);
  for (const match of importMatches) {
    items.push(relation(file.relativePath, "uses", match[1], file, match[0], 0.86));
  }
  return items.slice(0, 50);
}

function packageRelations(text, file) {
  if (!file.relativePath.endsWith("package.json")) return [];
  try {
    const parsed = JSON.parse(text);
    const name = parsed.name || path.basename(path.dirname(file.fullPath));
    const deps = { ...(parsed.dependencies ?? {}), ...(parsed.devDependencies ?? {}) };
    return Object.keys(deps).slice(0, 80).map((dep) => relation(name, "depends_on", dep, file, `${dep}: ${deps[dep]}`, 0.9));
  } catch {
    return [];
  }
}

function routeRelations(text, file) {
  const items = [];
  const routeMatches = text.matchAll(/(?:url\.pathname\s*===|url\.pathname\.match\()\s*["'`]([^"'`]+)["'`]/g);
  for (const match of routeMatches) {
    if (String(match[1]).includes("/api/")) {
      items.push(relation(file.relativePath, "serves_api", match[1], file, match[0], 0.88));
    }
  }
  return items.slice(0, 50);
}

function taskRelations(text, file) {
  const items = [];
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.{3,160})$/);
    if (!match) continue;
    items.push(relation(file.relativePath, match[1].trim().toLowerCase() === "x" ? "completed_task" : "has_open_task", match[2], file, line, 0.82));
  }
  return items.slice(0, 40);
}

function decisionRelations(text, file) {
  const items = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 220) continue;
    if (/\b(decided|decision|must|do not|never|always|source of truth|rule)\b/i.test(trimmed)) {
      items.push(relation(file.relativePath, "states_decision", trimmed.replace(/^[-*#\s]+/, ""), file, trimmed, 0.74));
    }
  }
  return items.slice(0, 45);
}

function extractRelations(text, file, projectName) {
  return [
    relation(projectName, "contains_file", file.relativePath, file, file.relativePath, 0.9),
    ...importRelations(text, file),
    ...packageRelations(text, file),
    ...routeRelations(text, file),
    ...taskRelations(text, file),
    ...decisionRelations(text, file)
  ];
}

function mergeEntities(entities) {
  const merged = new Map();
  for (const entity of entities) {
    const key = `${entity.type}:${entity.name.toLowerCase()}`;
    const current = merged.get(key);
    if (!current) {
      merged.set(key, {
        ...entity,
        id: createHash("sha1").update(key).digest("hex"),
        mentions: 1,
        sources: [entity.source]
      });
      continue;
    }
    current.mentions += 1;
    current.confidence = Math.max(current.confidence, entity.confidence);
    if (!current.sources.includes(entity.source)) current.sources.push(entity.source);
  }
  return [...merged.values()]
    .sort((a, b) => b.mentions - a.mentions || b.confidence - a.confidence)
    .slice(0, 220);
}

function uniqueRelations(relations) {
  const seen = new Set();
  const unique = [];
  for (const item of relations) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }
  return unique.slice(0, 450);
}

function chunkForFile(file, text) {
  const headings = headingEntities(text, file).map((item) => item.name).slice(0, 5);
  return {
    id: createHash("sha1").update(`${file.relativePath}:${file.updatedAt}:${file.size}`).digest("hex"),
    path: file.relativePath,
    title: headings[0] || file.relativePath,
    updatedAt: file.updatedAt,
    size: file.size,
    keywords: topKeywords(text, 12),
    headings,
    preview: text.replace(/\s+/g, " ").slice(0, PREVIEW_CHARS)
  };
}

function topEvidence(relations, verb, limit = 8) {
  return relations
    .filter((item) => item.relation === verb)
    .slice(0, limit)
    .map((item) => item.target);
}

async function memoryFileText(projectPath, file, maxChars = 900) {
  try {
    const raw = await fs.readFile(path.join(projectPath, MEMORY_DIR, file), "utf8");
    return cleanText(raw).slice(0, maxChars);
  } catch {
    return "";
  }
}

async function handoffUpdatedAt(projectPath) {
  const stat = await statOrNull(path.join(projectPath, MEMORY_DIR, "HANDOFF.md"));
  return stat?.mtime?.toISOString() ?? null;
}

function filesChangedSince(chunks, isoDate, limit = 12) {
  if (!isoDate) return [];
  const since = new Date(isoDate).getTime();
  if (!Number.isFinite(since)) return [];
  return chunks
    .filter((item) => {
      const updated = new Date(item.updatedAt).getTime();
      return Number.isFinite(updated)
        && updated > since + 1000
        && item.path !== `${MEMORY_DIR}/HANDOFF.md`
        && !item.path.startsWith(`${MEMORY_DIR}/events/`);
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

function searchRecipes({ project, routes, tasks, decisions }) {
  const recipes = [
    `${project.name} current focus`,
    "open tasks decisions rules",
    "handoff changed files"
  ];
  if (routes.length) recipes.push("api routes");
  if (tasks.length) recipes.push(tasks[0]);
  if (decisions.length) recipes.push("source of truth rules");
  return [...new Set(recipes)].slice(0, 6);
}

function recentMemoryEvents(projectPath, limit = 8) {
  return fs.readdir(path.join(projectPath, MEMORY_DIR, "events"), { withFileTypes: true })
    .then(async (entries) => {
      const files = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl"))
        .map((entry) => path.join(projectPath, MEMORY_DIR, "events", entry.name))
        .sort()
        .reverse()
        .slice(0, 3);
      const events = [];
      for (const file of files) {
        const raw = await fs.readFile(file, "utf8");
        for (const line of raw.split(/\r?\n/).filter(Boolean).reverse()) {
          try {
            events.push(JSON.parse(line));
          } catch {
            // Ignore malformed event lines.
          }
          if (events.length >= limit) return events;
        }
      }
      return events;
    })
    .catch(() => []);
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function appendEpisode(semanticRoot, episode) {
  await fs.mkdir(semanticRoot, { recursive: true });
  await fs.appendFile(path.join(semanticRoot, EPISODES_FILE), `${JSON.stringify(episode)}\n`, "utf8");
}

async function readEpisodes(semanticRoot, limit = 12) {
  try {
    const raw = await fs.readFile(path.join(semanticRoot, EPISODES_FILE), "utf8");
    return raw.split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .slice(-limit)
      .reverse();
  } catch {
    return [];
  }
}

async function buildStartupPacket({ project, index, graph, packetAgent = "all" }) {
  const recentEvents = await recentMemoryEvents(project.path);
  const tasks = topEvidence(graph.relations, "has_open_task", 12);
  const decisions = topEvidence(graph.relations, "states_decision", 12);
  const topFiles = index.chunks.slice(0, 12);
  const topEntities = graph.entities.slice(0, 18);
  const routes = graph.entities.filter((item) => item.type === "api_route").slice(0, 10);
  const packages = graph.entities.filter((item) => item.type === "package").slice(0, 12);
  const [handoffAt, statusText, handoffText, taskText, decisionText] = await Promise.all([
    handoffUpdatedAt(project.path),
    memoryFileText(project.path, "STATUS.md", 700),
    memoryFileText(project.path, "HANDOFF.md", 700),
    memoryFileText(project.path, "TASKS.md", 700),
    memoryFileText(project.path, "DECISIONS.md", 900)
  ]);
  const changedSinceHandoff = filesChangedSince(index.chunks, handoffAt);
  const dirtyFiles = Array.isArray(project.changedFiles) ? project.changedFiles.slice(0, 12) : [];
  const recipes = searchRecipes({ project, routes, tasks, decisions });

  return [
    `# Agent Startup Packet`,
    ``,
    `Project: ${project.name}`,
    `Path: ${project.path}`,
    `Generated: ${index.builtAt}`,
    `Intended agent: ${packetAgent}`,
    ``,
    `## First Rule`,
    ``,
    `Read this packet before making substantial changes. Treat .ai-memory as the portable source of project context across Claude, Codex, and Hermes.`,
    ``,
    `## Current Memory Health`,
    ``,
    `- Cognee-style semantic index: ${index.summary.chunks} chunks, ${index.summary.entities} entities`,
    `- Graphiti-style temporal graph: ${graph.summary.relations} relations, ${graph.summary.episodes} episodes`,
    `- Source hash: ${index.sourceHash}`,
    `- Last indexed project file update: ${index.sourceNewestAt || "unknown"}`,
    `- Last handoff update: ${handoffAt || "unknown"}`,
    ``,
    `## Operating Brief`,
    ``,
    `Project state: ${project.state || "unknown"}`,
    `Branch: ${project.branch || "unknown"}`,
    `Uncommitted files: ${project.dirtyCount ?? dirtyFiles.length ?? 0}`,
    ``,
    `Status excerpt: ${statusText || "No status memory captured yet."}`,
    ``,
    `Handoff excerpt: ${handoffText || "No handoff memory captured yet."}`,
    ``,
    `Task excerpt: ${taskText || "No task memory captured yet."}`,
    ``,
    `Decision excerpt: ${decisionText || "No decision memory captured yet."}`,
    ``,
    `## Changed Since Last Handoff`,
    ``,
    ...(changedSinceHandoff.length
      ? changedSinceHandoff.map((item) => `- ${item.path}: updated ${item.updatedAt}`)
      : ["- No indexed project files changed after the latest handoff."]),
    ``,
    `## Current Local Changes`,
    ``,
    ...(dirtyFiles.length
      ? dirtyFiles.map((item) => `- ${item}`)
      : ["- No uncommitted files were reported by the project status scan."]),
    ``,
    `## Important Files`,
    ``,
    ...topFiles.map((item) => `- ${item.path}: ${item.title}`),
    ``,
    `## Important Entities`,
    ``,
    ...topEntities.map((item) => `- ${item.name} (${item.type}, ${item.mentions} mention${item.mentions === 1 ? "" : "s"})`),
    ``,
    `## Decisions And Rules Found`,
    ``,
    ...(decisions.length ? decisions.map((item) => `- ${item}`) : ["- No explicit decisions indexed yet."]),
    ``,
    `## Open Tasks Found`,
    ``,
    ...(tasks.length ? tasks.map((item) => `- ${item}`) : ["- No checkbox tasks indexed yet."]),
    ``,
    `## API Routes Found`,
    ``,
    ...(routes.length ? routes.map((item) => `- ${item.name}`) : ["- No API routes indexed yet."]),
    ``,
    `## Packages Found`,
    ``,
    ...(packages.length ? packages.map((item) => `- ${item.name}`) : ["- No package manifest indexed yet."]),
    ``,
    `## Recent Memory Events`,
    ``,
    ...(recentEvents.length ? recentEvents.map((event) => `- ${event.occurredAt || "unknown"}: ${event.type}`) : ["- No recent events found."]),
    ``,
    `## Search Memory Recipes`,
    ``,
    ...recipes.map((item) => `- Search Memory: ${item}`),
    ``,
    `## Next Agent Checklist`,
    ``,
    `- Confirm this is the intended local folder before editing: ${project.path}`,
    `- Read Changed Since Last Handoff and Current Local Changes before touching files.`,
    `- Use Search Memory before asking Kevin to repeat project context.`,
    `- Update HANDOFF.md through AI Sync before switching tools, machines, or agents.`,
    `- Rebuild Semantic Memory after substantial file, decision, task, or skill changes.`,
    ``,
    `## Agent Instructions`,
    ``,
    `- Claude Code: use this packet when resuming the project after a switch or context reset.`,
    `- Codex: use this packet as the starting context when ${project.name} is opened locally.`,
    `- Hermes: use this packet for routing, monitoring, and handoff decisions. Do not treat it as a replacement for the repo.`,
    `- If the packet is stale or missing, rebuild Semantic Memory from AI Sync Console before starting work.`,
    ``
  ].join("\n");
}

function shortList(items, limit = 8) {
  return (items ?? []).filter(Boolean).slice(0, limit);
}

function sentence(value, fallback = "Not recorded yet.") {
  const text = cleanText(value).replace(/^# .+?\s*/m, "").trim();
  return text ? text.slice(0, 420) : fallback;
}

async function buildContextCapsule({ project, index, graph, agent = "all" }) {
  const semanticRoot = semanticPath(project);
  const recentEvents = await recentMemoryEvents(project.path, 6);
  const tasks = topEvidence(graph.relations, "has_open_task", 8);
  const decisions = topEvidence(graph.relations, "states_decision", 10);
  const [handoffAt, statusText, handoffText, taskText, decisionText] = await Promise.all([
    handoffUpdatedAt(project.path),
    memoryFileText(project.path, "STATUS.md", 650),
    memoryFileText(project.path, "HANDOFF.md", 650),
    memoryFileText(project.path, "TASKS.md", 650),
    memoryFileText(project.path, "DECISIONS.md", 650)
  ]);
  const changedSinceHandoff = filesChangedSince(index.chunks, handoffAt, 8);
  const importantFiles = index.chunks.slice(0, 10).map((item) => ({
    path: item.path,
    title: item.title,
    preview: item.preview
  }));
  const importantEntities = graph.entities.slice(0, 12).map((item) => ({
    name: item.name,
    type: item.type,
    mentions: item.mentions,
    sources: shortList(item.sources, 4)
  }));
  const recallPrompt = [
    `Before acting on ${project.name}, read .ai-memory/semantic/CONTEXT_CAPSULE.md first.`,
    `Then read .ai-memory/semantic/AGENT_STARTUP.md if the task is substantial.`,
    `Use the local folder ${project.path}.`,
    `If the capsule is stale, rebuild semantic memory in AI Sync Console before editing.`
  ].join(" ");

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    agent,
    project: {
      id: project.id,
      name: project.name,
      path: project.path,
      state: project.state || "unknown",
      branch: project.branch || null,
      dirtyCount: project.dirtyCount ?? 0,
      changedFiles: shortList(project.changedFiles, 10)
    },
    files: {
      capsule: path.join(semanticRoot, CAPSULE_FILE),
      startupPacket: path.join(semanticRoot, PACKET_FILE),
      cogneeIndex: path.join(semanticRoot, INDEX_FILE),
      graphitiGraph: path.join(semanticRoot, GRAPH_FILE)
    },
    memoryHealth: {
      chunks: index.summary?.chunks ?? index.chunks?.length ?? 0,
      entities: graph.summary?.entities ?? graph.entities?.length ?? 0,
      relations: graph.summary?.relations ?? graph.relations?.length ?? 0,
      episodes: graph.summary?.episodes ?? 0,
      sourceHash: index.sourceHash ?? null,
      sourceNewestAt: index.sourceNewestAt ?? null,
      handoffUpdatedAt: handoffAt
    },
    summary: sentence(statusText),
    latestHandoff: sentence(handoffText),
    taskMemory: sentence(taskText),
    decisionMemory: sentence(decisionText),
    changedSinceHandoff,
    importantFiles,
    importantEntities,
    rulesAndDecisions: shortList(decisions, 10),
    openTasks: shortList(tasks, 8),
    recentEvents: recentEvents.map((event) => ({
      type: event.type,
      occurredAt: event.occurredAt,
      payload: event.payload ?? {}
    })),
    recallPrompt
  };
}

function contextCapsuleMarkdown(capsule) {
  // The capsule is the SHORT recovery brief an agent reads first after
  // compression or a tool/machine switch. Deep inventory (changed files,
  // important files, entities, routes) lives in the startup packet, which
  // the capsule points to. Do not duplicate packet sections here; agents
  // read both files in sequence and pay for every repeated line.
  const project = capsule.project;
  const lines = [
    "# Context Capsule",
    "",
    `Generated: ${capsule.generatedAt}`,
    "",
    "## Post-Compression Recovery",
    "",
    capsule.recallPrompt,
    "",
    "## Project",
    "",
    `- Name: ${project.name}`,
    `- Folder: ${project.path}`,
    `- State: ${project.state}`,
    `- Branch: ${project.branch || "unknown"}`,
    `- Local changes: ${project.dirtyCount}`,
    "",
    "## Current Summary",
    "",
    capsule.summary,
    "",
    "## Latest Handoff",
    "",
    capsule.latestHandoff,
    "",
    "## Open Tasks",
    "",
    ...(capsule.openTasks.length ? capsule.openTasks.map((item) => `- ${item}`) : ["- No open tasks indexed yet."]),
    "",
    "## Rules And Decisions",
    "",
    ...(capsule.rulesAndDecisions.length ? capsule.rulesAndDecisions.map((item) => `- ${item}`) : ["- No explicit rules or decisions indexed yet."]),
    "",
    "## Read Next",
    "",
    `- ${capsule.files.startupPacket} (changed files, important files, entities, routes, search recipes)`,
    `- ${path.join(project.path, MEMORY_DIR, "STATUS.md")}`,
    `- ${path.join(project.path, MEMORY_DIR, "HANDOFF.md")}`,
    `- ${path.join(project.path, MEMORY_DIR, "TASKS.md")}`,
    ""
  ];
  return lines.join("\n");
}

async function writeContextCapsule(project, index, graph, agent = "all") {
  const root = semanticPath(project);
  const data = await buildContextCapsule({ project, index, graph, agent });
  const markdown = contextCapsuleMarkdown(data);
  await writeJson(path.join(root, CAPSULE_JSON_FILE), data);
  await fs.writeFile(path.join(root, CAPSULE_FILE), markdown, "utf8");
  return { data, markdown };
}

export async function getSemanticMemoryStatus(project) {
  if (!project?.exists || (!project.isRepo && !project.isContext)) {
    return {
      state: "unavailable",
      tone: "neutral",
      message: "Semantic memory unavailable",
      chunks: 0,
      entities: 0,
      relations: 0,
      episodes: 0,
      lastBuiltAt: null,
      packetPath: null
    };
  }

  const root = semanticPath(project);
  const indexFile = path.join(root, INDEX_FILE);
  const graphFile = path.join(root, GRAPH_FILE);
  const packetPath = path.join(root, PACKET_FILE);
  const capsulePath = path.join(root, CAPSULE_FILE);
  const [indexStat, graphStat, packetStat, capsuleStat] = await Promise.all([
    statOrNull(indexFile),
    statOrNull(graphFile),
    statOrNull(packetPath),
    statOrNull(capsulePath)
  ]);

  if (!indexStat || !graphStat || !packetStat) {
    return {
      state: "missing",
      tone: "warn",
      message: "Semantic memory not built",
      chunks: 0,
      entities: 0,
      relations: 0,
      episodes: (await readEpisodes(root, 1000)).length,
      lastBuiltAt: null,
      packetPath: null,
      capsulePath: null
    };
  }

  let index = null;
  let graph = null;
  try {
    index = JSON.parse(await fs.readFile(indexFile, "utf8"));
    graph = JSON.parse(await fs.readFile(graphFile, "utf8"));
  } catch {
    return {
      state: "invalid",
      tone: "bad",
      message: "Semantic memory index is invalid",
      chunks: 0,
      entities: 0,
      relations: 0,
      episodes: 0,
      lastBuiltAt: null,
      packetPath,
      capsulePath: capsuleStat ? capsulePath : null
    };
  }

  const builtAt = new Date(index.builtAt);
  const ageHours = Number.isFinite(builtAt.getTime()) ? Math.round((Date.now() - builtAt.getTime()) / 36_000) / 100 : null;
  const currentSources = await walkProjectFiles(project.path);
  const currentSourceHash = sourceHash(currentSources);
  const changedSinceBuild = Boolean(index.sourceHash && currentSourceHash !== index.sourceHash);
  const state = changedSinceBuild || (ageHours !== null && ageHours > 24) ? "stale" : "fresh";
  const message = changedSinceBuild
    ? "Project files changed since semantic graph was built"
    : state === "fresh" ? "Semantic graph ready" : "Semantic graph should be rebuilt";
  return {
    state,
    tone: state === "fresh" ? "ok" : "warn",
    message,
    chunks: index.summary?.chunks ?? index.chunks?.length ?? 0,
    entities: graph.summary?.entities ?? graph.entities?.length ?? 0,
    relations: graph.summary?.relations ?? graph.relations?.length ?? 0,
    episodes: graph.summary?.episodes ?? (await readEpisodes(root, 1000)).length,
    lastBuiltAt: index.builtAt,
    packetPath,
    capsulePath: capsuleStat ? capsulePath : null,
    sourceHash: index.sourceHash ?? null,
    currentSourceHash,
    sourceNewestAt: newestUpdatedAt(currentSources),
    indexedSourceNewestAt: index.sourceNewestAt ?? null,
    changedSinceBuild
  };
}

export async function rebuildSemanticMemory(project, options = {}) {
  if (!project?.exists || (!project.isRepo && !project.isContext)) {
    return { ok: false, message: "Project or context space must be available first." };
  }

  const root = semanticPath(project);
  await fs.mkdir(root, { recursive: true });

  const files = await walkProjectFiles(project.path);
  const sourceItems = [];
  const rawEntities = [];
  const rawRelations = [];
  const chunks = [];

  for (const file of files) {
    let text = "";
    try {
      text = await readTextFile(file);
    } catch {
      continue;
    }
    sourceItems.push(file);
    chunks.push(chunkForFile(file, text));
    rawEntities.push(...extractEntities(text, file));
    rawRelations.push(...extractRelations(text, file, project.name));
  }

  const entities = mergeEntities(rawEntities);
  const relations = uniqueRelations(rawRelations);
  const episodes = await readEpisodes(root, 1000);
  const builtAt = new Date().toISOString();
  const index = {
    schemaVersion: 2,
    engine: {
      cognee: "local-compatible semantic index",
      graphiti: "local-compatible temporal graph"
    },
    project: {
      id: project.id,
      name: project.name,
      path: project.path
    },
    builtAt,
    sourceHash: sourceHash(sourceItems),
    sourceNewestAt: newestUpdatedAt(sourceItems),
    summary: {
      files: sourceItems.length,
      chunks: chunks.length,
      entities: entities.length,
      relations: relations.length,
      bytes: sourceItems.reduce((sum, item) => sum + item.size, 0)
    },
    chunks
  };
  const graph = {
    schemaVersion: 2,
    builtAt,
    project: index.project,
    summary: {
      entities: entities.length,
      relations: relations.length,
      episodes: episodes.length + 1
    },
    entities,
    relations
  };

  const episode = {
    id: randomUUID(),
    type: "semantic_rebuild",
    occurredAt: builtAt,
    projectId: project.id,
    projectName: project.name,
    agent: options.agent ?? "ai-sync-console",
    reason: options.reason ?? "manual",
    sourceHash: index.sourceHash,
    stats: index.summary
  };

  await writeJson(path.join(root, INDEX_FILE), index);
  await writeJson(path.join(root, GRAPH_FILE), graph);
  await appendEpisode(root, episode);
  const latestEpisodes = await readEpisodes(root, 1000);
  graph.summary.episodes = latestEpisodes.length;
  await writeJson(path.join(root, GRAPH_FILE), graph);
  const packet = await buildStartupPacket({ project, index, graph, packetAgent: options.agent ?? "all" });
  await fs.writeFile(path.join(root, PACKET_FILE), packet, "utf8");
  const capsule = await writeContextCapsule(project, index, graph, options.agent ?? "all");

  return {
    ok: true,
    message: "Semantic memory rebuilt.",
    semantic: await getSemanticMemoryStatus(project),
    index,
    graph: {
      ...graph,
      entities: graph.entities.slice(0, 30),
      relations: graph.relations.slice(0, 30)
    },
    packet,
    capsule: capsule.data
  };
}

async function readIndexAndGraph(project) {
  const root = semanticPath(project);
  const index = JSON.parse(await fs.readFile(path.join(root, INDEX_FILE), "utf8"));
  const graph = JSON.parse(await fs.readFile(path.join(root, GRAPH_FILE), "utf8"));
  return { index, graph };
}

function scoreText(queryWords, text, boost = 1) {
  const haystack = String(text ?? "").toLowerCase();
  let score = 0;
  for (const word of queryWords) {
    if (!word) continue;
    if (haystack.includes(word)) score += boost;
  }
  return score;
}

function matchedTerms(queryWords, text) {
  const haystack = String(text ?? "").toLowerCase();
  return [...new Set(queryWords.filter((word) => word && haystack.includes(word)))];
}

function explainMatch(type, item, terms) {
  const wordList = terms.length ? terms.join(", ") : "query terms";
  if (type === "entity") return `Matched ${wordList} in ${item.type} entity ${item.name}.`;
  if (type === "relation") return `Matched ${wordList} in relation ${item.source} ${item.relation} ${item.target}.`;
  return `Matched ${wordList} in ${item.path}.`;
}

export async function searchSemanticMemory(project, query) {
  const q = String(query ?? "").trim();
  if (!q) return { ok: false, message: "Search text is required.", results: [] };
  if (!(await exists(path.join(semanticPath(project), INDEX_FILE)))) {
    await rebuildSemanticMemory(project, { reason: "search_missing_index" });
  }
  const { index, graph } = await readIndexAndGraph(project);
  const words = tokenize(q);
  const chunks = index.chunks
    .map((item) => {
      const keywordText = item.keywords.map((keyword) => keyword.word).join(" ");
      const searchable = `${item.path} ${item.title} ${item.preview} ${keywordText}`;
      const terms = matchedTerms(words, searchable);
      const score = scoreText(words, searchable, 2);
      return { type: "chunk", score, source: item.path, why: explainMatch("chunk", item, terms), item };
    })
    .filter((result) => result.score > 0);
  const entities = graph.entities
    .map((item) => {
      const searchable = `${item.name} ${item.type} ${item.sources?.join(" ")}`;
      const terms = matchedTerms(words, searchable);
      return {
        type: "entity",
        score: scoreText(words, searchable, 3),
        source: item.sources?.[0] ?? item.source ?? null,
        why: explainMatch("entity", item, terms),
        item
      };
    })
    .filter((result) => result.score > 0);
  const relations = graph.relations
    .map((item) => {
      const searchable = `${item.source} ${item.relation} ${item.target} ${item.evidence}`;
      const terms = matchedTerms(words, searchable);
      return {
        type: "relation",
        score: scoreText(words, searchable, 3),
        source: item.file,
        why: explainMatch("relation", item, terms),
        item
      };
    })
    .filter((result) => result.score > 0);

  return {
    ok: true,
    query: q,
    results: [...entities, ...relations, ...chunks]
      .sort((a, b) => b.score - a.score)
      .slice(0, 18)
  };
}

export async function getAgentStartupPacket(project, agent = "all") {
  const root = semanticPath(project);
  const packetPath = path.join(root, PACKET_FILE);
  if (!(await exists(packetPath))) {
    await rebuildSemanticMemory(project, { reason: "packet_missing", agent });
  }
  let packet = await fs.readFile(packetPath, "utf8");
  if (agent !== "all" && !packet.includes(`Intended agent: ${agent}`)) {
    const { index, graph } = await readIndexAndGraph(project);
    packet = await buildStartupPacket({ project, index, graph, packetAgent: agent });
    await fs.writeFile(packetPath, packet, "utf8");
  }
  return {
    ok: true,
    agent,
    path: packetPath,
    packet
  };
}

export async function getContextCapsule(project, options = {}) {
  const agent = options.agent ?? "all";
  const root = semanticPath(project);
  const indexFile = path.join(root, INDEX_FILE);
  const graphFile = path.join(root, GRAPH_FILE);
  if (!(await exists(indexFile)) || !(await exists(graphFile))) {
    if (options.rebuildIfMissing === false) {
      return { ok: false, message: "Semantic memory has not been built yet.", data: null, markdown: "" };
    }
    await rebuildSemanticMemory(project, { reason: "capsule_missing_index", agent });
  }
  const { index, graph } = await readIndexAndGraph(project);
  const capsule = await buildContextCapsule({ project, index, graph, agent });
  const markdown = contextCapsuleMarkdown(capsule);
  if (options.write !== false) {
    await writeJson(path.join(root, CAPSULE_JSON_FILE), capsule);
    await fs.writeFile(path.join(root, CAPSULE_FILE), markdown, "utf8");
  }
  return {
    ok: true,
    agent,
    path: path.join(root, CAPSULE_FILE),
    jsonPath: path.join(root, CAPSULE_JSON_FILE),
    data: capsule,
    markdown
  };
}
