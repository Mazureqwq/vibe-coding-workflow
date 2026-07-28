# Phase Card: spec

> 交互与加载：PROMPTS/_common.md；本卡只定义本阶段差异。

## Goal
把需求收敛成可验收规格。

## light
process_weight=light 时本阶段通常并入 discover 的 shape，并记入 skipped_phases。仅当验收仍不清时才单独打开。

## Allowed
- 场景拆解、优先级选项、边界确认
- 写 TASKS 验收标准

## Forbidden
- 进入实现
- 无优先级地堆功能

## Interaction
确认：
- Must / Should / Could
- 主路径场景
- 验收标准

## Output → 写入
- TASKS.md acceptance_criteria
- STATE.confirmed.success_criteria

## Exit Criteria
- 验收标准已确认
- 开放问题已记录或关闭
- 可进入 architecture（full）

## 结束契约（必须）

`yaml
phase_result:
  status: completed | waiting_user | blocked | failed
  next_phase: architecture | null
  stop_reason: null | waiting_user | blocked | tool_failure | output_limit
  checkpoint_updated: true
  evidence: []
`

- status=completed → 立即加载下一 phase-card

