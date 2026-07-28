# Phase Card: discover

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
把模糊想法收敛成清晰问题定义。

## Allowed
- 提问、复述理解、给选项
- 写 STATE / TASKS 的目标与非目标
- 建议 process_weight 是否需要升级

## Forbidden
- 写业务代码
- 过早锁定复杂技术实现
- 让用户手写长需求文档

## Interaction
至少确认：
1. 目标
2. 范围 / 非目标
3. 成功标准
4. 关键约束

## Output → 写入
- `STATE.confirmed.goal/non_goals/success_criteria/constraints`
- `TASKS.md` Active Task 草案

## Exit Criteria
- 用户确认问题定义
- 有可检查的成功标准
- next phase 已确定（full→spec，light→plan）
