# Phase Card: close

> 交互与加载：`PROMPTS/_common.md`；本卡只定义本阶段差异。

## Goal
收尾、回写、可传承。

## Allowed
- 更新 CHANGELOG / TASKS / STATE
- 补 DECISIONS / TECH_DEBT / ARCHITECTURE（如需要）
- 给出下一步建议选项

## Forbidden
- 继续大规模改代码
- 不回写就标 done
- `validation_result.status` 非 `passed|accepted` 时宣称完成

## Interaction
确认：
```text
A. 完成本任务并归档（推荐）
B. 还有收尾修改
C. 派生下一个任务
```

## Output → 写入
- `CHANGELOG.md`
- `TASKS.md` 状态 done / 清理 Active
- `STATE.md` 的 `current_phase`、`next_action`、`checkpoint` 归位
- `STATE.stop_reason: completed`（仅在 validation 通过/接受且用户确认归档后）
- 其他相关文档

## Exit Criteria
- `validation_result.status` 为 `passed` 或 `accepted`
- 文档回写完成
- 用户确认任务结束或派生下个任务
- `phase_result.status=completed` 且 `stop_reason=completed`

## 结束契约（必须）

```yaml
phase_result:
  status: completed | waiting_user | blocked | failed
  next_phase: null
  stop_reason: completed | waiting_user | blocked | tool_failure | output_limit
  checkpoint_updated: true
  evidence: [changelog, tasks_cleaned, validation_ref]
```
