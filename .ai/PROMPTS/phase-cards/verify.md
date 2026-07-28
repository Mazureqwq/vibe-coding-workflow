# Phase Card: verify

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。  
> light/full **均不可跳过**本阶段。

## Goal
证明改动满足验收，且无明显回归。

## Allowed
- 执行约定检查命令
- 按验收标准逐项核对
- 记录失败与处理

## Forbidden
- 夹带新功能
- 无验证宣称完成
- 无 commands/evidence 写 `passed`
- 无用户接受风险记录写 `accepted`

## Interaction
若失败：
```text
A. 回 build 修复（推荐）
B. 降范围并重确认验收
C. 记录已知问题后进入 close（需明确风险 = Gate 2）
```

## Output → 写入
- `TASKS.verification` 结果
- `STATE.validation_result.kind/status/summary/commands/evidence/residual_risks/architecture_checks/recorded_at`
- 失败时回退阶段到 build 或 plan

## Architecture Checks

若 ARCHITECTURE.md 已确认，至少检查并记录：模块边界、依赖方向/循环依赖、shared 越界引用、公开入口和模块独立测试。项目没有自动检查工具时，记录人工检查证据，不得假装已执行。

## Exit Criteria
- 验收项通过，或未通过项已被用户接受并记录
- `validation_result.status=passed|accepted`
- 可进入 close（自动加载 close card）

## 结束契约（必须）

```yaml
phase_result:
  status: completed | waiting_user | blocked | failed
  next_phase: close | build | plan | null
  stop_reason: null | waiting_user | blocked | tool_failure | output_limit
  checkpoint_updated: true
  evidence: []   # 建议非空；与 validation_result 对齐
```

- `status=completed` 且 next=close → 立即加载 close card
