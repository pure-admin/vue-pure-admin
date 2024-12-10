## 字段含义

| 字段              | 说明                                                         |
| :---------------- | :----------------------------------------------------------- |
| `menuType`        | 菜单类型（`0`代表菜单、`1`代表`iframe`、`2`代表外链、`3`代表按钮） |
| `parentId`        |                                                              |
| `title`           | 菜单名称（兼容国际化、非国际化，如果用国际化的写法就必须在根目录的`locales`文件夹下对应添加） |
| `name`            | 路由名称（必须唯一并且和当前路由`component`字段对应的页面里用`defineOptions`包起来的`name`保持一致） |
| `path`            | 路由路径                                                     |
| `component`       | 组件路径（传`component`组件路径，那么`path`可以随便写，如果不传，`component`组件路径会跟`path`保持一致） |
| `rank`            | 菜单排序（平台规定只有`home`路由的`rank`才能为`0`，所以后端在返回`rank`的时候需要从非`0`开始 [点击查看更多](https://pure-admin.cn/pages/routerMenu/#%E8%8F%9C%E5%8D%95%E6%8E%92%E5%BA%8F-rank)） |
| `redirect`        | 路由重定向                                                   |
| `icon`            | 菜单图标                                                     |
| `extraIcon`       | 右侧图标                                                     |
| `enterTransition` | 进场动画（页面加载动画）                                     |
| `leaveTransition` | 离场动画（页面加载动画）                                     |
| `activePath`      | 菜单激活（将某个菜单激活，主要用于通过`query`或`params`传参的路由，当它们通过配置`showLink: false`后不在菜单中显示，就不会有任何菜单高亮，而通过设置`activePath`指定激活菜单即可获得高亮，`activePath`为指定激活菜单的`path`） |
| `auths`           | 权限标识（按钮级别权限设置）                                 |
| `frameSrc`        | 链接地址（需要内嵌的`iframe`链接地址）                       |
| `frameLoading`    | 加载动画（内嵌的`iframe`页面是否开启首次加载动画）           |
| `keepAlive`       | 缓存页面（是否缓存该路由页面，开启后会保存该页面的整体状态，刷新后会清空状态） |
| `hiddenTag`       | 标签页（当前菜单名称或自定义信息禁止添加到标签页）           |
| `fixedTag`        | 固定标签页（当前菜单名称是否固定显示在标签页且不可关闭）           |
| `showLink`        | 菜单（是否显示该菜单）                                       |
| `showParent`      | 父级菜单（是否显示父级菜单 [点击查看更多](https://pure-admin.cn/pages/routerMenu/#%E7%AC%AC%E4%B8%80%E7%A7%8D-%E8%AF%A5%E6%A8%A1%E5%BC%8F%E9%92%88%E5%AF%B9%E7%88%B6%E7%BA%A7%E8%8F%9C%E5%8D%95%E4%B8%8B%E5%8F%AA%E6%9C%89%E4%B8%80%E4%B8%AA%E5%AD%90%E8%8F%9C%E5%8D%95%E7%9A%84%E6%83%85%E5%86%B5-%E5%9C%A8%E5%AD%90%E8%8F%9C%E5%8D%95%E7%9A%84-meta-%E5%B1%9E%E6%80%A7%E4%B8%AD%E5%8A%A0%E4%B8%8A-showparent-true-%E5%8D%B3%E5%8F%AF)） |

