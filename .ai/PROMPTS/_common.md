# PROMPTS 公共约定（冷、短）

> phase-card / 任务 prompt **不要复制**本页长文。需要时一句话引用即可。

## 交互
- 遵循 `AGENT.md` §3（一次一题；通道见 `STATE.host.choice_ui`）
- Ready 前不执行；L2 门禁单独确认
- 普通阶段按计划自动衔接

## 使用注意（短）
- 入口优先 `START.md`
- STATE 只写值；不每轮重读冷规则全文
- 启动先分支：resume / quick_boot / full_bootstrap

## 默认加载
- 热：`STATE.md` + `TASKS.md` active
- 当前仅 1 张 phase-card
- L1 用 `AGENT.core.md` + `WORKFLOW.slim.md`；不每轮重读完整全文（见 Step A / §0.4）

## 引用写法
```text
交互与加载：见 PROMPTS/_common.md
```
