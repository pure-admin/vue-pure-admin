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
- Packaged files provide traditional browser compatibility support, configure VITE_LEGACY to true

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
