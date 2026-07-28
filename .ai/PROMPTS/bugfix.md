# Prompt：Bug 修复

---

## 加载

- 交互与加载：`.ai/PROMPTS/_common.md`
- 热快照：`.ai/STATE.md` + `.ai/TASKS.md`
- 冷规则：按 AGENT Step A 分级；勿每轮全量重读
- 阶段卡按需：impact → build → verify（同时只持 1 张）

---

## 执行清单

```md
任务类型 = bugfix。

1. 若任务未启动，先 bootstrap
2. 收集：复现步骤 / 期望 / 实际 / 频率 / 环境（缺什么问什么，选项化）
3. 先定位根因，再最小修复
4. 默认 light；若涉及权限、数据、公共基础设施，建议升级 full
5. 验证前不得 close
6. 回写 TASKS / CHANGELOG；若是结构性坑，提案记入 TECH_DEBT
```

---

## 用户可粘贴

```md
现象：
复现步骤：
期望：
实际：
频率：必现/偶现
```
