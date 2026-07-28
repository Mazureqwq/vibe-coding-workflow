# 架构决策记录（ADR）

> 记录“为什么这样选”。  
> 由 AI 在用户确认方案后写入，不要求用户先写 ADR。

---

## 规则

1. 最新决策追加在上方或按编号递增
2. 状态：`proposed` → `accepted` → `superseded` / `deprecated`
3. 被替代的决策不删除，只标记

---

## 模板

```markdown
## ADR-XXX: 标题

- 日期：YYYY-MM-DD
- 状态：proposed | accepted | superseded | deprecated
- 关联任务：T-XXX

### 背景
### 决策
### 选项与取舍
### 后果
```

---

## ADR-006: L1 使用 AGENT.core + WORKFLOW.slim 作为常驻冷规则

- 日期：2026-07-27
- 状态：accepted
- 关联任务：T-000

### 背景

分级加载已规定 L1，但 L1 仍易被实现成“打开完整 AGENT+WORKFLOW”，启动与多轮成本回弹。

### 决策

- 新增 `AGENT.core.md`、`WORKFLOW.slim.md` 作为默认 L1
- 完整 `AGENT.md` / `WORKFLOW.md` 降为 L3 附录（大表、细协议、长文案）
- `START.md` / bootstrap / Step A 明确 core/slim 优先

### 后果

- 正向：L1 体积可控，更利缓存命中
- 负向：需避免 core/slim 与全文长期漂移（改规则时先改 core/slim，再同步全文）


## ADR-005: 短入口 START + resume/quick_boot 启动分支

- 日期：2026-07-27
- 状态：accepted
- 关联任务：T-000

### 背景

即使用户接受工作流，启动仍常因“先读两大本 + 固定四轮访谈”而慢、贵。使用注意若只在聊天里提醒，下一轮模型又容易全量重读。

### 决策

1. 增加 `.ai/START.md` 作为推荐短入口
2. 将使用注意写入 `AGENT.md` §0.5，成为硬守则
3. 启动三分支：resume / quick_boot（推荐包）/ full_bootstrap
4. 推荐包一次确认是“一次一题”的合法例外：确认的是整包建议，不是多项并问

### 后果

- 正向：继续任务与目标清晰场景启动更快、更省 token
- 负向：quick_boot 若推荐不准，需 C 转逐项修改
- 后续：可按宿主加一键 slash 命令指向 START.md


## ADR-004: 上下文热冷分离与分级加载以降低 token / 缓存未命中

- 日期：2026-07-27
- 状态：accepted
- 关联任务：T-000

### 背景

强制每轮读取 AGENT+WORKFLOW+STATE+TASKS，且 STATE 混入大段说明书，导致多轮访谈规则 token 线性放大，并破坏 prompt cache 稳定性。

### 决策

1. `STATE.md` 仅保留热快照；说明外移 `STATE.schema.md`
2. 启动改为 L0–L3 分级加载；禁止同阶段每轮全量重读冷规则
3. phase-card / 任务 prompt 去公共页眉，改引用 `PROMPTS/_common.md`
4. host 探测结果可复用；§7 大表等附录按需加载

### 选项与取舍

1. 继续全量必读：实现简单，成本高
2. 合并成单文件超长规则：不利于热更新缓存
3. 热冷分离 + 分级加载：可移植，省 token

### 后果

- 正向：恢复会话与同阶段多轮成本显著下降
- 负向：AI 需遵守加载层级，不能“无脑全读”
- 后续：已落为 ADR-006（AGENT.core + WORKFLOW.slim）；维护见 MAINTENANCE.md

## ADR-003: 用大厂典型研发流驱动任务类型与流程重量路由

- 日期：2026-07-27
- 状态：accepted
- 关联任务：T-000

### 背景

仅提供 full/light 与抽象阶段名，AI 容易按“文档完整度”而不是“真实研发场景”选重量：小 bug 走过重，热修与根治混在一起，预研被当成正式交付。

### 决策

在 `WORKFLOW.md` §7 增加大厂典型流程对照表与推荐算法：

- 先识别典型流（功能迭代、热修、重构、平台、Spike、安全、基础设施等）
- 再映射 `task_type` + 默认 `process_weight` + 阶段侧重 + 门禁
- 允许用户改重量，但必须提示升级/降级风险
- 热修与根治默认分任务

### 选项与取舍

1. 只保留 feature/bugfix/refactor 粗类型：简单，但不够像真实研发
2. 引入完整公司制度（Scrum 仪式、变更单系统）：过重且绑组织
3. 保留轻量类型扩展 + 对照表路由：可执行、可移植

### 后果

- 正向：auto 推荐更稳；访谈时可一句话说清“这像哪种大厂流”
- 负向：类型枚举变多，需在 STATE/TASKS 同步
- 后续：phase-card 可按 workflow_pattern 增加检查项

## ADR-002: 宿主选择框能力探测优先于品牌绑定

- 日期：2026-07-27
- 状态：accepted
- 关联任务：T-000

### 背景

工作流需要“可点击选项”体验，但不同 AI 宿主能力不同：有的提供选择题工具，有的有模式门控，有的只有纯文本。若把某一产品的 API 写死，会破坏通用性。

### 决策

采用 **probe-first / capability-based adaptation**：

1. 每次会话启动静默探测本轮是否具备选择框/选项工具
2. 按能力选择通道：`native_tool` → `native_ui` → `text_abc` → `assume`
3. 能力与门控写入 `STATE.host`，问题呈现跟随通道
4. 不在通用规则中绑定某个宿主品牌的唯一实现

### 选项与取舍

1. 写死某宿主 API：体验最好但不可移植
2. 永远只用 A/B/C 文本：可移植但浪费原生 UI
3. 先探测再自适应：可移植，且在有能力时自动升级体验

### 后果

- 正向：一套 `.ai/` 可跨 Codex / Claude Code / Cursor 等使用
- 正向：有弹窗能力时自动用；无则稳定降级
- 负向：AI 需每会话维护 `STATE.host`
- 后续：可选增加 `.ai/adapters/*` 作为某宿主的“编译提示”，但不得成为总控硬依赖


## ADR-001: 采用交互式阶段门禁作为通用 Vibe Coding 工作流

- 日期：2026-07-26
- 状态：accepted
- 关联任务：T-000

### 背景

仅放置文档不足以约束大模型；空项目与已有项目需要不同流程，且用户不应手工维护长规范。

### 决策

采用：

- 双模式：greenfield / brownfield(hybrid)
- 阶段门禁 + phase-card
- 交互式确认后由 AI 回写 `.ai`
- 流程重量（full/light/auto）由用户交互选择

### 选项与取舍

1. 仅提供静态模板：轻，但约束弱
2. 固定完整大厂流程：规范，但小任务过重
3. 交互式双模式 + 可选流程重量：可通用，可收敛

### 后果

- 正向：可约束、可复用、低填写成本
- 负向：需要 AI 每轮维护 STATE
- 后续：所有任务先读 STATE/WORKFLOW
