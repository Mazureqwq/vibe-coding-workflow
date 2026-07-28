# Phase Card: architecture

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
在写代码前确认架构与技术边界。

## Allowed
- 提供 2–3 套方案对比
- 定义模块边界、关键链路、风险
- 写 ARCHITECTURE / DECISIONS 草案

## Forbidden
- 未确认就大规模落代码
- 一次引入过多无关基础设施

## Interaction
固定请用户选方案：
```text
A. 方案1（推荐）— 优点/代价
B. 方案2 — 优点/代价
C. 方案3 — 优点/代价
```

## Output → 写入
- `ARCHITECTURE.md`
- `DECISIONS.md`（重大选型）
- `STATE.confirmed.architecture_choice`
- `STATE.doc_authority.ARCHITECTURE.md = follow`（确认后）

## Exit Criteria
- 用户确认选型与边界
- 风险已明示
- 可进入 plan
