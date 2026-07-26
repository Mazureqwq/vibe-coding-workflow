# Phase Card: recon

## Goal
理解已有项目现实，不先改代码。

## Interaction Rule
- 一次只问一题；优先可点选；未确认不进入下一动作

## Allowed
- 扫描目录、依赖、脚本、入口、测试、关键模块
- 输出项目理解简报
- 识别 `.ai` 空洞/过期信号

## Forbidden
- 边看边重构
- 无证据断言业务含义

## Interaction
简报后请用户确认/纠正：
- 技术栈是否正确
- 主模块理解是否正确
- 启动与验证命令是否正确

## Output → 写入
- `STATE.confirmed` 浓缩理解
- 如需要：`ARCHITECTURE.md` / `ENGINEERING.md` 草案（status=draft）

## Exit Criteria
- 用户确认理解简报
- full → 进入 align
- light → 做完轻量 align/impact 检查后进入 plan
