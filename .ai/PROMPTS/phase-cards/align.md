# Phase Card: align

> 交互与加载：PROMPTS/_common.md；本卡只定义本阶段差异。

## Goal
决定本任务中 .ai 文档与代码谁说了算。

## light
process_weight=light 时文档效力检查可并入 recon shape；明显冲突仍须打开本阶段或升级 full。

## Allowed
- 对比文档 vs 代码
- 为每个相关文档建议效力
- 请用户选择效力

## Forbidden
- 不声明就忽略文档
- 不确认就重写全部规范

## Interaction
对每个相关文档给出：
`	ext
ENGINEERING.md: 建议 update-first
A. follow  B. update-first（推荐）  C. code-as-source  D. ignore-for-task
`

## Output → 写入
- STATE.doc_authority
- 若选 update-first：进入文档更新草案，确认后写回

## Exit Criteria
- 相关文档效力已确认
- 冲突已处理或记录
- 可进入 impact（full）或按 light 路由进入 plan

## 结束契约（必须）

`yaml
phase_result:
  status: completed | waiting_user | blocked | failed
  next_phase: impact | plan | review | null
  stop_reason: null | waiting_user | blocked | tool_failure | output_limit
  checkpoint_updated: true
  evidence: []
`

- status=completed → 立即加载下一 phase-card

