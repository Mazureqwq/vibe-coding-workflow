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