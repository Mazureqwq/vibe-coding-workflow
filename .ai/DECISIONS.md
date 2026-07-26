# 架构决策记录（ADR）

> 记录“为什么这样选”。  
> 由 AI 在用户确认方案后写入，不要求用户先写 ADR。

---

## 规则

1. 最新决策追加在上方或按编号递增
2. 状态：`proposed` → `accepted` → `superseded` / `deprecated`
3. 被替代的决策不删除，只标记

---

## 模板

```markdown
## ADR-XXX: 标题

- 日期：YYYY-MM-DD
- 状态：proposed | accepted | superseded | deprecated
- 关联任务：T-XXX

### 背景
### 决策
### 选项与取舍
### 后果
```

---

## ADR-001: 采用交互式阶段门禁作为通用 Vibe Coding 工作流

- 日期：2026-07-26
- 状态：accepted
- 关联任务：T-000

### 背景

仅放置文档不足以约束大模型；空项目与已有项目需要不同流程，且用户不应手工维护长规范。

### 决策

采用：

- 双模式：greenfield / brownfield(hybrid)
- 阶段门禁 + phase-card
- 交互式确认后由 AI 回写 `.ai`
- 流程重量（full/light/auto）由用户交互选择

### 选项与取舍

1. 仅提供静态模板：轻，但约束弱
2. 固定完整大厂流程：规范，但小任务过重
3. 交互式双模式 + 可选流程重量：可通用，可收敛

### 后果

- 正向：可约束、可复用、低填写成本
- 负向：需要 AI 每轮维护 STATE
- 后续：所有任务先读 STATE/WORKFLOW
