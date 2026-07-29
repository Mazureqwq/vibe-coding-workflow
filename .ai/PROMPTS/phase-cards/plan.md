# Phase Card: plan

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
形成可执行、可验证的实施计划。

## light
计划可极简（3–5 步）并紧贴 build；仍需可勾选验收与验证方式。
高风险 / 架构变更不得用 light 计划偷渡，应升级或插回 architecture。

## Allowed
- 任务切片、顺序、测试策略、回滚点
- 明确不做清单
- 写 TASKS / STATE

## Forbidden
- 超计划提前实现
- 计划空泛到无法执行
- 无验收标准进入 build

## Interaction
请用户确认（Gate 1；若含架构/契约大改则为 Gate 2）：
```text
A. 按此计划执行（推荐）
B. 调整任务顺序/范围
C. 先补信息再计划
```

## Output → 写入
- `TASKS.md` 任务卡完整字段
- `STATE.confirmed.implementation_plan_summary`
- `STATE.risk_level`（如有更新）
- `STATE.next_action = execute_phase/build`

## Exit Criteria
- 用户确认计划
- 验收标准可勾选
- 满足 build 最低条件

## 结束契约（必须）

```yaml
phase_result:
  status: completed | waiting_user | blocked | failed
  next_phase: build | null
  stop_reason: null | waiting_user | blocked | tool_failure | output_limit
  checkpoint_updated: true
  evidence: []
```

- `status=completed` → 立即加载 build card（除非 Gate 2 未确认）
