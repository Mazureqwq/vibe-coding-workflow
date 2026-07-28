# START（推荐启动入口）

> 用户和 AI 都从这里起步。短、可缓存、可恢复。  
> 详细宪法在 `AGENT.md`，不要一上来全读。

## 用户可粘贴

### 通用启动
```text
请按 .ai/START.md 启动工作流。
目标：{{一句话}}
约束：{{可选}}
```

### 继续上次
```text
请按 .ai/START.md 继续。
```

### 快速通道（接受 AI 推荐包）
```text
请按 .ai/START.md 快速启动。
目标：{{一句话}}
你来推荐 mode / 流程重量 / 类型，我一次确认。
```

## AI 启动红线（使用注意）

1. **先 L0**：只读 `.ai/STATE.md` + `.ai/TASKS.md` active
1.1 **L1 用 core/slim**：不要默认打开完整 AGENT/WORKFLOW
2. **能复用就不重读**：同阶段多轮禁止全量重读 AGENT + WORKFLOW
3. **STATE 只写值**：说明书在 `STATE.schema.md`，禁止把长规则写回热快照
4. **同时只持 1 张 phase-card**
5. **L3 附录按需**：§7 大表 / ADR / ENGINEERING / ARCHITECTURE / schema 默认不读
6. **先分支再访谈**：resume → quick_boot → full_bootstrap
7. **有目标就给推荐包**：不要从零空问 Mode/Weight/Type 四轮（除非信息不足）
8. **Ready 前不写业务代码**

## AI 最小步骤

```text
1) 读 STATE + TASKS（L0）
2) 分支：
   - checkpoint 可恢复 → 恢复摘要 + 继续/查看/修改（1 题）
   - 用户要快速启动或目标已清 → 推荐包一次确认（quick_boot）
   - 否则 full_bootstrap：一次一题
3) 需要冷规则时再升 L1（`AGENT.core.md` + `WORKFLOW.slim.md`）
4) 静默：语言 + host.choice_ui（可复用则复用）
5) 写入 STATE（短值）后进入阶段卡
```

## 推荐包格式（quick_boot）

一次只确认这一包（仍算 1 个决策题）：

```text
### 启动推荐包
目标：...
A. 采用推荐并开始准备执行（推荐）
   - mode: ...
   - weight: light|full|auto→resolved
   - type/pattern: ...
   - 下一阶段: ...
   - 理由: 一句话
B. 采用推荐但先不执行（只写入 STATE/TASKS）
C. 我要逐项修改（进入 full_bootstrap）
```

## 加载提示

| 场景 | 加载 |
|------|------|
| 继续上次 | L0 + 当前 phase-card |
| 快速启动 | L0 → AGENT.core + WORKFLOW.slim → 推荐包 |
| 完整访谈 | L0 → core/slim → bootstrap 队列 |
| 字段/路由争议 | 再升完整 AGENT/WORKFLOW 或 §7 等 L3 |

L1 常驻：`AGENT.core.md` + `WORKFLOW.slim.md`。完整协议：`AGENT.md`；路由大表：`WORKFLOW.md` §7。
改工作流本身时读 `MAINTENANCE.md`（日常任务忽略）。
