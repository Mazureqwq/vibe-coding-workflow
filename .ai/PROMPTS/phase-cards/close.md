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

## Interaction
确认：
```text
A. 完成本任务并归档（推荐）
B. 还有收尾修改
C. 派生下一个任务
```

## Output → 写入
- `CHANGELOG.md`
- `TASKS.md` 状态 done
- `STATE.md` phase/progress 归位
- 其他相关文档

## Exit Criteria
- 文档回写完成
- 用户确认任务结束或派生下个任务
