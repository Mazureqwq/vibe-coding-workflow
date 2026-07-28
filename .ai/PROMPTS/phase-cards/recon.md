# Phase Card: recon

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
理解仓库现实，为后续对齐与改动提供事实基础。

## light shape（process_weight=light）
quick recon 后一次产出短 shape，避免另开 align/impact：
- 技术栈与入口事实
- 文档效力要点
- 影响面与风险一句话
- 是否升级 full / 插回 architecture

写入 `confirmed.*` / `risk_level`；跳过阶段记 `skipped_phases`。

## Allowed
- 只读探索代码与文档
- 输出事实摘要（标记 unknown/inferred）
- 建议 recon 深度与 process_weight

## Forbidden
- 先改再理解
- 把猜测写成确定事实

## Interaction
默认 quick；仅当深度影响风险判断时再问是否 focused/deep。

## Output → 写入
- STATE 短摘要字段 / TASKS.impact_scope
- 必要时 ARCHITECTURE（用户确认后）

## Exit Criteria
- 有足够事实支撑下一阶段
- light：可进 plan；full：可进 align 或按路由进 review

## 结束契约（必须）

```yaml
phase_result:
  status: completed | waiting_user | blocked | failed
  next_phase: align | plan | review | null
  stop_reason: null | waiting_user | blocked | tool_failure | output_limit
  checkpoint_updated: true
  evidence: []
```

- `status=completed` → 立即加载下一 phase-card
