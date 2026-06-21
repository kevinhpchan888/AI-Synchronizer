function normalizedText(value) {
  return String(value || "").toLowerCase();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function isHermesCoordinator(machine = {}) {
  const text = [
    normalizedText(machine.key),
    normalizedText(machine.name),
    normalizedText(machine.role)
  ].join(" ");
  return text.includes("hermes") || text.includes("mac mini") || text.includes("mac-mini");
}

export function jobTargetsForMachine(machine = {}) {
  const targets = [machine.key, machine.id];
  if (isHermesCoordinator(machine)) targets.push("hermes", "mac-mini");
  return unique(targets);
}
