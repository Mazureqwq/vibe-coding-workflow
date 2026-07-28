# Phase Card: architecture

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
在写代码前确认技术边界、模块化方式、依赖方向，以及未来增加功能时的扩展路径。

## light 处理
`process_weight=light` 时默认跳过本阶段（记入 `skipped_phases`）。若出现公共层/契约/跨模块/安全数据信号，必须插回本阶段或升级 full。

## Architecture Principles
默认优先评估以下方向，并说明不采用它们的理由：

- 按业务能力或 feature 划分模块，避免所有页面、组件、服务分别堆在全局目录
- 模块内部高内聚，模块之间通过明确契约协作
- 依赖单向流动，业务逻辑不直接依赖具体基础设施
- 共享代码必须稳定、通用、无业务语义；不确定是否共享时先留在业务模块内
- 新功能优先通过新增模块或实现扩展点接入，避免修改大量既有业务分支
- 状态、数据访问、错误处理和权限边界必须有明确归属

## Allowed
- 提供 2–3 套方案对比
- 定义模块边界、关键链路、依赖方向和公共契约
- 评估可维护性、可扩展性、可测试性、性能和演进成本
- 设计扩展点、模块注册方式、配置边界和迁移策略
- 写 ARCHITECTURE / DECISIONS 草案

## Forbidden
- 未确认就大规模落代码
- 只讨论框架和目录，不讨论依赖、契约和变更路径
- 为了“以后可能用到”提前抽象不稳定的业务逻辑
- 建立无 owner 的 shared/utils/common 大杂烩
- 用跨模块直接引用、全局状态或隐式副作用绕过模块边界
- 一次引入过多无关基础设施


## Interaction
架构阶段按以下顺序一次确认一个主题。已有证据可以复用，但不能静默跳过高风险项：

1. **架构目标**：维护成本、迭代速度、团队协作、性能、可靠性中优先保障什么？
2. **模块划分**：按业务能力/feature、按技术分层，还是模块化单体/插件化？推荐优先评估 feature-first 模块化方案。
3. **模块边界**：每个模块负责什么、不负责什么，谁拥有对应数据和业务规则？
4. **依赖方向**：哪些层可以依赖哪些层？如何避免循环依赖和业务逻辑泄漏到 shared？
5. **公共代码规则**：什么条件下才能下沉到 shared？公共 API 由谁维护？
6. **契约与通信**：模块之间使用函数、接口、事件、路由、消息还是 API？输入输出如何校验和版本化？
7. **状态与数据归属**：本地 UI 状态、业务状态、服务端缓存、持久化数据分别由谁管理？
8. **扩展路径**：新增一个业务功能需要新增哪些文件，是否必须修改核心模块？是否需要注册表、策略、适配器或插件边界？
9. **测试隔离**：模块能否独立单测？跨模块链路用什么集成测试或契约测试保护？
10. **失败与可观测性**：错误边界、日志、指标、追踪和降级由哪一层负责？
11. **演进策略**：如果规模增长或架构假设被推翻，如何迁移、兼容和回滚？

跳过记录示例：
`architecture_depth=minimum; skipped: 公共契约版本、迁移策略；reason: 单模块低风险任务`

输出方案时必须包含：

```text
方案：...
模块组织：...
依赖方向：...
公共代码边界：...
扩展方式：...
状态/数据归属：...
测试与验证：...
主要代价：...
```

方案选择：
```text
A. 方案1（推荐）— 可维护性、扩展性、代价
B. 方案2 — 可维护性、扩展性、代价
C. 方案3 — 可维护性、扩展性、代价
```

## Output → 写入
- `ARCHITECTURE.md`
- `DECISIONS.md`（重大选型、模块边界和取舍）
- `ENGINEERING.md` 的项目约定（目录风格、依赖规则、测试要求）
- `STATE.architecture_depth`
- `STATE.confirmed.architecture_choice`
- `STATE.confirmed.implementation_plan_summary`（扩展和迁移摘要）
- `STATE.doc_authority.ARCHITECTURE.md = follow`（确认后）

## Exit Criteria
- 用户确认架构深度、架构目标和方案
- 未执行的高级主题已记录 skipped 及原因
- 模块职责、owner、依赖方向和公共契约已记录
- 共享代码、状态归属、扩展点和测试隔离规则已明确
- 主要风险、演进/迁移策略和验证方式已明示
- 可进入 plan

## 结束契约（必须）

交互与加载：见 `PROMPTS/_common.md`。

结束本阶段前输出并回写：

```yaml
phase_result:
  status: completed | waiting_user | blocked | failed
  next_phase: <phase>|null
  stop_reason: null | waiting_user | blocked | tool_failure | output_limit | completed
  checkpoint_updated: true
  evidence: []
```

- `status=completed` 且非 close → 立即加载下一 phase-card，不要停问“是否继续”
- 需要用户 Gate 2 决策 → `waiting_user`
- 主路径是本 card；任务 prompt 仅 addon

