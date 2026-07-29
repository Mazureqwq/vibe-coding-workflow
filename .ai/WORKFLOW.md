# 工作流定义（双模式 + 可选流程重量 + 阶段门禁）

> 日常默认读 `WORKFLOW.slim.md`；本文件作完整地图、大表和详细参考附录。

> 定义 Vibe Coding 的标准流程。  
> 只描述阶段、门禁、交互、路由；不绑定具体业务。
> 工作流自包含于 `.ai/`，不污染宿主项目根目录文件。

---

## 1. 启动时必须完成的判定

### 1.0 启动入口与使用注意

- **推荐入口**：`.ai/START.md`（短） > bootstrap prompt > `AGENT.core.md` + `WORKFLOW.slim.md` > 完整 AGENT/WORKFLOW 全文
- **使用注意**（硬）：先读热状态快照；核心规则用 core/slim；STATE 只写值；同阶段不全量重读；一阶段一张卡；完整大表按需读取
- **启动分支（quick-first）**：`resume` | `quick_boot`（默认优先） | `full_bootstrap`（见 AGENT Step F / ADR-007）
- 用户只说“继续”且有 checkpoint → 不得重新访谈
- 用户给目标并接受推荐 → 优先推荐包一次确认，再 Ready


每次新任务开始，AI 先静默记录交互语言，再按顺序交互确认（**一次只问一题**，优先可点击选项）：

1. **Mode**：`greenfield` / `brownfield` / `hybrid`
2. **Process Weight**：`full` / `light` / `auto`
3. **Task Type**：`feature` / `bugfix` / `hotfix` / `refactor` / `platform` / `spike` / `infra` / `security` / `review` / `chore` / `docs`
4. **Interaction Mode**：由 AI 按风险静默推荐 `low_touch` / `standard` / `deep`，用户可覆盖，不额外增加必答轮次

交互语言只作为会话元数据静默写入，不占用访谈题；其余判定完成后写入 `STATE.md` 与 `TASKS.md`，再进入阶段。

### 1.1 顺序访谈与可点选

- 上下文按语义范围读取（见 `.ai/AGENT.md` Step A / §0.4）；热数据用短 `STATE.md`，字段说明见 `STATE.schema.md`
- 启动时先**静默探测宿主选择框能力**，写入 `STATE.host`（见 `.ai/AGENT.md` §0.3）
- 启动项（目标 / Mode / Weight / Type）**分多轮**完成，不合并成一张总问卷
- 每轮：1 个问题 + 2–3 个选项（推荐项第一）
- 按探测结果选择通道：`native_tool` / `native_ui` / `text_abc` / `assume`
- 有原生选项能力时必须用可点击选项；否则文本 A/B/C 或低风险 assume
- 能力若有模式门控：决策轮尽量满足；无法满足则降级，不假装已弹框
- 全部齐备后，单独一题确认“是否开始执行”
- 未 Ready 前只更新 STATE/TASKS，不进入 build

### 1.2 交互语言适配

- 交互文案必须使用用户当前语言（见 `.ai/AGENT.md` §0.1）
- 选项、推荐、阶段说明、摘要确认都同语
- 用户中途切换语言则立即跟随
- 将 `ui_language` 写入 `STATE.md`
- 模板原文语言可以是中文/英文，但展示给用户时要翻译成用户语言

### 1.3 宿主能力自适应

- 不绑定 Codex / Claude / Cursor 等具体产品；只绑定“能力 → 通道”
- 探测信号：本轮 tools、系统说明、模式约束、是否能渲染可点选项
- 有选择题工具/UI：把工作流问题编译为宿主 schema 并调用
- 无能力：`text_abc`；仅对低风险、已明确的信息可 `assume` 并标记 `inferred`
- 每会话重新校正 `STATE.host`；历史结果仅作参考
- 详细协议：`.ai/AGENT.md` §0.3


---

## 2. 流程重量（交互选择，不写死）

### 2.1 单题选项卡（仅流程重量这一轮使用；不要夹带其他问题）

