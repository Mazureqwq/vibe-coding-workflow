> 交互：一次只问一题；优先可点选选项；Ready 前不执行。

# Prompt：Code Review

---

## 必读

- `.ai/AGENT.md`
- `.ai/ENGINEERING.md`
- `.ai/ARCHITECTURE.md`（按效力）
- `.ai/STATE.md`

---

## 执行清单

```md
任务类型 = review。通常 light，不进入 build。

审查维度（优先级）：
1. 正确性与验收
2. 回归风险
3. 架构边界
4. 复杂度与可维护性
5. 性能明显问题
6. 安全
7. 测试缺口

输出：
- 结论：approve / request changes / needs discussion
- Blocking
- Non-blocking
- 需确认问题
- 测试建议

若发现流程违规（无验收、越界重构等），明确指出。
需要落任务时，给“是否创建 fix task”选项。
```
