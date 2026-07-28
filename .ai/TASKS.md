# 当前任务（Tasks）

> 只记录当前任务与下一步。  
> 任务内容由 AI 通过交互生成，用户负责选择/纠正，不必手写长文。

---

## 当前迭代

```yaml
iteration: null
goal: null
timebox: null
```

---

## Active Task

```yaml
id: null                    # T-001
title: null
type: null                  # feature | bugfix | hotfix | refactor | platform | spike | infra | security | review | chore | docs
priority: P1
status: todo                # todo | doing | blocked | verify | done
mode: null                  # greenfield | brownfield | hybrid
process_weight: null        # full | light | auto
workflow_pattern: null      # feature_delivery | bugfix | hotfix | refactor | platform | spike | infra | security | review | chore
phase: null
acceptance_criteria: []
non_goals: []
impact_scope: []
verification: []
```

---

## Backlog

| ID | 标题 | 类型 | 优先级 | 状态 | 备注 |
|----|------|------|--------|------|------|
|  |  |  |  |  |  |

---

## Blocked

| ID | 原因 | 需要谁 | 下一步 |
|----|------|--------|--------|
|  |  |  |  |

---

## 任务卡片模板（AI 写入用）

```markdown
### T-XXX 标题

- 类型：
- 典型流：feature_delivery | bugfix | hotfix | refactor | platform | spike | infra | security | review | chore
- 模式：
- 流程重量：full | light | auto
- 当前阶段：
- 背景：
- 目标：
- 非目标：
- 验收标准：
  - [ ]
- 影响范围：
- 验证方式：
- 关联文档效力：
- 阶段提示词：`.ai/PROMPTS/phase-cards/<phase>.md`
```

---

## AI 维护规则

1. 用户提出需求后，先生成任务草案选项，确认后再写入
2. 阶段变化时同步 `status` / `phase`
3. 完成后把摘要同步到 `CHANGELOG.md`，并清理 Active Task
4. 阶段推进只走 phase-card；任务类型检查用 PROMPTS addon，不替代阶段机
5. 不把历史长篇堆在这里；历史用 CHANGELOG / DECISIONS