# 2026-07-28

### Added
- ADR-007：默认 quick-first 与减负不降门禁（accepted）
- `risk_level`、`phase_result.evidence`、Gate 0/1/2 命名
- `.ai/examples/light-bugfix.md` 与 `full-upgrade.md` 标注轨迹
- checker：completed 快照门禁、热层注释启发式、examples/addon 检查

### Changed
- 启动默认权重改为 quick-first；推荐包低/中风险可与 Ready 合并
- `STATE.md` 去注释纯值；`workflow_version: 3`
- light 分析合并为 shape；verify/close 明确不可跳过
- 任务 prompt 标注为 addon；phase-card 统一结束契约
- README 改为 30 秒 / 5 分钟 / 维护者 三层阅读

### Fixed
- `ENGINEERING.md` 2.7 安全基线与 2.8 架构段落错位

# 开发日志（Changelog）

> 记录别人需要知道的变化。  
> 由 AI 在 close 或完成对外可见改动时写入。

---

## 格式

```markdown
## YYYY-MM-DD

### Added
### Changed
- 交互升级为顺序访谈：一次一题、优先可点选、Ready 后才执行
- 交互语言跟随用户，并写入 `STATE.ui_language`
### Fixed
### Removed
### Docs / Chore
```

---

## 规则

- 用结果语言，不写无意义的 update
- 破坏性变更标注 `BREAKING`
- 关联任务 ID
- 不记录敏感信息

---

## 2026-07-27

### Added

- 宿主能力探测与自适应交互协议（`AGENT.md` §0.3）
  - 通道：`native_tool` / `native_ui` / `text_abc` / `assume`
  - 决策级别：已明确事实 / 常规选择 / 高风险门禁
- `STATE.host`：记录本轮选择框能力、门控与适配状态
- ADR-002：能力探测优先于品牌绑定
- 大厂典型流程对照表与任务路由（`WORKFLOW.md` §7）
  - 扩展类型：`hotfix` / `platform` / `spike` / `infra` / `security`
  - `workflow_pattern` 写入 STATE/TASKS
  - ADR-003：用典型研发流驱动类型与重量
- 上下文预算优化（token / cache）
  - STATE.md 热冷分离 + STATE.schema.md
  - AGENT Step A：热状态快照、核心运行规则、当前阶段卡、详细参考规则
  - PROMPTS/_common.md；phase-card 去公共 Interaction Rule
  - ADR-004：热冷分离与分级加载
- `.ai/START.md` 短启动入口
- 使用注意写入 AGENT §0.5；启动三分支 resume/quick_boot/full_bootstrap
- ADR-005：短入口 + 推荐包启动
- `AGENT.core.md` + `WORKFLOW.slim.md` 作为默认核心运行规则
- ADR-006：core/slim 优先于完整全文- `MAINTENANCE.md`：core/slim 与全文防漂移同步顺序
- `check-consistency.mjs`：入口/分层一致性自检

### Changed

- 启动协议：抛出决策题前必须先探测/校正宿主选择能力
- `WORKFLOW` / `bootstrap` / README：由“优先可点选”升级为“先探测再自适应”
- uto 推荐规则对齐大厂场景（热修、预研、安全、平台等）
- 启动/提示词改为分级加载，避免每轮全量重读冷规则

### Fixed
### Removed
### Docs / Chore

---
## 2026-07-26

### Added

- 初始化通用交互式 Vibe Coding 工作流
  - 总控：`AGENT.md` / `WORKFLOW.md` / `STATE.md`
  - 文档：`ENGINEERING` `ARCHITECTURE` `ROADMAP` `TASKS` `DECISIONS` `TECH_DEBT` `CHANGELOG`
  - 任务提示词 + 阶段卡 `PROMPTS/`

### Changed

- 交互升级为顺序访谈：一次一题、优先可点选、Ready 后才执行
- 交互语言跟随用户，并写入 `STATE.ui_language`
- 收拢根目录入口：说明并入 `.ai/README.md`，默认不再占用宿主项目 README/AGENTS
- 流程重量改为交互选择：`full` / `light` / `auto`
- `.ai` 文档改为“AI 交互写入，用户选择确认”
