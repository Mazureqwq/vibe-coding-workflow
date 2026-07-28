# Phase Card: verify

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
证明改动满足验收，且无明显回归。

## Allowed
- 执行约定检查命令
- 按验收标准逐项核对
- 记录失败与处理

## Forbidden
- 夹带新功能
- 无验证宣称完成

## Interaction
若失败：
```text
A. 回 build 修复（推荐）
B. 降范围并重确认验收
C. 记录已知问题后进入 close（需明确风险）
```

## Output → 写入
- `TASKS.verification` 结果
- 失败时回退阶段到 build 或 plan

## Exit Criteria
- 验收项通过，或未通过项已被用户接受并记录
- 可进入 close
