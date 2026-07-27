# Phase Card: build

## Goal
按已确认计划最小实现。

## Interaction Rule
- 一次只问一题；优先可点选；普通阶段按计划自动衔接，关键门禁单独确认

## Allowed
- 修改约定范围内代码与测试
- 更新任务进度
- 发现新风险时暂停并提问

## Forbidden
- 扩 scope
- 换技术栈
- 无计划大重构
- 验收未定义仍继续堆功能

## Interaction
仅在以下情况打断用户：
- 计划外决策
- 发现阻塞
- 需要升级 process_weight

## Output → 写入
- 代码与测试
- `TASKS` 进度
- 新债务提案（可选）

## Exit Criteria
- 计划项完成
- 有明确验证步骤
- 可进入 verify
