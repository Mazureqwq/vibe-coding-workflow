# 工作流定义（双模式 + 可选流程重量 + 阶段门禁）

> 定义 Vibe Coding 的标准流程。  
> 只描述阶段、门禁、交互、路由；不绑定具体业务。
> 工作流自包含于 `.ai/`，不污染宿主项目根目录文件。

---

## 1. 启动时必须完成的判定

每次新任务开始，AI 按顺序交互确认（**一次只问一题**，优先可点击选项）：

0. **UI Language**：跟随用户当前语言（见 AGENT §0.1），并写入 STATE
1. **Mode**：`greenfield` / `brownfield` / `hybrid`
2. **Process Weight**：`full` / `light` / `auto`
3. **Task Type**：`feature` / `bugfix` / `refactor` / `review` / `chore` / `docs`

全部确认后写入 `STATE.md` 与 `TASKS.md`，再进入阶段。

### 1.2 顺序访谈与可点选

- 启动项（目标 / Mode / Weight / Type）**分多轮**完成，不合并成一张总问卷
- 每轮：1 个问题 + 2–3 个选项（推荐项第一）
- 宿主支持选项 UI 时必须弹出选项供点击；否则用 A/B/C 文本退化
- 全部齐备后，单独一题确认“是否开始执行”
- 未 Ready 前只更新 STATE/TASKS，不进入 build

### 1.1 交互语言适配

- 交互文案必须使用用户当前语言（见 `.ai/AGENT.md` §0.1）
- 选项、推荐、阶段说明、摘要确认都同语
- 用户中途切换语言则立即跟随
- 将 `ui_language` 写入 `STATE.md`
- 模板原文语言可以是中文/英文，但展示给用户时要翻译成用户语言


---

## 2. 流程重量（交互选择，不写死）

### 2.1 单题选项卡（仅流程重量这一轮使用；不要夹带其他问题）

```text
### 需要确认：流程重量
我的理解：这是一个 <简短任务判断>
选项：
A. full（完整大厂版）— 阶段全开，适合新项目/大功能/架构变更
B. light（轻量版）— 合并分析阶段，适合小改动/局部修复
C. auto（推荐）— 由我按风险推荐 full 或 light，你确认后再执行
请回复 A / B / C，或 C + 你的偏好。
```

### 2.2 映射

#### full

- greenfield：`discover → spec → architecture → plan → build → verify → close`
- brownfield/hybrid：`recon → align → impact → plan → build → verify → close`

#### light

- greenfield：`discover → plan → build → verify → close`  
  - `spec`/`architecture` 默认合并进 discover/plan  
  - 若发现架构风险，必须提示升级为 full 或补开 architecture
- brownfield/hybrid：`recon → plan → build → verify → close`  
  - `align`/`impact` 做轻量检查并写入结论  
  - 若文档冲突或影响面大，必须提示升级为 full

#### auto

AI 推荐规则（需展示理由并让用户确认）：

| 信号 | 推荐 |
|------|------|
| 空项目、新子系统、新技术选型 | full |
| 多模块改动、权限/数据/公共基础设施 | full |
| 单点 bug、文案、局部 UI、小配置 | light |
| 信息不足 | 先问 1 个关键问题，再推荐 |

`auto` 确认后，把 `resolved_as: full|light` 写入 STATE。

---

## 3. 双模式主链路

### Greenfield

```text
full:  discover → spec → architecture → plan → build → verify → close
light: discover → plan → build → verify → close
```

### Brownfield / Hybrid

```text
full:  recon → align → impact → plan → build → verify → close
light: recon → plan → build → verify → close
```

Hybrid 与 Brownfield 同链路；Align 更严格，更常出现 `update-first`。

---

## 4. 阶段总表

