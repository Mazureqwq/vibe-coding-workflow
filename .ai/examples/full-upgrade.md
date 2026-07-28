# Example: Full 升级路径（annotated）

> 不进入默认加载。演示 quick_boot 中发现风险后升级。  
> 场景：给已有 API 加跨模块缓存与权限。

## 用户

```text
请按 .ai/START.md 启动。
目标：给用户资料接口加缓存，并限制仅本人与管理员可访问
```

## AI 首轮推荐包

初判 mid，给出 standard + light 倾向，但浅层 recon 发现：

- 权限中间件在公共层
- 缓存键涉及多模块失效

→ **暂停升级**（Gate 2）

## 用户决策 #1

```text
发现高风险：公共层权限 + 跨模块缓存失效
A. 升级 full + deep 并继续（推荐）
B. 缩 scope，只做本接口本地缓存
C. 取消
```

用户选 A。risk_level=high；weight=full；interaction_mode=deep。

## 执行摘要

1. recon → align → impact（契约/权限/缓存失效面）  
2. plan 经 Gate 2 确认  
3. build 分批 + checkpoint  
4. verify：权限用例 + 缓存失效证据；passed  
5. close：DECISIONS 记缓存策略；stop_reason=completed

## 计数

- 推荐包未与 Ready 合并（high/deep）
- 出现独立升级确认与 plan 确认
- 仍从 quick_boot 起步，而不是一上来 full_bootstrap 问卷