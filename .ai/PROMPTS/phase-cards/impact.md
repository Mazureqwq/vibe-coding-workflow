# Phase Card: impact

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
评估需求落到真实模块后的影响与风险。

## Allowed
- 映射影响面、回归路径、依赖关系
- 识别是否需先还债
- 建议保持 light 或升级 full

## Forbidden
- 直接编码
- 忽视公共模块风险

## Interaction
确认：
- 影响范围
- 风险等级
- 是否接受最小改动方案

## Output → 写入
- `TASKS.impact_scope / verification`
- `STATE.risk_level`
- `STATE.confirmed.implementation_plan_summary`（初稿）
- 可选 `TECH_DEBT` 提案

## Exit Criteria
- 影响范围与风险已确认
- 可进入 plan

## 结束契约（必须）

交互与加载：见 `PROMPTS/_common.md`。

结束本阶段前输出并回写：

```yaml
phase_result:
  status: completed | waiting_user | blocked | failed
  next_phase: <phase>|null
  stop_reason: null | waiting_user | blocked | tool_failure | output_limit | completed
  checkpoint_updated: true
  evidence: []
```

- `status=completed` 且非 close → 立即加载下一 phase-card，不要停问“是否继续”
- 需要用户 Gate 2 决策 → `waiting_user`
- 主路径是本 card；任务 prompt 仅 addon

