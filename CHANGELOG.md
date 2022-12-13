# 3.9.5 (2022-12-13)

### ✔️ refactor

- completely removed `lodash` and its related libraries
  [Click here to see Why Removed? How to integrate it yourself? ](https://yiming_chang.gitee.io/pure-admin-doc/pages/FAQ/#%E5%B9%B3%E5%8F%B0%E5%9C%A8-v3-9-5-%E7 %89%88%E6%9C%AC%E5%AE%8C%E5%85%A8%E7%A7%BB%E9%99%A4%E4%BA%86-lodash-%E5%92%8C% E5%85%B6%E7%9B%B8%E5%85%B3%E5%BA%93-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A7%BB%E9 %99%A4-%E5%A6%82%E4%BD%95%E8%87%AA%E8%A1%8C%E9%9B%86%E6%88%90)

### 🎫 Feat

- Add `@pureadmin/table` table dynamic column example

### 🐞 Bug fixes

- Fix dynamic route `rank` issue
- Fix dark theme styling issues

### 🍏 Perf

- optimize the route `rank`, when `rank` does not exist, it will be created automatically according to the order, the home page route will always be the first

# 3.9.4 (2022-12-05)

### ✔️ refactor

- Completely removed `vxe-table`, after removal, the overall package size of the full version is reduced by `1.82MB`, and the initial startup time is basically the same as the lite version 🐮
  [Click here to see Why Removed? How to integrate it yourself?](https://xiaoxian521.github.io/pure-admin-doc/pages/FAQ/#%E5%B9%B3%E5%8F%B0%E5%9C%A8-v3-9-4-%E7%89%88%E6%9C%AC%E5%AE%8C%E5%85%A8%E7%A7%BB%E9%99%A4%E4%BA%86-vxe-table-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A7%BB%E9%99%A4-%E5%A6%82%E4%BD%95%E8%87%AA%E8%A1%8C%E9%9B%86%E6%88%90)

### 🎫 Feat

- Add `@pureadmin/table` table selector (single select, multiple select) example

# 3.9.3 (2022-12-04)

### 🎫 Feat

- Add `@pureadmin/table` pagination and loading animation example

### 🐞 Bug fixes

- Fixed the problem that the refresh page would be blank due to changes in dynamic routes stored in local storage after enabling `CachingAsyncRoutes`
- Fixed `Tooltip` displayed abnormally after the menu is collapsed

### 🍏 Perf

- Expand the use of local icons, the first launch of the full version reduces `13` requests again
- When the menu loading is slow, add `loading` animation to optimize user experience
- Theme initialization is placed in `onBeforeMount` to avoid flashing of the initialization page

# 3.9.2 (2022-12-03)

### 🍏 Perf

- Global coverage of `el-dialog`, `el-drawer`, `el-message-box`, `el-notification` components of `element-plus`The style of the close icon in the upper right corner makes it more vivid [specific modification Code record](https://github.com/xiaoxian521/vue-pure-admin/commit/c80818d792276666aaea4b18413a0f08777f2ed1)
- The packaging output information is compatible with different packaging output paths
- Optimize some animations

# 3.9.1 (2022-12-02)

### 🎫 Feat

- Add `CachingAsyncRoutes` whether to enable dynamic route cache local global configuration, default `true`
- Add `TooltipEffect` global configuration, you can configure the `effect` attribute of all `el-tooltip` on the platform body, the default `light`, does not affect the business code
- Add directory, menu text exceeds display `Tooltip` text prompt demo

### 🍏 Perf

- Optimize `initRouter` method, compatible with `sso` scenario
- Breadcrumb animation style optimization

# 3.9.0 (2022-11-30)

### 🐞 Bug fixes

- Fixed the jitter problem caused by the scroll bar on the page when the text is too long when exiting the full screen
- Fix some type errors

### 🍏 Perf

- perf: Great optimization of the first screen loading. Compared with the version before `3.9.0`, the first screen requests are reduced by `71`, and the first screen loading resources are reduced by `4.1 MB`

# 3.8.7 (2022-11-28)

### 🍏 Perf

- perf: Great package optimization, please be sure to upgrade! Use `unplugin-vue-define-options` to replace `unplugin-vue-macros`, the packaging speed is increased several times, use `unplugin-vue-macros` to take `mac` with moderate performance as an example, the packaging time of the full version is` 6` minutes😭, after replacing it with `unplugin-vue-define-options`, the packaging time on the same computer is `50` seconds☺️

# 3.8.6 (2022-11-27)

### 🎫 Feat

- Add `message` message prompt function, compatible with `Element Plus` and `Ant ​​Design` two `Message` style styles, use and package size are extremely low cost and adapt to dark mode, really fragrant 😂

### 🍏 Perf

- perf: No need to install `@vue/runtime-core`, compatible with `volar` hints of all `element-plus` components

# 3.8.5 (2022-11-26)

### 🍏 Perf

- Great optimization, remove `@pureadmin/components` and use compatible writing, the package size of the platform is reduced by `0.4` MB before compression is not enabled, and the resource of `2.3` MB is reduced for the first screen request, which is for the [lite version ](https://github.com/xiaoxian521/pure-admin-thin) is a very big optimization, the streamlined version has synchronized code

# 3.8.0 (2022-11-26)

### 🎫 Feat

- Add `@pureadmin/table` multiple data format (deep structure) examples
- Add `@pureadmin/table` image preview example
- Add `@pureadmin/table` row and column drag example
- Add `@pureadmin/table` context menu example
- Add `@pureadmin/table` export `Excel` example
- Add `@pureadmin/table` edit cell example
- Add `@pureadmin/table` watermark example
- Add `@pureadmin/table` print example
- Add `@pureadmin/table` embedded `echarts` chart example
- Add `svgo` to compress all `svg` files on the platform to reduce the size

### 🍏 Perf

- The static routing platform automatically imports without manual import
- Improved global type hints
- Optimize `vite` to rely on pre-built configurations in the platform, and the loading speed of page switching is significantly accelerated

# 3.7.1 (2022-11-22)

### 🔥 hotfix

- Fixed the problem that the tab page may not be reset when logging out when the tab page cache is not turned on

# 3.7.0 (2022-11-21)

### ✔️ refactor

- Replace `driver.js` with `intro.js`

### 🎫 Feat

- Add front-end single sign-on, test address https://yiming_chang.gitee.io/vue-pure-admin/#/pure-table/index?username=sso&roles=admin&accessToken=eyJhbGciOiJIUzUxMiJ9.admin
- Add more examples for [@pureadmin/table](https://github.com/xiaoxian521/pure-admin-table) and `element-plus` [table](https://element-plus.org /zh-CN/component/table.html) example remains the same
- Rich watermark function page (supports customizing various colors, shadows, text, additional attributes, setting undeletable watermarks and setting watermarks for specified elements)
- Optimize the menu, add `MenuArrowIconNoTransition` global configuration, configure it in `public/serverConfig.json`, for the left menu mode, the menu expansion can be set `MenuArrowIconNoTransition: true` to solve
- Replacement form designer component demo

### 🐞 Bug fixes

- Repair the in-page menu with parameters to jump to each other, the label is not selected and highlighted

### 🍏 Perf

- Removed deprecated `$baseUrl`
- Compatible importing a certain library leads to `global is not defined` error, importing `src/utils/globalPolyfills.ts` file into `src/main.ts` can solve the problem
- Remove `@vitejs/plugin-legacy`, `vue3` cannot make it support `ie` through any tool

# 3.6.4 (2022-11-10)

### 🎫 Feat

- Menu icon `icon` supports using online icons

### 🐞 Bug fixes

- Fixed `vxe-button` font color issue after mouse overlay and some other style issues

### 🍏 Perf

- Optimize the routing guard, if you have logged in and there is login information, you cannot jump to the routing whitelist, but continue to stay on the current page
- Removed `baseURL` and global environment proxy, and can be written directly in `vite.config.ts`, which is convenient and supports multiple proxy addresses

# 3.6.3 (2022-11-01)

### 🎫 Feat

- Static resource classification and packaging
- Add danmaku component `demo`

### 🐞 Bug fixes

- Fix the `collapse` property added in the latest version of `tailwindcss` conflicts with the platform `class` class name
- Fix that when the `token` expires, if the page has multiple requests, the `token` will be refreshed repeatedly

# 3.6.2 (2022-10-27)

### ✔️ refactor

- Replace `/@/` alias with `@/` alias

# 3.6.1 (2022-10-27)

### 🎫 Feat

- Add whether to start `cdn` for packaging to replace the local library configuration, the default `false` does not start
- Added optional `gzip` and `brotli` compression modes for packaging builds

### 🐞 Bug fixes

- Fix `title` too long display style problem
- Fix the parent `name` in the route should not be repeated with the child `name`, which will cause redirection to jump `404` problem

### 🍏 Perf

- Upgrade `axios` to the latest version

# 3.6.0 (2022-10-25)

### 🎫 Feat

- Add file download `demo`
- Add typewriter component `demo`
- Added `json` editor `demo`

### ✔️ refactor

- Refactor the permission module, adopt the most commonly used `RBAC` (Role-Based Access List): role-based permission control (User -> Role -> Permission), and update the page permission and button permission `demo` example, button Permissions support three operation modes (judging permissions in component mode, judging permissions in function mode, and judging permissions in instruction mode)

### 🐞 Bug fixes

- Fixed the theme not being emptied when clearing the cache and returning to the login page
- Fix `menu` display problem in production environment in `horizontal` mode
- Fixed the problem that the `mix` mixed mode navigation might not be displayed in the left menu of the production environment
- After the `token` expires, calling the refresh `token` interface will cause an infinite loop

### 🍏 Perf

- Removed uncommon `@apply` from `tailwind.css`
- Replace `//` comments with `/** */`, which is more friendly to the editor's intellisense
- Optimize the login enter event
- Simplified some functions, eliminated useless functions, and optimized page loading speed

# 3.5.0 (2022-9-10)

### 🎫 Feat

- Add `cssnano` to compress the size of `css` when packaging
- Add `element-plus` seamless scrolling `Table` page demo
- Open `vscode` bracket pair guide

### ✔️ refactor

- Replace `unocss` with `tailwindcss`, add `tailwindcss` [documentation](https://xiaoxian521.github.io/pure-admin-doc/pages/39156f/)

### 🐞 Bug fixes

- `token` expires, refresh the infinite loop

### 🍏 Perf

- When resetting the route, clear the cached page

# 3.4.6 (2022-8-23)

### 🐞 Bug fixes

- `process` is not defined in path
- Fixed an error when dynamic routing `children` is an empty array
- Fixed `iframe` loading failure

# 3.4.5 (2022-8-22)

### 🐞 Bug fixes

- Fix local responsive storage object setting issue

# 3.4.0 (2022-8-22)

### 🍏 Perf

- Optimized routing
- Optimized for mobile compatibility
- Optimized routing parameters (`query`, `params` way to refresh the page does not need to open the tab page cache, the parameters can be retained on the `url` and `tab page`)

# 3.3.5 (2022-8-19)

### 🎫 Feat

- Secondary encapsulation of `Table` of `element-plus` into [@pureadmin/table](https://github.com/xiaoxian521/pure-admin-table), providing flexible configuration items and integrating into the platform
- Secondary encapsulation of `Descriptions` of `element-plus` into [@pureadmin/descriptions](https://github.com/xiaoxian521/pure-admin-descriptions), providing flexible configuration items and integrating into the platform
- Centralize most of the tools and hooks of the platform to [@pureadmin/utils](https://pure-admin-utils.netlify.app), and delete the code concentrated in this library to reduce the size of the platform
- Add [unplugin-vue-define-options](https://www.npmjs.com/package/unplugin-vue-define-options) plugin, the page can directly write `defineOptions({name: custom name})`
- Add project files, language analysis tool [cloc](https://www.npmjs.com/package/cloc)
- Added landing page internationalization
- Add full routing configuration table type declaration
- Add virtual listing page demo
- Add `PDF` preview page demo
- Added export `execl` page demo
- Added blank page demo without `Layout`

### ✔️ refactor

- Refactored the theme color to adapt to `element-plus` dark mode (also solved the problem that the same element `css` in `3.3.0` and earlier versions was overwritten many times, resulting in poor style debugging)
- Refactored route reset function

### 🍏 Perf

- The compatible project storage directory is named in Chinese, but we really do not recommend Chinese naming, because a library may not escape the Chinese path, causing the project to crash
- Optimized interface type

### 🐞 Bug fixes

- Fixed async routes with `showlink` set to `false`, not showing after refresh
- Fixed vertical navigation menu text being hidden after collapse when there is no `icon`

# 3.3.0 (2022-5-11)

### 🎫 Feat

- Add user management page demo
- Add role management page demo
- Add department management page demo
- Add card list page demo
- Integrated form designer
- Added `PPT` demo
- Added anti-shake interception demo in the function menu
- Upgrade `wangeditorV5` (and support internationalization and custom themes)
- Integrate `tauri` version
- Added barcode function
- Added QR code function
- Use the `Cascader` cascade selector in `element-plus` to write a three-level and two-level linkage demo of Chinese provinces and cities
- Integrate `Swiper` plugin
- Routing supports passing `component`, representing the component path
- Added pre-release packaging mode
- Add [hooks] to close a tag (https://github.com/xiaoxian521/vue-pure-admin/commit/5e8723a031923e79f507e5a17151d3bd88a51523)

### ✔️ refactor

- Refactored the landing page to be more inclined to the actual business scenario
- Use `unocss` instead of `windicss`, `unocss` has better performance in development environment, no memory leaks, and `api` is compatible with `windicss`

### 🍏 Perf

- Optimized the style of the `split-pane` component for the platform
- Optimize internationalization, no longer pass the `i18n` field in the route, the platform automatically reads the files in the `locales` folder of the root directory for internationalization matching
- Optimized icon selector
- Optimize `layout` to display user information [commit](https://github.com/xiaoxian521/vue-pure-admin/commit/56f9dc85e7fbe0637605c43577c794de9f8968aa)

### 🐞 Bug fixes

- Fix route initialization problem (Cannot access 'constantRoutes' before initialization)

# 3.2.0 (2022-3-22)

### 🎫 Feat

- Icon selection component
- Menu search function
- Added results page
- Extended `element-plus` timeline component
- Extended `element-plus` tree component to support connecting lines
- Add tree selector, support single and multiple selection

### 🍏 Perf

- Optimized the error page UI
- Optimize the internationalization function
- Optimized routing `rank` sorting, compatible with the case where the value of the `rank` field in the routing `meta` is `null`

### 🐞 Bug fixes

- Fixed the situation where the menu expands and folds will freeze on some computers

# 3.1.0 (2022-3-3)

### 🎫 Feat

- iframe supports dynamic loading
- Watermark example
- Print examples (pictures, tables, echarts)
- Add running and packaging information, use `lodash-unified` to replace `lodash-es`, `lodash-unified` supports `ESM` and is compatible with `CJS`

### 🐞 Bug fixes

- Fixed jumping to another menu page alone in one menu page, the routing page jumped but the tab page was not displayed
- Fixed the route that returns dynamic level 3 and above in the background, and the menu does not correspond to the page

# 3.0 (2022-2-14)

### 🎫 Feat

- Added mix navigation

### 🐞 Bug fixes

- Fix tab page bug

# 2.9.0 (2022-2-5)

### 🎫 Feat

- Added package size analysis, command `pnpm report`

### 🍏 Perf

- Use `iconify` to introduce icons on demand, optimize icon size, and reduce network requests
- Optimize the route, the route can not pass `showLink: true`, it is displayed by default

# 2.8.5 (2022-1-21)

### 🎫 Feat

- Added `WindiCSS` support
- Add online environment remove console plugin `vite-plugin-remove-console`

### ✔️ refactor

- Replace `@element-plus/icons-vue` with `@iconify-icons/ep`

# 2.8.0(2022-1-4)

### 🎫 Feat

-Added dark theme
-Add element-plus custom theme
-Add guide page

### 🍏 Perf

-Optimize internationalization, compatible with the vscode plug-in i18n Ally smart reminder
-Optimize the back-end return routing structure
-Optimize local storage, with four built-in buttons `responsive-configure`, `responsive-locale`, `responsive-layout`, `responsive-tags`, which are basic configuration, international configuration, layout configuration, and tab persistent configuration

# 2.7.0(2021-12-18)

### 🎫 Feat

- New tab reuse
- New message reminder template
- Added front-end menu tree structure example
- Refactor routing, optimize permissions modules, and bring a more convenient experience
- Refactor the env environment and http request to bring a more convenient experience
- Currently, the tabs of the platform are forced to associate with local storage. The next step is to put the tabs in the memory by default and support configurable persistent tabs
- Navigation menu icons support fontawesome, iconfont, remixicon, element-plus/icons, custom svg
- Update font-awesome to version 5.0, because versions below 5.0 are no longer officially maintained, but the platform will still be compatible with font-awesome4 version

### 🍏 Perf

- Optimize the tab page to bring a better interactive experience
- Routing title supports direct writing in Chinese, which can be separated from internationalization
- Route history mode is read from env and supports base parameter

# 2.6.0(2021-11-10)

### 🎫 Feat

- Refactored navigation theme color, supports multiple color schemes
- Refactored login page, illustration style

### 🍏 Perf

- Optimize the navigation style
- Eliminate strong navigation dependence on vxe-table
- Synchronously update element-plus, replace Font Icon with SVG Icon

# 2.1.0(2021-10-14)

### 🎫 Feat

- Route animation (each route can add different animations)
- Extra icons (for example, this is a newly added page, a new icon is displayed in the upper right corner of the routing menu)
- Extract the default configuration options
- Perfect type file

### 🐞 Bug fixes

- Fix the issue of element-plus internationalization
- Fix routing issues
- Fix navigation adaptation problem

# 2.0.1(2021-9-29)

### 🎫 Feat

- Feat horizontal nav

# 2.0.0(2021-4-13)

### 🎫 Chores

- Release 2.0.0 version
