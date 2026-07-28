# Phase Card: spec

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
把目标变成可验收需求。

## Allowed
- 场景拆解、优先级选项、边界确认
- 写 TASKS 验收标准

## Forbidden
- 进入实现
- 无优先级地堆功能

## Interaction
给用户选项化确认：
- Must / Should / Could
- 主路径场景
- 验收标准

## Output → 写入
- `TASKS.md` acceptance_criteria
- `STATE.confirmed.success_criteria`

## Exit Criteria
- 验收标准已确认
- 开放问题已记录或关闭
- 可进入 architecture（full）
