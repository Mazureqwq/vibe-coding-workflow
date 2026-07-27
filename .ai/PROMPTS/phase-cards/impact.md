# Phase Card: impact

## Goal
评估需求落到真实模块后的影响与风险。

## Interaction Rule
- 一次只问一题；优先可点选；普通阶段按计划自动衔接，关键门禁单独确认

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
- `STATE.confirmed.implementation_plan_summary`（初稿）
- 可选 `TECH_DEBT` 提案

## Exit Criteria
- 影响范围与风险已确认
- 可进入 plan
