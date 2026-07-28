# WORKFLOW.slim（L1 流程地图）

> 需要流程地图时**优先读本文件**。  
> 大厂对照大表、长选项文案等见完整 `WORKFLOW.md`（L3）。  
> 策略：ADR-007 quick-first；主路径 = phase-card。

## 启动

- 入口：`START.md`
- 使用注意：先 Load L0；STATE 只写值；一 card；L3 按需
- 分支（quick-first）：`resume` | `quick_boot`（默认优先） | `full_bootstrap`
- 语言静默跟随；host 通道静默探测/复用
- 一次一题；`quick_boot` 用推荐包；低/中风险可与 Ready 合并
- 用户可见：目标 / 模式 / 重量 / 阶段 / 是否开始

## 交互档位

- `low_touch`：低风险、目标清晰 → 推荐包，少逐题
- `standard`：保留目标、影响、验收和计划确认
- `deep`：完整访谈、架构和迁移决策；不合并 Ready 偷渡
- `auto`：AI 按风险推荐并写入 STATE

简单任务不应强制完整问卷；复杂任务不得为省轮次跳过 Gate 2。

## 流程重量

| 值 | 含义 |
|----|------|
| `full` | 阶段全开 |
| `light` | 合并分析阶段（shape）；verify/close 不合并 |
| `auto` | 推荐后确认，写 `resolved_as` |

### full

- greenfield：`discover → spec → architecture → plan → build → verify → close`
- brownfield/hybrid：`recon → align → impact → plan → build → verify → close`

### light

- greenfield：`discover → plan → build → verify → close`  
  （discover 内产出短 shape：问题/范围/验收；跳过 spec/architecture，除非触发插回）
- brownfield/hybrid：`recon → plan → build → verify → close`  
  （recon 内短 shape：现实/对齐要点/影响；跳过 align/impact/architecture，除非触发插回）
- 发现架构/公共层/文档严重冲突/安全数据风险 → 暂停，提示升级 full 或补开阶段
- **verify 与 close 永不跳过**

### auto 信号（短）

| 信号 | 推荐 |
|------|------|
| 空项目、多模块、公共层、安全、平台底座 | full + deep/standard |
| 单点 bug、文案、局部 UI、文档、spike | light + low_touch |
| 热修 | light 止血；根治另开任务 |
| 不足 | 先问 1 题再推荐，或 full_bootstrap |

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
| review | 输出审查结论 | 进入 build |

每阶段结束必须写 `phase_result` 并按契约续跑。Exit 细节见 phase-card。

## 任务类型速查

| 类型 | 默认重量 |
|------|----------|
| 大 feature / platform / security / 不清的 refactor | full 或 auto |
| 小 feature / bugfix / chore / docs / review / spike | light 或 auto |
| hotfix | light 止血，根治另开 |

任务类型统一枚举：`feature`、`bugfix`、`hotfix`、`refactor`、`platform`、`spike`、`infra`、`security`、`review`、`chore`、`docs`。

特殊路由：
- 所有进入 close 的任务必须先产生 `validation_result.status=passed|accepted`
- `review` 的 review 结论就是验证结果，`kind=review`
- `spike` 的 Go/No-Go 结论写入 `kind=spike_result`
- `infra` 的变更检查清单写入 `kind=change_checklist`
- `review`：`recon → review → close`，不进入 build
- 合法转移以 `.ai/workflow-machine.json` 为准，禁止自行跳阶段
- `hotfix`：`build → verify → close`，根治另开任务
- `security`：至少经过 `impact → plan → build → verify → close`

跳过阶段必须写入 `STATE.skipped_phases` 并确认（light 默认跳过的分析阶段也要记录）。

## 推进 / 回退 / Recon

- 普通阶段完成：写 `phase_result` + checkpoint，加载下一阶段并继续；只有门禁、阻塞或输出限制才停止
- Gate 2（build 大改、升 full、改契约、接受风险）单独确认
- 回退：需求冲突→spec/discover；架构推翻→architecture/align；验证失败→verify/build；范围爆炸→plan
- Recon 分层：`quick` 默认 → `focused` → `deep`；先 quick summary 再让用户选是否加深

## 与 PROMPTS（主路径唯一）

```text
START / 用户需求
  → bootstrap（仅启动，不写业务代码）
  → mode + weight + type（推荐包或逐项）
  → phase-card（唯一阶段执行卡）
  → 可选任务 prompt addon（bugfix/new-feature/... 检查项）
  → 写 STATE/TASKS
```

禁止：用 `PROMPTS/bugfix.md` 等任务卡替代 phase-card 推进。  
公共约定：`PROMPTS/_common.md`。

## 维护

阶段名/重量映射变更时：先改本文件，再同步完整 `WORKFLOW.md`。见 `MAINTENANCE.md`。
