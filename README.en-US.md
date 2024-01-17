<h1>vue-pure-admin</h1>

![GitHub license](https://img.shields.io/github/license/pure-admin/vue-pure-admin?style=flat)
![GitHub stars](https://img.shields.io/github/stars/pure-admin/vue-pure-admin?color=fa6470&style=flat)
![GitHub forks](https://img.shields.io/github/forks/pure-admin/vue-pure-admin?style=flat)

**English** | [中文](./README.md)

## Introduction

`vue-pure-admin` is an open source, free and out-of-the-box middle and backend management system template. Completely adopts `ECMAScript` module (`ESM`) specifications to write and organize code, using the latest `Vue3`, `Vite`, `Element-Plus`, `TypeScript`, `Pinia`, `Tailwindcss` and other mainstream technologies develop

## Thin version (offering non-internationalized and internationalized versions)

The simplified version is based on the shelf extracted from [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin), which contains main functions and is more suitable for actual project development. The packaged size is introduced globally [element-plus](https://element-plus.org) is still below `2.3MB`, and the full version of the code will be permanently synchronized. After enabling `brotli` compression and `cdn` to replace the local library mode, the package size is less than `350kb`

[Click to view the non-internationalized version](https://github.com/pure-admin/pure-admin-thin)  
[Click to view Internationalization version](https://github.com/pure-admin/pure-admin-thin/tree/i18n)

## Supporting Video

[Click Watch Tutorial](https://www.bilibili.com/video/BV1kg411v7QT)  
[Click Watch UI Design](https://www.bilibili.com/video/BV17g411T7rq)

## Docs

[View vue-pure-admin documentation](https://yiming_chang.gitee.io/pure-admin-doc)  
[View @pureadmin/utils documentation](https://pure-admin-utils.netlify.app)

## Tauri

[Click Watch Tauri](https://github.com/pure-admin/tauri-pure-admin)

## Electron

[Click Watch Electron](https://github.com/pure-admin/electron-pure-admin)

## Preview

[preview station](https://yiming_chang.gitee.io/vue-pure-admin)

`PC`

<p align="center">
  <img alt="PureAdmin" src="https://xiaoxian521.github.io/hyperlink/img/vue-pure-admin/1.jpg">
  <br />
  <img alt="PureAdmin" src="https://xiaoxian521.github.io/hyperlink/img/vue-pure-admin/2.jpg">
</p>

`DarkMode`

<p align="center">
  <img alt="PureAdmin" src="https://xiaoxian521.github.io/hyperlink/img/vue-pure-admin/3.jpg">
  <br />
  <img alt="PureAdmin" src="https://xiaoxian521.github.io/hyperlink/img/vue-pure-admin/4.jpg">
</p>

`Mobile`

<p align="center">
  <img alt="PureAdmin" src="https://xiaoxian521.github.io/hyperlink/img/vue-pure-admin/5.jpg">
</p>

### Use Gitpod

Open the project in Gitpod (free online dev environment for GitHub) and start coding immediately.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/pure-admin/vue-pure-admin)

## Install And Use

### Pull code

#### It is recommended to use `@pureadmin/cli` scaffolding

<br/>
<img src="https://xiaoxian521.github.io/hyperlink/gif/pure-admin-cli.gif" alt="pure-admin-cli" />

1. Global installation

```bash
npm install -g @pureadmin/cli
```

2. Interactively select templates and create projects

```bash
pure create
```

[Click to view the detailed usage of @pureadmin/cli scaffolding](https://github.com/pure-admin/pure-admin-cli#pureadmincli)

#### Pull from `GitHub`

```bash
git clone https://github.com/pure-admin/vue-pure-admin.git
```

#### Pulled from `Gitee`

```bash
git clone https://gitee.com/yiming_chang/vue-pure-admin.git
```

### Install dependencies

```bash
cd vue-pure-admin

pnpm install
```

### Run platform

```bash
pnpm dev
```

### Project packaging

```bash
pnpm build
```

## Docker support

1. Customize the image named `vue-pure-admin` (please note that there is a dot `.` at the end of the command below, indicating that the `Dockerfile` file in the current path is used, and the path can be specified according to the actual situation)

```bash
docker build -t vue-pure-admin .
```

2. Port mapping and start the `docker` container (`8080:80`: indicates that the `80` port is used in the container, and the port is forwarded to the `8080` port of the host; `pure-admin`: indicates a custom container name; `vue-pure-admin`: indicates the custom image name)

```bash
docker run -dp 8080:80  --name pure-admin vue-pure-admin
```

After operating the above two commands, open `http://localhost:8080` in the browser to preview

Of course, you can also operate the `docker` project through the [Docker Desktop](https://www.docker.com/products/docker-desktop/) visual interface, as shown below

<p align="center">
  <img alt="docker-desktop" width="100%" src="https://xiaoxian521.github.io/hyperlink/img/docker-desktop.jpg">
</p>

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

reference [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) specification ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

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

It is recommended to use `Chrome`, `Edge`, and `Firefox` browsers for local development. The author commonly uses the latest version of `Chrome` browser.  
In actual use, I feel that `Firefox` is smoother in animation than other browsers, but the author is used to using `Chrome`. It depends on personal preference.  
For more detailed browser compatibility support, please see [Which browsers does Vue support? ](https://vuejs.org/about/faq.html#what-browsers-does-vue-support) and [Vite browser compatibility](https://vitejs.dev/guide/build.html#browser-compatibility)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                             not support                                                                                              |                                                                                            last 2 versions                                                                                             |                                                                                                  last 2 versions                                                                                                  |                                                                                                last 2 versions                                                                                                |                                                                                                last 2 versions                                                                                                |

## Maintainer

[xiaoxian521](https://github.com/xiaoxian521)、[Ten-K](https://github.com/Ten-K)

## License

Completely free and open source

[MIT © 2020-present, pure-admin](./LICENSE)

## `Star`

Many thanks to the kind individuals who leave a star. Your support is much appreciated :heart:

[![Stargazers repo roster for @pure-admin/vue-pure-admin](https://bytecrank.com/nastyox/reporoster/php/stargazersSVG.php?user=pure-admin&repo=vue-pure-admin)](https://github.com/pure-admin/vue-pure-admin/stargazers)

## `Fork`

It's so cool that you study hard :heart:

[![Forkers repo roster for @pure-admin/vue-pure-admin](https://bytecrank.com/nastyox/reporoster/php/forkersSVG.php?user=pure-admin&repo=vue-pure-admin)](https://github.com/pure-admin/vue-pure-admin/network/members)
