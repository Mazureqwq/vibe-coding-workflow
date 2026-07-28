# Phase Card: build

> 交互与加载：PROMPTS/_common.md；本卡只定义本阶段差异。

## Goal
按已确认计划最小实现。

## Allowed
- 修改约定范围内代码与测试
- 更新任务进度
- 发现新风险时暂停并提问
- 每个执行批次后更新 TASKS 进度和 checkpoint
- 完成本阶段后直接进入 verify，不只输出下一步计划

## Forbidden
- 扩 scope
- 换技术栈
- 无计划大重构
- 验收未定义仍继续堆功能
- Ready/Gate 2 未通过就大改

## Interaction
仅在以下情况打断用户：
- 计划外决策（Gate 1/2）
- 发现阻塞
- 需要升级 process_weight / risk_level

## Output → 写入
- 代码与测试
- TASKS 进度
- 新债务提案（可选）
- checkpoint / changed_files

## 停止与续接
除非触发门禁、阻塞、工具失败或输出限制，build 不得在中途结束。
触发停止时写入 STATE.stop_reason，并记录可恢复 checkpoint。

## Exit Criteria
- 计划项完成
- 有明确验证步骤
- 可进入 verify

## 结束契约（必须）

`yaml
phase_result:
  status: completed | waiting_user | blocked | failed
  next_phase: verify | null
  stop_reason: null | waiting_user | blocked | tool_failure | output_limit
  checkpoint_updated: true
  evidence: []
`

- status=completed → 立即加载 verify card

