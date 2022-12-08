<h1>vue-pure-admin</h1>

![GitHub license](https://img.shields.io/github/license/xiaoxian521/vue-pure-admin?style=flat)
![GitHub stars](https://img.shields.io/github/stars/xiaoxian521/vue-pure-admin?color=fa6470&style=flat)
![GitHub forks](https://img.shields.io/github/forks/xiaoxian521/vue-pure-admin?style=flat)

**中文** | [English](./README.en-US.md)

## 简介

`vue-pure-admin` 是一款开源免费且开箱即用的中后台管理系统模版。使用了最新的 `Vue3`、`Vite`、`Element-Plus`、`TypeScript`、`Pinia`、`Tailwindcss` 等主流技术开发

## 精简版（实际项目开发请用精简版，提供 `非国际化` 、`国际化` 两个版本选择）

精简版是基于 [vue-pure-admin](https://github.com/xiaoxian521/vue-pure-admin) 提炼出的架子，包含主体功能，更适合实际项目开发，打包后的大小在全局引入 [element-plus](https://element-plus.org) 的情况下仍然低于 `2.3MB`，并且会永久同步完整版的代码。开启 `brotli` 压缩和 `cdn` 替换本地库模式后，打包大小低于 `350kb`

- [点我查看非国际化精简版](https://github.com/xiaoxian521/pure-admin-thin)
- [点我查看国际化精简版](https://github.com/xiaoxian521/pure-admin-thin/tree/i18n)

## 配套视频

- [点我查看快速开发教程](https://www.bilibili.com/video/BV1kg411v7QT)
- [点我查看 UI 设计](https://www.bilibili.com/video/BV17g411T7rq)

## 配套保姆级文档（支持 `PWA` 快速、离线访问）

- [点我查看国内文档站](https://yiming_chang.gitee.io/pure-admin-doc)
- [点我查看国外文档站](https://xiaoxian521.github.io/pure-admin-doc)

## `Tauri` 版

- [点我查看 Tauri 版](https://github.com/xiaoxian521/tauri-pure-admin)

## `Electron` 版

- [点我查看 Electron 版](https://github.com/xiaoxian521/electron-pure-admin)

## 预览

- [点我查看国内预览站](https://yiming_chang.gitee.io/vue-pure-admin)
- [点我查看国外预览站](https://xiaoxian521.github.io/vue-pure-admin)

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

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/xiaoxian521/vue-pure-admin)

## 安装使用

- 获取项目代码

```bash
git clone https://github.com/xiaoxian521/vue-pure-admin.git
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

## 更新日志

[CHANGELOG](./CHANGELOG.zh_CN.md)

## 如何贡献

非常欢迎您的加入！[提一个 Issue](https://github.com/xiaoxian521/vue-pure-admin/issues/new/choose) 或者提交一个 `Pull Request`

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

## 捐赠

如果您觉得这个项目对您有帮助，可以帮作者买一杯果汁 🍹 表示支持

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f69bf13c5b854ed5b699807cafa0e3ce~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?" width="150px" height="150px" />

## `QQ` 交流群

一群已满，下面是二群，群里严禁`黄`、`赌`、`毒`、`vpn`等违法行为！

<img src="https://yiming_chang.gitee.io/pure-admin-doc/img/support/qq.png" width="150px" height="225px" />

## 许可证

原则上不收取任何费用及版权，可以放心使用，不过如需二次开源（比如用此平台二次开发并开源）请联系作者获取许可！

[MIT © xiaoxian521-2020](./LICENSE)

## 捐赠者

非常感谢您们的支持，相信项目会越来越好 :heart:

|                                                                xueyuheng                                                                 |                                                                taolei1990                                                                 |                                                                hang-kim                                                                 |                                                               madwolfcrazy                                                                |                                                                limuen                                                                 |                                                                BenLakes                                                                 |
| :--------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: |
| <a href="https://github.com/xueyuheng"><img src="https://avatars.githubusercontent.com/u/48202935?v=4" width="60px" height="60px" /></a> | <a href="https://github.com/taolei1990"><img src="https://avatars.githubusercontent.com/u/23173640?v=4" width="60px" height="60px" /></a> | <a href="https://github.com/hang-kim"><img src="https://avatars.githubusercontent.com/u/52914259?v=4" width="60px" height="60px" /></a> | <a href="https://github.com/madwolfcrazy"><img src="https://avatars.githubusercontent.com/u/223671?v=4" width="60px" height="60px" /></a> | <a href="https://github.com/limuen"><img src="https://avatars.githubusercontent.com/u/31790606?v=4" width="60px" height="60px" /></a> | <a href="https://github.com/BenLakes"><img src="https://avatars.githubusercontent.com/u/15206046?v=4" width="60px" height="60px" /></a> |
|                                                                mollerzhu                                                                 |                                                                  TLovers                                                                  |                                                                  cnyyk                                                                  |                                                                                                                                           |                                                                                                                                       |                                                                                                                                         |
| <a href="https://github.com/mollerzhu"><img src="https://avatars.githubusercontent.com/u/49627902?v=4" width="60px" height="60px" /></a> |  <a href="https://github.com/TLovers"><img src="https://avatars.githubusercontent.com/u/26561694?v=4" width="60px" height="60px" /></a>   |   <a href="https://github.com/cnyyk"><img src="https://avatars.githubusercontent.com/u/275233?v=4" width="60px" height="60px" /></a>    |                                                                                                                                           |                                                                                                                                       |                                                                                                                                         |

## 贡献者

感谢所有做出贡献的人 :heart:

<a href="https://github.com/xiaoxian521/vue-pure-admin/graphs/contributors"><img src="https://contrib.rocks/image?repo=xiaoxian521/vue-pure-admin" /></a>

## `Star`

非常感谢留下星星的好心人，感谢您的支持 :heart:

[![Stargazers for vue-pure-admin](https://reporoster.com/stars/xiaoxian521/vue-pure-admin)](https://github.com/xiaoxian521/vue-pure-admin/stargazers)

## `Fork`

瞧，那些 `小哥哥` 、`小姐姐` 认真 `学习` 的样子真滴是 `哎呦不错哦` :heart:

[![Forkers repo roster for vue-pure-admin](https://reporoster.com/forks/xiaoxian521/vue-pure-admin)](https://github.com/xiaoxian521/vue-pure-admin/network/members)
