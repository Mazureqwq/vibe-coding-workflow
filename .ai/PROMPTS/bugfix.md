> 交互：一次只问一题；优先可点选选项；Ready 前不执行。

# Prompt：Bug 修复

---

## 必读

- `.ai/AGENT.md`
- `.ai/WORKFLOW.md`
- `.ai/STATE.md`
- `.ai/PROMPTS/phase-cards/impact.md`
- `.ai/PROMPTS/phase-cards/build.md`
- `.ai/PROMPTS/phase-cards/verify.md`

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
