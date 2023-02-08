<h1>vue-pure-admin</h1>

![GitHub license](https://img.shields.io/github/license/pure-admin/vue-pure-admin?style=flat)
![GitHub stars](https://img.shields.io/github/stars/pure-admin/vue-pure-admin?color=fa6470&style=flat)
![GitHub forks](https://img.shields.io/github/forks/pure-admin/vue-pure-admin?style=flat)

**English** | [中文](./README.md)

## Introduction

`vue-pure-admin` is an open source free and out-of-the-box middle and background management system template. Developed using the latest mainstream technologies such as `Vue3`, `Vite`, `Element-Plus`, `TypeScript`, `Pinia`, `Tailwindcss`

## Thin version (offering non-internationalized and internationalized versions)

The simplified version is based on the shelf extracted from [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin), which contains main functions and is more suitable for actual project development. The packaged size is introduced globally [element-plus](https://element-plus.org) is still below `2.3MB`, and the full version of the code will be permanently synchronized. After enabling `brotli` compression and `cdn` to replace the local library mode, the package size is less than `350kb`

- [Click me to view the non-internationalized version](https://github.com/pure-admin/pure-admin-thin)
- [Click me to view Internationalization version](https://github.com/pure-admin/pure-admin-thin/tree/i18n)

## Supporting Video

- [Click Watch Tutorial](https://www.bilibili.com/video/BV1kg411v7QT)
- [Click Watch UI Design](https://www.bilibili.com/video/BV17g411T7rq)

## Docs (support `PWA` fast, offline access)

- [Click me to view the domestic documentation site](https://yiming_chang.gitee.io/pure-admin-doc)
- [Click me to view foreign document site](https://pure-admin.github.io/pure-admin-doc)

## Tauri

- [Click Watch Tauri](https://github.com/pure-admin/tauri-pure-admin)

## Electron

- [Click Watch Electron](https://github.com/pure-admin/electron-pure-admin)

## Preview

- [Click me to view the domestic preview station](https://yiming_chang.gitee.io/vue-pure-admin)
- [Click me to view foreign preview site](https://pure-admin.github.io/vue-pure-admin)

- PC
<p align="center">
  <img alt="PureAdmin Logo" width="100%" src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d45c15ccbe674fe291a4faa528d11eda~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?">
</p>

- DarkMode
<p align="center">
  <img alt="PureAdmin Logo" width="100%" src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10a351f0d9c94b90ba3b408a786b9ede~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?">
</p>

- Mobile
<p align="center">
  <img alt="PureAdmin Logo" width="100%" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3061c7b92f6d4cb4bcdf227d966ac696~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?">
</p>

### Use Gitpod

Open the project in Gitpod (free online dev environment for GitHub) and start coding immediately.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/pure-admin/vue-pure-admin)

## Install and use

- Get the project code

```bash
git clone https://github.com/pure-admin/vue-pure-admin.git
or
git clone https://gitee.com/yiming_chang/vue-pure-admin.git
```

- Installation dependencies

```bash
cd vue-pure-admin

pnpm install

```

- run

```bash
pnpm serve
```

- build

```bash
pnpm build
```

## Change Log

[CHANGELOG](./CHANGELOG.en_US.md)

## How to contribute

You are very welcome to join！[Raise an issue](https://github.com/pure-admin/vue-pure-admin/issues/new/choose) Or submit a Pull Request

**Pull Request:**

1. Fork code!
2. Create your own branch: `git checkout -b feat/xxxx`
3. Submit your changes: `git commit -am 'feat(function): add xxxxx'`
4. Push your branch: `git push origin feat/xxxx`
5. submit`pull request`

## Git Contribution submission specification

- reference [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) specification ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` Add new features
  - `fix` Fix the problem/BUG
  - `style` The code style is related and does not affect the running result
  - `perf` Optimization/performance improvement
  - `refactor` Refactor
  - `revert` Undo edit
  - `test` Test related
  - `docs` Documentation/notes
  - `chore` Dependency update/scaffolding configuration modification etc.
  - `workflow` Workflow improvements
  - `ci` Continuous integration
  - `types` Type definition file changes
  - `wip` In development

## Browser support

The `Chrome 80+` browser is recommended for local development

Support modern browsers, not IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                             not support                                                                                              |                                                                                            last 2 versions                                                                                             |                                                                                                  last 2 versions                                                                                                  |                                                                                                last 2 versions                                                                                                |                                                                                                last 2 versions                                                                                                |

## Maintainer

[xiaoxian521](https://github.com/xiaoxian521)、[Ten-K](https://github.com/Ten-K)

## Donate

If you think this project is helpful to you, you can help the author buy a glass of juice 🍹 Show your support

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f69bf13c5b854ed5b699807cafa0e3ce~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?" width="150px" height="150px" />

## License

In principle, no fees and copyrights are charged, and you can use it with confidence, but if you need secondary open source, please contact the author for permission!

[MIT © xiaoxian521-2023](./LICENSE)

## Backers

Thank you very much for your support, I believe the project will get better and better :heart:

|                                                                xueyuheng                                                                 |                                                                taolei1990                                                                 |                                                                hang-kim                                                                 |                                                               madwolfcrazy                                                                |                                                                limuen                                                                 |                                                                BenLakes                                                                 |
| :--------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: |
| <a href="https://github.com/xueyuheng"><img src="https://avatars.githubusercontent.com/u/48202935?v=4" width="60px" height="60px" /></a> | <a href="https://github.com/taolei1990"><img src="https://avatars.githubusercontent.com/u/23173640?v=4" width="60px" height="60px" /></a> | <a href="https://github.com/hang-kim"><img src="https://avatars.githubusercontent.com/u/52914259?v=4" width="60px" height="60px" /></a> | <a href="https://github.com/madwolfcrazy"><img src="https://avatars.githubusercontent.com/u/223671?v=4" width="60px" height="60px" /></a> | <a href="https://github.com/limuen"><img src="https://avatars.githubusercontent.com/u/31790606?v=4" width="60px" height="60px" /></a> | <a href="https://github.com/BenLakes"><img src="https://avatars.githubusercontent.com/u/15206046?v=4" width="60px" height="60px" /></a> |
|                                                                mollerzhu                                                                 |                                                                  TLovers                                                                  |                                                                  cnyyk                                                                  |                                                                                                                                           |                                                                                                                                       |                                                                                                                                         |
| <a href="https://github.com/mollerzhu"><img src="https://avatars.githubusercontent.com/u/49627902?v=4" width="60px" height="60px" /></a> |  <a href="https://github.com/TLovers"><img src="https://avatars.githubusercontent.com/u/26561694?v=4" width="60px" height="60px" /></a>   |   <a href="https://github.com/cnyyk"><img src="https://avatars.githubusercontent.com/u/275233?v=4" width="60px" height="60px" /></a>    |                                                                                                                                           |                                                                                                                                       |                                                                                                                                         |

## Contributors

Thanks to all the people who contribute :heart:

<a href="https://github.com/pure-admin/vue-pure-admin/graphs/contributors"><img src="https://contrib.rocks/image?repo=pure-admin/vue-pure-admin" /></a>

## `Star`

Many thanks to the kind individuals who leave a star. Your support is much appreciated :heart:

[![Stargazers for vue-pure-admin](https://reporoster.com/stars/pure-admin/vue-pure-admin)](https://github.com/pure-admin/vue-pure-admin/stargazers)

## `Fork`

It's so cool that you study hard :heart:

[![Forkers repo roster for vue-pure-admin](https://reporoster.com/forks/pure-admin/vue-pure-admin)](https://github.com/pure-admin/vue-pure-admin/network/members)
