# PROMPTS 公共约定（冷、短）

> phase-card / 任务 prompt **不要复制**本页长文。需要时一句话引用即可。  
> 策略：ADR-007 减负不降门禁。

## 交互
- 遵循 `AGENT.core` / `AGENT.md` §3（一次一题；通道见 `STATE.host.choice_ui`）
- Ready 前不执行业务写码；Gate 2 门禁单独确认（低风险 Ready 可与推荐包合并）
- 普通阶段按计划自动衔接；输出摘要后继续加载下一阶段，不把摘要当作任务结束
- 非完成态停止必须写入 `STATE.stop_reason` 并同步 checkpoint
- 只有 `stop_reason=completed` 才能称为任务完成
- 每张 phase-card 结束时必须输出并回写：
  - `phase_result.status`：`completed` | `waiting_user` | `blocked` | `failed`（进行中可用 `pending`）
  - `phase_result.next_phase`
  - `phase_result.stop_reason`
  - `phase_result.checkpoint_updated`
  - 短 `evidence`（可 `[]`，verify/close 除外）
- `status=completed` 且非 close → 必须立即加载下一 phase-card 继续
- 进入 close 前必须有 `validation_result.status=passed|accepted`
- `passed` 必须写 commands 或 evidence；`accepted` 必须写用户接受风险的依据
- STATE 写入必须检查 revision/session，内容必须脱敏
- 主路径 = `phase-cards/*`；根目录任务 prompt 仅 addon checklist

## 使用注意（短）
- 入口优先 `START.md`
- STATE 只写值；不每轮重读冷规则全文
- 启动先分支：resume / quick_boot（默认优先） / full_bootstrap
- 决策门禁称 Gate 0/1/2；上下文读取使用语义名称：热状态快照、核心运行规则、当前阶段卡、详细参考规则

## 默认加载
- 热：`STATE.md` + `TASKS.md` active
- 当前仅 1 张 phase-card
- 核心运行规则使用 `AGENT.core.md` + `WORKFLOW.slim.md`；不每轮重读完整全文

## 停止白名单
允许：`waiting_user` | `blocked` | `tool_failure` | `output_limit` | `completed`  
禁止：普通阶段只总结就停；“如需继续请告诉我”作为唯一结尾

## 引用写法
```text
交互与加载：见 PROMPTS/_common.md
```
