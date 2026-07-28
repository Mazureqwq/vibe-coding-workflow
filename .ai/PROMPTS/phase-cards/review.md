# Phase Card: review

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
形成可执行的代码或方案审查结论。

## Allowed
- 检查正确性、回归风险、架构边界、性能、安全和测试缺口
- 区分 blocking 与 non-blocking 问题
- 记录是否需要派生修复任务

## Forbidden
- 修改业务代码
- 把审查意见直接当成已修复
- 跳过证据或把不确定性写成结论

## Interaction
输出审查结论后确认：
```text
A. 接受结论并归档（推荐）
B. 补充审查范围或证据
C. 创建修复任务
```

## Output → 写入
- `TASKS.md` 的 verification / impact_scope
- `STATE.validation_result = { kind: review, status: passed|accepted, summary, commands, evidence, residual_risks, recorded_at }`
- `DECISIONS.md` 或 `TECH_DEBT.md`（如需要）
- `CHANGELOG.md`（close 阶段）

## Exit Criteria
- 结论为 approve / request changes / needs discussion 之一
- blocking、non-blocking 和测试建议已记录
- 用户确认归档或派生修复任务；validation_result 已写入

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

