# 维护清单（改工作流时读）

> 日常任务不要读本文件。只有修改 `.ai` 工作流本身时使用。

## 改硬规则顺序

1. `AGENT.core.md` + `WORKFLOW.slim.md`（L1）
2. `START.md` / `PROMPTS/_common.md` / `PROMPTS/bootstrap.md`
3. phase-cards 与（如需）任务 addon
4. 同步完整 `AGENT.md` / `WORKFLOW.md`（L3，不得覆盖 L1）
5. `STATE.md` 模板 + `STATE.schema.md` + `workflow-machine.json`
6. `DECISIONS.md` ADR + `CHANGELOG.md`
7. `examples/` 轨迹是否仍成立
8. `node .ai/check-consistency.mjs`

## ADR-007 回归点

- [ ] 启动决策树仍是 resume → quick_boot 默认 → full_bootstrap
- [ ] 低风险推荐包可合并 Ready；high/deep 不可
- [ ] light 不跳过 verify/close
- [ ] STATE 热层无大段注释/说明书
- [ ] phase-card 有 phase_result 结束契约
- [ ] 任务 prompt 仍标注 addon / 非主路径
- [ ] Load 与 Gate 命名未重新混用
- [ ] examples 与 core/slim 无漂移

## 何时改 L1

- 修改 Ready / Gate 2 / 写码最低条件
- 修改 host 通道优先级
- 修改 quick-first / 自动续跑 / 停止白名单
- 修改 full/light 路径或阶段名

## 何时只改附录

- §7 大厂对照表扩写
- 宿主探测长文、访谈细项
- 单张 phase-card 的阶段特有检查

## 快速自检

- [ ] 用户入口仍指向 `START.md`
- [ ] Step A 的 L1 仍是 core + slim
- [ ] phase-card 只引用 `_common`，无大段重复页眉
- [ ] `STATE.md` 只有短 YAML 纯值
- [ ] YAML 结构、枚举、阶段覆盖、checkpoint 通过解析校验
- [ ] README / `.ai/README` 含 START、core、slim、schema、examples
- [ ] `node .ai/check-consistency.mjs` errors=0