> 呈现方式跟随 STATE.host.choice_ui.channel：能弹框就弹框，否则用下列 A/B/C 文本。

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

分析阶段可合并为短 **shape** 输出；**verify 与 close 不可跳过、不可合并掉**。触发架构/公共层/安全/数据风险时必须暂停升级或插回阶段。

- greenfield：`discover → plan → build → verify → close`  
  - `spec`/`architecture` 默认合并进 discover/plan  
  - 若发现架构风险，必须提示升级为 full 或补开 architecture
- brownfield/hybrid：`recon → plan → build → verify → close`  
  - `align`/`impact` 做轻量检查并写入结论  
  - 若文档冲突或影响面大，必须提示升级为 full

#### auto

AI 推荐规则（需展示理由并让用户确认；完整对照见 §7.2 / §7.3）：

| 信号 | 推荐 |
|------|------|
| 空项目、新子系统、新技术选型、平台底座 | full |
| 多模块改动、权限/数据/公共基础设施、安全合规 | full |
| 重构/升级且影响面不清 | full 或先 focused recon 再定 |
| 单点 bug、文案、局部 UI、小配置、纯文档 | light |
| 预研/Spike（时间盒） | light（交付结论） |
| 线上热修 | light 止血；根治另开任务 |
| 信息不足 | 先问 1 个关键问题，再推荐 |

`auto` 确认后，把 `resolved_as: full|light` 写入 STATE，并可记录 `workflow_pattern`。

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
| `review` | 输出审查结论 | 检查代码/方案、记录风险 | 进入 build | 生成 validation_result |

---

### 4.1 合法阶段转移

阶段转移的唯一来源是 `.ai/workflow-machine.json`，以下为生成后的摘要；回退必须记录原因并更新 checkpoint：

```yaml
unstarted: [discover, recon]
discover: [spec, plan]
spec: [architecture]
architecture: [plan]
recon: [align, plan, review]
align: [impact, review]
impact: [plan]
plan: [build, verify, close]
build: [verify]
review: [close]
verify: [build, close]
close: []
```

`close` 的唯一前置条件是 `validation_result.status=passed|accepted`，不再强制所有任务都经过名为 `verify` 的阶段。
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

> 路由依据：**大厂真实研发流 → 任务类型 → 默认重量 → 阶段路径**。  
> 用户仍可改重量；AI 只给推荐与风险，不写死。

### 7.1 类型速查

| 类型 | 默认建议重量 | 备注 |
|------|--------------|------|
| 新项目/大功能 `feature` | full | 可被用户改成 light，但要提示风险 |
| 小功能 `feature` | light 或 auto | 涉及公共层时转 full |
| `bugfix` / `hotfix` | light 或 auto | 系统级/数据/权限缺陷转 full；线上事故先止血 |
| `refactor` | full 或 auto | 行为不变也要 impact/verify |
| `platform` | full 或 auto | 组件库/中台/BFF/微前端底座等，强调边界与接入 |
| `spike` | light | 时间盒预研；交付结论，默认不进大范围 build |
| `infra` / 变更发布 | light 或 full | 低风险配置 light；涉及发布链路/权限/数据 full |
| `security` | full 或 auto | 漏洞/合规；按风险时限推进，verify 必做 |
| `review` | light | 不进入 build |
| `chore` / `docs` | light | 有流程/规范变更时走 close 回写 |

任何跳过阶段必须写入 `STATE.skipped_phases` 并确认。

### 7.2 大厂典型流程对照表

> 用途：识别用户意图后，先映射到「典型流」，再推荐 `task_type` + `process_weight` + 阶段侧重。  
> 对照的是业界常见做法，不绑定某家公司的制度名称。

