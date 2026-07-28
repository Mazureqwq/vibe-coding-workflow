# Phase Card: discover

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
把模糊想法收敛成清晰问题定义。

## light shape（process_weight=light）
一次产出短 shape，避免另开 spec/architecture：
- 问题 / 范围 / 非目标
- 成功标准（可验收）
- 约束与风险（一句话）
- 是否需要插回 architecture（默认否）

写入 `confirmed.*`；若跳过 spec/architecture，记入 `skipped_phases`。

## Allowed
- 提问、复述理解、给选项
- 写 STATE / TASKS 的目标与非目标
- 建议 process_weight / interaction_mode 是否需要升级

## Forbidden
- 写业务代码
- 未确认目标就进入大规模设计或实现

## Output → 写入
- `confirmed.goal/non_goals/success_criteria/constraints`
- `TASKS` 草案字段
- `risk_level`（如可判断）

## Exit Criteria
- 目标与成功标准清楚，或 light shape 已确认
- 可进入 spec（full）或 plan（light）

## 结束契约（必须）

```yaml
phase_result:
  status: completed | waiting_user | blocked | failed
  next_phase: spec | plan | null
  stop_reason: null | waiting_user | blocked | tool_failure | output_limit
  checkpoint_updated: true
  evidence: []
```

- `status=completed` → 立即加载下一 phase-card
