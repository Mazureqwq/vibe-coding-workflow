# Example: Light Bugfix 成功路径（annotated）

> 不进入默认加载。用于理解 ADR-007 quick-first 体感。  
> 场景：已有前端项目，登录页按钮点击无响应。

## 用户

```text
请按 .ai/START.md 快速启动。
目标：修复登录页按钮点击无响应
你推荐我确认
```

## AI（静默）

- 读取热状态快照：STATE/TASKS 为空任务
- boot_path = quick_boot
- 浅层 recon：React + 已有 login 页
- risk_level = low；interaction_mode = low_touch；weight = light；type = bugfix

## 用户决策 #1（推荐包 + Ready 合并）

```text
A. 采用推荐并开始准备执行（推荐）
   - mode: brownfield
   - weight: light
   - type/pattern: bugfix
   - interaction_mode: low_touch
   - next phase: recon
```

用户选 A。

## 执行

1. **recon**（light shape）：定位按钮 handler / 事件绑定问题 → phase_result.completed → plan  
2. **plan**：3 步修复 + 手工复现验证  
3. **build**：最小修复  
4. **verify**：复现路径通过；validation_result.status=passed + commands/evidence  
5. **close**：CHANGELOG + TASKS done + stop_reason=completed

## 计数

- 用户决策轮次：1（推荐包合并 Ready）
- 未走 full_bootstrap 四轮问卷
- verify/close 未跳过
