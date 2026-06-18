import { execFile } from "node:child_process";
import { platform } from "node:os";

const SECRET_PATTERNS = [
  /(SUPABASE_[A-Z_]*KEY=)[^\s]+/gi,
  /(VERCEL_[A-Z_]*TOKEN=)[^\s]+/gi,
  /(GITHUB_[A-Z_]*TOKEN=)[^\s]+/gi,
  /(Authorization:\s*Bearer\s+)[^\s]+/gi,
  /(token["']?\s*[:=]\s*["']?)[A-Za-z0-9._-]+/gi,
  /(key["']?\s*[:=]\s*["']?)[A-Za-z0-9._-]+/gi
];

export function redact(value = "") {
  let output = String(value);
  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, "$1[redacted]");
  }
  return output;
}

export function run(command, args = [], options = {}) {
  const timeout = options.timeout ?? 30000;
  const cwd = options.cwd ?? process.cwd();
  const env = { ...process.env, ...(options.env ?? {}) };

  return new Promise((resolve) => {
    execFile(command, args, { cwd, env, timeout, windowsHide: true, maxBuffer: 1024 * 1024 * 8 }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        code: error?.code ?? 0,
        signal: error?.signal ?? null,
        command,
        args,
        cwd,
        stdout: redact(stdout ?? ""),
        stderr: redact(stderr ?? ""),
        message: redact(error?.message ?? "")
      });
    });
  });
}

export async function runShell(command, options = {}) {
  const isWindows = platform() === "win32";
  const shell = isWindows ? "powershell.exe" : "sh";
  const args = isWindows
    ? ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command]
    : ["-lc", command];
  return run(shell, args, options);
}

export async function commandExists(name) {
  const isWindows = platform() === "win32";
  const result = isWindows
    ? await run("where.exe", [name], { timeout: 8000 })
    : await runShell(`command -v ${JSON.stringify(name)}`, { timeout: 8000 });

  const firstLine = result.stdout.split(/\r?\n/).find(Boolean);
  return {
    exists: result.ok && Boolean(firstLine),
    path: firstLine ?? null
  };
}

