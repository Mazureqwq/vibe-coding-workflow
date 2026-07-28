# AGENT.core（L1 常驻冷规则）

> 会话需要冷规则时**优先读本文件**，不要默认打开完整 `AGENT.md`。  
> 完整附录：宿主长协议、访谈细项、开场骨架等见 `AGENT.md`。  
> 用户入口：`START.md`。策略：ADR-007 quick-first / 减负不降门禁。

## 绝对优先级

1. `START.md` / 本文件 / `WORKFLOW.slim.md`（L1 操作规则）
2. 当前 `STATE.md`（热快照）
3. 已确认的用户选择
4. 完整 `AGENT.md` / `WORKFLOW.md`（L3 附录，不得覆盖 L1 硬规则）
5. 其余 `.ai/*` 与仓库现实代码

若 L1 与 L3 内容冲突，以 L1 为准，并在维护时同步 L3。

冲突：先声明 → 给选项 → 等选择 → 再行动。

## 角色红线

必须：

- 先 Load L0 热快照，再按需升舱
- 交互语言跟随用户
- 先确认再写 `.ai`，先门禁再写业务代码
- 一次一题；有原生选项能力则优先弹框
- 启动先分支：`resume` / `quick_boot`（默认优先） / `full_bootstrap`
- Ready 前不执行业务写码

禁止：

- 跳过阶段直接实现
- 信息不足假装确定
- 每轮全量重读完整 AGENT + WORKFLOW
- 把说明书写回 `STATE.md`
- 同时加载多张 phase-card
- 用任务 prompt 替代 phase-card 推进
- 快速启动后跳过 Ready/Gate 2 大改代码
- 普通阶段摘要后假结束

## 使用注意（短）

1. 入口优先 `START.md`
2. 每轮先读 `STATE.md` + `TASKS.md` active（Load L0）
3. STATE 只写值；说明在 `STATE.schema.md`
4. 一阶段一 card；公共交互见 `PROMPTS/_common.md`
5. host 已 adapted 且证据未变 → 复用
6. 用户已给目标 → **优先 quick_boot 推荐包**一次确认
7. 更新 `context_budget.last_load_tier`

## 交互档位

默认由 AI 按风险选择，用户可覆盖：

- `low_touch`：单点 bug、文案、局部配置；复用已给信息，尽量一次推荐后执行
- `standard`：普通功能和重构；只问影响结果的关键决策
- `deep`：跨模块、公共层、权限、数据、安全或架构；完整门禁
- `auto`：先推荐档位并说明理由，写入后按 resolved 执行

`process_weight` 管阶段是否完整；`interaction_mode` 管问多少。二者解耦。

## 上下文组装顺序

为提高 Prompt Cache 命中率，读取和组装分开：
1. 读取 Load L0：`STATE.md` + `TASKS.md`，判断恢复和路由。
2. 组装稳定前缀：`AGENT.core.md`、`WORKFLOW.slim.md`、`PROMPTS/_common.md`、当前 phase-card。
3. 将动态 STATE/TASKS 和用户最新决策放在稳定规则之后。
4. L3 附录只在需要时追加，不放入常驻前缀。

## 分级加载（Load L0–L3）

| 层级 | 读什么 | 何时 |
|------|--------|------|
| Load L0 | `STATE.md` + `TASKS.md` | 每轮先读；resume 默认 |
| Load L1 | **本文件** + `WORKFLOW.slim.md` | 新会话、版本变化、路由/门禁需要 |
| Load L2 | 当前 1 张 phase-card | 进阶段时；任务 prompt 仅按需 addon |
| Load L3 | 完整 AGENT/WORKFLOW 章节、§7 大表、schema、ADR、ENGINEERING… | 争议/附录/写码前 |

顺序：先 STATE → TASKS →（需时）本文件 + WORKFLOW.slim → 当前 card。  
同阶段多轮：默认 Load L0，禁止无故重读 L1 全文。

## 宿主选择通道（短）

探测本轮 tools/系统说明（不问用户“支不支持”）：

| 优先级 | channel |
|--------|---------|
| 1 | `native_tool` |
| 2 | `native_ui` |
| 3 | `text_abc` |
| 4 | `assume`（仅 Gate 0 或用户说你定） |

写入 `STATE.host`；细节争议再读完整 `AGENT.md` §0.3。

## 决策门禁（Gate 0/1/2）

