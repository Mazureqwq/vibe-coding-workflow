# Phase Card: plan

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
形成可执行、可验证的实施计划。

## Allowed
- 任务切片、顺序、测试策略、回滚点
- 明确不做清单
- 写 TASKS / STATE

## Forbidden
- 超计划提前实现
- 计划空泛到无法执行

## Interaction
请用户确认：
```text
A. 按此计划执行（推荐）
B. 调整任务顺序/范围
C. 先补信息再计划
```

## Output → 写入
- `TASKS.md` 任务卡完整字段
- `STATE.confirmed.implementation_plan_summary`
- `STATE.next_action = execute_phase/build`

## Exit Criteria
- 用户确认计划
- 验收标准可勾选
- 满足 build 最低条件
