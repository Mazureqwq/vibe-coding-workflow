# 编码规范（通用约束）

> 只放跨项目可复用的工程约束。  
> 具体技术栈、目录别名、UI 库等，通过交互由 AI 写入「项目约定」段。

---

## 1. 目标

- 改动可理解
- 行为可验证
- 风险可控制
- 风格可协作

---

## 2. 通用工程约束

### 2.1 改动边界

- 只改当前任务范围
- 不做无关清理式重构
- 不引入未确认依赖
- 不删除无证据的“看起来没用”的逻辑

### 2.2 命名与结构

- 命名表达业务含义，不使用模糊词堆砌
- 一个模块只承担一类职责
- 公共逻辑下沉，业务逻辑不泄漏到通用层
- 避免超大文件与超长函数；需要拆分时先说明理由

### 2.3 类型与契约

- 能静态约束的不要全靠运行时碰运气
- 外部输入（接口、路由、存储、用户输入）必须校验或收窄
- 公共函数/组件的输入输出应明确
- 禁止无说明的 `any` / 随意吞错

### 2.4 错误处理

- 错误要可感知、可追溯
- 禁止空 catch
- 用户可恢复错误给行动建议；系统错误走统一出口
- 不把敏感信息打进日志或 UI

### 2.5 异步与状态

- 避免竞态（过期请求覆盖新结果）
- 明确 loading / empty / error / success
- 状态分层：本地 UI 态、业务态、服务端缓存态不混用

### 2.6 测试与验证

- 有逻辑就要有验证路径
- 修 bug 必有回归路径
- 关键路径优先，不追求无效覆盖率数字
- 提交前至少保证：约定检查命令通过

### 2.7 安全基线

- 不硬编码密钥
- 默认不渲染未消毒 HTML
- 前端权限仅作体验，后端必须鉴权
- 不在文档或代码中写入真实生产凭证

---

## 3. Git 与交付

### Commit 建议

```text
<type>(<scope>): <subject>
```

常用 type：`feat` `fix` `refactor` `docs` `test` `chore` `perf`

### 完成定义（DoD）

- [ ] 满足验收标准
- [ ] 验证已执行并记录
- [ ] 无无关注释/调试残留
- [ ] 需要时已回写 `.ai` 文档

---

## 4. 项目约定（交互生成）

> 以下内容不要用户手写长文。  
> AI 在 recon/architecture/align 阶段通过选项收集后写入。

```yaml
stack:
  language: null
  framework: null
  package_manager: null
  bundler: null
  ui_library: null
  state_management: null
  test_runner: null

conventions:
  directory_style: null          # 如 feature-first / layer-first
  naming_style: null
  branch_strategy: null
  required_checks: []            # 如 typecheck / lint / unit / e2e
  code_review_focus: []

notes: []
```

---

## 5. 效力说明

本文件默认 `follow`。  
若与仓库现实冲突，进入 `align`，由用户选择：

- `follow`
- `update-first`
- `code-as-source`
- `ignore-for-task`
