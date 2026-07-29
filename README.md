# VibeRail

一个可以复制到任意项目中的 AI 软件开发工作流。

[English README](README.en.md)

它让 AI 在写代码前先理解目标、项目现状和影响范围，再根据风险选择轻量或完整流程，并通过验证和收尾阶段完成一次可恢复、可追踪的开发任务。

## 它解决什么问题

直接对 AI 说“实现这个功能”，常见结果是：

- 没理解已有代码就开始修改；
- 小修复和大型改造使用同样复杂的流程；
- 需求、范围和验收标准不清楚；
- 验证、回归测试和文档收尾被跳过；
- 会话中断后无法准确恢复。

这个工作流把一次开发任务拆成可确认、可恢复、可验证的阶段，同时允许低风险任务快速通过。

## 适合谁

适合：

- 使用 Codex、Claude Code、Cursor 等 AI 编程工具的人；
- 需要维护已有项目的个人开发者和小团队；
- 希望 AI 先理解、再规划、最后写代码的项目；
- 需要处理中断恢复、验证回退和高风险确认的任务。

不适合：

- 替代目标项目自己的单元测试、集成测试或代码审查；
- 让 AI 在没有用户确认的情况下执行高风险变更；
- 把流程文档当作具体技术栈的项目模板。

## 30 秒上手

把 `.ai/` 目录复制到目标项目根目录，然后在 AI 编程工具中发送：

```text
请按 .ai/START.md 快速启动。
目标：修复登录页按钮点击无响应
你推荐，我确认
```

继续上次中断的任务：

```text
请按 .ai/START.md 继续
```

工作流不会覆盖目标项目原有的 `README.md`、`AGENTS.md` 或其他根目录文件。

### 完整示例

用户输入：

```text
修复登录页按钮点击无响应，你推荐我确认
```

AI 推荐：

```text
mode: brownfield
weight: light
type: bugfix
interaction: low_touch
next phase: recon
```

用户选择推荐后，流程为：

```text
recon → plan → build → verify → close
```

如果 verify 失败，流程会回到 `build` 修复，而不是直接宣布完成。

## 工作方式

```mermaid
flowchart LR
    A[一句话目标] --> B[启动推荐]
    B --> C[理解项目与需求]
    C --> D[计划与风险确认]
    D --> E[按计划实现]
    E --> F[验证与回归]
    F --> G[收尾与记录]
    F -->|失败| E
    C -->|发现高风险| D
```

默认路径是：

```text
目标 → 启动推荐 → 阶段推进 → verify → close
```

低风险任务可以快速启动；涉及公共模块、权限、数据、架构或无法快速回滚的改动，必须单独确认后才能继续。

## 典型流程

### 小型 Bug 修复

```text
recon → plan → build → verify → close
```

例如修复“登录按钮重复点击发送两次请求”。分析阶段可以合并，但必须保留验证和收尾。

### 新功能或大型改造

```text
discover → spec → architecture → plan → build → verify → close
```

例如增加批量导入用户功能，需要明确数据校验、权限、错误处理、测试和回滚策略。

### 验证失败

```text
verify → build → verify → close
```

验证失败不能直接宣布完成，必须回到允许的阶段修复，重新验证通过后才能收尾。

### 线上热修

```text
最小范围止血 → verify → close
```

止血和根因治理分成两个任务，避免把线上恢复和大规模重构混在一起。

## 核心能力

- **快速启动**：清晰目标默认使用推荐包，减少无效访谈。
- **风险分级**：`full`、`light`、`auto` 适配不同任务规模。
- **交互档位**：`low_touch`、`standard`、`deep` 与流程重量分离。
- **阶段门禁**：未确认前不写业务代码，高风险改动必须单独确认。
- **可恢复状态**：使用 `STATE.md`、`TASKS.md` 和 checkpoint 保存进度。
- **失败可回退**：验证失败时按阶段机回到 `build` 或 `plan`。
- **语义化上下文读取**：热状态快照、核心运行规则、当前阶段卡、详细参考规则。
- **宿主自适应**：优先使用原生选项能力，不具备时降级为文本选项。
- **项目无关**：不绑定具体语言、框架或 AI 产品。

## 自动验证

项目包含两类自动检查：

```bash
node .ai/check-consistency.mjs
```

检查文档、状态快照、阶段卡、阶段转移、完成门禁和术语一致性，并自动运行流程轨迹测试。

```bash
node .ai/tests/workflow-traces.mjs
```

当前覆盖 5 条核心轨迹：

- 轻量 bugfix 成功；
- 完整 feature 成功；
- verify 失败后回退 build；
- Gate 2 未确认时阻止 build；
- checkpoint 暂停与 resume 恢复。

