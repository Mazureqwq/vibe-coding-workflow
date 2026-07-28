# Vibe Coding Workflow

一个通用、可交互、项目无关的 AI 软件开发工作流。

它帮助大模型在开始写代码前，先理解项目和需求，通过顺序访谈或推荐包收集必要信息，再根据风险选择合适的开发流程，并在阶段门禁通过后执行任务。

> 工作流本身只需要复制 `.ai/` 目录，不会覆盖目标项目原有的 `README.md`、`AGENTS.md` 或其他根目录文件。  
> 当前策略：**ADR-007 quick-first / 减负不降门禁**。

## 30 秒上手

复制 `.ai/` 到项目根目录，在 AI 工具中粘贴：

```text
请按 .ai/START.md 快速启动。
目标：{{一句话目标}}
你推荐，我确认
```

继续上次：

```text
请按 .ai/START.md 继续
```

## 5 分钟理解

默认路径（大多数任务）：

```text
清晰目标 → quick_boot 推荐包（可与 Ready 合并）→ phase-card 推进 → verify → close
```

你通常只需关心 5 件事：目标、新项目/已有项目、完整/轻量、当前阶段、是否开始执行。

硬门禁（不降）：

- Ready 前不写业务代码（低风险可与推荐包合并确认）
- 高风险 Gate 2 必须单独确认
- light 可合并分析，不可跳过 verify/close
- 普通阶段自动续跑，阶段摘要 ≠ 任务结束

建议阅读：`.ai/START.md` → `.ai/AGENT.core.md` → `.ai/WORKFLOW.slim.md`

## 为什么需要它

直接让 AI “实现一个功能”通常会带来：

- 没有充分理解已有项目就开始改代码
- 需求、范围和验收标准不明确
- 复杂任务和简单任务同一重量
- 忽略架构、规范或历史决策
- 缺少测试、回归和文档收尾

## 核心特性

- **quick-first 启动**：resume / 推荐包默认 / 逐项访谈
- **顺序访谈**：每轮一题；推荐包是合法整包确认
- **Ready 门禁**：确认后才执行；低风险可合并，高风险必拆分
- **双项目模式**：greenfield / brownfield / hybrid
- **可选流程重量**：full / light / auto
- **交互档位**：low_touch / standard / deep（与重量解耦）
- **阶段化 + 自动续跑**：phase-card 主路径 + phase_result 契约
- **状态持久化**：`.ai/STATE.md` + `.ai/TASKS.md`
- **上下文分级**：Load L0–L3；决策门禁 Gate 0/1/2
- **宿主自适应**：native 选项优先，文本降级
- **项目无关**：不绑定业务、框架、语言或某一 AI 产品

## 项目模式

### Greenfield
`discover → spec → architecture → plan → build → verify → close`

### Brownfield / Hybrid
`recon → align → impact → plan → build → verify → close`

light 会合并分析阶段为短 shape，但 **verify/close 保留**。

## 流程重量

| 模式 | 说明 | 适用 |
|------|------|------|
| `full` | 阶段全开 | 新项目、大功能、架构/跨模块 |
| `light` | 合并分析 | 小功能、局部修复、配置/文档 |
| `auto` | AI 推荐 | 不确定时 |

## 目录

```text
.ai/
├── START.md                 # 启动入口
├── AGENT.core.md            # L1 常驻总控
├── WORKFLOW.slim.md         # L1 流程地图
├── STATE.md                 # 热快照（只写值）
├── TASKS.md
├── workflow-machine.json
├── PROMPTS/
│   ├── bootstrap.md
│   ├── _common.md
│   ├── phase-cards/         # 唯一阶段主路径
│   └── *.md                 # 任务类型 addon
├── examples/                # 标注轨迹（非必读）
├── AGENT.md / WORKFLOW.md   # L3 附录
└── check-consistency.mjs
```

## 维护者

完整规则、大表、ADR、一致性校验：

- `.ai/AGENT.md` / `.ai/WORKFLOW.md`
- `.ai/DECISIONS.md`（含 ADR-007）
- `.ai/MAINTENANCE.md`
- `node .ai/check-consistency.mjs`

## 样例

- `.ai/examples/light-bugfix.md` — 1 次确认跑通
- `.ai/examples/full-upgrade.md` — 推荐后升级 full/deep