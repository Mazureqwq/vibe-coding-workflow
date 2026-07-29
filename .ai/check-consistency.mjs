#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const rel = (p) => path.join(root, p);
const read = (p) => fs.readFileSync(rel(p), "utf8");
const exists = (p) => fs.existsSync(rel(p));
const errors = [];
const warnings = [];
const yamlScalar = (value) => {
  const trimmed = value.trim();
  if (trimmed === "null" || trimmed === "~") return null;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1);
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const body = trimmed.slice(1, -1).trim();
    return body ? body.split(",").map(yamlScalar) : [];
  }
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    const result = {};
    const body = trimmed.slice(1, -1).trim();
    if (!body) return result;
    for (const entry of body.split(",")) {
      const separator = entry.indexOf(":");
      if (separator < 1) throw new Error(`invalid inline map entry: ${entry}`);
      result[entry.slice(0, separator).trim()] = yamlScalar(entry.slice(separator + 1));
    }
    return result;
  }
  return trimmed;
};
const stripYamlComment = (line) => {
  let quote = null;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if ((character === "\"" || character === "'") && (!quote || quote === character)) quote = quote ? null : character;
    if (character === "#" && !quote && (index === 0 || /\s/.test(line[index - 1]))) return line.slice(0, index).trimEnd();
  }
  return line;
};
const parseStateYaml = (document) => {
  const match = document.match(/```yaml\r?\n([\s\S]*?)\r?\n```/);
  if (!match) throw new Error("STATE.md must contain one fenced yaml snapshot");
  const rootValue = {};
  const stack = [{ indent: -1, value: rootValue }];
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = stripYamlComment(rawLine);
    if (!line.trim()) continue;
    if (/^\s*-\s+/.test(line)) throw new Error("multiline YAML lists are not supported in STATE.md; use inline arrays");
    const indent = line.length - line.trimStart().length;
    const separator = line.indexOf(":");
    if (separator < 1) throw new Error(`invalid YAML field: ${line.trim()}`);
    const key = line.slice(indent, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    while (stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1)?.value;
    if (!parent || typeof parent !== "object" || Array.isArray(parent)) throw new Error(`invalid YAML nesting: ${line.trim()}`);
    if (Object.prototype.hasOwnProperty.call(parent, key)) throw new Error(`duplicate YAML field: ${key}`);
    if (rawValue) parent[key] = yamlScalar(rawValue);
    else { parent[key] = {}; stack.push({ indent, value: parent[key] }); }
  }
  return rootValue;
};
const requireEnum = (value, allowed, field) => {
  if (value !== null && !allowed.includes(value)) errors.push(`${field} has invalid value: ${String(value)}`);
};
const validateStateSnapshot = (snapshot, definition) => {
  const requiredFields = ["schema_version", "workflow_version", "state_revision", "current_phase", "interaction_mode", "architecture_depth", "phase_result", "validation_result", "phases", "checkpoint", "redaction_status"];
  for (const field of requiredFields) if (!Object.prototype.hasOwnProperty.call(snapshot, field)) errors.push(`STATE.md missing parsed field: ${field}`);
  if (snapshot.schema_version !== 3) errors.push("STATE.md schema_version must be 3");
  requireEnum(snapshot.current_phase, ["unstarted", ...definition.phases], "STATE.current_phase");
  requireEnum(snapshot.interaction_mode, definition.interaction_modes, "STATE.interaction_mode");
  requireEnum(snapshot.architecture_depth, definition.architecture_depths, "STATE.architecture_depth");
  requireEnum(snapshot.risk_level, ["low", "mid", "high", null, "unknown"], "STATE.risk_level");
  if (snapshot.workflow_version !== 3) errors.push("STATE.md workflow_version must be 3");
  requireEnum(snapshot.task_type, [null, ...definition.task_types], "STATE.task_type");
  requireEnum(snapshot.stop_reason, [null, ...definition.stop_reasons], "STATE.stop_reason");
  requireEnum(snapshot.redaction_status, ["clean", "needs_review"], "STATE.redaction_status");
  const contextScope = snapshot.context_budget?.last_context_scope;
  requireEnum(contextScope, [null, "hot_snapshot", "core_rules", "phase_card", "reference_rules"], "STATE.context_budget.last_context_scope");
  const phaseResult = snapshot.phase_result ?? {};
  requireEnum(phaseResult.status, ["pending", "completed", "waiting_user", "blocked", "failed"], "STATE.phase_result.status");
  if (phaseResult.next_phase !== null && !definition.phases.includes(phaseResult.next_phase)) errors.push("STATE.phase_result.next_phase is not a known phase");
  requireEnum(phaseResult.stop_reason, [null, ...definition.stop_reasons], "STATE.phase_result.stop_reason");
  if (typeof phaseResult.checkpoint_updated !== "boolean") errors.push("STATE.phase_result.checkpoint_updated must be boolean");
  const validation = snapshot.validation_result ?? {};
  requireEnum(validation.kind, [null, "verify", "review", "spike_result", "change_checklist"], "STATE.validation_result.kind");
  requireEnum(validation.status, definition.validation_statuses, "STATE.validation_result.status");
  for (const field of ["commands", "evidence", "residual_risks", "architecture_checks"]) if (!Array.isArray(validation[field])) errors.push(`STATE.validation_result.${field} must be an inline array`);
  const phases = snapshot.phases;
  if (!phases || typeof phases !== "object" || Array.isArray(phases)) errors.push("STATE.phases must be a map");
  else {
    for (const phase of definition.phases) {
      if (!phases[phase]) errors.push(`STATE.phases missing parsed phase: ${phase}`);
      else requireEnum(phases[phase].status, ["pending", "in_progress", "completed", "waiting_user", "blocked", "failed"], `STATE.phases.${phase}.status`);
    }
  }
  const checkpoint = snapshot.checkpoint ?? {};
  requireEnum(checkpoint.status, ["clean", "paused", "needs_review"], "STATE.checkpoint.status");
  if (typeof checkpoint.safe_to_retry !== "boolean") errors.push("STATE.checkpoint.safe_to_retry must be boolean");
  if (!Array.isArray(checkpoint.changed_files)) errors.push("STATE.checkpoint.changed_files must be an inline array");
  // completed snapshot gates (ADR-007)
  if (snapshot.stop_reason === "completed") {
    const validation = snapshot.validation_result ?? {};
    if (!["passed", "accepted"].includes(validation.status)) errors.push("completed snapshot requires validation_result.status passed|accepted");
    if (validation.status === "passed") {
      const commands = validation.commands ?? [];
      const evidence = validation.evidence ?? [];
      if ((!Array.isArray(commands) || commands.length === 0) && (!Array.isArray(evidence) || evidence.length === 0)) {
        errors.push("passed validation requires commands or evidence");
      }
    }
  }
  if (snapshot.interview?.ready_for_execution === false && ["build", "verify", "close"].includes(snapshot.current_phase) && snapshot.stop_reason !== "completed") {
    warnings.push("current_phase is post-ready but interview.ready_for_execution is false");
  }
};
const required = ["START.md", "AGENT.core.md", "AGENT.md", "WORKFLOW.slim.md", "WORKFLOW.md", "STATE.md", "STATE.schema.md", "TASKS.md", "PROMPTS/_common.md", "PROMPTS/bootstrap.md", "MAINTENANCE.md", "ARCHITECTURE.md", "workflow-machine.json", "tests/workflow-traces.mjs"];
const requireText = (text, needle, message) => { if (!text.includes(needle)) errors.push(message); };
for (const file of required) if (!exists(file)) errors.push("missing file: " + file);
let machine = null;
try { machine = JSON.parse(read("workflow-machine.json")); } catch (error) { errors.push("workflow-machine.json is not valid JSON: " + error.message); }
const start = exists("START.md") ? read("START.md") : "";
const agent = exists("AGENT.md") ? read("AGENT.md") : "";
const core = exists("AGENT.core.md") ? read("AGENT.core.md") : "";
const slim = exists("WORKFLOW.slim.md") ? read("WORKFLOW.slim.md") : "";
const workflow = exists("WORKFLOW.md") ? read("WORKFLOW.md") : "";
const schema = exists("STATE.schema.md") ? read("STATE.schema.md") : "";
const state = exists("STATE.md") ? read("STATE.md") : "";
const common = exists("PROMPTS/_common.md") ? read("PROMPTS/_common.md") : "";
const architecture = exists("ARCHITECTURE.md") ? read("ARCHITECTURE.md") : "";
const architectureCard = exists("PROMPTS/phase-cards/architecture.md") ? read("PROMPTS/phase-cards/architecture.md") : "";
const verifyCard = exists("PROMPTS/phase-cards/verify.md") ? read("PROMPTS/phase-cards/verify.md") : "";
const closeCard = exists("PROMPTS/phase-cards/close.md") ? read("PROMPTS/phase-cards/close.md") : "";
requireText(start, "缓存前缀", "START.md should document cache-friendly assembly");
requireText(core, "持续执行契约", "AGENT.core.md should define continuation contract");
requireText(core, "上下文组装顺序", "AGENT.core.md should define context assembly");
requireText(core, "interaction_mode(resolved)", "AGENT.core.md should gate resolved interaction mode");
requireText(core, "quick-first", "AGENT.core.md should define quick-first startup");
requireText(core, "Gate 0/1/2", "AGENT.core.md should define Gate naming");
requireText(start, "quick-first", "START.md should define quick-first");
requireText(slim, "phase-card", "WORKFLOW.slim.md should define phase-card main path");
requireText(common, "停止白名单", "common prompt should define stop whitelist");
requireText(state, "risk_level:", "STATE.md should define risk_level");
requireText(state, "evidence: []", "STATE.md phase_result should include evidence");
requireText(slim, "workflow-machine.json", "WORKFLOW.slim.md should reference machine definition");
requireText(schema, "## phase_result", "STATE.schema.md should define phase_result");
requireText(schema, "## allowed_transitions", "STATE.schema.md should define allowed transitions");
requireText(schema, "state_revision", "STATE.schema.md should define state revision");
requireText(schema, "redaction", "STATE.schema.md should define redaction rules");
requireText(state, "state_revision:", "STATE.md should define state_revision");
requireText(state, "validation_result:", "STATE.md should define validation_result");
requireText(state, "phase_result:", "STATE.md should define phase_result");
requireText(state, "  review: { status: pending", "STATE.md phases should include review");
requireText(state, "architecture_checks:", "STATE.md should define architecture checks");
requireText(common, "phase_result.status", "common prompt should define phase result contract");
requireText(common, "revision/session", "common prompt should define concurrent STATE writes");
requireText(verifyCard, "Architecture Checks", "verify card should define architecture checks");
requireText(architectureCard, "minimum", "architecture card should define depth levels");
requireText(architecture, "## 6. 扩展路径", "ARCHITECTURE.md should define extension path");
requireText(closeCard, "validation_result", "close card should require validation result");
if (machine && state) {
  try {
    const snapshot = parseStateYaml(state);
    validateStateSnapshot(snapshot, machine);
    const from = snapshot.current_phase;
    const to = snapshot.phase_result?.next_phase;
    if (to !== null && !(machine.transitions?.[from] ?? []).includes(to)) {
      errors.push(`STATE.phase_result.next_phase is not a legal transition: ${from} -> ${to}`);
    }
    if (snapshot.phase_result?.status === "completed" && from !== "close" && to === null) {
      errors.push("completed non-close phase must declare next_phase");
    }
  } catch (error) { errors.push("STATE.md YAML parse failed: " + error.message); }
}
if (machine) {
  const phases = machine.phases ?? [];
  const types = machine.task_types ?? [];
  for (const phase of phases) {
    if (!state.includes(`  ${phase}: { status: pending`)) errors.push(`STATE.md phases should include ${phase}`);
    if (!exists(`PROMPTS/phase-cards/${phase}.md`)) errors.push(`missing phase card: ${phase}`);
  }
  for (const type of types) {
    if (!workflow.includes(`\`${type}\``)) errors.push(`WORKFLOW.md missing task type: ${type}`);
    if (!machine.routes?.[type]) errors.push(`machine route missing task type: ${type}`);
  }
  for (const [phase, nextPhases] of Object.entries(machine.transitions ?? {})) {
    if (phase !== "unstarted" && !phases.includes(phase)) errors.push(`transition source is not a phase: ${phase}`);
    for (const nextPhase of nextPhases) if (!phases.includes(nextPhase)) errors.push(`transition target is not a phase: ${phase} -> ${nextPhase}`);
  }
  if (machine.routes?.review?.allow_build !== false) errors.push("review route must forbid build");
  if (machine.routes?.review?.validation_kind !== "review") errors.push("review route must use review validation");
  if (machine.routes?.spike?.validation_kind !== "spike_result") errors.push("spike route must use spike_result validation");
  if (machine.routes?.infra?.validation_kind !== "change_checklist") errors.push("infra route must use change_checklist validation");
  const scenarioPaths = [
    { name: "feature", path: ["discover", "spec", "architecture", "plan", "build", "verify", "close"], validation: "verify" },
    { name: "review", path: ["recon", "review", "close"], validation: "review" },
    { name: "spike", path: ["discover", "plan", "verify", "close"], validation: "spike_result" },
    { name: "infra", path: ["plan", "verify", "close"], validation: "change_checklist" }
  ];
  for (const scenario of scenarioPaths) {
    for (let index = 0; index < scenario.path.length - 1; index += 1) {
      const from = scenario.path[index];
      const to = scenario.path[index + 1];
      if (!(machine.transitions[from] ?? []).includes(to)) errors.push(`scenario ${scenario.name} has illegal transition: ${from} -> ${to}`);
    }
    if (machine.routes[scenario.name]?.validation_kind !== scenario.validation) errors.push(`scenario ${scenario.name} has wrong validation kind`);
  }
}
if (!workflow.includes("validation_result.status=passed|accepted")) errors.push("WORKFLOW.md should gate close on validation_result");
if (!workflow.includes("workflow-machine.json")) errors.push("WORKFLOW.md should reference machine definition");
if (workflow.includes("spike）→close") || workflow.includes("变更检查清单→close")) errors.push("special routes must pass through validation before close");
if (state.includes("### light 映射") || state.includes("password:") || state.includes("token:")) errors.push("STATE.md contains manual or sensitive-looking fields");
if (!state.includes("redaction_status: clean")) errors.push("STATE.md should define redaction status");
if (!state.includes("safe_to_retry: true")) errors.push("STATE.md should define retry safety");
if (!state.includes("changed_files: []")) errors.push("STATE.md should track changed files");
if (!state.includes("commands: []") || !state.includes("evidence: []")) warnings.push("STATE.md validation evidence fields are missing");
if (state.length > 6000) warnings.push("STATE.md is large (>6k chars)");
const cardsDir = rel("PROMPTS/phase-cards");
if (fs.existsSync(cardsDir)) for (const name of fs.readdirSync(cardsDir)) {
  if (!name.endsWith(".md")) continue;
  const text = fs.readFileSync(path.join(cardsDir, name), "utf8");
  if (!text.includes("_common")) warnings.push("phase-card missing _common ref: " + name);
  const fenceCount = (text.match(/^```/gm) ?? []).length;
  if (fenceCount % 2 !== 0) errors.push("phase-card has unbalanced code fences: " + name);
}

// Semantic vocabulary guard: numeric context aliases are intentionally forbidden.
const semanticAliasPattern = /(?:^|[^A-Za-z0-9])L(?:0|1|2|3)(?:[^A-Za-z0-9]|$)/;
for (const file of ["START.md", "AGENT.md", "AGENT.core.md", "WORKFLOW.md", "WORKFLOW.slim.md", "STATE.schema.md", "PROMPTS/_common.md", "PROMPTS/bootstrap.md", "MAINTENANCE.md", "DECISIONS.md", "CHANGELOG.md", "README.md"]) {
  if (exists(file) && semanticAliasPattern.test(read(file))) errors.push("deprecated numeric context alias found in " + file);
}

// hot-layer comments heuristic (ADR-007)
if (state) {
  const fence = state.match(/```yaml\r?\n([\s\S]*?)\r?\n```/);
  if (fence) {
    const commentLines = fence[1].split(/\r?\n/).filter((line) => line.includes("#"));
    if (commentLines.length > 3) warnings.push(`STATE.md hot snapshot has ${commentLines.length} commented lines; prefer pure values (ADR-007)`);
  }
}
if (!exists("examples/light-bugfix.md") || !exists("examples/full-upgrade.md")) {
  warnings.push("missing annotated examples under .ai/examples/ (light-bugfix.md / full-upgrade.md)");
}
if (exists("PROMPTS/bugfix.md")) {
  const bugfix = read("PROMPTS/bugfix.md");
  if (!bugfix.includes("Addon") && !bugfix.includes("非主路径")) warnings.push("PROMPTS/bugfix.md should be marked as addon / non-main-path");
}

const traceRun = spawnSync(process.execPath, [rel("tests/workflow-traces.mjs")], { encoding: "utf8" });
if (traceRun.status !== 0) errors.push("workflow trace tests failed");
console.log("ai-workflow consistency check");
if (errors.length) { console.log("errors:"); for (const error of errors) console.log(" - " + error); } else console.log("errors: 0");
if (warnings.length) { console.log("warnings:"); for (const warning of warnings) console.log(" - " + warning); } else console.log("warnings: 0");
process.exit(errors.length ? 1 : 0);

