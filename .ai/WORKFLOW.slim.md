# WORKFLOW.slim（L1 流程地图）

> 需要流程地图时**优先读本文件**。  
> 大厂对照大表、长选项文案等见完整 `WORKFLOW.md`（L3）。

## 启动

- 入口：`START.md`
- 使用注意：先 L0；STATE 只写值；一 card；L3 按需
- 分支：`resume` | `quick_boot` | `full_bootstrap`
- 语言静默跟随；host 通道静默探测/复用
- 一次一题；`quick_boot` 可用推荐包

## 流程重量

| 值 | 含义 |
|----|------|
| `full` | 阶段全开 |
| `light` | 合并分析阶段 |
| `auto` | 推荐后确认，写 `resolved_as` |

### full

- greenfield：`discover → spec → architecture → plan → build → verify → close`
- brownfield/hybrid：`recon → align → impact → plan → build → verify → close`

### light

- greenfield：`discover → plan → build → verify → close`
- brownfield/hybrid：`recon → plan → build → verify → close`
- 发现架构/公共层/文档严重冲突 → 提示升级 full 或补开阶段

### auto 信号（短）

| 信号 | 推荐 |
|------|------|
| 空项目、多模块、公共层、安全、平台底座 | full |
| 单点 bug、文案、局部 UI、文档、spike | light |
| 热修 | light 止血；根治另开任务 |
| 不足 | 先问 1 题再推荐 |

完整算法与大表：`WORKFLOW.md` §7（L3）。

## 双模式主链路

- **greenfield**：无业务源码/空壳
- **brownfield**：已有可读代码
- **hybrid**：有代码但 `.ai` 缺失/过期

## 阶段总表（缩略）

| Phase | 目标 | 禁止 |
|------|------|------|
| discover | 问题与成功标准 | 写业务代码 |
| spec | 可验收需求 | 大规模实现 |
| architecture | 选型与边界 | 借架构铺开业务代码 |
| recon | 理解仓库现实 | 先改再理解 |
| align | 文档效力 | 未对齐开干 |
| impact | 影响与风险 | 直接编码 |
| plan | 可执行计划 | 超计划实现 |
| build | 最小实现 | 扩 scope/换栈 |
| verify | 验收与回归 | 夹带新功能 |
| close | 回写与传承 | 继续大改 |

Exit 细节见 phase-card / 完整 WORKFLOW。

## 任务类型速查

| 类型 | 默认重量 |
|------|----------|
| 大 feature / platform / security / 不清的 refactor | full 或 auto |
| 小 feature / bugfix / chore / docs / review / spike | light 或 auto |
| hotfix | light 止血，根治另开 |

跳过阶段必须写入 `STATE.skipped_phases` 并确认。

## 推进 / 回退 / Recon

- 普通阶段完成：摘要 + 下一动作，不重复问“是否继续”
- L2 门禁（build、升 full、改契约、接受风险）单独确认
- 回退：需求冲突→spec/discover；架构推翻→architecture/align；验证失败→verify/build；范围爆炸→plan
- Recon 分层：`quick` 默认 → `focused` → `deep`；先 quick summary 再让用户选是否加深

## 与 PROMPTS

```text
START / 用户需求 → bootstrap 或任务 prompt → mode+weight+type → phase-card → 写 STATE/TASKS
```

公共约定：`PROMPTS/_common.md`。

## 维护

阶段名/重量映射变更时：先改本文件，再同步完整 `WORKFLOW.md`。见 `MAINTENANCE.md`。