| 大厂典型流 | 信号（用户怎么说/现场像什么） | 建议 type | 默认重量 | 阶段侧重 | 关键门禁 |
|------------|--------------------------------|-----------|----------|----------|----------|
| 功能迭代交付 | 新功能、版本需求、业务迭代、“做个 XX” | `feature` | 大=full；小=light/auto | full：discover/spec/architecture/plan…<br>light：discover/recon→plan→build→verify | Ready 后才 build；公共层/数据/权限改动升级 full |
| Bug / 缺陷修复 | 报错、复现、测试打回、偶现问题 | `bugfix` | light/auto | recon/impact（轻）→plan→build→verify→close | 先复现与影响面；禁止无根因乱改 |
| 线上事故 / 热修 | 生产故障、P0/P1、先恢复再复盘 | `hotfix` | light（止血）→ 必要时追加 full 复盘任务 | 最小 build→verify→close；复盘可另开任务 | 先止血与回滚；根治与防回归分开 |
| 重构 / 架构演进 | 升级框架、拆模块、治理坏味道、性能重构 | `refactor` | full/auto | recon→align→impact→architecture?/plan→build→verify | 要有基线与迁移策略；双轨/开关/分批优先于大爆炸 |
| 平台 / 中台能力 | 组件库、脚手架、权限中心、BFF、微前端底座 | `platform` | full/auto | discover/spec→architecture→plan→build→verify→close | 先定边界/API/兼容与接入成本；试点再推广 |
| 预研 / Spike | 可行性、选型对比、摸底、时间盒试验 | `spike` | light | discover→plan→（可选 build）→verify→close | verify 写入 `kind=spike_result`；交付 Go/No-Go 结论与代价 |
| 基础设施 / 发布变更 | CI/CD、扩容、配置、监控、路由、环境 | `infra` | 低风险 light；高风险 full | plan→（build）→verify→close | verify 可执行变更检查清单并写入 `kind=change_checklist` |
| 安全 / 合规 | 漏洞、CVE、越权、隐私、合规整改 | `security` | full/auto | impact→plan→build→verify→close | 按风险时限；临时缓解与正式修复都要记录 |
| 跨团队大型项目 | 多团队依赖、里程碑、年中/战略项目 | `feature`/`platform` | full | 完整链路 + 里程碑化 plan | 接口冻结、集成窗口、分阶段上线；STATE 记里程碑 |
| 日常小迭代 | 文案、小 UI、局部配置、文档 | `chore`/`docs`/`feature` | light | plan→build→verify→close | 影响出本模块则升级；规范变更要 close 回写 |
| Code Review | 只审 PR/方案，不开发 | `review` | light | recon/align 轻量 → review → close | review 结论写入 `kind=review` 的 validation_result；不进入 build |

### 7.3 推荐算法（auto 与默认提示用）

按顺序匹配，**先命中先应用**；展示给用户时用一句话说明命中了哪条：

1. **事故热修**：生产不可用 / 明确 P0 → `hotfix` + light（止血），并提示后续复盘任务  
2. **安全合规**：漏洞/越权/敏感数据 → `security` + full/auto  
3. **预研**：“可行性/对比/摸底/两天验证” → `spike` + light  
4. **重构演进**：无行为变更的结构/性能/升级 → `refactor` + full/auto  
5. **平台能力**：多业务复用、SDK/底座/中台 → `platform` + full/auto  
6. **基础变更**：发布、CI、配置、环境、监控 → `infra`；触达权限/数据/全局流量则 full  
7. **缺陷**：有预期但行为错误 → `bugfix`；影响公共层/数据模型则升级 full  
8. **纯评审** → `review` + light  
9. **文档/杂项** → `docs`/`chore` + light  
10. **其余交付** → `feature`；空项目/多模块/公共层/数据权限 → full，否则 light/auto

### 7.4 升级与降级触发

**必须提示升级 full（或补开阶段）**

- 改到公共库、鉴权、支付、数据模型、对外 API 契约  
- light 进行中发现跨模块影响或文档严重冲突  
- 需要新架构/新技术选型  
- 安全风险或无法快速回滚  

**可建议保持 light**

- 单文件/单组件、纯展示、文案、文档  
- 已有清晰复现的局部 bug  
- spike 仅验证结论  

**热修特例**

```text
hotfix（最小修复）→ verify → close
另开任务：postmortem / 根治（bugfix 或 refactor，常 full）
```

