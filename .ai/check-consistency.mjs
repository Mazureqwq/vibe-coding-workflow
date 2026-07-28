#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const root = path.dirname(fileURLToPath(import.meta.url));
const rel = (p) => path.join(root, p);
const read = (p) => fs.readFileSync(rel(p), "utf8");
const exists = (p) => fs.existsSync(rel(p));
const required = [
  "START.md", "AGENT.core.md", "AGENT.md", "WORKFLOW.slim.md", "WORKFLOW.md",
  "STATE.md", "STATE.schema.md", "TASKS.md", "PROMPTS/_common.md",
  "PROMPTS/bootstrap.md", "MAINTENANCE.md"
];
const errors = [];
const warnings = [];
for (const file of required) {
  if (!exists(file)) errors.push("missing file: " + file);
}
const start = exists("START.md") ? read("START.md") : "";
const agent = exists("AGENT.md") ? read("AGENT.md") : "";
const core = exists("AGENT.core.md") ? read("AGENT.core.md") : "";
const boot = exists("PROMPTS/bootstrap.md") ? read("PROMPTS/bootstrap.md") : "";
const state = exists("STATE.md") ? read("STATE.md") : "";
if (start && !start.includes("AGENT.core.md")) errors.push("START.md should mention AGENT.core.md");
if (start && !start.includes("WORKFLOW.slim.md")) errors.push("START.md should mention WORKFLOW.slim.md");
if (agent && !agent.includes("AGENT.core.md")) errors.push("AGENT.md should mention AGENT.core.md as L1");
if (core && !core.includes("L0")) errors.push("AGENT.core.md should describe L0");
if (core && !core.includes("MAINTENANCE.md")) warnings.push("AGENT.core.md missing maintenance pointer");
if (boot && !boot.includes("AGENT.core")) warnings.push("bootstrap.md may not mention AGENT.core");
if (state && state.includes("### light 映射")) errors.push("STATE.md still contains long manuals");
if (state && !state.includes("schema_version")) warnings.push("STATE.md missing schema_version");
if (state && state.length > 6000) warnings.push("STATE.md is large (>6k chars)");
const cardsDir = rel("PROMPTS/phase-cards");
if (fs.existsSync(cardsDir)) {
  for (const name of fs.readdirSync(cardsDir)) {
    if (!name.endsWith(".md")) continue;
    const text = fs.readFileSync(path.join(cardsDir, name), "utf8");
    if (/^## Interaction Rule/m.test(text)) warnings.push("phase-card has Interaction Rule again: " + name);
    if (!text.includes("_common")) warnings.push("phase-card missing _common ref: " + name);
  }
}
console.log("ai-workflow consistency check");
if (errors.length) {
  console.log("errors:");
  for (const error of errors) console.log(" - " + error);
} else console.log("errors: 0");
if (warnings.length) {
  console.log("warnings:");
  for (const warning of warnings) console.log(" - " + warning);
} else console.log("warnings: 0");
process.exit(errors.length ? 1 : 0);