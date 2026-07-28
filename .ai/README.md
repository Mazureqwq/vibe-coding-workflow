# .ai 工作流包

通用、可交互、可约束大模型的工程协作工作流。  
**只依赖本目录**，不占用项目根目录的 `README.md` / `AGENTS.md`。

## 设计目标

- 空项目：按正式交付链路推进，而不是直接堆代码
- 已有项目：先理解与对齐，再最小改动落地
- 用户不写长文档：AI 给选项，用户做选择，AI 写入 `.ai/`
- 流程重量可交互：`full` / `light` / `auto`
- 交互语言跟随用户
- 先探测宿主选择框能力，再自适应弹窗或文本降级
- 上下文 L0–L3 分级加载；STATE 热冷分离以利缓存

## 接入项目

1. 只复制整个 `.ai/` 目录到目标仓库根目录
2. 不要覆盖目标项目自己的 `README.md`
3. 对 AI 说（推荐）：

```text
请按 .ai/START.md 启动工作流。
目标：{{一句话}}
```

继续上次：`请按 .ai/START.md 继续`  
更快：`请按 .ai/START.md 快速启动。目标：... 你推荐我确认`

### 使用注意（AI 必须遵守）

- 先读 `STATE.md` 热快照（L0）；L1 用 `AGENT.core.md` + `WORKFLOW.slim.md`，不要每轮全量重读完整全文
- 只把值写入 `STATE.md`；说明见 `STATE.schema.md`
- 同时只加载 1 张 phase-card；附录按需
- 启动分支：resume / quick_boot / full_bootstrap

## 目录

```text
.ai/
├── START.md                 # 推荐启动入口（短）
├── README.md                # 本说明（工作流包内）
├── AGENT.core.md            # L1 常驻总控
├── AGENT.md                 # 完整总控附录
├── WORKFLOW.slim.md         # L1 流程地图
├── WORKFLOW.md              # 完整流程/大表附录
├── STATE.md                 # 热快照（短 YAML）
├── STATE.schema.md          # STATE 字段冷说明（按需）
├── ENGINEERING.md           # 通用工程约束
├── ARCHITECTURE.md          # 架构真相源模板
├── ROADMAP.md               # 长期规划模板
├── TASKS.md                 # 当前任务
├── DECISIONS.md             # ADR
├── TECH_DEBT.md             # 技术债
├── MAINTENANCE.md           # 改工作流时的同步约定
├── CHANGELOG.md             # 开发日志
└── PROMPTS/
    ├── _common.md
    ├── bootstrap.md
    ├── recon.md
    ├── new-feature.md
    ├── refactor.md
    ├── bugfix.md
    ├── review.md
    └── phase-cards/
```

## 启动判定

AI 启动时先静默完成，再按顺序**逐题**确认：

0. UI Language（跟随用户，静默）
0.1 Host choice UI 探测 → 选择 `native_tool` / `native_ui` / `text_abc` / `assume`（静默）
0.2 启动分支：resume / quick_boot / full_bootstrap
1. Mode：`greenfield` / `brownfield` / `hybrid`
2. Process Weight：`full` / `light` / `auto`
3. Task Type：`feature` / `bugfix` / `refactor` / ...

## 流程重量

| 选项 | 含义 |
|------|------|
| `full` | 完整大厂版，阶段全开 |
| `light` | 轻量版，合并分析阶段 |
| `auto` | AI 推荐 full 或 light，你确认 |

任务类型与重量对照「大厂典型研发流」路由，见 `WORKFLOW.md` §7（功能迭代 / 热修 / 重构 / 平台 / Spike / 安全 / 基础设施等）。

### full

- greenfield：`discover → spec → architecture → plan → build → verify → close`
- brownfield：`recon → align → impact → plan → build → verify → close`

### light

- greenfield：`discover → plan → build → verify → close`
- brownfield：`recon → plan → build → verify → close`

## 顺序访谈（重要）

大模型必须：

1. **依次提问**（每轮只 1 个关键问题）
2. **先按本轮宿主能力选通道，再给出选项**（能弹框则弹；否则 A/B/C 或低风险 assume）
3. 把答案写入 `.ai/STATE.md`
4. **信息足够并经你确认后**，才开始执行任务

不要期望一次回复里塞 Mode + Weight + 类型 + 目标。

## 体验约定

- 语言识别与宿主能力探测静默完成，不占访谈题
- 每轮只问一个关键问题；通道由 `STATE.host.choice_ui` 决定
- 普通阶段按计划自动衔接，高风险动作才单独确认
- 支持查看进度、修改答案、暂停、继续和返回阶段

## 交互原则

```text
探测宿主能力 → 单题提问 → 按通道呈现选项 → 你选择 → AI 写入 .ai → 下一题 → Ready 后执行
```

## 与宿主项目边界

- 本目录是工作流包，不替代项目 README
- 根目录不要求也不依赖 `AGENTS.md`
- 若宿主工具只认根目录规则文件，可自行做极薄转发；默认不创建
- 所有状态与约束回写都落在 `.ai/` 内