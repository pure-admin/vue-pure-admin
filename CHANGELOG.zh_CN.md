# 5.9.0 (2024-12-10)

### ✔️ Refactor

- 升级`vite`至`v6`版本，升级`sass`至最新版，重构主题写法，弃用 [@pureadmin/theme](https://www.npmjs.com/package/@pureadmin/theme)，点击查看 [相关优化点细节](https://github.com/pure-admin/vue-pure-admin/pull/1188#issue-2630095115)。对于拥有 [Max版本](https://pure-admin.cn/pages/max/) 的用户平台强烈建议升级，后续`Max版本用户`会享有一套更现代、美观且自定义程度高的主题色
- 使用 [code-inspector-plugin](https://www.npmjs.com/package/code-inspector-plugin) 替换 [vite-plugin-vue-inspector](https://www.npmjs.com/package/vite-plugin-vue-inspector)

### 🎫 Feat

- 新增函数式抽屉组件
- `pure-table`添加动态表头示例

### 🐞 Bug fixes

- 修复在菜单、部门管理中，表格展开后启用或关闭全屏功能时，表格高度未自动适应的问题

### 🍏 Perf

- 优化用户管理左侧部门树的布局

# 5.8.0 (2024-08-19)

### 🎫 Feat

- 新增第二种按钮权限指令（根据登录接口返回的`permissions`字段进行判断）
- 函数式弹框`ReDialog`添加点击确认按钮后是否开启`loading`加载动画功能
- `PureTableBar`组件添加全屏和退出全屏功能
- `VxeTableBar`组件添加全屏和退出全屏功能
- `ReDialog`组件的确定按钮提供关闭按钮动画`closeLoading`功能
- 添加开发环境代码调试`vite-plugin-vue-inspector`插件，提升开发体验
- 添加`vite-plugin-checker`插件，更严格的类型和`eslint`校验

### 🐞 Bug fixes

- 修复配置路由属性`fixedTag`为`false`后当前标签页不可关闭的问题
- 修复顶部菜单模式下`logo`不可隐藏的问题

### 🍏 Perf

- 优化自定义指令的类型提示
- 优化登录页回车登录功能
- 优化移动端左侧菜单遮罩层级
- 优化系统管理-角色管理的权限功能样式
- 升级依赖，`element-plus`最新版兼容处理

# 5.7.0 (2024-06-04)

### 🎫 Feat

- 添加谷歌风格的页签

### 🐞 Bug fixes

- 修复在火狐浏览器中菜单折叠后，文字超出未隐藏的问题

# 5.6.0 (2024-05-14)

### ✔️ Refactor

- 升级`pnpm`至`v9`版本，规定`pnpm`版本`>=9`

### 🐞 Bug fixes

- 修复点击外链会跳转两次的问题

### 🍏 Perf

- 优化`ReSegmented`组件

# 5.5.0 (2024-05-07)

### 📄 Docs

文档站和完整版预览站地址更换！

- 最新文档站地址：https://pure-admin.cn
- 最新完整版预览站地址：https://pure-admin.github.io/vue-pure-admin

### ✔️ Refactor

- 重构`layout`文件命名规范，更易读

### 🎫 Feat

- 添加新组件`ReVxeTableBar`搭配`vxe-table`使用

### 🐞 Bug fixes

- 修复深色模式下设置`FixedHeader`为`false`时，背景色为白色的问题
- 修复函数式弹窗`ReDialog`点击取消按钮，延时关闭无效问题

### 🍏 Perf

- 优化账号设置-头像上传功能

# 5.4.0 (2024-04-18)

### 🎫 Feat

- 分段控制器组件添加全局禁用属性`disabled`
- 添加思维导图示例
- 函数式弹框`ReDialog`添加`Popconfirm`气泡确认框
- `pure-table`添加`headerSlot`自定义表头插槽用法示例
- 路由添加可配置的`fixedTag`属性，作用为当前菜单名称是否固定显示在标签页且不可关闭
- 添加账户设置功能页面且兼容移动端
- 升级`eslint9`，相关兼容处理
- 添加全局配置`MaxTagsLevel`属性，可设置打开标签页最大数
- 框架核心代码国际化全量覆盖（仅需处理业务代码国际化即可）

### 🐞 Bug fixes

- 修复当一个页面存在多个`RePureTableBar`组件，列无法正常拖动问题
- 修复三级菜单向左折叠后图标显示样式问题
- 修复账户设置页面，刷新后字体颜色未生效的问题
- 修复调用刷新`token`接口时，`refreshToken`参数为空的问题

### 🍏 Perf

- 优化登录接口
- 优化获取顶级菜单逻辑
- 优化请求白名单逻辑，兼容更多场景
- 简化`store`文件中导出和导入用法
- 移除非必要的`cloc`工具依赖包，它使用`GPL`开源许可证具有争议性
- 优化`src/utils/http`文件中`post`和`get`工具函数的类型

# 5.3.0 (2024-03-28)

### ✔️ Refactor

- 重构国际化文件命名规范以及演示页加上代码位置提示

### 🎫 Feat

- 添加`MQTT`示例
- 添加`docx`、`excel`文件预览示例
- `ReSegmented`分段控制器新增`size`属性，可设置三种尺寸
- `RePureTableBar`组件搭配`pure-admin-table`支持表头国际化切换

# 5.2.0 (2024-03-22)

### ✔️ Refactor

- 将全屏按钮置于顶部，使其显眼且易于操作

### 🎫 Feat

- 新增`v-ripple`指令(水波纹效果)
- 内容区添加全局`Stretch`配置，可自定义紧凑页面，轻松找到所需信息
- 添加基于`ElTour`实现的漫游式引导
- 完善角色管理-菜单权限功能，新颖的交互体验
- 添加系统监控-在线用户
- 添加系统监控-登录日志
- 添加系统监控-操作日志
- 添加系统监控-系统日志
- 添加更多更方便的`pure-admin-table`可编辑表格示例（整体编辑、单行编辑、单元格编辑）
- `ReSegmented`组件新增`block`属性，可使其适合父元素宽度
- 添加 [vue-flow](https://vueflow.dev/) 流程图示例
- 添加虚拟表格示例
- 添加甘特图示例
- 添加图形验证码示例
- 添加表单示例，可通过`JSON`格式配置生成（基础表单、弹框表单、抽屉表单、分步表单、搜索表单）
- 在左侧菜单右中侧再加一个折叠展开菜单的功能

### 🐞 Bug fixes

- 修复`windwos`下点击注册页面会出现滚动条问题
- 修复`windows`下页面切换，内容区会出现滚动条问题
- 修复`pure-table`带状态表格在深色整体风格下状态样式消失的问题
- 修复系统配置中开启灰色模式和深色整体风格，刷新页面整体风格异常

### 🍏 Perf

- 系统管理、系统监控的所有页面兼容移动端

# 5.1.0 (2024-03-02)

### ✔️ Refactor

- 重构标签页`UI`，点击关闭按钮更方便

### 🎫 Feat

- 添加多选卡片示例
- 菜单支持`a`标签右键的所有浏览器行为（在新标签页中、新窗口中打开链接，拖拽到新标签页打开等）
- 菜单搜索新增搜索历史和收藏功能

### 🐞 Bug fixes

- 修复`windows`系统下登录页出现滚动条的问题

### 🍏 Perf

- 规范注册本地图标时的命名规则，使其更好地配合图标选择器

# 5.0.0 (2024-02-26)

全面`ESM`版本

### ✔️ Refactor

- 升级`vite`至`v5`版本，规定`node`版本`>18.18.0`，`pnpm`版本`>=8.6.10`
- 使用 [vite-plugin-fake-server](https://www.npmjs.com/package/vite-plugin-fake-server) 替换 [vite-plugin-mock](https://www.npmjs.com/package/vite-plugin-mock)，使用 [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker) 替换 [mockjs](https://www.npmjs.com/package/mockjs)
- 重命名`tailwind.config.js`为`tailwind.config.ts`并更新其文件为`esm`语法
- 更新`.prettierrc.js`文件为`esm`语法
- 更新`postcss.config.js`文件为`esm`语法
- 更新`commitlint.config.js`文件为`esm`语法
- 使用`eslint.config.js`替换`.eslintrc.js`并遵循`esm`语法
- 升级`stylelint`至`16`版本并遵循`esm`语法
- 所有`search`搜索图标统一替换为`@iconify-icons/ri/search-line`它比较常用将其放入全局离线图标中
- 移除`iframe`在暗模式下的滤镜效果
- 带来更美观精致的首页
- 更干净整洁的系统配置右侧弹出面板
- 重构关于页面，整体更紧致，关键信息更突出

### 🎫 Feat

- 添加系统管理-菜单管理
- 完善系统管理-用户管理
- 内嵌`iframe`页支持设置`keepAlive`，保持页面状态
- 优化导航，弹出的菜单超出内容区自适应且可滚动
- 添加文件上传示例
- 添加整体风格自适应操作系统浅色、深色、自动主题功能
- 添加页脚
- 支持多标签页打开已经登录的系统后无需再登录并添加内免登录功能（用户可选择免登录的天数）
- 带来高级感的终端命令行
- 添加音频可视化功能示例
- 添加视频帧截取-`WebAssembly`版，支持`MP4`、`MOV`、`AVI`、`WebM`、`MKV`等主流格式
- 添加阻止键盘`F12`、浏览器默认右键菜单、页面元素选中、图片默认可拖动方法
- 二次封装`localforage`支持设置过期时间，提供完整的类型提示
- 添加`AnimateCss`选择器组件`ReAnimateSelector`
- 添加`ReText`组件，支持自动省略显示`Tooltip`功能, 支持多行省略, 高可复用性
- 添加艺术画板功能，比如可以用来绘制一些设计思想架构图
- 新增组件-可选按钮示例
- 添加常用按钮示例
- 添加颜色选择器组件示例
- 添加日期选择器组件示例
- 添加日期时间选择器示例
- 添加时间选择(器)示例
- 添加统计组件示例
- 添加标签组件示例
- 添加折叠面板组件示例
- 添加进度条组件示例
- 升级`Swiper 11`
- 添加 [vite-plugin-router-warn](https://www.npmjs.com/package/vite-plugin-router-warn) 插件，根治非必要的`vue-router`动态路由警告`No match found for location with path`

### 🐞 Bug fixes

- 修复`query`路由传参模式下，点击标签页进行切换操作时会触发两次`router`跳转问题
- 修复卡片标签页模式下，通过`query`路由传参时，离开激活的标签后仍存在`card-active`属性，导致鼠标`hover`时字体颜色未改变
- 修复`src/layout/components/appMain.vue`文件中同名词读取解析错误
- 修复内嵌页面`frameView`在隐藏标签页后高度没有自适应
- 修复路由`meta.transition.name`配置无效的问题
- 修复点击`iframe`页面无法关闭右键标签页面板以及在`iframe`页面时右键标签页面板被遮挡的问题
- 修复在路由`query`、`params`模式下点击面包屑跳转页面少参问题

### 🍏 Perf

- 优化主题色
- 标签页可按滑动力度进行左右滑动
- 接口命名规则统一为`kebab-case`串式命名法
- `el-form`的`label`和全局的`label`样式保持一致
- `VITE_PUBLIC_PATH`默认还原为 `/` 对`VITE_ROUTER_HISTORY`为`h5`模式更友好
- 优化`transformI18n`函数，国际化支持无限嵌套级别（当然平台还是推荐嵌套层级越少越好）
- 页面初始化时先加载`pinia`再加载`router`，兼容更多使用场景
- 优化请求白名单的判断逻辑
- 左侧菜单导航样式调整，优化有无`logo`时`pc`端和移动端不同的展示方式
- 升级代码规范风格相关库至最新
- 优化登录页`loading`判断
- 优化`IconSelect`图标选择器组件，提升用户体验
- 优化分段控制器组件，添加`v-model`支持
- 优化平台`logo`获取方式
- 升级`@pureadmin/theme`，带来了更友好的`esm`支持
- 优化`build/info.ts`文件中的一些函数，使其友好支持`esm`
- 优化`PureTableBar`组件的列设置弹出框，设置最大高度，超出可滚动
- 优化函数式弹框组件`ReDialog`保留关闭动画
- 对中文路径做测试，删除`sass-loader`依赖
- 打包后的代码改为默认原生支持 [ES2015](https://caniuse.com/es6) 的浏览器
- 删除会自动安装的`stylelint`插件依赖
- 增强`useRenderIcon`使用本地`svg`的方式
- 优化左侧菜单最左下角的展开、折叠按钮在亮白主题配色下的样式
- 优化所有`el-empty`的`description`内容。图标选择器内容为空时加上`el-empty`
- 左侧菜单折叠后的`tooltip`主题与整体菜单保持统一
- 更新`svgo`命令为`svgo -f . -r`（压缩当前目录下的所有`SVG`文件）
- 优化项目构建相关函数
- 增强`ReTypeit`组件，支持插槽以及所有`typeit`配置项
- 优化国际化相关处理逻辑，初始化时添加缓存以避免不必要的性能消耗

# 4.5.0 (2023-06-26)

### ✔️ Refactor

- 重构图片裁剪 `ReCropper` 组件，添加更多实用功能

### 🎫 Feat

- 菜单搜索功能支持拼音搜索，比如搜图片裁剪，输入 `tp` 或 `tupian` 等对应拼音即可
- 添加长按指令及使用示例，该长按指令支持自定义时长的持续回调
- 添加敏感词过滤功能示例
- 添加汉语拼音功能示例

### 🐞 Bug fixes

- 修复 `V4.4.0` 版本，页面开启 `keepAlive` 缓存后第一次加载并未缓存页面的问题
- 修复 `RePureTableBar` 组件初始化时列设置勾选项未根据 `hide` 属性正确初始化

### 🍏 Perf

- 将 `VITE_PUBLIC_PATH` 默认改为 `./` 兼容更多路径场景，
- 兼容 `VITE_PUBLIC_PATH` 为 `url` 的 `OSS` 场景，需将 `@pureadmin/theme` 升级至最新版

# 4.4.0 (2023-06-14)

### 🎫 Feat

- 路由 `meta` 添加 `activePath` 属性，可将某个菜单激活（主要用于通过 `query` 或 `params` 传参的路由，当它们通过配置 `showLink: false` 后不在菜单中显示，就不会有任何菜单高亮，而通过设置 `activePath` 指定激活菜单即可获得高亮，`activePath` 为指定激活菜单的 `path` [查看详情](https://github.com/pure-admin/vue-pure-admin/commit/58cafbc73ffa27253446ee93077e1e382519ce8a#commitcomment-117834411)）
- `pure-admin-table` 高级用法添加自适应内容区高度示例
- 添加防抖、节流和文本复制指令并规范自定义指令用法错误时的提示以及添加使用示例
- `notice` 消息提示组件空数据时添加 `el-empty` 组件
- 函数式弹窗示例代码添加子组件 `prop` 为 `primitive` 类型的示例
- 添加 `vscode-docker` 插件

### 🐞 Bug fixes

- 修复国际化切换到英文模式刷新会回到中文模式
- 修复搜索菜单功能的弹框遮罩未覆盖左侧菜单的问题

### 🍏 Perf

- 页面切换性能优化，不考虑网络的情况下，页面切换逻辑的速度差不多比之前快 `3-4` 倍 [查看优化详情](https://github.com/pure-admin/vue-pure-admin/pull/600#issuecomment-1586094078)
- 优化标签页操作-路由传参模式用法
- 系统管理中表格均改为自适应内容区高度，需将 `@pureadmin/table` 升级到最新版
- 使用 `vueuse` 的 `useResizeObserver` 函数替换 `v-resize` 自定义指令，从测试后的表现来看性能会更好
- 对未解绑的公共事件，在页面销毁时解绑

# 4.3.0 (2023-06-04)

### 🎫 Feat

- 添加 `docker` 支持
- 添加项目版本实时更新检测功能
- 完善系统管理-角色管理页面
- 瀑布流组件添加无限滚动
- 函数式弹框添加 `updateDialog` 更改弹框自身属性值方法
- `wangeditor` 富文本添加多个富文本和自定义图片上传示例
- `pure-table` 表格高级用法添加保留已选中的 `CheckBox` 选项示例
- `RePureTableBar` 组件添加 `title` 插槽

### 🐞 Bug fixes

- 修复获取验证码倒计时会有 `1s` 延时禁用的问题
- 修复图标选择器未正确初始化预览问题
- 修复动态路由重定向造成标签页出现重复内容
- 修复强制刷新页面 `getTopMenu()` 函数获取不到 `path` 报错的问题
- 修复左侧菜单折叠后突然拉升造成左侧菜单整体不显示的问题
- 修复 `RePureTableBar` 关闭列设置后在 `windows` 出现滚动条的问题

### 🍏 Perf

- 优化标签页操作-路由传参模式用法
- 优化菜单搜索功能和样式
- 更新 `vscode` 代码片段
- 优化 `dataThemeChange` 主题设置的初始化调用时机

# 4.2.0 (2023-05-15)

### 🎫 Feat

- 新增分段控制器组件并适配暗黑模式
- 静态路由支持配置数组格式
- 函数式弹框组件添加全屏、退出全屏操作按钮
- 新增组件-瀑布流 `demo`
- 添加 `Exclusive` 类型互斥语法糖

### 🍏 Perf

- 规范 `template` 模版中路由写法，不再使用 `$route` 和 `$router`，此写法 `vue-tsc` 编译不通过

# 4.1.0 (2023-05-12)

### 🎫 Feat

- 函数式弹框组件添加结合 `Form` 的 `demo` 示例
- 封装 `element-plus` 的 `el-col` 组件
- 函数式弹框组件添加 `beforeCancel` 和 `beforeSure` 回调，可暂停弹框的关闭
- 完善 `系统管理-部门管理` 页面
- 优化 `PureTableBar` 组件，列展示添加拖拽功能

### 🐞 Bug fixes

- 修复开启 `keepAlive` 后点击标签页的重新加载，页面缓存还存在的问题
- 修复混合模式菜单下刷新页签后左侧菜单会闪烁一下的问题

### 🍏 Perf

- 优化首页布局
- 依赖更新到 `vue3.3+` 以及删除 `unplugin-vue-define-options` 插件

# 4.0.0 (2023-05-09)

[查看 4.0.0 版本优化细节](https://github.com/pure-admin/vue-pure-admin/issues/428#issuecomment-1422191158)

### ✔️ Refactor

- 采用 `css` 伪类 `before` 写法重构菜单的激活背景，类似于 [ant.design-menu](https://ant.design/components/menu-cn#components-menu-demo-inline-collapsed)

### 🎫 Feat

- 优化菜单名称右侧的额外图标，使其支持更多图标渲染模式
- 可配置首页菜单显示与隐藏
- 将本地响应式存储的命名空间提升到全局配置中
- 新增函数式弹框组件以及 `demo` 示例，使用更便捷
- `PureTableBar` 组件添加列展示功能

### 🐞 Bug fixes

- 修复当菜单折叠或展开时首页 `echarts` 图表未自适应容器
- 修复当只有一个子菜单时，搜索功能搜索不到该子菜单问题
- 修复全局配置 `Theme` 为 `light` 清空缓存重新登录主题配置不生效的问题
- 修复菜单搜索功能弹框打开后搜索框未自动聚集的问题
- 修复按 `ESC` 退出全屏后，工具栏按钮文案展示问题
- 修复移动端通知栏 `tooltip` 点击穿透问题
- 修复当左侧菜单收起后，切换到 `horizontal` 导航模式时文字不展示的问题
- 修复导航 `tab` 关闭其他标签页无法重置状态问题
- 修复 `getHistoryMode` 函数中环境变量未初始化带来的页面热更新报错
- 修复导航 `tab` 过多导致关闭左侧标签页无法正常显示
- 修复点击内容区全屏报错问题
- 修复混合导航下打开 `showLink:false` 页面并刷新后，左侧导航栏一直处于加载状态的问题
- 修复混合模式导航下调用 `initRouter` 函数导致左侧导航内存溢出问题
- 修复关闭左侧、右侧、其他、全部标签页操作时缓存页面并没有销毁问题
- 修复路由通过 `query` 或 `params` 传参，开启缓存后关闭标签页缓存失效问题
- 修复 `params` 路由传参模式下，面包屑无法找到父级路径问题

### 🍏 Perf

- 优化 `RePureTableBar` 组件的 `buttons` 具名插槽
- 优化导航样式以及菜单折叠动画
- 优化菜单名称右侧的额外图标，使其支持更多图标渲染模式
- 优化 `logo` 图和文字布局以及统一配置
- 路由信息 `showLink` 设置成 `false` 后，当前路由信息不添加到标签页
- 导出 `addPathMatch` 函数
- `pinia` 中所有 `getters` 改为官方推荐写法，`this` 改成 `state` 可自动推导类型
- 适配最新版 `pure-table` 的 `api`
- 忽略 `sourcemap-codec` 和 `stable` 依赖包的 `deprecation` 警告
- 从 `tsconfig.json` 文件中移除 `"incremental": true`
- 更新 `stylelint` 以及相关配置至最新，强化样式校验
- 面包屑去首页化，根据选择的菜单对应显示，首页不在固定到面包屑里，并优化面包屑页面的路由监听

# 3.9.7 (2022-12-26)

### 🍏 Perf

- 使用 `path.posix.resolve` 替代 `path.resolve` 避免 `windows` 环境下使用 `electron` 出现盘符问题
- 默认关闭 `CachingAsyncRoutes` 动态路由缓存本地，使其在开发环境下调试更方便，不用每次修改动态路由都要先清空本地缓存的动态路由，更推荐在生产环境开启

# 3.9.6 (2022-12-19)

### 🎫 Chores

- 升级 `vite4` 版本

### 🐞 Bug fixes

- 修复 `tailwind.css` 错误的引入方式导致 `vite` 的 `hmr` 慢的问题

### 🍏 Perf

- 更新 [@pureadmin/theme](https://github.com/pure-admin/pure-admin-theme) 至最新版，带来更友好的类型提示
- 优化 [PureTableBar](https://github.com/pure-admin/vue-pure-admin/tree/main/src/components/RePureTableBar) 组件
- 优化系统管理页面业务代码，带来更好的代码参考

# 3.9.5 (2022-12-13)

### ✔️ Refactor

- 完全移除了 `lodash` 和其相关库
  [点击此处查看为什么移除？如何自行集成？](https://pure-admin.cn/pages/FAQ/#%E5%B9%B3%E5%8F%B0%E5%9C%A8-v3-9-5-%E7%89%88%E6%9C%AC%E5%AE%8C%E5%85%A8%E7%A7%BB%E9%99%A4%E4%BA%86-lodash-%E5%92%8C%E5%85%B6%E7%9B%B8%E5%85%B3%E5%BA%93-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A7%BB%E9%99%A4-%E5%A6%82%E4%BD%95%E8%87%AA%E8%A1%8C%E9%9B%86%E6%88%90)

### 🎫 Feat

- 添加 `@pureadmin/table` 表格动态列示例

### 🐞 Bug fixes

- 修复动态路由 `rank` 问题
- 修复暗黑主题样式问题

### 🍏 Perf

- 优化路由 `rank` ，当 `rank` 不存在时，根据顺序自动创建，首页路由永远在第一位

# 3.9.4 (2022-12-05)

### ✔️ Refactor

- 完全移除了 `vxe-table`，移除后，完整版整体打包大小减少 `1.82MB`，首启动时长基本和精简版持平 🐮
  [点击此处查看为什么移除？如何自行集成？](https://pure-admin.cn/pages/FAQ/#%E5%B9%B3%E5%8F%B0%E5%9C%A8-v3-9-4-%E7%89%88%E6%9C%AC%E5%AE%8C%E5%85%A8%E7%A7%BB%E9%99%A4%E4%BA%86-vxe-table-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A7%BB%E9%99%A4-%E5%A6%82%E4%BD%95%E8%87%AA%E8%A1%8C%E9%9B%86%E6%88%90)

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

- 全局覆盖 `element-plus` 的 `el-dialog`、`el-drawer`、`el-message-box`、`el-notification` 组件右上角关闭图标的样式，使其表现更鲜明 [具体代码修改记录](https://github.com/pure-admin/vue-pure-admin/commit/c80818d792276666aaea4b18413a0f08777f2ed1)
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

- 大优化，移除 `@pureadmin/components` 并采用兼容写法，平台打包大小在未启用压缩前对比优化前减少 `0.4` MB , 首屏请求减少 `2.3` MB 的资源，这对于 [精简版](https://github.com/pure-admin/pure-admin-thin) 来说是非常大的优化，精简版已经同步代码

# 3.8.0 (2022-11-26)

### 🎫 Feat

- 添加 `@pureadmin/table` 多种数据格式（深层结构）示例
- 添加 `@pureadmin/table` 图像预览示例
- 添加 `@pureadmin/table` 行、列拖拽示例
- 添加 `@pureadmin/table` 右键菜单示例
- 添加 `@pureadmin/table` 导出 `Excel` 示例
- 添加 `@pureadmin/table` 修改单元格示例
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

### ✔️ Refactor

- 使用 `intro.js` 替换 `driver.js`

### 🎫 Feat

- 添加前端单点登录，测试地址 https://pure-admin.github.io/vue-pure-admin/#/pure-table/index?username=sso&roles=admin&accessToken=eyJhbGciOiJIUzUxMiJ9.admin
- 为 [@pureadmin/table](https://github.com/pure-admin/pure-admin-table) 添加更多的示例和 `element-plus` 的 [table](https://element-plus.org/zh-CN/component/table.html) 示例保持一致
- 丰富水印功能页面（支持自定义各种颜色、阴影、文字、额外属性、设置不可删除水印以及给指定元素设置水印）
- 优化菜单，添加 `MenuArrowIconNoTransition` 全局配置，在 `public/platform-config.json` 中配置即可，对于出现左侧菜单模式，菜单展开卡顿的可设置 `MenuArrowIconNoTransition: true` 即可解决
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

### ✔️ Refactor

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

### ✔️ Refactor

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

### ✔️ Refactor

- 使用 `tailwindcss` 替换 `unocss`，新增 `tailwindcss` [使用文档](https://pure-admin.cn/pages/tailwindcss/)

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

- 将 `element-plus` 的 `Table` 二次封装到[@pureadmin/table](https://github.com/pure-admin/pure-admin-table)，提供灵活的配置项并集成到平台里
- 将 `element-plus` 的 `Descriptions` 二次封装到[@pureadmin/descriptions](https://github.com/pure-admin/pure-admin-descriptions)，提供灵活的配置项并集成到平台里
- 将平台的大部分工具以及 `hooks` 都集中到[@pureadmin/utils](https://pure-admin-utils.netlify.app)，并删除集中到这个库里的代码，减少平台体积
- 添加[unplugin-vue-define-options](https://www.npmjs.com/package/unplugin-vue-define-options)插件，页面可直接写 `defineOptions({name: 自定义名称})`
- 添加项目文件、语言分析工具 [cloc](https://www.npmjs.com/package/cloc)
- 添加登录页国际化
- 添加完整路由配置表类型声明
- 添加虚拟列表页面 demo
- 添加 `PDF` 预览页面 demo
- 添加导出 `excel` 页面 demo
- 添加无 `Layout` 的空白页面 demo

### ✔️ Refactor

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
- 添加关闭某个标签的[hooks](https://github.com/pure-admin/vue-pure-admin/commit/5e8723a031923e79f507e5a17151d3bd88a51523)

### ✔️ Refactor

- 重构登录页，更偏向实际业务场景
- 使用`unocss`替换`windicss`，`unocss`开发环境下性能更好，没有内存泄露，而且`api`使用上兼容`windicss`

### 🍏 Perf

- 优化平台的`split-pane`组件样式
- 优化国际化，路由不再传`i18n`字段，平台自动读取根目录`locales`文件夹下文件进行国际化匹配
- 优化图标选择器
- 优化`layout`显示用户信息[commit](https://github.com/pure-admin/vue-pure-admin/commit/56f9dc85e7fbe0637605c43577c794de9f8968aa)

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

### ✔️ Refactor

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