| Phase | 目标 | 允许 | 禁止 | Exit Criteria |
|------|------|------|------|---------------|
| `discover` | 定义问题与成功标准 | 提问、给选项、写 STATE/TASKS | 写业务代码 | 目标/范围/非目标/成功标准已确认 |
| `spec` | 形成可验收需求 | 场景拆解、优先级、边界 | 大规模实现 | 验收标准已确认 |
| `architecture` | 形成架构与约束 | 选型选项、模块边界、风险 | 借架构铺开业务代码 | 选型与边界已确认并落文档 |
| `recon` | 理解项目现实 | 扫仓库、总结结构/脚本/模块 | 先改代码再理解 | 项目理解简报已确认 |
| `align` | 决定规范效力 | 对比文档与代码、给效力选项 | 未对齐就开干 | 相关文档效力已确认 |
| `impact` | 评估改动影响 | 映射模块、风险、回归面 | 直接编码 | 影响范围与风险已确认 |
| `plan` | 形成可执行计划 | 任务切片、测试策略、风险 | 超计划实现 | 任务板与顺序已确认 |
| `build` | 按计划实现 | 改约定范围代码与测试 | 扩 scope、换栈 | 计划项完成且可验证 |
| `verify` | 证明其正确 | 跑检查、补测试、列回归 | 夹带新功能 | 验收通过或问题已记录 |
| `close` | 收尾与传承 | 回写文档、总结、下步建议 | 继续大改代码 | STATE/TASKS/CHANGELOG 已同步 |

---

## 5. 交互式落文档机制

> 交互语言跟随用户；结构化 key 可稳定英文，可读内容用用户语言。

所有“需要进入 `.ai` 的内容”都走：

```text
单题理解 → 可点选选项 → 用户选择 → AI 写入 → 下一题 / Ready 后执行
```

用户不手写长规范；用户只做选择与纠正。

| 文件 | 何时写 |
|------|--------|
| `STATE.md` | 模式/重量/阶段/效力变化 |
| `TASKS.md` | 任务确认、拆分、状态变化 |
| `ARCHITECTURE.md` | architecture 或 align 确认后 |
| `ENGINEERING.md` | 工程约定确认后 |
| `ROADMAP.md` | 中长期目标确认后 |
| `DECISIONS.md` | 重大取舍确认后 |
| `TECH_DEBT.md` | 发现债务且用户确认后 |
| `CHANGELOG.md` | close 或对外可见完成时 |

---

## 6. 文档效力

| 效力 | 含义 |
|------|------|
| `follow` | 严格遵循 |
| `update-first` | 先更新文档再改代码 |
| `code-as-source` | 本任务以代码为准 |
| `ignore-for-task` | 本任务不适用 |

light 流程也必须做最少效力声明（至少 ENGINEERING/ARCHITECTURE/TASKS）。

---

## 7. 任务类型路由

| 类型 | 默认建议重量 | 备注 |
|------|--------------|------|
| 新项目/大功能 | full | 可被用户改成 light，但要提示风险 |
| 小功能 | light 或 auto | 涉及公共层时转 full |
| bugfix | light 或 auto | 系统级缺陷转 full |
| refactor | full 或 auto | 行为不变也要 impact/verify |
| review | light | 不进入 build |
| chore/docs | light | 有流程/规范变更时走 close 回写 |

任何跳过阶段必须写入 `STATE.skipped_phases` 并确认。

---

## 8. 阶段推进与回退

### 推进

1. 检查 Exit Criteria
2. 询问是否进入下一阶段
3. 更新 STATE
4. 加载下一 phase-card

### 回退

| 情况 | 回退到 |
|------|--------|
| 需求冲突 | `spec` 或 `discover` / `impact` |
| 架构假设被推翻 | `architecture` 或 `align` |
| 验证失败 | `verify` 或 `build` |
| 范围蔓延 | `plan` |
| 文档严重冲突 | `align` |
| 发现重量选轻了 | 询问是否升级 `process_weight` |

---

## 9. 与 PROMPTS 的关系

```text
用户需求
  → 任务 prompt（bootstrap/new-feature/...）
    → 判定 mode + process_weight + task_type
      → phase-card
        → 交互 / 执行
          → 回写 STATE/TASKS/...
```

- 任务级入口：`.ai/PROMPTS/*.md`
- 阶段级门禁：`.ai/PROMPTS/phase-cards/*.md`

