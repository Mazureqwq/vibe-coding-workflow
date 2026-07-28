# START（推荐启动入口）

> 用户和 AI 都从这里起步。短、可缓存、可恢复。  
> 详细宪法在 `AGENT.md`，不要一上来全读。  
> 策略：ADR-007 **quick-first / 减负不降门禁**。

## 用户可粘贴

### 通用启动
```text
请按 .ai/START.md 启动工作流。
目标：{{一句话目标}}
```

### 继续上次
```text
请按 .ai/START.md 继续
```

### 快速启动（推荐默认）
```text
请按 .ai/START.md 快速启动。
目标：{{一句话目标}}
你推荐，我确认
```

## AI 必读顺序（缓存前缀友好）

> 读取判断 与 组装前缀 分开：先用热快照路由，再把稳定规则放前、动态状态放后。

1. **L0 热快照**：`.ai/STATE.md` + `.ai/TASKS.md`（只看 active）
2. 判定 `boot_path`（见下方决策树）
3. 需要冷规则时读 **L1**：`AGENT.core.md` + `WORKFLOW.slim.md`（不要默认打开完整 AGENT/WORKFLOW）
4. 进阶段时只加载 **1 张** `PROMPTS/phase-cards/<phase>.md`
5. 争议/附录/大表才升 **L3**

组装稳定前缀时优先：`AGENT.core` → `WORKFLOW.slim` → `PROMPTS/_common` → 当前 phase-card；  
动态 `STATE`/`TASKS`/用户最新决策放在稳定规则之后，提高 prompt cache 命中。

## 启动决策树（quick-first）

```text
1. 有可恢复 checkpoint？
   → resume
2. 用户已给清晰目标，或说了「快速启动 / 你推荐 / 你定」？
   → quick_boot（默认）
3. 目标模糊 / 高风险信号明显 / 用户只要逐项？
   → full_bootstrap
```

禁止习惯性四轮 Mode → Weight → Type → Goal。信息已够时直接推荐包。

## 用户只需要关心的 5 件事

1. 目标是什么  
2. 新项目还是已有项目  
3. 完整流程还是轻量  
4. 当前阶段  
5. 是否开始执行  

`workflow_pattern`、`host_channel`、Load/Gate 层级默认内部消化，必要时再解释。

## boot_path 行为

| boot_path | 行为 |
|-----------|------|
| `resume` | 6 行恢复摘要 + 继续/查看/修改（1 题） |
| `quick_boot` | 推荐包一次确认；低/中风险可与 Ready 合并 |
| `full_bootstrap` | 一次一题队列；已有信息复用跳过 |

### 恢复摘要模板
```text
停在：<phase> / <stop_reason>
目标：...
已确认：mode / weight / type / ready
下一步：...
风险：low | mid | high
选：A 继续（推荐） / B 查看 / C 修改
```

### 推荐包模板
```text
### 启动推荐包
目标：...
风险：low | mid | high
A. 采用推荐并开始准备执行（推荐）
   - mode: ...
   - weight: ...
   - type/pattern: ...
   - interaction_mode: ...
   - next phase: ...
   - 理由: ...
B. 采用推荐但只写入，不执行
C. 我要逐项修改
```

低/中风险且 `interaction_mode != deep` 时，A 可视为 **推荐包 + Ready 合并**。  
高风险、`deep`、或存在未决 Gate 2 时：先确认推荐包，再单独 Ready/Gate。

## 硬门禁（不降）

- Ready 前不写业务代码
- Gate 2 不可 assume：大范围 build、升 full、改架构/契约、接受验证失败风险、破坏性操作
- light 可少问、可合并分析；**不可跳过 verify / close**
- 普通阶段完成后自动加载下一 card；不得把阶段摘要当任务结束
- 主路径 = phase-card；任务 prompt 仅 addon

## 成功标准（启动结束）

已写入短值：`ui_language`、`host.choice_ui.channel`、`boot_path`、`mode`、`process_weight`、`task_type`、`interaction_mode`、`confirmed.goal`、`risk_level`、`next_action` / `current_phase`。  
用户未确认执行前：`interview.ready_for_execution` 可为 true，但业务写码仍需 Ready/合并 Ready 通过。

## 不要做

- 每轮全量重读完整 `AGENT.md` + `WORKFLOW.md`
- 把说明书写回 `STATE.md`
- 无推荐权限却伪造成“已帮你决定并执行”
- 为了快默认 `assume` 做 Gate 2
