# `.ai/` 工作流包

本目录可单独复制到任意项目根目录。

## 阅读路径

| 层级 | 读什么 | 谁 |
|------|--------|-----|
| 30 秒 | `START.md` | 所有用户 |
| 5 分钟 | `START` + `AGENT.core` + `WORKFLOW.slim` | 日常执行 |
| 维护者 | 完整 AGENT/WORKFLOW + ADR + MAINTENANCE + checker | 改工作流时 |

## 默认策略（ADR-007）

- **quick-first**：清晰目标默认推荐包，不是四轮问卷
- **减负不降门禁**：light 可合并分析；verify/close/Gate 2 不砍
- **热层纯值**：`STATE.md` 无说明书
- **主路径**：`PROMPTS/phase-cards/*`；任务 prompt 为 addon
- **命名**：上下文读取使用热状态快照、核心运行规则、当前阶段卡、详细参考规则；Gate 0/1/2 表示决策门禁

## 关键文件

- `START.md` — 入口与决策树
- `AGENT.core.md` / `WORKFLOW.slim.md` — 核心运行规则
- `STATE.md` / `STATE.schema.md` — 热/冷
- `workflow-machine.json` — 阶段机
- `PROMPTS/_common.md` — 结束契约与停止白名单
- `examples/` — 行为样例
- `check-consistency.mjs` — 静态 + 完成快照校验
- `tests/workflow-traces.mjs` — 核心流程轨迹测试

## 自检

```bash
node .ai/check-consistency.mjs
node .ai/tests/workflow-traces.mjs
```

前者检查文档、状态和阶段机结构；后者模拟 feature、bugfix、验证失败回退、Gate 2 阻塞和 checkpoint 恢复。
