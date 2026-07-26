# .ai 工作流包

通用、可交互、可约束大模型的工程协作工作流。  
**只依赖本目录**，不占用项目根目录的 `README.md` / `AGENTS.md`。

## 设计目标

- 空项目：按正式交付链路推进，而不是直接堆代码
- 已有项目：先理解与对齐，再最小改动落地
- 用户不写长文档：AI 给选项，用户做选择，AI 写入 `.ai/`
- 流程重量可交互：`full` / `light` / `auto`
- 交互语言跟随用户

## 接入项目

1. 只复制整个 `.ai/` 目录到目标仓库根目录
2. 不要覆盖目标项目自己的 `README.md`
3. 对 AI 说：

```text
请按 .ai/AGENT.md 与 .ai/WORKFLOW.md 启动工作流。
先识别我的语言，再做 Mode 与流程重量选择；确认前不要写业务代码。
```

## 目录

```text
.ai/
├── README.md                # 本说明（工作流包内）
├── AGENT.md                 # 总控规则
├── WORKFLOW.md              # 双模式 + 流程重量 + 门禁
├── STATE.md                 # 当前模式/重量/阶段/文档效力
├── ENGINEERING.md           # 通用工程约束
├── ARCHITECTURE.md          # 架构真相源模板
├── ROADMAP.md               # 长期规划模板
├── TASKS.md                 # 当前任务
├── DECISIONS.md             # ADR
├── TECH_DEBT.md             # 技术债
├── CHANGELOG.md             # 开发日志
└── PROMPTS/
    ├── bootstrap.md
    ├── recon.md
    ├── new-feature.md
    ├── refactor.md
    ├── bugfix.md
    ├── review.md
    └── phase-cards/
```

## 启动判定

AI 启动时按顺序**逐题**确认：

0. UI Language（跟随用户）
1. Mode：`greenfield` / `brownfield` / `hybrid`
2. Process Weight：`full` / `light` / `auto`
3. Task Type：`feature` / `bugfix` / `refactor` / ...

## 流程重量

| 选项 | 含义 |
|------|------|
| `full` | 完整大厂版，阶段全开 |
| `light` | 轻量版，合并分析阶段 |
| `auto` | AI 推荐 full 或 light，你确认 |

### full

- greenfield：`discover → spec → architecture → plan → build → verify → close`
- brownfield：`recon → align → impact → plan → build → verify → close`

### light

- greenfield：`discover → plan → build → verify → close`
- brownfield：`recon → plan → build → verify → close`

## 顺序访谈（重要）

大模型必须：

1. **依次提问**（每轮只 1 个关键问题）
2. **给出可点选选项**（宿主支持则弹选项框；否则 A/B/C）
3. 把答案写入 `.ai/STATE.md`
4. **信息足够并经你确认后**，才开始执行任务

不要期望一次回复里塞 Mode + Weight + 类型 + 目标。

## 交互原则

```text
单题提问 → 可点选选项 → 你选择 → AI 写入 .ai → 下一题 → Ready 后执行
```

## 与宿主项目边界

- 本目录是工作流包，不替代项目 README
- 根目录不要求也不依赖 `AGENTS.md`
- 若宿主工具只认根目录规则文件，可自行做极薄转发；默认不创建
- 所有状态与约束回写都落在 `.ai/` 内