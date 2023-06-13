<h1>vue-pure-admin</h1>

![GitHub license](https://img.shields.io/github/license/pure-admin/vue-pure-admin?style=flat)
![GitHub stars](https://img.shields.io/github/stars/pure-admin/vue-pure-admin?color=fa6470&style=flat)
![GitHub forks](https://img.shields.io/github/forks/pure-admin/vue-pure-admin?style=flat)

**中文** | [English](./README.en-US.md)

## 简介

`vue-pure-admin` 是一款开源免费且开箱即用的中后台管理系统模版。使用了最新的 `Vue3`、`Vite`、`Element-Plus`、`TypeScript`、`Pinia`、`Tailwindcss` 等主流技术开发

## 精简版（实际项目开发请用精简版，提供 `非国际化` 、`国际化` 两个版本选择）

精简版是基于 [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) 提炼出的架子，包含主体功能，更适合实际项目开发，打包后的大小在全局引入 [element-plus](https://element-plus.org) 的情况下仍然低于 `2.3MB`，并且会永久同步完整版的代码。开启 `brotli` 压缩和 `cdn` 替换本地库模式后，打包大小低于 `350kb`

- [点我查看非国际化精简版](https://github.com/pure-admin/pure-admin-thin)
- [点我查看国际化精简版](https://github.com/pure-admin/pure-admin-thin/tree/i18n)

## 配套视频

- [点我查看快速开发教程](https://www.bilibili.com/video/BV1kg411v7QT)
- [点我查看 UI 设计](https://www.bilibili.com/video/BV17g411T7rq)

## 配套保姆级文档

- [查看文档](https://yiming_chang.gitee.io/pure-admin-doc)

## `Tauri` 版

- [点我查看 Tauri 版](https://github.com/pure-admin/tauri-pure-admin)

## `Electron` 版

- [点我查看 Electron 版](https://github.com/pure-admin/electron-pure-admin)

## 预览

- [查看预览](https://yiming_chang.gitee.io/vue-pure-admin)

- PC 端
<p align="center">
  <img alt="PureAdmin Logo" width="100%" src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d45c15ccbe674fe291a4faa528d11eda~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?">
</p>

- 暗黑模式
<p align="center">
  <img alt="PureAdmin Logo" width="100%" src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10a351f0d9c94b90ba3b408a786b9ede~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?">
</p>

- 移动端
<p align="center">
  <img alt="PureAdmin Logo" width="100%" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3061c7b92f6d4cb4bcdf227d966ac696~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?">
</p>

### 使用 `Gitpod`

在 Gitpod（适用于 GitHub 的免费在线开发环境）中打开项目，并立即开始编码.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/pure-admin/vue-pure-admin)

## 安装使用

- 获取项目代码

```bash
git clone https://github.com/pure-admin/vue-pure-admin.git
or
git clone https://gitee.com/yiming_chang/vue-pure-admin.git
```

- 安装依赖

```bash
cd vue-pure-admin

pnpm install

```

- 运行

```bash
pnpm serve
```

- 打包

```bash
pnpm build
```

## Docker 支持

1. 自定义镜像名为 `vue-pure-admin` 的镜像（请注意下面命令末尾有一个点 `.` 表示使用当前路径下的 `Dockerfile` 文件，可根据实际情况指定路径）

```bash
docker build -t vue-pure-admin .
```

2. 端口映射并启动 `docker` 容器（`8080:80`：表示在容器中使用 `80` 端口，并将该端口转发到主机的 `8080` 端口；`pure-admin`：表示自定义容器名；`vue-pure-admin`：表示自定义镜像名）

```bash
docker run -dp 8080:80  --name pure-admin vue-pure-admin
```

操作完上面两个命令后，在浏览器打开 `http://localhost:8080` 即可预览

当然也可以通过 [Docker Desktop](https://www.docker.com/products/docker-desktop/) 可视化界面去操作 `docker` 项目，如下图

<p align="center">
  <img alt="docker" width="100%" src="https://yiming_chang.gitee.io/pure-admin-doc/img/docker/1.jpg">
</p>

## 更新日志

[CHANGELOG](./CHANGELOG.zh_CN.md)

## 如何贡献

非常欢迎您的加入！[提一个 Issue](https://github.com/pure-admin/vue-pure-admin/issues/new/choose) 或者提交一个 `Pull Request`

**Pull Request:**

1. Fork 代码!
2. 创建自己的分支: `git checkout -b feat/xxxx`
3. 提交您的修改: `git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支: `git push origin feat/xxxx`
5. 提交`pull request`

## `Git` 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中

## 浏览器支持

本地开发推荐使用 `Chrome 80+` 浏览器

支持现代浏览器, 不支持 `IE`

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                             not support                                                                                              |                                                                                            last 2 versions                                                                                             |                                                                                                  last 2 versions                                                                                                  |                                                                                                last 2 versions                                                                                                |                                                                                                last 2 versions                                                                                                |

## 维护者

[xiaoxian521](https://github.com/xiaoxian521)、[Ten-K](https://github.com/Ten-K)

## 许可证

原则上不收取任何费用及版权，可商用，不过如需二次开源（比如用此平台二次开发并开源，要求前端代码必须开源免费）请联系作者获取许可！（免费，走个记录而已）

[MIT © 2020-present, pure-admin](./LICENSE)

## `Star`

非常感谢留下星星的好心人，感谢您的支持 :heart:

[![Stargazers for vue-pure-admin](https://reporoster.com/stars/pure-admin/vue-pure-admin)](https://github.com/pure-admin/vue-pure-admin/stargazers)

## `Fork`

瞧，那些 `小哥哥` 、`小姐姐` 认真 `学习` 的样子真滴是 `哎呦不错哦` :heart:

[![Forkers repo roster for vue-pure-admin](https://reporoster.com/forks/pure-admin/vue-pure-admin)](https://github.com/pure-admin/vue-pure-admin/network/members)
