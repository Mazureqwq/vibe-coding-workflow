# STATE Schema（冷说明）

> 字段字典与维护规则。**默认不读全文**；仅在字段含义不清、升级 schema、或排障时按需读取。  
> 热数据只写 `.ai/STATE.md`（纯值，无枚举注释）。

## schema migration

- `schema_version: 3`：phase_result、validation_result、interaction_mode、architecture_depth、state_revision、checkpoint 重试、脱敏。
- `workflow_version: 3`：ADR-007 quick-first；热层去注释；`risk_level`；`phase_result.evidence`；Gate 命名；light shape 语义。

逻辑分组（热文件仍扁平，便于解析）：

| 组 | 字段 |
|----|------|
| meta | schema_version, workflow_version, session_id, state_revision, writer_session_id, redaction_status |
| boot | boot_path, ui_language*, host, interaction_mode, risk_level |
| task | mode, process_weight*, task_*, workflow_pattern, architecture_depth, confirmed |
| progress | current_phase, phases, phase_result, next_action, stop_reason, checkpoint, skipped_phases |
| gates | interview.ready_*, validation_result, risk_level |
| budget | context_budget |

## 核心字段

| 字段 | 含义 |
|------|------|
| `schema_version` | STATE 结构版本；变化时才重读本 schema |
| `workflow_version` | 工作流行为版本 |
| `interaction_mode` | low_touch / standard / deep / auto |
| `risk_level` | low / mid / high；控制推荐包是否与 Ready 合并 |
| `architecture_depth` | minimum / standard / deep / auto |
| `state_revision` | 乐观并发版本；写入前比对 |
| `writer_session_id` | 当前写者会话；冲突勿覆盖 |
| `redaction_status` | clean / needs_review |
| `context_budget.last_context_scope` | hot_snapshot / core_rules / phase_card / reference_rules；记录本轮读取到的最大语义范围 |
| `boot_path` | resume / quick_boot / full_bootstrap |
| `stop_reason` | waiting_user / blocked / tool_failure / output_limit / completed |

## interaction_mode

| 值 | 含义 |
|----|------|
| low_touch | 少问，推荐包优先 |
| standard | 关键决策确认 |
| deep | 完整门禁，不合并 Ready 偷渡 |
| auto | 先推荐再 resolved |

与 `process_weight` 解耦：weight 管阶段开全否，interaction 管问多少。

## risk_level

| 值 | 合并 Ready | 默认 interaction |
|----|------------|------------------|
| low | 允许与推荐包合并 | low_touch |
| mid | 允许合并，但影响/验收需清楚 | standard |
| high | 禁止合并；Gate 2 必问 | deep |

## boot_path

| 值 | 含义 |
|----|------|
| resume | 从 checkpoint 恢复 |
| quick_boot | 推荐包一次确认（默认优先） |
| full_bootstrap | 一次一题 |

## phase_result

```yaml
phase_result:
  status: pending | completed | waiting_user | blocked | failed
  next_phase: <phase>|null
  stop_reason: <stop_reason>|null
  checkpoint_updated: true|false
  evidence: []                 # 短句；verify 建议非空
```

规则：
- 无 phase_result 更新 = 阶段未完成
- status=completed 且非 close → 必须续跑下一 card
- 允许停止的 stop_reason 见 AGENT.core 白名单

## validation_result

```yaml
validation_result:
  kind: verify | review | spike_result | change_checklist | null
  status: pending | passed | accepted | failed
  summary: null
  commands: []
  evidence: []
  residual_risks: []
  architecture_checks: []
  recorded_at: null
```

close 前：`passed|accepted`；passed 要有 commands 或 evidence；accepted 要有用户接受风险依据。

## allowed_transitions

以 `.ai/workflow-machine.json` 为唯一机器来源。  
light 跳过的分析阶段写入 `skipped_phases`，不得假装执行过。

## Gate vs Load

| 名称 | 含义 |
|------|------|
| 上下文读取范围 | 读什么上下文 |
| Gate 0/1/2 | 能否 assume：已明确事实、常规方案、高风险变更 |

## redaction

写入 STATE 前去除密钥、token、个人信息；不确定则 `redaction_status: needs_review` 并暂停。

## 维护规则

1. 热文件只改值，不追加说明书
2. 枚举变更先改 `workflow-machine.json` 与本 schema，再改模板
3. `schema_version` 变化才强制重读本文件
4. 启动写 `boot_path`；快速启动不得跳过 Gate 2
5. completed 时校验 validation 与 checkpoint
6. 并发写：比对 state_revision + writer_session_id
