# STATE（热快照）

> 只存当前值，不写说明书。字段含义见 `.ai/STATE.schema.md`。  
> AI 维护；用户确认选项。回写时只改值，不把规则正文写回本文件。

```yaml
schema_version: 2
workflow_version: 1
session_id: null
checkpoint_id: null
last_checkpoint_at: null

# --- core ---
mode: unknown                  # greenfield | brownfield | hybrid | unknown
process_weight: unknown        # full | light | auto | unknown
current_phase: unstarted
task_id: null
task_type: null                # feature | bugfix | hotfix | refactor | platform | spike | infra | security | review | chore | docs
task_title: null
workflow_pattern: null         # feature_delivery | bugfix | hotfix | refactor | platform | spike | infra | security | review | chore
updated_at: null
ui_language: unknown
ui_language_source: unknown    # user_message | explicit | fallback | unknown

# --- host (probe result only) ---
host:
  name: unknown
  detected_at: null
  choice_ui:
    available: unknown         # true | false | unknown
    channel: unknown           # native_tool | native_ui | text_abc | assume | unknown
    tool_name: null
    max_questions_per_turn: 1
    max_options_per_question: 3
    supports_recommended_marker: unknown
    supports_other_autofill: unknown
    mode_gated: false
    mode_requirement: null
    evidence: []               # keep <=3 short strings
  adaptation:
    status: pending            # pending | adapted | fallback
    strategy: probe_first
    notes: null

# --- weight decision ---
process_weight_decision:
  selected: unknown
  resolved_as: null
  reason: null
  confirmed_by_user: false

# --- doc authority ---
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

# --- confirmed (short only) ---
confirmed:
  goal: null
  non_goals: []
  success_criteria: []
  constraints: []
  architecture_choice: null
  implementation_plan_summary: null

# --- phases ---
phases:
  discover: { status: pending, notes: null }
  spec: { status: pending, notes: null }
  architecture: { status: pending, notes: null }
  recon: { status: pending, notes: null }
  align: { status: pending, notes: null }
  impact: { status: pending, notes: null }
  plan: { status: pending, notes: null }
  build: { status: pending, notes: null }
  verify: { status: pending, notes: null }
  close: { status: pending, notes: null }

skipped_phases: []
open_questions: []

boot_path: null                 # resume | quick_boot | full_bootstrap | null

next_action:
  intent: bootstrap            # bootstrap | interview | wait_confirmation | resume | execute_phase | quick_boot
  phase: null
  summary: 等待 START 入口分支（resume / quick_boot / full_bootstrap）

# --- interview ---
interview:
  status: idle                 # idle | collecting | ready | executing | paused
  current_question_id: null
  current_question: null
  queue: []
  asked: []
  answers: {}
  answer_status: {}            # id -> confirmed | inferred | needs_review
  ready_for_execution: false
  execution_confirmed: false

# --- checkpoint ---
checkpoint:
  status: clean                # clean | paused | needs_review
  summary: null
  safe_to_resume: true
  pending_user_action: null

# --- context budget (optional telemetry) ---
context_budget:
  last_load_tier: null         # L0 | L1 | L2 | L3
  cold_rules_loaded: false
  notes: null
```