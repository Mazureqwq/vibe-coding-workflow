# MAINTENANCE（工作流维护约定）

> 给人看，也给 AI 在“改工作流本身”时按需读（L3）。  
> 日常任务启动**不必**读本文件。

## 文件分层

| 层 | 文件 | 职责 |
|----|------|------|
| 入口 | `START.md` | 用户/AI 最短启动 |
| 热 | `STATE.md` / `TASKS.md` | 仅当前值 |
| L1 冷 | `AGENT.core.md` / `WORKFLOW.slim.md` | 常驻规则与地图 |
| L3 附录 | `AGENT.md` / `WORKFLOW.md` / schema / ADR… | 细协议与大表 |
| 剧本 | `PROMPTS/*` | 场景差异；公共见 `_common.md` |

## 改规则时的同步顺序（防漂移）

1. **先改 L1**：`AGENT.core.md` / `WORKFLOW.slim.md` / `START.md`（若影响启动）
2. **再改附录**：完整 `AGENT.md` / `WORKFLOW.md` 对应章节
3. **再改派生**：`bootstrap.md`、`_common.md`、README 目录与粘贴语
4. **记一笔**：`CHANGELOG.md`；若是结构决策加 ADR
5. **不要**把长说明写进 `STATE.md`

## 何时必须改 core/slim

- 新增/修改硬红线、加载层级、启动分支
- 修改 full/light 路径或阶段名
- 修改 Ready / 写码最低条件
- 修改 host 通道优先级或使用注意

## 何时只改附录

- §7 大厂对照表扩写
- §0.3 宿主探测长文
- 访谈细项、开场骨架示例
- 单张 phase-card 的阶段特有检查

## 快速自检

- [ ] 用户入口是否仍指向 `START.md`
- [ ] Step A 的 L1 是否仍是 core + slim
- [ ] phase-card 是否仍只引用 `_common`，无大段重复页眉
- [ ] `STATE.md` 是否仍只有短 YAML
- [ ] README / `.ai/README` 目录树是否包含 START、core、slim、schema
- [ ] 可运行：`node .ai/check-consistency.mjs`