# AI User Admin Console

独立后台管理仓库，用于 `ai_user / healty-agent` 项目的运营后台与权限管理。

## 项目定位

该项目基于 `Vue 3 + TypeScript + Vite + Element Plus + Pinia`，主要承载以下后台能力：

- 用户管理
- 管理员管理
- 角色管理
- 路由 / 权限资源管理
- 会话记录与识别记录查看
- 审计日志与后台运维视图

## 分支策略

当前只保留三条长期分支：

| 分支 | 用途 | 环境 |
|---|---|---|
| `develop` | 日常开发集成 | 开发环境 |
| `staging` | 测试 / 预发布验收 | 测试环境 |
| `main` | 正式发布 | 生产环境 |

推荐流转：`feat/* -> develop -> staging -> main`

## 本地开发

### 1. 安装依赖

```bash
cd /Users/mengfeng/Desktop/ai_user/admin
nvm use 18.20.8
pnpm install
```

### 2. 启动开发环境

```bash
pnpm dev
```

默认访问地址：`http://127.0.0.1:5174`

### 3. 构建发布包

```bash
pnpm build
```

如需测试环境构建：

```bash
pnpm build:staging
```

## 对接说明

- 前端仅通过后端 API 交互
- 后端接口来自主仓：`healty-agent`
- 权限数据依赖 `/api/admin/rbac/policy`
- 管理员角色绑定依赖 `/api/admin/users/{id}/role` 与 `/api/admin/users/{id}/roles`

## 说明

这个仓库已从原始 `vue-pure-admin` 模板中抽离出来，当前按业务后台方式维护，不再作为通用模板展示仓使用。
