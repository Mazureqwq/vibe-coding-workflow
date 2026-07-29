#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testsRoot = path.dirname(fileURLToPath(import.meta.url));
const aiRoot = path.dirname(testsRoot);
const machine = JSON.parse(fs.readFileSync(path.join(aiRoot, "workflow-machine.json"), "utf8"));

const initialState = () => ({
  current_phase: "unstarted",
  validation_status: "pending",
  validation_commands: [],
  gate2_confirmed: false,
  checkpoint: { status: "clean", safe_to_retry: false },
  skipped_phases: []
});

const allowed = (from, to) => (machine.transitions[from] ?? []).includes(to);

function move(state, to) {
  assert.ok(allowed(state.current_phase, to), `illegal transition: ${state.current_phase} -> ${to}`);
  state.current_phase = to;
  return state;
}

function complete(state, next) {
  if (state.current_phase === "close" && next === null) return state;
  assert.ok(next, `completed ${state.current_phase} must declare next phase`);
  return move(state, next);
}

function requireGate2(state, action) {
  assert.equal(state.gate2_confirmed, true, `${action} requires explicit high-risk confirmation`);
}

function enterBuild(state, { gate2 = false } = {}) {
  if (gate2) requireGate2(state, "build");
  return move(state, "build");
}

function enterClose(state) {
  assert.ok(["passed", "accepted"].includes(state.validation_status), "close requires passed or accepted validation");
  return move(state, "close");
}

function passValidation(state, command) {
  state.validation_status = "passed";
  state.validation_commands.push(command);
  return state;
}

function failValidation(state) {
  state.validation_status = "failed";
  return state;
}

function pause(state) {
  state.checkpoint = { status: "paused", safe_to_retry: true };
  return state;
}

function resume(state) {
  assert.equal(state.checkpoint.status, "paused", "resume requires a paused checkpoint");
  assert.equal(state.checkpoint.safe_to_retry, true, "resume requires a retry-safe checkpoint");
  state.checkpoint.status = "clean";
  return state;
}

const traces = {
  lightBugfixSuccess() {
    const state = initialState();
    state.skipped_phases = ["discover", "spec", "architecture", "align", "impact"];
    move(state, "recon");
    complete(state, "plan");
    enterBuild(state);
    complete(state, "verify");
    passValidation(state, "npm test -- login duplicate request");
    enterClose(state);
    complete(state, null);
    return state;
  },

  fullFeatureSuccess() {
    const state = initialState();
    move(state, "discover");
    complete(state, "spec");
    complete(state, "architecture");
    complete(state, "plan");
    state.gate2_confirmed = true;
    enterBuild(state, { gate2: true });
    complete(state, "verify");
    passValidation(state, "npm test -- user import");
    enterClose(state);
    complete(state, null);
    return state;
  },

  verifyFailureThenRebuild() {
    const state = initialState();
    move(state, "recon");
    complete(state, "plan");
    enterBuild(state);
    complete(state, "verify");
    failValidation(state);
    complete(state, "build");
    complete(state, "verify");
    passValidation(state, "npm test -- regression suite");
    enterClose(state);
    complete(state, null);
    return state;
  },

  gate2BlocksBuild() {
    const state = initialState();
    move(state, "recon");
    complete(state, "plan");
    assert.throws(() => enterBuild(state, { gate2: true }), /requires explicit high-risk confirmation/);
    assert.equal(state.current_phase, "plan");
    state.gate2_confirmed = true;
    enterBuild(state, { gate2: true });
    return state;
  },

  resumeFromCheckpoint() {
    const state = initialState();
    // Resume loads an existing snapshot; it does not replay earlier transitions.
    state.current_phase = "build";
    pause(state);
    resume(state);
    assert.equal(state.current_phase, "build");
    assert.equal(state.checkpoint.status, "clean");
    return state;
  }
};

console.log("workflow trace tests");
for (const [name, trace] of Object.entries(traces)) {
  const result = trace();
  console.log(`- passed: ${name} (${result.current_phase})`);
}
