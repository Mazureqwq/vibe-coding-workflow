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

## ADR-007: 默认 quick-first 与减负不降门禁

- 日期：2026-07-28
- 状态：accepted
- 关联任务：T-000
- 关联：ADR-002、ADR-003、ADR-004、ADR-005、ADR-006

### 背景

工作流已具备双模式、Ready/高风险变更门禁、启动三分叉、语义化上下文读取范围与 core/slim。但实战仍有摩擦：

1. 清晰小任务也容易走满访谈，默认路径偏重
2. `STATE.md` 热状态快照仍偏吵，resume 与每轮读取成本偏高
3. 执行约束偏软，普通阶段摘要后易假结束
4. 上下文读取范围与决策门禁曾共用代号，任务 prompt 与 phase-card 双轨易漂

### 决策

采用 **Burden ↓ / Gates =（减负不降门禁）**：

1. **quick-first**：有 checkpoint → resume；清晰目标或“你推荐/快速启动” → `quick_boot`（默认）；目标模糊/高风险/逐项要求 → `full_bootstrap`
2. **推荐包**一次确认整包建议；低/中风险且非 `deep` 时允许与 Ready 合并；高风险或未决 Gate 2 必须拆分
3. **门禁保留**：Ready 前不写业务代码；Gate 2 不可 assume；light 可合并分析，不可跳过 verify/close
4. **weight 与 interaction_mode 解耦**：问多少不等于阶段全开
5. **STATE 只写值**；说明只在 schema
6. **phase_result 短契约 + 自动续跑**；仅 waiting_user/blocked/completed/tool_failure/output_limit 可停
7. **主路径唯一**：phase-card；任务 prompt 仅 addon；bootstrap 不写业务代码
8. **命名消歧**：上下文读取范围使用语义名称；决策级使用 Gate 0/1/2（assume/confirm/gate）
9. **light 映射**：分析可合并为 shape 输出；architecture 默认跳过，触发信号则插回；verify/close 保留
10. **可验证性**：examples + completed 快照校验逐步补强

### 选项与取舍

1. 维持完整访谈优先：稳但易弃用
2. 直接写码、取消门禁：快但回退原始 vibe coding
3. 只加长规则：token 升、遵守率未必升
4. **采纳** quick-first + 热瘦身 + 短契约 + 风险门禁

### 后果

- 正向：小任务 1 次推荐确认即可准备执行；高风险仍展开；与 ADR-003/004/005 兼容
- 负向：推荐质量成关键路径；Ready 合并需 risk 约束；需防 core/slim 与全文漂移
- 后续：Phase 1–4 见 CHANGELOG；checker 增加 completed 校验与热层启发式

---

## ADR-006: 核心运行规则使用 AGENT.core + WORKFLOW.slim

- 日期：2026-07-27
- 状态：accepted
- 关联任务：T-000

### 背景

上下文读取范围已规定核心运行规则，但仍易被实现成“打开完整 AGENT+WORKFLOW”，启动与多轮成本回弹。

### 决策

- 新增 `AGENT.core.md`、`WORKFLOW.slim.md` 作为默认核心运行规则
- 完整 `AGENT.md` / `WORKFLOW.md` 降为详细参考附录（大表、细协议、长文案）
- `START.md` / bootstrap / Step A 明确 core/slim 优先

### 后果

- 正向：核心规则体积可控，更利缓存命中
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
- 后续：可按宿主加一键 slash 命令指向 START.md；默认权重由 ADR-007 调整为 quick-first


## ADR-004: 上下文热冷分离与分级加载以降低 token / 缓存未命中

- 日期：2026-07-27
- 状态：accepted
- 关联任务：T-000

### 背景

强制每轮读取 AGENT+WORKFLOW+STATE+TASKS，且 STATE 混入大段说明书，导致多轮访谈规则 token 线性放大，并破坏 prompt cache 稳定性。

### 决策

1. `STATE.md` 仅保留热快照；说明外移 `STATE.schema.md`
2. 启动改为语义化上下文读取；禁止同阶段每轮全量重读冷规则
3. phase-card / 任务 prompt 去公共页眉，改引用 `PROMPTS/_common.md`
4. host 探测结果可复用；§7 大表等附录按需加载

### 选项与取舍

1. 继续全量必读：实现简单，成本高
2. 合并成单文件超长规则：不利于热更新缓存
3. 热冷分离 + 分级加载：可移植，省 token

### 后果

- 正向：恢复会话与同阶段多轮成本显著下降
- 负向：AI 需遵守加载层级，不能“无脑全读”
- 后续：已落为 ADR-006（AGENT.core + WORKFLOW.slim）；热层纯值由 ADR-007 加强；维护见 MAINTENANCE.md

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
3. 不把某一品牌的内部 API 写死为唯一路径
4. 将探测结果写入 `STATE.host`，供后续轮次复用

### 选项与取舍

1. 写死某产品 API：体验好，但不可移植
2. 永远纯文本 A/B/C：可移植，但浪费原生能力
3. **探测优先 + 文本降级**：可移植且尽量用上原生选项

### 后果

- 正向：同一套 `.ai` 可跨宿主
- 负向：需维护通道优先级与降级策略
- 后续：ADR-007 明确默认更快 ≠ 默认 assume 做 Gate 2

## ADR-001: 工作流以可复制 `.ai/` 包交付且项目无关

- 日期：2026-07-27
- 状态：accepted
- 关联任务：T-000

### 背景

需要一套可迁入任意仓库的 AI 开发工作流，不能污染宿主 README/AGENTS，也不能绑死业务栈。

### 决策

- 仅分发 `.ai/` 目录
- 状态、任务、决策、规范均落在 `.ai/`
- 不要求宿主根目录存在特定规则文件

### 后果

- 正向：接入成本低、可复制
- 负向：依赖用户/工具主动读取 `.ai/START.md`
