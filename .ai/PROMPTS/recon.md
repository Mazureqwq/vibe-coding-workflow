# Prompt：已有项目梳理（Recon 入口）

> 先快速建立可用理解，再按任务风险决定是否深入；不默认无限扫描。

## 加载

- 交互与加载：`.ai/PROMPTS/_common.md`
- 热快照：`.ai/STATE.md` + `.ai/TASKS.md`
- 冷规则：按 AGENT Step A 分级；勿每轮全量重读
- 当前 card：phase-cards/recon.md

## 执行清单

```md
你处于 recon 阶段，不改业务代码。

1. 先做 quick recon：技术栈、包管理器、入口、脚本、测试、任务相关目录
2. 输出 5–10 行事实摘要，并标记 unknown / inferred
3. 根据任务影响推荐 recon 深度：quick / focused / deep
4. 一次只询问是否继续深入，不追加无关问题
5. 用户确认后再读取下一层；若当前理解足够，允许进入下一阶段
6. 把确认后的摘要写入 STATE；重要结构变化才更新 ARCHITECTURE

如果发现公共层、架构、权限、数据链路或高回归风险，必须提议升级流程重量。
```