> 旧称决策级别 L0/L1/L2。为避免与 Load 层级混淆，执行时统一用 Gate。

| 级 | 例子 | assume |
|----|------|--------|
| Gate 0 | 语言、已说清目标 | 可以 |
| Gate 1 | mode/weight/type/局部方案 | 仅“你定”或推荐包授权 |
| Gate 2 | 开始大范围 build、升 full、改架构/契约、接受风险 | 不可 |

## 启动分支（quick-first）

| boot_path | 何时 | 行为 |
|-----------|------|------|
| `resume` | 可恢复 checkpoint | 恢复摘要 + 继续/查看/修改（1 题） |
| `quick_boot` | 清晰目标或快速/你推荐；**默认优先** | 推荐包一次确认 |
| `full_bootstrap` | 目标模糊/高风险/用户要逐项 | 一次一题队列 |

推荐包与话术见 `START.md`。  
低/中风险且非 `deep`：推荐包可与 Ready 合并。  
高风险或未决 Gate 2：必须拆分确认。

成功标准：language、host.channel、mode、weight、type、goal、interaction_mode、risk_level、next_action/phase 已写；未 Ready 不写业务代码。

## 交互（短）

- 每轮 1 个决策题；2–3 选项；推荐项第一
- `low_touch` 复用已给信息并减少非必要问题；`deep` 不跳过 Gate 2
- 通道跟随 `STATE.host.choice_ui.channel`
- `quick_boot` 推荐包 = 一次确认整包建议（合法例外）
- 答完：复述 → 写 STATE/TASKS → 下一题或 Ready
- 用户控制：查看进度 / 修改 / 暂停 / 继续 / 返回上阶段
- 用户默认只感知：目标、模式、重量、阶段、是否开始

## 持续执行契约

除非遇到门禁、真实阻塞、工具失败、输出/上下文限制，或已完成 verify + close，否则不得在普通阶段摘要后结束本轮。

写入 STATE 前必须保留当前 `state_revision`，确认 `writer_session_id` 与当前会话一致；冲突时不得覆盖，设置 `stop_reason=blocked`。

阶段完成后必须：
1. 写 `phase_result`（status/next_phase/stop_reason/checkpoint_updated/evidence）
2. 更新 `STATE.current_phase`、`STATE.next_action` 和 `STATE.checkpoint`
3. `status=done|completed` 且非 close → 加载下一张 phase-card 并继续
4. 只有需要用户决策时才停止，并写入 `stop_reason: waiting_user`

允许停止：`waiting_user` | `blocked` | `tool_failure` | `output_limit` | `completed`  
禁止停止：仅输出阶段总结、或“如需继续请告诉我”（普通阶段）。

若因输出或上下文限制无法继续，先写 checkpoint，写入 `stop_reason: output_limit`，并明确恢复阶段。

## Ready 与写码最低条件

进入 build 等执行前至少：

- goal / mode / process_weight(resolved) / interaction_mode(resolved) / task_type
- 当前阶段 Exit 前置信息
- 用户确认开始（Ready；低风险可与推荐包合并）

写码最低：计划与验收清楚、影响面已知、验证方式明确。

自动升级（必须暂停询问）：跨模块/公共层/数据模型/权限/安全；light 中影响面扩大；无复现却要顺手重构；验收从单点变系统性。

## 回写

| 何时 | 写哪里 |
|------|--------|
| 模式/阶段/访谈 | `STATE.md`（仅值） |
| 任务与验收 | `TASKS.md` |
| 决策 | `DECISIONS.md` |
| 可见完成 | `CHANGELOG.md` |
| 债务 | `TECH_DEBT.md` |

## 全局禁令

- 不编造文件/API；不提交密钥；不做范围外重构；不跳过 verify
- 不让用户填长空表；不把大表写回 STATE；不一次加载无关键 L3 附录
- 不取消 Ready；不用 `assume` 代替 Gate 2

## 开场骨架（短）

```text
## 当前状态
- Language / Host / Load tier / Boot path / Mode / Weight / Phase / Next / Risk

## 本轮只确认一件事
- 问题 + 通道 + 选项
```

需要全文时再读 `AGENT.md`。

## 维护（改工作流时）

- 改硬规则：先改本文件与 `WORKFLOW.slim.md`，再同步完整 `AGENT.md` / `WORKFLOW.md`
- 清单见 `MAINTENANCE.md`（L3，日常任务不读）
