# Addon（非主路径）

> 本文件是 **任务类型附加检查**，不能替代 `phase-cards/*` 推进。  
> 主路径：bootstrap → Ready → 当前 phase-card → verify → close。  
> 仅在对应 task_type/场景下按需加载 1 次。
# Prompt：重构

---

## 加载

- 交互与加载：`.ai/PROMPTS/_common.md`
- 热快照：`.ai/STATE.md` + `.ai/TASKS.md`
- 冷规则：按 AGENT Step A 分级；勿每轮全量重读
- 按需：TECH_DEBT、architecture/impact card

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

