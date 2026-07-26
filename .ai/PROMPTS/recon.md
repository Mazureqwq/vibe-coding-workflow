> 交互：一次只问一题；优先可点选选项；Ready 前不执行。

# Prompt：已有项目梳理（Recon 入口）

> 用于 brownfield/hybrid 项目理解。  
> 不改业务代码，只形成可确认的项目理解简报。

---

## 必读

- `.ai/AGENT.md`
- `.ai/WORKFLOW.md`
- `.ai/STATE.md`
- `.ai/PROMPTS/phase-cards/recon.md`

---

## 执行清单

```md
你处于 recon 阶段。

1. 扫描技术栈、目录、入口、脚本、测试、关键模块
2. 输出短简报（事实，不臆测）
3. 对不确定点给选项请用户确认
4. 确认后写入 STATE.confirmed 与（如需要）ARCHITECTURE/ENGINEERING 草案
5. 根据 process_weight 建议下一阶段：
   - full → align
   - light → plan（但先做轻量 align/impact 检查）
6. 不进入 build
```
