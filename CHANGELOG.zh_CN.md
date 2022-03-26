# 3.2.0 (2022-3-22)

### 🎫 Feat

- 图标选择组件
- 菜单搜索功能
- 添加结果页面
- 扩展`element-plus`时间线组件
- 扩展`element-plus`树组件，支持连接线
- 添加树形选择器，支持单选和多选

### 🍏 Perf

- 优化错误页面 UI
- 优化国际化功能
- 优化路由`rank`排序，兼容路由`meta`中`rank`字段值为`null`的情况

### 🐞 Bug fixes

- 修复菜单展开折叠在部分电脑出现卡顿的情况

# 3.1.0 (2022-3-3)

### 🎫 Feat

- iframe 支持动态加载
- 水印示例
- 打印示例（图片、表格、echarts）
- 添加运行、打包信息, 使用`lodash-unified`替换`lodash-es`,`lodash-unified`支持`ESM`同时兼容`CJS`

### 🐞 Bug fixes

- 修复在一个菜单页面内单独跳转到另一个菜单页面，路由页面跳转了但是标签页不显示的情况
- 修复后台返回动态三级及以上的路由，出现菜单与页面不对应的情况

# 3.0 (2022-2-14)

### 🎫 Feat

- 添加混合导航

### 🐞 Bug fixes

- 修复标签页 bug

# 2.9.0(2022-2-5)

### 🎫 Feat

- 添加打包大小分析，命令`pnpm report`

### 🍏 Perf

- 采用`iconify`按需引入图标，优化图标大小，减少网络请求
- 优化路由，路由可不传`showLink: true`，默认显示

# 2.8.5(2022-1-21)

### 🎫 Feat

- 添加 `WindiCSS` 支持
- 添加线上环境删 console 插件`vite-plugin-remove-console`

### ✔️ refactor

- 使用`@iconify-icons/ep`替换`@element-plus/icons-vue`

# 2.8.0(2022-1-4)

### 🎫 Feat

- 添加暗黑主题
- 添加 element-plus 自定义主题
- 添加引导页

### 🍏 Perf

- 优化国际化，兼容 vscode 插件 i18n Ally 智能提醒
- 优化后端返回路由结构
- 优化本地存储，内置四个键`responsive-configure`、`responsive-locale`、`responsive-layout`、`responsive-tags`，分别为基本配置、国际化配置、布局配置、标签页持久化配置

# 2.7.0(2021-12-18)

### 🎫 Feat

- 新增标签页复用
- 新增消息提醒模版
- 新增前端菜单树结构例子
- 重构路由，优化权限模块，带来更方便的体验
- 重构 env 环境和 http 请求，带来更方便的体验
- 目前平台的标签页强制关联了本地存储，下一步标签页默认放到内存中并支持可配置持久化标签页
- 导航菜单图标支持 fontawesome、iconfont、remixicon、element-plus/icons、自定义 svg
- 更新 font-awesome 到 5.0 版本，因为 5.0 以下的版本官方不再维护，但平台依旧会兼容 font-awesome4 版本

### 🍏 Perf

- 优化标签页，带来更好的交互体验
- 路由 title 支持直接写中文，可脱离国际化
- 路由历史模式从 env 读取并支持 base 参数
- 打包后的文件提供传统浏览器兼容性支持，配置 VITE_LEGACY 为 true

# 2.6.0(2021-11-10)

### 🎫 Feat

- 重构导航主题色，支持多种配色
- 重构登录页，插画风格

### 🍏 Perf

- 优化导航样式
- 剔除导航强依赖 vxe-table
- 同步更新 element-plus，使用 SVG Icon 替换 Font Icon

# 2.1.0(2021-10-14)

### 🎫 Feat

- 路由动画（每个路由都可添加不同动画）
- 额外图标（比如这个是新加的页面，路由菜单右上角显示个新图标）
- 抽离默认配置选项
- 完善类型文件

### 🐞 Bug fixes

- 修复 element-plus 国际化使用问题
- 修复路由问题
- 修复导航适配问题

# 2.0.1(2021-9-29)

### 🎫 Feat

- 添加 horizontal 水平模式导航

# 2.0.0(2021-4-13)

### 🎫 Chores

- 发布 2.0.0 版本
