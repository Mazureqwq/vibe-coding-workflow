> 交互：一次只问一题；优先可点选选项；Ready 前不执行。

# Prompt：重构

---

## 必读

- `.ai/AGENT.md`
- `.ai/WORKFLOW.md`
- `.ai/STATE.md`
- `.ai/TECH_DEBT.md`
- `.ai/PROMPTS/phase-cards/impact.md`
- `.ai/PROMPTS/phase-cards/plan.md`

---

## 执行清单

```md
任务类型 = refactor。

硬约束：
- 默认行为不变
- 先确认“不变行为”清单
- 先确认范围与回归面
- 无证据不扩 scope

建议 process_weight：
- 跨模块 / 公共层：full 或 auto→full
- 局部清理：light 或 auto→light

流程：
1. bootstrap（若需要）
2. brownfield 为主：recon →（align）→ impact → plan → build → verify → close
3. 每个关键决策给选项
4. 完成后更新 TECH_DEBT / DECISIONS / CHANGELOG
```
