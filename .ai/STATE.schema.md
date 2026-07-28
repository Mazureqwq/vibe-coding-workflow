# STATE Schema（冷说明）

> 字段字典与维护规则。**默认不读全文**；仅在字段含义不清、升级 schema、或排障时按需读取。  
> 热数据只写 `.ai/STATE.md`。

## 设计

| 文件 | 角色 | 变更频率 | 缓存 |
|------|------|----------|------|
| `STATE.md` | 纯热快照 | 高 | 易未命中，必须短 |
| `STATE.schema.md` | 字段说明 | 极低 | 可缓存，按需加载 |
| `AGENT.core.md` / `WORKFLOW.slim.md` | L1 冷规则 | 低 | 稳定前缀，优先于完整全文 |

## 核心字段

| 字段 | 含义 |
|------|------|
| `schema_version` | STATE 结构版本；变化时才重读本 schema |
| `mode` | greenfield / brownfield / hybrid |
| `process_weight` | full / light / auto |
| `current_phase` | 见 WORKFLOW 阶段表 |
| `task_type` | feature/bugfix/hotfix/refactor/platform/spike/infra/security/review/chore/docs |
| `workflow_pattern` | 大厂典型流标签，见 WORKFLOW §7 |
| `ui_language` | 交互语言 |

## process_weight

| 值 | 含义 |
|----|------|
| `full` | 阶段全开 |
| `light` | 合并分析阶段 |
| `auto` | AI 推荐后用户确认；确认后写 `resolved_as` |

路径映射只以 `WORKFLOW.md` 为准，不在热快照重复。

## host.choice_ui

| 字段 | 含义 |
|------|------|
| `available` | 是否具备原生选项能力 |
| `channel` | native_tool / native_ui / text_abc / assume |
| `tool_name` | 探测到的工具名（不写死品牌） |
| `mode_gated` | 是否需特定模式才能弹框 |
| `evidence` | ≤3 条短证据 |

规则见 `AGENT.md` §0.3。热快照只保留探测结果。

## doc_authority

`follow | update-first | code-as-source | ignore-for-task | unknown`  
仅填与当前任务相关的文档。

## interview

| 字段 | 含义 |
|------|------|
| `status` | idle/collecting/ready/executing/paused |
| `queue` | 待问 id |
| `answers` / `answer_status` | 答案与 confirmed/inferred/needs_review |
| `ready_for_execution` | 信息是否齐 |
| `execution_confirmed` | 用户是否同意开始 |

队列规则见 `AGENT.md` §3；此处不重复。

## boot_path / 启动分支

| 值 | 含义 |
|----|------|
| `resume` | 从 checkpoint 继续 |
| `quick_boot` | 推荐包一次确认 |
| `full_bootstrap` | 逐项访谈 |

见 `START.md` 与 `AGENT.md` Step F。

## checkpoint

暂停、等待用户、阶段完成时更新。恢复时优先读热快照 checkpoint，不重扫全部冷规则。

## context_budget

| 字段 | 含义 |
|------|------|
| `last_load_tier` | 本轮实际加载层级 L0–L3 |
| `cold_rules_loaded` | 本轮是否加载了 AGENT/WORKFLOW 全文类冷规则 |

## 维护规则（短）

1. 每会话先读 `STATE.md` 热快照，再决定是否加载冷规则  
2. 只改 YAML 值；禁止把长说明、映射表、协议正文写回 `STATE.md`  
3. `evidence`、`notes`、`summary` 保持短句  
4. `schema_version` 变化才读本 schema  
5. host 证据未变且 `adaptation.status` 已 adapted/fallback 时，不重跑完整探测叙事  
6. 用户改上游答案时，下游标 `needs_review`
7. 启动时写入 `boot_path`；快速启动不得跳过 Ready/L2 门禁
8. 优先保持热快照短小，以利多轮缓存