不要把“根治重构”塞进同一热修任务，除非用户明确要求且接受风险。

### 7.5 写入 STATE / TASKS

确认类型与重量后写入：

```yaml
task_type: feature | bugfix | hotfix | refactor | platform | spike | infra | security | review | chore | docs
interaction_mode: low_touch | standard | deep | auto
architecture_depth: minimum | standard | deep | auto
validation_result.status: pending | passed | accepted | failed
process_weight: full | light | auto
process_weight_decision.resolved_as: full | light   # auto 时必填
# 可选：
# workflow_pattern: feature_delivery | bugfix | hotfix | refactor | platform | spike | infra | security | review | chore
```

阶段跳过、合并、升级理由写入 `skipped_phases` 或 `phases.*.notes`。

---

## 8. 阶段推进与回退

### 推进

1. 检查 Exit Criteria
2. 更新 STATE/TASKS，并写入 checkpoint
3. 普通阶段自动展示摘要并加载下一 phase-card
4. 进入 `build`、升级 `full`、修改架构/公共契约、接受风险或进入 `close` 归档时，单独等待用户确认

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

## 8.1 渐进式 Recon

已有项目不默认做无限深度的全仓库梳理。按任务风险分层：

| 层级 | 读取范围 | 进入条件 |
|------|----------|----------|
| `quick` | 技术栈、入口、脚本、相关目录、验证命令 | 所有 brownfield 任务默认先做 |
| `focused` | 相关模块、依赖链、测试、配置与历史决策 | 任务影响超过单文件时 |
| `deep` | 跨模块架构、运行链路、部署/CI、风险盘点 | 公共层、架构、数据/权限或用户选择 |

先输出 quick summary，再给用户选择：

- 继续 focused/deep
- 使用当前理解进入下一阶段
- 发现风险后升级流程重量

### 8.2 阶段切换策略

- 普通阶段完成后，更新 checkpoint、加载下一张 phase-card 并继续执行；不因摘要输出而结束本轮。只有进入 build、升级 full、修改架构/公共契约、接受风险、真实阻塞或输出限制时才停止。
- 进入 `build`、升级 `full`、修改架构/公共契约或接受风险时，单独弹确认；真实阻塞和输出限制直接保存 checkpoint 并停止
- 用户说“继续/按计划执行”时，视为对当前计划内下一步的授权
- 用户未授权或表达不确定时，停在 `wait_confirmation`

### 8.3 用户控制指令

AI 应识别这些意图：`查看进度`、`修改答案`、`返回上一阶段`、`暂停`、`继续`、`重新开始`、`只记录不执行`。

执行前先更新 `STATE.checkpoint`，恢复时从 checkpoint 继续，不重置已确认内容。

### 8.4 停止原因

每次非完成态停止都必须写入 `STATE.stop_reason`：

- `waiting_user`：等待 Gate 2 门禁或用户补充
- `blocked`：真实阻塞且无法自行解除
- `tool_failure`：工具失败且无法恢复
- `output_limit`：输出或上下文即将耗尽，已保存 checkpoint
- `completed`：已完成验证并完成 close

没有 `stop_reason` 不得声称暂停、完成或等待用户。

## 9. 与 PROMPTS 的关系

公共交互与加载约定见 `.ai/PROMPTS/_common.md`；phase-card 只保留阶段差异，避免重复页眉消耗 token。

```text
用户需求 / START
  → bootstrap（仅启动，不写业务代码）
    → 判定 mode + process_weight + task_type（推荐包或逐项）
      → phase-card（唯一阶段主路径）
        → 可选任务 prompt addon（bugfix/new-feature/...）
          → 交互 / 执行
            → 回写 STATE/TASKS/...
```

- 启动入口：`.ai/START.md` + `.ai/PROMPTS/bootstrap.md`
- 阶段主路径：`.ai/PROMPTS/phase-cards/*.md`
- 任务类型 addon：`.ai/PROMPTS/*.md`（不可替代 phase-card）

