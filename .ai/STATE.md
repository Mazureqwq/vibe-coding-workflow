# STATE（当前工作流状态）

> 由 AI 维护，用户负责确认选项。  
> 这是会话间的“进度条”和“约束开关”。  
> 不要手写长文；通常由 AI 在交互后更新。

---

## 快照

```yaml
mode: unknown                  # greenfield | brownfield | hybrid | unknown
process_weight: unknown        # full | light | auto | unknown
current_phase: unstarted       # 见 WORKFLOW.md
task_id: null                  # 如 T-001
task_type: null                # feature | bugfix | refactor | review | chore | docs
task_title: null
updated_at: null               # ISO 或 YYYY-MM-DD HH:mm
ui_language: unknown           # zh-CN | en | ja | ... | unknown
ui_language_source: unknown    # user_message | explicit | fallback | unknown
```

---

## 流程重量（Process Weight）

> 每次新任务开始时，由 AI 交互请用户选择；不要写死。

```yaml
process_weight_decision:
  selected: unknown            # full | light | auto | unknown
  resolved_as: null            # auto 解析后的实际重量 full/light
  reason: null
  confirmed_by_user: false
```

### 选项含义

| 值 | 含义 | 适用 |
|----|------|------|
| `full` | 完整大厂链路，阶段全开 | 新项目、大功能、架构调整 |
| `light` | 轻量链路，合并分析阶段 | 小改动、局部 bug、文案/配置 |
| `auto` | AI 按任务风险给推荐，再确认 | 默认推荐 |

### light 映射

- greenfield light：`discover` → `plan` → `build` → `verify` → `close`  
  （spec/architecture 并入 discover/plan，仅在需要时扩开）
- brownfield light：`recon` → `plan` → `build` → `verify` → `close`  
  （align/impact 并入 recon/plan 的轻量检查）

### full 映射

- greenfield full：`discover → spec → architecture → plan → build → verify → close`
- brownfield full：`recon → align → impact → plan → build → verify → close`

---

## 文档效力（Doc Authority）

> 仅填写与当前任务相关的文档。

```yaml
doc_authority:
  AGENT.md: follow
  WORKFLOW.md: follow
  ENGINEERING.md: unknown      # follow | update-first | code-as-source | ignore-for-task | unknown
  ARCHITECTURE.md: unknown
  ROADMAP.md: unknown
  TASKS.md: follow
  DECISIONS.md: unknown
  TECH_DEBT.md: unknown
  CHANGELOG.md: follow
```

---

## 已确认上下文（Confirmed Context）

> AI 把用户确认后的结论浓缩写在这里，避免重复追问。

```yaml
confirmed:
  goal: null
  non_goals: []
  success_criteria: []
  constraints: []
  architecture_choice: null
  implementation_plan_summary: null
```

---

## 阶段进度

```yaml
phases:
  discover: { status: pending, notes: null }      # pending | active | done | skipped
  spec: { status: pending, notes: null }
  architecture: { status: pending, notes: null }
  recon: { status: pending, notes: null }
  align: { status: pending, notes: null }
  impact: { status: pending, notes: null }
  plan: { status: pending, notes: null }
  build: { status: pending, notes: null }
  verify: { status: pending, notes: null }
  close: { status: pending, notes: null }
```

---

## 跳过阶段

```yaml
skipped_phases: []
# 例：
# - phase: architecture
#   reason: light 流程合并 / 无架构影响
#   confirmed_by_user: true
```

---

## 开放问题

```yaml
open_questions: []
# 例：
# - id: Q1
#   question: 是否需要登录态？
#   options: [需要, 不需要, 以后再说]
#   status: open | answered
#   answer: null
```

---

## 下一动作

```yaml
next_action:
  intent: bootstrap            # bootstrap | interview | wait_confirmation | execute_phase
  phase: null
  summary: 等待首次模式判定、流程重量选择与任务确认
```

---

## 访谈队列（Interview）

> 一次只问一题。AI 维护队列；用户只点选/回答当前题。

```yaml
interview:
  status: idle                 # idle | collecting | ready | executing
  current_question_id: null    # 如 mode / process_weight / task_type
  current_question: null       # 当前展示给用户的问题（用户语言）
  queue: []                    # 待问 id 列表
  asked: []                    # 已问 id
  answers: {}                  # id -> 用户选择/补充
  ready_for_execution: false
  execution_confirmed: false
```

### 队列规则

1. 每轮只消费 `queue` 队首一题
2. 用户已在对话里提供的信息：写入 `answers` 并跳过该题（可做一次复述确认）
3. `ready_for_execution=true` 后，下一题必须是“是否开始执行”
4. 用户确认开始后：`execution_confirmed=true`，`status=executing`
5. 执行中出现新决策：`status=collecting`，暂停执行并入队新问题

---

## 维护规则

1. 新任务先确认 `mode` + `process_weight`
2. 每次阶段切换后更新 `current_phase` 与 `phases.*.status`
3. 每次用户确认后更新 `confirmed` / `doc_authority`
4. 每次会话开始先读本文件
5. 本文件保持短而结构化，细节放到 TASKS 或其他文档
6. 访谈期间维护 interview.queue；禁止一轮多个决策题
7. ready_for_execution 前不得进入执行态

---

## 交互语言

> 交互文案跟随用户语言；由 AI 检测并维护。

| 字段 | 含义 |
|------|------|
| `ui_language` | 当前交互语言 |
| `ui_language_source` | 来源：用户消息 / 明确指定 / 兜底 |

规则详见 `.ai/AGENT.md` §0.1。