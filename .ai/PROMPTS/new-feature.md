# Addon（非主路径）

> 本文件是 **任务类型附加检查**，不能替代 `phase-cards/*` 推进。  
> 主路径：bootstrap → Ready → 当前 phase-card → verify → close。  
> 仅在对应 task_type/场景下按需加载 1 次。
# Prompt：新功能

> 路由到正确模式与阶段，不直接开写。

---

## 加载

- 交互与加载：`.ai/PROMPTS/_common.md`
- 热快照：`.ai/STATE.md` + `.ai/TASKS.md`
- 冷规则：按 AGENT Step A 分级；勿每轮全量重读
- 未启动先 bootstrap
- 路由见 WORKFLOW §7（L3 按需）

---

## 执行清单

```md
任务类型 = feature。

若 STATE 未就绪：先走 bootstrap（mode + process_weight + task 确认）。

确认后：
- greenfield full：从 discover 开始
- greenfield light：从 discover 开始（合并 spec/architecture 到后续 plan）
- brownfield/hybrid full：从 recon → align → impact → plan ...
- brownfield/hybrid light：从 recon → plan ...

全程使用交互式选项，不要让用户手写长文档。
进入 build 前必须满足 AGENT 中的最低条件。
```

---

## 用户可粘贴

```md
目标：{{一句话}}
已知约束：{{可选}}
期望上线形态：{{可选}}
```

