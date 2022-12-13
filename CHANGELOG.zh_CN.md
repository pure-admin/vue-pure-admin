# 3.9.5 (2022-12-13)

### ✔️ refactor

- 完全移除了 `lodash` 和其相关库
  [点击此处查看为什么移除？如何自行集成？](https://yiming_chang.gitee.io/pure-admin-doc/pages/FAQ/#%E5%B9%B3%E5%8F%B0%E5%9C%A8-v3-9-5-%E7%89%88%E6%9C%AC%E5%AE%8C%E5%85%A8%E7%A7%BB%E9%99%A4%E4%BA%86-lodash-%E5%92%8C%E5%85%B6%E7%9B%B8%E5%85%B3%E5%BA%93-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A7%BB%E9%99%A4-%E5%A6%82%E4%BD%95%E8%87%AA%E8%A1%8C%E9%9B%86%E6%88%90)

### 🎫 Feat

- 添加 `@pureadmin/table` 表格动态列示例

### 🐞 Bug fixes

- 修复动态路由 `rank` 问题
- 修复暗黑主题样式问题

### 🍏 Perf

- 优化路由 `rank` ，当 `rank` 不存在时，根据顺序自动创建，首页路由永远在第一位

# 3.9.4 (2022-12-05)

### ✔️ refactor

- 完全移除了 `vxe-table`，移除后，完整版整体打包大小减少 `1.82MB`，首启动时长基本和精简版持平 🐮
  [点击此处查看为什么移除？如何自行集成？](https://yiming_chang.gitee.io/pure-admin-doc/pages/FAQ/#%E5%B9%B3%E5%8F%B0%E5%9C%A8-v3-9-4-%E7%89%88%E6%9C%AC%E5%AE%8C%E5%85%A8%E7%A7%BB%E9%99%A4%E4%BA%86-vxe-table-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A7%BB%E9%99%A4-%E5%A6%82%E4%BD%95%E8%87%AA%E8%A1%8C%E9%9B%86%E6%88%90)

### 🎫 Feat

- 添加 `@pureadmin/table` 表格选择器（单选、多选）示例

# 3.9.3 (2022-12-04)

### 🎫 Feat

- 添加 `@pureadmin/table` 分页和加载动画示例

### 🐞 Bug fixes

- 修复开启 `CachingAsyncRoutes` 后，存入本地存储的动态路由改变造成刷新页面空白的问题
- 修复菜单折叠后 `Tooltip` 显示异常

### 🍏 Perf

- 扩展本地图标使用方式，完整版首启动再次减少 `13` 个请求
- 当菜单加载慢时，添加 `loading` 动画，优化用户体验
- 主题初始化放在 `onBeforeMount` 里，避免初始化页面闪烁

# 3.9.2 (2022-12-03)

### 🍏 Perf

- 全局覆盖 `element-plus` 的 `el-dialog`、`el-drawer`、`el-message-box`、`el-notification` 组件右上角关闭图标的样式，使其表现更鲜明 [具体代码修改记录](https://github.com/xiaoxian521/vue-pure-admin/commit/c80818d792276666aaea4b18413a0f08777f2ed1)
- 打包输出信息兼容不同打包输出路径
- 优化一些动画

# 3.9.1 (2022-12-02)

### 🎫 Feat

- 添加 `CachingAsyncRoutes` 是否开启动态路由缓存本地的全局配置，默认 `true`
- 添加 `TooltipEffect` 全局配置，可配置平台主体所有 `el-tooltip` 的 `effect` 属性，默认 `light`，不影响业务代码
- 添加目录、菜单文字超出显示 `Tooltip` 文字提示演示

### 🍏 Perf

- 优化 `initRouter` 方法，兼容 `sso` 场景
- 面包屑动画样式优化

# 3.9.0 (2022-11-30)

### 🐞 Bug fixes

- 修复退出全屏时文字过长导致页面出现滚动条后带来的抖动问题
- 修复一些类型错误

### 🍏 Perf

- perf: 首屏加载大优化，对比 `3.9.0` 之前版本，首屏请求减少 `71` 个，首屏加载资源减少 `4.1 MB`

# 3.8.7 (2022-11-28)

### 🍏 Perf

- perf: 打包大优化，请务必升级！使用 `unplugin-vue-define-options` 替换 `unplugin-vue-macros` ，打包速度提升数倍，使用 `unplugin-vue-macros` 以性能中等偏上的 `mac` 为例完整版打包时长为 `6` 分钟 😭，使用 `unplugin-vue-define-options` 替换后，相同电脑下打包时长为 `50` 秒 ☺️

# 3.8.6 (2022-11-27)

### 🎫 Feat

- 添加 `message` 消息提示函数，兼容 `Element Plus` 和 `Ant Design` 两种 `Message` 样式风格，使用和打包大小成本极低并适配暗黑模式，真香 😂

### 🍏 Perf

- perf: 无需安装 `@vue/runtime-core` ，兼容所有 `element-plus` 组件的 `volar` 提示

# 3.8.5 (2022-11-26)

### 🍏 Perf

- 大优化，移除 `@pureadmin/components` 并采用兼容写法，平台打包大小在未启用压缩前对比优化前减少 `0.4` MB , 首屏请求减少 `2.3` MB 的资源，这对于 [精简版](https://github.com/xiaoxian521/pure-admin-thin) 来说是非常大的优化，精简版已经同步代码

# 3.8.0 (2022-11-26)

### 🎫 Feat

- 添加 `@pureadmin/table` 多种数据格式（深层结构）示例
- 添加 `@pureadmin/table` 图像预览示例
- 添加 `@pureadmin/table` 行、列拖拽示例
- 添加 `@pureadmin/table` 右键菜单示例
- 添加 `@pureadmin/table` 导出 `Excel` 示例
- 添加 `@pureadmin/table` 编辑单元格示例
- 添加 `@pureadmin/table` 水印示例
- 添加 `@pureadmin/table` 打印示例
- 添加 `@pureadmin/table` 内嵌 `echarts` 图表示例
- 添加 `svgo` 压缩平台所有 `svg` 文件，减少体积

### 🍏 Perf

- 静态路由平台自动导入，无需手动引入
- 更完善的全局类型提示
- 优化 `vite` 依赖预构建在平台里的配置，页面切换加载速度显著加快

# 3.7.1 (2022-11-22)

### 🔥 hotfix

- 修复在未开启标签页缓存时退出登录，可能存在标签页未重置的问题

# 3.7.0 (2022-11-21)

### ✔️ refactor

- 使用 `intro.js` 替换 `driver.js`

### 🎫 Feat

- 添加前端单点登录，测试地址 https://yiming_chang.gitee.io/vue-pure-admin/#/pure-table/index?username=sso&roles=admin&accessToken=eyJhbGciOiJIUzUxMiJ9.admin
- 为 [@pureadmin/table](https://github.com/xiaoxian521/pure-admin-table) 添加更多的示例和 `element-plus` 的 [table](https://element-plus.org/zh-CN/component/table.html) 示例保持一致
- 丰富水印功能页面（支持自定义各种颜色、阴影、文字、额外属性、设置不可删除水印以及给指定元素设置水印）
- 优化菜单，添加 `MenuArrowIconNoTransition` 全局配置，在 `public/serverConfig.json` 中配置即可，对于出现左侧菜单模式，菜单展开卡顿的可设置 `MenuArrowIconNoTransition: true` 即可解决
- 更换表单设计器组件演示

### 🐞 Bug fixes

- 修复页内菜单带参互相跳转，标签没有选中高亮

### 🍏 Perf

- 删除已废弃的 `$baseUrl`
- 兼容引入某个库导致 `global is not defined` 报错，将 `src/utils/globalPolyfills.ts` 文件引入 `src/main.ts` 即可解决
- 删除 `@vitejs/plugin-legacy`，`vue3` 无法通过任何工具使其支持 `ie`

# 3.6.4 (2022-11-10)

### 🎫 Feat

- 菜单图标 `icon` 支持使用在线图标

### 🐞 Bug fixes

- 修复 `vxe-button` 鼠标覆盖后字体颜色问题以及一些别的样式问题

### 🍏 Perf

- 优化路由守卫，如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面
- 将 `baseURL` 和全局环境代理删除，可直接在 `vite.config.ts` 编写，即方便又支持多个代理地址

# 3.6.3 (2022-11-01)

### 🎫 Feat

- 静态资源分类打包
- 添加弹幕组件 `demo`

### 🐞 Bug fixes

- 修复 `tailwindcss` 最新版新增的 `collapse` 属性与平台 `class` 类名冲突
- 修复当 `token` 过期后，如果页面有多个请求会重复刷新 `token`

# 3.6.2 (2022-10-27)

### ✔️ refactor

- 使用`@/`别名替换`/@/`别名

# 3.6.1 (2022-10-27)

### 🎫 Feat

- 添加打包是否启动`cdn`替换本地库配置，默认`false`不启动
- 添加打包构建可选`gzip`与`brotli`压缩模式

### 🐞 Bug fixes

- 修复`title`过长显示样式问题
- 修复路由中父级`name`不应和子级`name`重复，会造成重定向跳转`404`问题

### 🍏 Perf

- 升级`axios`至最新版

# 3.6.0 (2022-10-25)

### 🎫 Feat

- 添加文件下载`demo`
- 添加打字机组件`demo`
- 添加`json`编辑器`demo`

### ✔️ refactor

- 重构权限模块，采用目前最常用的`RBAC`（Role-Based Access List）: 基于角色的权限控制（ 用户 -> 角色 -> 权限 ），并更新页面权限和按钮权限`demo`示例，按钮权限支持三种操作模式（组件方式判断权限、函数方式判断权限、指令方式判断权限）

### 🐞 Bug fixes

- 修复清空缓存并返回登录页时未清空主题
- 修复`horizontal`模式下`menu`在生产环境显示问题
- 修复`mix`混合模式导航在生产环境左侧菜单一定机率不显示的问题
- `token`过期后调用刷新`token`接口会无限循环的问题

### 🍏 Perf

- 从`tailwind.css`中移除不常用的`@apply`
- 使用`/** */`替换`//`注释，对编辑器的智能提示更友好
- 优化登录回车事件
- 简化了一些函数，剔除了无用函数，优化了页面加载速度

# 3.5.0 (2022-9-10)

### 🎫 Feat

- 添加 `cssnano` ，打包时压缩 `css` 体积
- 添加 `element-plus` 无缝滚动 `Table` 页面 demo
- 开启 `vscode` 括号对指南

### ✔️ refactor

- 使用 `tailwindcss` 替换 `unocss`，新增 `tailwindcss` [使用文档](https://yiming_chang.gitee.io/pure-admin-doc/pages/tailwindcss/)

### 🐞 Bug fixes

- `token` 过期，刷新死循环

### 🍏 Perf

- 重置路由时，清空缓存页面

# 3.4.6 (2022-8-23)

### 🐞 Bug fixes

- `process` is not defined in path
- 修复动态路由`children`为空数组时报错
- 修复`iframe`加载失败

# 3.4.5 (2022-8-22)

### 🐞 Bug fixes

- 修复本地响应式存储对象设置问题

# 3.4.0 (2022-8-22)

### 🍏 Perf

- 优化路由
- 优化移动端兼容性
- 优化路由传参（`query`、`params` 方式刷新页面不需要再开启标签页缓存也能保留参数在`url`和`标签页`上）

# 3.3.5 (2022-8-19)

### 🎫 Feat

- 将 `element-plus` 的 `Table` 二次封装到[@pureadmin/table](https://github.com/xiaoxian521/pure-admin-table)，提供灵活的配置项并集成到平台里
- 将 `element-plus` 的 `Descriptions` 二次封装到[@pureadmin/descriptions](https://github.com/xiaoxian521/pure-admin-descriptions)，提供灵活的配置项并集成到平台里
- 将平台的大部分工具以及 `hooks` 都集中到[@pureadmin/utils](https://pure-admin-utils.netlify.app)，并删除集中到这个库里的代码，减少平台体积
- 添加[unplugin-vue-define-options](https://www.npmjs.com/package/unplugin-vue-define-options)插件，页面可直接写 `defineOptions({name: 自定义名称})`
- 添加项目文件、语言分析工具 [cloc](https://www.npmjs.com/package/cloc)
- 添加登录页国际化
- 添加完整路由配置表类型声明
- 添加虚拟列表页面 demo
- 添加 `PDF` 预览页面 demo
- 添加导出 `execl` 页面 demo
- 添加无 `Layout` 的空白页面 demo

### ✔️ refactor

- 重构主题色，适配 `element-plus` 暗黑模式（同时也解决了 `3.3.0` 及更低版本中同样的元素 `css` 被多次覆盖，导致样式不好调试的问题）
- 重构路由重置功能

### 🍏 Perf

- 兼容项目存放目录以中文命名，但我们真心不推荐中文命名，因为可能某个库没有对中文路径做转义处理，导致项目奔溃
- 优化接口类型

### 🐞 Bug fixes

- 修复路由 `showlink` 为 `false` 的异步路由，刷新后不显示
- 修复当没有 `icon` 时，垂直导航菜单折叠后文字被隐藏

# 3.3.0 (2022-5-11)

### 🎫 Feat

- 添加用户管理页面 demo
- 添加角色管理页面 demo
- 添加部门管理页面 demo
- 添加卡片列表页面 demo
- 集成表单设计器
- 新增`PPT`demo
- 在功能菜单中新增防抖截流 demo
- 升级`wangeditorV5`（并支持国际化和自定义主题）
- 集成`tauri`版本
- 新增条形码功能
- 新增二维码功能
- 使用`element-plus`中的`Cascader`级联选择器编写中国省市区三级、二级联动 demo
- 集成`Swiper`插件
- 路由支持传`component`，代表组件路径
- 添加预发布打包模式
- 添加关闭某个标签的[hooks](https://github.com/xiaoxian521/vue-pure-admin/commit/5e8723a031923e79f507e5a17151d3bd88a51523)

### ✔️ refactor

- 重构登录页，更偏向实际业务场景
- 使用`unocss`替换`windicss`，`unocss`开发环境下性能更好，没有内存泄露，而且`api`使用上兼容`windicss`

### 🍏 Perf

- 优化平台的`split-pane`组件样式
- 优化国际化，路由不再传`i18n`字段，平台自动读取根目录`locales`文件夹下文件进行国际化匹配
- 优化图标选择器
- 优化`layout`显示用户信息[commit](https://github.com/xiaoxian521/vue-pure-admin/commit/56f9dc85e7fbe0637605c43577c794de9f8968aa)

### 🐞 Bug fixes

- 修复路由初始化问题（Cannot access 'constantRoutes' before initialization）

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
