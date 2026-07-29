# STATE（热快照）

> 只存当前值。字段含义见 `.ai/STATE.schema.md`。禁止把规则正文写回本文件。

```yaml
schema_version: 3
workflow_version: 3
session_id: null
checkpoint_id: null
last_checkpoint_at: null
state_revision: 0
writer_session_id: null
redaction_status: clean
mode: unknown
process_weight: unknown
interaction_mode: auto
current_phase: unstarted
architecture_depth: auto
task_id: null
task_type: null
task_title: null
workflow_pattern: null
updated_at: null
stop_reason: null
ui_language: unknown
ui_language_source: unknown
risk_level: low
boot_path: null
host:
  name: unknown
  detected_at: null
  choice_ui:
    available: unknown
    channel: unknown
    tool_name: null
    max_questions_per_turn: 1
    max_options_per_question: 3
    supports_recommended_marker: unknown
    supports_other_autofill: unknown
    mode_gated: false
    mode_requirement: null
    evidence: []
  adaptation:
    status: pending
    strategy: probe_first
    notes: null
process_weight_decision:
  selected: unknown
  resolved_as: null
  reason: null
  confirmed_by_user: false
doc_authority:
  AGENT.md: follow
  WORKFLOW.md: follow
  ENGINEERING.md: unknown
  ARCHITECTURE.md: unknown
  ROADMAP.md: unknown
  TASKS.md: follow
  DECISIONS.md: unknown
  TECH_DEBT.md: unknown
  CHANGELOG.md: follow
confirmed:
  goal: null
  non_goals: []
  success_criteria: []
  constraints: []
  architecture_choice: null
  implementation_plan_summary: null
phase_result:
  status: pending
  next_phase: null
  stop_reason: null
  checkpoint_updated: false
  evidence: []
validation_result:
  kind: null
  status: pending
  summary: null
  commands: []
  evidence: []
  residual_risks: []
  architecture_checks: []
  recorded_at: null
phases:
  discover: { status: pending, notes: null }
  spec: { status: pending, notes: null }
  architecture: { status: pending, notes: null }
  recon: { status: pending, notes: null }
  align: { status: pending, notes: null }
  impact: { status: pending, notes: null }
  plan: { status: pending, notes: null }
  build: { status: pending, notes: null }
  review: { status: pending, notes: null }
  verify: { status: pending, notes: null }
  close: { status: pending, notes: null }
skipped_phases: []
open_questions: []
next_action:
  intent: bootstrap
  phase: null
  summary: 等待 START 入口分支（resume / quick_boot / full_bootstrap）
interview:
  status: idle
  current_question_id: null
  current_question: null
  queue: []
  asked: []
  answers: {}
  answer_status: {}
  ready_for_execution: false
  execution_confirmed: false
checkpoint:
  status: clean
  recorded_at: null
  safe_to_resume: true
  pending_user_action: null
  operation_id: null
  last_completed_step: null
  changed_files: []
  safe_to_retry: true
context_budget:
  last_context_scope: null
  cold_rules_loaded: false
  notes: null
```
