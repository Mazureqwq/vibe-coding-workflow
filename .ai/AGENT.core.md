# AGENT.core（L1 常驻冷规则）

> 会话需要冷规则时**优先读本文件**，不要默认打开完整 `AGENT.md`。  
> 完整附录：宿主长协议、访谈细项、开场骨架等见 `AGENT.md`。  
> 用户入口：`START.md`。

## 绝对优先级

1. `START.md` / 本文件 / `WORKFLOW.slim.md`
2. 当前 `STATE.md`（热快照）
3. 已确认的用户选择
4. 完整 `AGENT.md` / `WORKFLOW.md`（按需）
5. 其余 `.ai/*` 与仓库现实代码

冲突：先声明 → 给选项 → 等选择 → 再行动。

## 角色红线

必须：

- 先 L0 热快照，再按需升舱
- 交互语言跟随用户
- 先确认再写 `.ai`，先门禁再写业务代码
- 一次一题；有原生选项能力则优先弹框
- 启动先分支：`resume` / `quick_boot` / `full_bootstrap`
- Ready 前不执行

禁止：

- 跳过阶段直接实现
- 信息不足假装确定
- 每轮全量重读完整 AGENT + WORKFLOW
- 把说明书写回 `STATE.md`
- 同时加载多张 phase-card
- 快速启动后跳过 Ready/L2 门禁大改代码

## 使用注意（短）

1. 入口优先 `START.md`
2. 每轮先读 `STATE.md` + `TASKS.md` active（L0）
3. STATE 只写值；说明在 `STATE.schema.md`
4. 一阶段一 card；公共交互见 `PROMPTS/_common.md`
5. host 已 adapted 且证据未变 → 复用
6. 用户已给目标 → 优先推荐包一次确认
7. 更新 `context_budget.last_load_tier`

## 分级加载

| 层级 | 读什么 | 何时 |
|------|--------|------|
| L0 | `STATE.md` + `TASKS.md` | 每轮先读；resume 默认 |
| L1 | **本文件** + `WORKFLOW.slim.md` | 新会话、版本变化、路由/门禁需要 |
| L2 | 当前 1 张 phase-card 或任务 prompt | 进阶段时 |
| L3 | 完整 AGENT/WORKFLOW 章节、§7 大表、schema、ADR、ENGINEERING… | 争议/附录/写码前 |

顺序：先 STATE → TASKS →（需时）本文件 + WORKFLOW.slim → 当前 card。  
同阶段多轮：默认 L0，禁止无故重读 L1 全文。

## 宿主选择通道（短）

探测本轮 tools/系统说明（不问用户“支不支持”）：

| 优先级 | channel |
|--------|---------|
| 1 | `native_tool` |
| 2 | `native_ui` |
| 3 | `text_abc` |
| 4 | `assume`（仅 L0 或用户说你定） |

写入 `STATE.host`；细节争议再读完整 `AGENT.md` §0.3。

## 决策级别

| 级 | 例子 | assume |
|----|------|--------|
| L0 | 语言、已说清目标 | 可以 |
| L1 | mode/weight/type/局部方案 | 仅“你定” |
| L2 | 开始 build、升 full、改架构/契约、接受风险 | 不可 |

## 启动分支

| boot_path | 行为 |
|-----------|------|
| `resume` | 恢复摘要 + 继续/查看/修改（1 题） |
| `quick_boot` | 推荐包一次确认（mode/weight/type/next phase） |
| `full_bootstrap` | 一次一题队列 |

推荐包与话术见 `START.md`。成功标准：language、host.channel、mode、weight、type、goal、next_action/phase 已写；未 Ready 不写业务代码。

## 交互（短）

- 每轮 1 个决策题；2–3 选项；推荐项第一
- 通道跟随 `STATE.host.choice_ui.channel`
- `quick_boot` 推荐包 = 一次确认整包建议（合法例外）
- 答完：复述 → 写 STATE/TASKS → 下一题或 Ready
- 用户控制：查看进度 / 修改 / 暂停 / 继续 / 返回上阶段

## Ready 与写码最低条件

进入 build 等执行前至少：

- goal / mode / process_weight(resolved) / task_type
- 当前阶段 Exit 前置信息
- 用户确认开始（Ready）

写码最低：计划与验收清楚、影响面已知、验证方式明确。

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

## 开场骨架（短）

```text
## 当前状态
- Language / Host / Load tier / Boot path / Mode / Weight / Phase / Next

## 本轮只确认一件事
- 问题 + 通道 + 选项
```

需要全文时再读 `AGENT.md`。
## 维护（改工作流时）

- 改硬规则：先改本文件与 `WORKFLOW.slim.md`，再同步完整 `AGENT.md` / `WORKFLOW.md`
- 清单见 `MAINTENANCE.md`（L3，日常任务不读）