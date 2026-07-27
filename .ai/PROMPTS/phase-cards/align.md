# Phase Card: align

## Goal
决定本任务中 `.ai` 文档与代码谁说了算。

## Interaction Rule
- 一次只问一题；优先可点选；普通阶段按计划自动衔接，关键门禁单独确认

## Allowed
- 对比文档 vs 代码
- 为每个相关文档建议效力
- 请用户选择效力

## Forbidden
- 不声明就忽略文档
- 不确认就重写全部规范

## Interaction
对每个相关文档给出：
```text
ENGINEERING.md: 建议 update-first
A. follow  B. update-first（推荐）  C. code-as-source  D. ignore-for-task
```

## Output → 写入
- `STATE.doc_authority`
- 若选 update-first：进入文档更新草案，确认后写回

## Exit Criteria
- 相关文档效力已确认
- 冲突已处理或记录
- 可进入 impact