示例输出：

```text
workflow trace tests
- passed: lightBugfixSuccess (close)
- passed: fullFeatureSuccess (close)
- passed: verifyFailureThenRebuild (close)
- passed: gate2BlocksBuild (build)
- passed: resumeFromCheckpoint (build)
```

这些测试验证的是工作流行为，不替代目标项目自己的单元测试、集成测试或端到端测试。

## 流程重量

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `full` | 阶段全开 | 新项目、大功能、架构或跨模块改动 |
| `light` | 合并分析阶段 | 小功能、局部修复、配置和文档 |
| `auto` | AI 根据风险推荐 | 不确定任务规模时 |

## 与直接写代码的区别

| 直接让 AI 写代码 | 使用本工作流 |
|---|---|
| 直接修改代码 | 先理解目标和项目现状 |
| 所有任务同一重量 | 根据风险选择 `full` / `light` / `auto` |
| 容易跳过测试 | `verify` 是固定阶段 |
| 中断后依赖聊天记录 | 使用 checkpoint 恢复 |
| 完成标准依赖口头判断 | 使用验收标准和验证证据 |

## 目录结构

```text
.ai/
├── START.md                 # 启动入口与决策树
├── AGENT.core.md            # 核心运行规则
├── WORKFLOW.slim.md         # 核心流程地图
├── STATE.md                 # 热状态快照
├── STATE.schema.md          # 状态字段说明
├── TASKS.md                 # 当前任务与验收标准
├── workflow-machine.json    # 合法阶段转移
├── PROMPTS/
│   ├── bootstrap.md         # 启动路由
│   ├── _common.md           # 公共交互和结束契约
│   └── phase-cards/         # 唯一阶段主路径
├── examples/                # 标注后的行为样例
├── tests/
│   └── workflow-traces.mjs  # 核心流程轨迹测试
├── AGENT.md / WORKFLOW.md   # 详细参考规则与附录
└── check-consistency.mjs    # 一致性检查入口
```

## 进一步阅读

- [启动入口](.ai/START.md)
- [核心流程地图](.ai/WORKFLOW.slim.md)
- [轻量 Bug 修复示例](.ai/examples/light-bugfix.md)
- [完整升级示例](.ai/examples/full-upgrade.md)
- [流程轨迹测试](.ai/tests/workflow-traces.mjs)

## 核心文件职责

| 文件 | 作用 |
|------|------|
| `.ai/START.md` | 用户启动入口和启动路由 |
| `.ai/STATE.md` | 当前任务的热状态快照 |
| `.ai/TASKS.md` | 当前任务、范围和验收标准 |
| `.ai/workflow-machine.json` | 合法阶段转移和任务类型路由 |
| `.ai/PROMPTS/phase-cards/` | 各阶段的执行规则 |
| `.ai/check-consistency.mjs` | 文档、状态和行为一致性检查 |
| `.ai/tests/workflow-traces.mjs` | 核心流程轨迹测试 |

## 维护

修改工作流自身时，先同步核心运行规则和流程地图，再同步详细参考规则、状态 schema、阶段卡和示例，最后运行：

```bash
node .ai/check-consistency.mjs
```

详细维护约定见 `.ai/MAINTENANCE.md`。

## FAQ

### 必须使用完整流程吗？

不需要。小型 bug、局部 UI 修改、配置和文档任务可以使用 `light`；新项目、跨模块功能和架构改动通常使用 `full` 或 `auto`。

### `light` 会跳过验证吗？

不会。`light` 只合并分析阶段，`verify` 和 `close` 仍然保留。

### 支持哪些 AI 工具？

工作流本身不绑定具体产品。它优先使用宿主提供的原生选项能力，不具备时降级为文本选项，因此可以迁移到支持项目文件读取和代码修改的 AI 编程工具。

### 会修改目标项目根目录吗？

默认只需要复制 `.ai/` 目录。工作流状态、任务、决策和阶段记录都保存在 `.ai/` 中，业务代码仍由具体任务决定。

### 中断后如何继续？

发送：

```text
请按 .ai/START.md 继续
```

工作流会读取 checkpoint，恢复到上次安全暂停的阶段。

### 如何定制流程？

修改 `.ai/PROMPTS/phase-cards/`、`.ai/workflow-machine.json` 或核心规则后，运行：

```bash
node .ai/check-consistency.mjs
```

### 和普通 `AGENTS.md` 有什么区别？

`AGENTS.md` 通常描述项目约定；本工作流额外管理任务启动、阶段推进、风险确认、checkpoint、验证回退和收尾记录。两者可以同时使用。

