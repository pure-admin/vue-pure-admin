import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/get-card-list",
    method: "post",
    response: () => {
      return {
        success: true,
        data: {
          list: [
            {
              index: 1,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL证书",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 2,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "人脸识别",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 3,
              isSetup: false,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 4,
              isSetup: false,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "SSL证书",
              description:
                "云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。"
            },
            {
              index: 5,
              isSetup: true,
              type: 3,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "SSL证书",
              description:
                "云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。"
            },
            {
              index: 6,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec 云防火墙",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 7,
              isSetup: false,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "CVM",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 8,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL证书",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 9,
              isSetup: false,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL证书",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 10,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。"
            },
            {
              index: 11,
              isSetup: true,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "云数据库",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 12,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL证书",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 13,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "云数据库",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 14,
              isSetup: false,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL证书",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 15,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "云数据库",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 16,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "CVM",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 17,
              isSetup: false,
              type: 5,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "云数据库",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 18,
              isSetup: false,
              type: 4,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "云数据库",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 19,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 20,
              isSetup: true,
              type: 4,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "SSL证书",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 21,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "云数据库",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 22,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "CVM",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 23,
              isSetup: true,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "人脸识别",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 24,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "人脸识别",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 25,
              isSetup: false,
              type: 5,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "CVM",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 26,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL证书",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 27,
              isSetup: true,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 28,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "云数据库",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 29,
              isSetup: false,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "CVM",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 30,
              isSetup: true,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 31,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "CVM",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 32,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "T-Sec 云防火墙",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 33,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "CVM",
              description:
                "云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。"
            },
            {
              index: 34,
              isSetup: false,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "SSL证书",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 35,
              isSetup: false,
              type: 1,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "云数据库",
              description:
                "基于腾讯优图强大的面部分析技术，提供包括人脸检测与分析、五官定位、人脸搜索、人脸比对、人脸"
            },
            {
              index: 36,
              isSetup: false,
              type: 4,
              banner:
                "https://tdesign.gtimg.com/tdesign-pro/face-recognition.jpg",
              name: "SSL证书",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 37,
              isSetup: true,
              type: 5,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "CVM",
              description:
                "云数据库MySQL为用户提供安全可靠，性能卓越、易于维护的企业级云数据库服务。"
            },
            {
              index: 38,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "云数据库",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 39,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "人脸识别",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 40,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "CVM",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 41,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec 云防火墙",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 42,
              isSetup: true,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "T-Sec 云防火墙",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 43,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-db.jpg",
              name: "SSL证书",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 44,
              isSetup: true,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/t-sec.jpg",
              name: "SSL证书",
              description:
                "云硬盘为您提供用于CVM的持久性数据块级存储服务。云硬盘中的数据自动地可用区内以多副本冗"
            },
            {
              index: 45,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec 云防火墙",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 46,
              isSetup: true,
              type: 2,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL证书",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            },
            {
              index: 47,
              isSetup: false,
              type: 4,
              banner: "https://tdesign.gtimg.com/tdesign-pro/cloud-server.jpg",
              name: "SSL证书",
              description:
                "腾讯安全云防火墙产品，是腾讯云安全团队结合云原生的优势，自主研发的SaaS化防火墙产品，无需客无需客无需客无需客无需客无需客无需客"
            },
            {
              index: 48,
              isSetup: false,
              type: 3,
              banner: "https://tdesign.gtimg.com/tdesign-pro/ssl.jpg",
              name: "T-Sec 云防火墙",
              description:
                "SSL证书又叫服务器证书，腾讯云为您提供证书的一站式服务，包括免费、付费证书的申请、管理及部"
            }
          ]
        }
      };
    }
  },
  {
    // https://api.github.com/repos/pure-admin/vue-pure-admin/releases?per_page=100
    url: "/releases",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          list: [
            {
              created_at: "2023-06-26T03:14:25Z",
              published_at: "2023-06-26T03:17:23Z",
              body: "# 4.5.0 (2023-06-26)\r\n\r\n### ✔️ refactor\r\n\r\n- 重构图片裁剪 `ReCropper` 组件，添加更多实用功能\r\n\r\n### 🎫 Feat\r\n\r\n- 菜单搜索功能支持拼音搜索，比如搜图片裁剪，输入 `tp` 或 `tupian` 等对应拼音即可\r\n- 添加长按指令及使用示例，该长按指令支持自定义时长的持续回调\r\n- 添加敏感词过滤功能示例\r\n- 添加汉语拼音功能示例\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复 `V4.4.0` 版本，页面开启 `keepAlive` 缓存后第一次加载并未缓存页面的问题\r\n- 修复 `RePureTableBar` 组件初始化时列设置勾选项未根据 `hide` 属性正确初始化\r\n\r\n### 🍏 Perf\r\n\r\n- 将 `VITE_PUBLIC_PATH` 默认改为 `./` 兼容更多路径场景，\r\n- 兼容 `VITE_PUBLIC_PATH` 为 `url` 的 `OSS` 场景，需将 `@pureadmin/theme` 升级至最新版"
            },
            {
              created_at: "2023-06-14T02:52:19Z",
              published_at: "2023-06-14T02:54:41Z",
              body: "# 4.4.0 (2023-06-14)\r\n\r\n### 🎫 Feat\r\n\r\n- 路由 `meta` 添加 `activePath` 属性，可将某个菜单激活（主要用于通过 `query` 或 `params` 传参的路由，当它们通过配置 `showLink: false` 后不在菜单中显示，就不会有任何菜单高亮，而通过设置 `activePath` 指定激活菜单即可获得高亮，`activePath` 为指定激活菜单的 `path` [查看详情](https://github.com/pure-admin/vue-pure-admin/commit/58cafbc73ffa27253446ee93077e1e382519ce8a#commitcomment-117834411)）\r\n- `pure-admin-table` 高级用法添加自适应内容区高度示例\r\n- 添加防抖、节流和文本复制指令并规范自定义指令用法错误时的提示以及添加使用示例\r\n- `notice` 消息提示组件空数据时添加 `el-empty` 组件\r\n- 函数式弹窗示例代码添加子组件 `prop` 为 `primitive` 类型的示例\r\n- 添加 `vscode-docker` 插件\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复国际化切换到英文模式刷新会回到中文模式\r\n- 修复搜索菜单功能的弹框遮罩未覆盖左侧菜单的问题\r\n\r\n### 🍏 Perf\r\n\r\n- 页面切换性能优化，不考虑网络的情况下，页面切换逻辑的速度差不多比之前快 `3-4` 倍 [查看优化详情](https://github.com/pure-admin/vue-pure-admin/pull/600#issuecomment-1586094078)\r\n- 优化标签页操作-路由传参模式用法\r\n- 系统管理中表格均改为自适应内容区高度，需将 `@pureadmin/table` 升级到最新版\r\n- 使用 `vueuse` 的 `useResizeObserver` 函数替换 `v-resize` 自定义指令，从测试后的表现来看性能会更好\r\n- 对未解绑的公共事件，在页面销毁时解绑"
            },
            {
              created_at: "2023-06-04T04:11:51Z",
              published_at: "2023-06-04T04:13:24Z",
              body: "# 4.3.0 (2023-06-04)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加 `docker` 支持\r\n- 添加项目版本实时更新检测功能\r\n- 完善系统管理-角色管理页面\r\n- 瀑布流组件添加无限滚动\r\n- 函数式弹框添加 `updateDialog` 更改弹框自身属性值方法\r\n- `wangeditor` 富文本添加多个富文本和自定义图片上传示例\r\n- `pure-table` 表格高级用法添加保留已选中的 `CheckBox` 选项示例\r\n- `RePureTableBar` 组件添加 `title` 插槽\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复获取验证码倒计时会有 `1s` 延时禁用的问题\r\n- 修复图标选择器未正确初始化预览问题\r\n- 修复动态路由重定向造成标签页出现重复内容\r\n- 修复强制刷新页面 `getTopMenu()` 函数获取不到 `path` 报错的问题\r\n- 修复左侧菜单折叠后突然拉升造成左侧菜单整体不显示的问题\r\n- 修复 `RePureTableBar` 关闭列设置后在 `windows` 出现滚动条的问题\r\n\r\n### 🍏 Perf\r\n\r\n- 优化标签页操作-路由传参模式用法\r\n- 优化菜单搜索功能和样式\r\n- 更新 `vscode` 代码片段\r\n- 优化 `dataThemeChange` 主题设置的初始化调用时机"
            },
            {
              created_at: "2023-05-15T07:03:57Z",
              published_at: "2023-05-15T07:04:54Z",
              body: "# 4.2.0 (2023-05-15)\r\n\r\n### 🎫 Feat\r\n\r\n- 新增分段控制器组件并适配暗黑模式\r\n- 静态路由支持配置数组格式\r\n- 函数式弹框组件添加全屏、退出全屏操作按钮\r\n- 新增组件-瀑布流 `demo`\r\n- 添加 `Exclusive` 类型互斥语法糖\r\n\r\n### 🍏 Perf\r\n\r\n- 规范 `template` 模版中路由写法，不再使用 `$route` 和 `$router`，此写法 `vue-tsc` 编译不通过"
            },
            {
              created_at: "2023-05-11T17:45:43Z",
              published_at: "2023-05-11T17:47:10Z",
              body: "# 4.1.0 (2023-05-12)\r\n\r\n### 🎫 Feat\r\n\r\n- 函数式弹框组件添加结合 `Form` 的 `demo` 示例\r\n- 封装 `element-plus` 的 `el-col` 组件\r\n- 函数式弹框组件添加 `beforeCancel` 和 `beforeSure` 回调，可暂停弹框的关闭\r\n- 完善 `系统管理-部门管理` 页面\r\n- 优化 `PureTableBar` 组件，列展示添加拖拽功能\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复开启 `keepAlive` 后点击标签页的重新加载，页面缓存还存在的问题\r\n- 修复混合模式菜单下刷新页签后左侧菜单会闪烁一下的问题\r\n\r\n### 🍏 Perf\r\n\r\n- 优化首页布局\r\n- 依赖更新到 `vue3.3+` 以及删除 `unplugin-vue-define-options` 插件"
            },
            {
              created_at: "2023-05-09T08:11:28Z",
              published_at: "2023-05-09T08:14:55Z",
              body: '# 4.0.0 (2023-05-09)\r\n\r\n[查看 4.0.0 版本优化细节](https://github.com/pure-admin/vue-pure-admin/issues/428#issuecomment-1422191158)\r\n\r\n### ✔️ refactor\r\n\r\n- 采用 `css` 伪类 `before` 写法重构菜单的激活背景，类似于 [ant.design-menu](https://ant.design/components/menu-cn#components-menu-demo-inline-collapsed)\r\n\r\n### 🎫 Feat\r\n\r\n- 优化菜单名称右侧的额外图标，使其支持更多图标渲染模式\r\n- 可配置首页菜单显示与隐藏\r\n- 将本地响应式存储的命名空间提升到全局配置中\r\n- 新增函数式弹框组件以及 `demo` 示例，使用更便捷\r\n- `PureTableBar` 组件添加列展示功能\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复当菜单折叠或展开时首页 `echarts` 图表未自适应容器\r\n- 修复当只有一个子菜单时，搜索功能搜索不到该子菜单问题\r\n- 修复全局配置 `Theme` 为 `light` 清空缓存重新登录主题配置不生效的问题\r\n- 修复菜单搜索功能弹框打开后搜索框未自动聚集的问题\r\n- 修复按 `ESC` 退出全屏后，工具栏按钮文案展示问题\r\n- 修复移动端通知栏 `tooltip` 点击穿透问题\r\n- 修复当左侧菜单收起后，切换到 `horizontal` 导航模式时文字不展示的问题\r\n- 修复导航 `tab` 关闭其他标签页无法重置状态问题\r\n- 修复 `getHistoryMode` 函数中环境变量未初始化带来的页面热更新报错\r\n- 修复导航 `tab` 过多导致关闭左侧标签页无法正常显示\r\n- 修复点击内容区全屏报错问题\r\n- 修复混合导航下打开 `showLink:false` 页面并刷新后，左侧导航栏一直处于加载状态的问题\r\n- 修复混合模式导航下调用 `initRouter` 函数导致左侧导航内存溢出问题\r\n- 修复关闭左侧、右侧、其他、全部标签页操作时缓存页面并没有销毁问题\r\n- 修复路由通过 `query` 或 `params` 传参，开启缓存后关闭标签页缓存失效问题\r\n- 修复 `params` 路由传参模式下，面包屑无法找到父级路径问题\r\n\r\n### 🍏 Perf\r\n\r\n- 优化 `RePureTableBar` 组件的 `buttons` 具名插槽\r\n- 优化导航样式以及菜单折叠动画\r\n- 优化菜单名称右侧的额外图标，使其支持更多图标渲染模式\r\n- 优化 `logo` 图和文字布局以及统一配置\r\n- 路由信息 `showLink` 设置成 `false` 后，当前路由信息不添加到标签页\r\n- 导出 `addPathMatch` 函数\r\n- `pinia` 中所有 `getters` 改为官方推荐写法，`this` 改成 `state` 可自动推导类型\r\n- 适配最新版 `pure-table` 的 `api`\r\n- 忽略 `sourcemap-codec` 和 `stable` 依赖包的 `deprecation` 警告\r\n- 从 `tsconfig.json` 文件中移除 `"incremental": true`\r\n- 更新 `stylelint` 以及相关配置至最新，强化样式校验\r\n- 面包屑去首页化，根据选择的菜单对应显示，首页不在固定到面包屑里，并优化面包屑页面的路由监听'
            },
            {
              created_at: "2022-12-26T06:31:04Z",
              published_at: "2022-12-26T06:32:38Z",
              body: "# 3.9.7 (2022-12-26)\r\n\r\n### 🍏 Perf\r\n\r\n- 使用 `path.posix.resolve` 替代 `path.resolve` 避免 `windows` 环境下使用 `electron` 出现盘符问题\r\n- 默认关闭 `CachingAsyncRoutes` 动态路由缓存本地，使其在开发环境下调试更方便，不用每次修改动态路由都要先清空本地缓存的动态路由，更推荐在生产环境开启"
            },
            {
              created_at: "2022-12-19T04:14:18Z",
              published_at: "2022-12-19T04:15:41Z",
              body: "# 3.9.6 (2022-12-19)\r\n\r\n### 🎫 Chores\r\n\r\n- 升级 `vite4` 版本\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复 `tailwind.css` 错误的引入方式导致 `vite` 的 `hmr` 慢的问题\r\n\r\n### 🍏 Perf\r\n\r\n- 更新 [@pureadmin/theme](https://github.com/pure-admin/pure-admin-theme) 至最新版，带来更友好的类型提示\r\n- 优化 [PureTableBar](https://github.com/xiaoxian521/vue-pure-admin/tree/main/src/components/RePureTableBar) 组件\r\n- 优化系统管理页面业务代码，带来更好的代码参考"
            },
            {
              created_at: "2022-12-13T06:19:31Z",
              published_at: "2022-12-13T06:20:30Z",
              body: "# 3.9.5 (2022-12-13)\r\n\r\n### ✔️ refactor\r\n\r\n- 完全移除了 `lodash` 和其相关库\r\n  [点击此处查看为什么移除？如何自行集成？](https://yiming_chang.gitee.io/pure-admin-doc/pages/FAQ/#%E5%B9%B3%E5%8F%B0%E5%9C%A8-v3-9-5-%E7%89%88%E6%9C%AC%E5%AE%8C%E5%85%A8%E7%A7%BB%E9%99%A4%E4%BA%86-lodash-%E5%92%8C%E5%85%B6%E7%9B%B8%E5%85%B3%E5%BA%93-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A7%BB%E9%99%A4-%E5%A6%82%E4%BD%95%E8%87%AA%E8%A1%8C%E9%9B%86%E6%88%90)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加 `@pureadmin/table` 表格动态列示例\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复动态路由 `rank` 问题\r\n- 修复暗黑主题样式问题\r\n\r\n### 🍏 Perf\r\n\r\n- 优化路由 `rank` ，当 `rank` 不存在时，根据顺序自动创建，首页路由永远在第一位"
            },
            {
              created_at: "2022-12-05T05:59:54Z",
              published_at: "2022-12-05T06:04:01Z",
              body: "# 3.9.4 (2022-12-05)\r\n\r\n### ✔️ refactor\r\n\r\n- 完全移除了 `vxe-table`，移除后，完整版整体打包大小减少 `1.82MB`，首启动时长基本和精简版持平 🐮\r\n  [点击此处查看为什么移除？如何自行集成？](https://yiming_chang.gitee.io/pure-admin-doc/pages/FAQ/#%E5%B9%B3%E5%8F%B0%E5%9C%A8-v3-9-4-%E7%89%88%E6%9C%AC%E5%AE%8C%E5%85%A8%E7%A7%BB%E9%99%A4%E4%BA%86-vxe-table-%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A7%BB%E9%99%A4-%E5%A6%82%E4%BD%95%E8%87%AA%E8%A1%8C%E9%9B%86%E6%88%90)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加 `@pureadmin/table` 表格选择器（单选、多选）示例"
            },
            {
              created_at: "2022-12-04T08:45:47Z",
              published_at: "2022-12-04T08:46:59Z",
              body: "# 3.9.3 (2022-12-04)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加 `@pureadmin/table` 分页和加载动画示例\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复开启 `CachingAsyncRoutes` 后，存入本地存储的动态路由改变造成刷新页面空白的问题\r\n- 修复菜单折叠后 `Tooltip` 显示异常\r\n\r\n### 🍏 Perf\r\n\r\n- 扩展本地图标使用方式，完整版首启动再次减少 `13` 个请求\r\n- 当菜单加载慢时，添加 `loading` 动画，优化用户体验\r\n- 主题初始化放在 `onBeforeMount` 里，避免初始化页面闪烁"
            },
            {
              created_at: "2022-12-03T07:02:17Z",
              published_at: "2022-12-03T07:03:09Z",
              body: "# 3.9.2 (2022-12-03)\r\n\r\n### 🍏 Perf\r\n\r\n- 全局覆盖 `element-plus` 的 `el-dialog`、`el-drawer`、`el-message-box`、`el-notification` 组件右上角关闭图标的样式，使其表现更鲜明 [具体代码修改记录](https://github.com/xiaoxian521/vue-pure-admin/commit/c80818d792276666aaea4b18413a0f08777f2ed1)\r\n- 打包输出信息兼容不同打包输出路径\r\n- 优化一些动画"
            },
            {
              created_at: "2022-12-02T11:32:48Z",
              published_at: "2022-12-02T11:33:45Z",
              body: "# 3.9.1 (2022-12-02)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加 `CachingAsyncRoutes` 是否开启动态路由缓存本地的全局配置，默认 `true`\r\n- 添加 `TooltipEffect` 全局配置，可配置平台主体所有 `el-tooltip` 的 `effect` 属性，默认 `light`，不影响业务代码\r\n- 添加目录、菜单文字超出显示 `Tooltip` 文字提示演示\r\n\r\n### 🍏 Perf\r\n\r\n- 优化 `initRouter` 方法，兼容 `sso` 场景\r\n- 面包屑动画样式优化"
            },
            {
              created_at: "2022-11-30T06:11:08Z",
              published_at: "2022-11-30T06:12:32Z",
              body: "# 3.9.0 (2022-11-30)\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复退出全屏时文字过长导致页面出现滚动条后带来的抖动问题\r\n- 修复一些类型错误\r\n\r\n### 🍏 Perf\r\n\r\n- perf: 首屏加载大优化，对比 `3.9.0` 之前版本，首屏请求减少 `71` 个，首屏加载资源减少 `4.1 MB`"
            },
            {
              created_at: "2022-11-27T17:25:43Z",
              published_at: "2022-11-27T17:27:59Z",
              body: "# 3.8.7 (2022-11-28)\r\n\r\n### 🍏 Perf\r\n\r\n- perf: 打包大优化，请务必升级！使用 `unplugin-vue-define-options` 替换 `unplugin-vue-macros` ，打包速度提升数倍，使用 `unplugin-vue-macros` 以性能中等偏上的 `mac` 为例完整版打包时长为 `6` 分钟 😭，使用 `unplugin-vue-define-options` 替换后，相同电脑下打包时长为 `50` 秒 ☺️"
            },
            {
              created_at: "2022-11-27T08:34:46Z",
              published_at: "2022-11-27T08:35:49Z",
              body: "# 3.8.6 (2022-11-27)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加 `message` 消息提示函数，兼容 `Element Plus` 和 `Ant Design` 两种 `Message` 样式风格，使用和打包大小成本极低并适配暗黑模式，真香 😂\r\n\r\n### 🍏 Perf\r\n\r\n- perf: 无需安装 `@vue/runtime-core` ，兼容所有 `element-plus` 组件的 `volar` 提示"
            },
            {
              created_at: "2022-11-26T16:03:19Z",
              published_at: "2022-11-26T16:04:41Z",
              body: "# 3.8.5 (2022-11-26)\r\n\r\n### 🍏 Perf\r\n\r\n- 大优化，移除 `@pureadmin/components` 并采用兼容写法，平台打包大小在未启用压缩前对比优化前减少 `0.4` MB , 首屏请求减少 `2.3` MB 的资源，这对于 [精简版](https://github.com/xiaoxian521/pure-admin-thin) 来说是非常大的优化，精简版已经同步代码"
            },
            {
              created_at: "2022-11-26T07:07:07Z",
              published_at: "2022-11-26T07:08:11Z",
              body: "# 3.8.0 (2022-11-26)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加 `@pureadmin/table` 多种数据格式（深层结构）示例\r\n- 添加 `@pureadmin/table` 图像预览示例\r\n- 添加 `@pureadmin/table` 行、列拖拽示例\r\n- 添加 `@pureadmin/table` 右键菜单示例\r\n- 添加 `@pureadmin/table` 导出 `Excel` 示例\r\n- 添加 `@pureadmin/table` 编辑单元格示例\r\n- 添加 `@pureadmin/table` 水印示例\r\n- 添加 `@pureadmin/table` 打印示例\r\n- 添加 `@pureadmin/table` 内嵌 `echarts` 图表示例\r\n- 添加 `svgo` 压缩平台所有 `svg` 文件，减少体积\r\n\r\n### 🍏 Perf\r\n\r\n- 静态路由平台自动导入，无需手动引入\r\n- 更完善的全局类型提示\r\n- 优化 `vite` 依赖预构建在平台里的配置，页面切换加载速度显著加快"
            },
            {
              created_at: "2022-11-21T17:00:04Z",
              published_at: "2022-11-21T17:00:42Z",
              body: "# 3.7.1 (2022-11-22)\r\n\r\n### 🔥 hotfix\r\n\r\n- 修复在未开启标签页缓存时退出登录，可能存在标签页未重置的问题"
            },
            {
              created_at: "2022-11-21T09:14:22Z",
              published_at: "2022-11-21T09:15:24Z",
              body: "# 3.7.0 (2022-11-21)\r\n\r\n### ✔️ refactor\r\n\r\n- 使用 `intro.js` 替换 `driver.js`\r\n\r\n### 🎫 Feat\r\n\r\n- 添加前端单点登录，测试地址 https://yiming_chang.gitee.io/vue-pure-admin/#/pure-table/index?username=sso&roles=admin&accessToken=eyJhbGciOiJIUzUxMiJ9.admin\r\n- 为 [@pureadmin/table](https://github.com/xiaoxian521/pure-admin-table) 添加更多的示例和 `element-plus` 的 [table](https://element-plus.org/zh-CN/component/table.html) 示例保持一致\r\n- 丰富水印功能页面（支持自定义各种颜色、阴影、文字、额外属性、设置不可删除水印以及给指定元素设置水印）\r\n- 优化菜单，添加 `MenuArrowIconNoTransition` 全局配置，在 `public/platform-config.json` 中配置即可，对于出现左侧菜单模式，菜单展开卡顿的可设置 `MenuArrowIconNoTransition: true` 即可解决\r\n- 更换表单设计器组件演示\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复页内菜单带参互相跳转，标签没有选中高亮\r\n\r\n### 🍏 Perf\r\n\r\n- 删除已废弃的 `$baseUrl`\r\n- 兼容引入某个库导致 `global is not defined` 报错，将 `src/utils/globalPolyfills.ts` 文件引入 `src/main.ts` 即可解决\r\n- 删除 `@vitejs/plugin-legacy`，`vue3` 无法通过任何工具使其支持 `ie`"
            },
            {
              created_at: "2022-11-10T04:17:05Z",
              published_at: "2022-11-10T04:18:18Z",
              body: "# 3.6.4 (2022-11-10)\r\n\r\n### 🎫 Feat\r\n\r\n- 菜单图标 `icon` 支持使用在线图标\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复 `vxe-button` 鼠标覆盖后字体颜色问题以及一些别的样式问题\r\n\r\n### 🍏 Perf\r\n\r\n- 优化路由守卫，如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面\r\n- 将 `baseURL` 和全局环境代理删除，可直接在 `vite.config.ts` 编写，即方便又支持多个代理地址"
            },
            {
              created_at: "2022-11-01T08:18:12Z",
              published_at: "2022-11-01T08:19:22Z",
              body: "# 3.6.3 (2022-11-01)\r\n\r\n### 🎫 Feat\r\n\r\n- 静态资源分类打包\r\n- 添加弹幕组件 `demo`\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复 `tailwindcss` 最新版新增的 `collapse` 属性与平台 `class` 类名冲突\r\n- 修复当 `token` 过期后，如果页面有多个请求会重复刷新 `token`"
            },
            {
              created_at: "2022-10-27T04:58:44Z",
              published_at: "2022-10-27T04:59:32Z",
              body: "# 3.6.2 (2022-10-27)\r\n\r\n### ✔️ refactor\r\n\r\n- 使用`@/`别名替换`/@/`别名"
            },
            {
              created_at: "2022-10-26T18:42:33Z",
              published_at: "2022-10-26T18:43:31Z",
              body: "# 3.6.1 (2022-10-27)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加打包是否启动`cdn`替换本地库配置，默认`false`不启动\r\n- 添加打包构建可选`gzip`与`brotli`压缩模式\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复`title`过长显示样式问题\r\n- 修复路由中父级`name`不应和子级`name`重复，会造成重定向跳转`404`问题\r\n\r\n### 🍏 Perf\r\n\r\n- 升级`axios`至最新版"
            },
            {
              created_at: "2022-10-25T05:07:18Z",
              published_at: "2022-10-25T05:08:18Z",
              body: "# 3.6.0 (2022-10-25)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加文件下载`demo`\r\n- 添加打字机组件`demo`\r\n- 添加`json`编辑器`demo`\r\n\r\n### ✔️ refactor\r\n\r\n- 重构权限模块，采用目前最常用的`RBAC`（Role-Based Access List）: 基于角色的权限控制（ 用户 -> 角色 -> 权限 ），并更新页面权限和按钮权限`demo`示例，按钮权限支持三种操作模式（组件方式判断权限、函数方式判断权限、指令方式判断权限）\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复清空缓存并返回登录页时未清空主题\r\n- 修复`horizontal`模式下`menu`在生产环境显示问题\r\n- 修复`mix`混合模式导航在生产环境左侧菜单一定机率不显示的问题\r\n- `token`过期后调用刷新`token`接口会无限循环的问题\r\n\r\n### 🍏 Perf\r\n\r\n- 从`tailwind.css`中移除不常用的`@apply`\r\n- 使用`/** */`替换`//`注释，对编辑器的智能提示更友好\r\n- 优化登录回车事件\r\n- 简化了一些函数，剔除了无用函数，优化了页面加载速度"
            },
            {
              created_at: "2022-09-10T13:44:17Z",
              published_at: "2022-09-10T13:46:11Z",
              body: "# 3.5.0 (2022-9-10)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加 `cssnano` ，打包时压缩 `css` 体积\r\n- 添加 `element-plus` 无缝滚动 `Table` 页面 demo\r\n- 开启 `vscode` 括号对指南\r\n\r\n### ✔️ refactor\r\n\r\n- 使用 `tailwindcss` 替换 `unocss`，新增 `tailwindcss` [使用文档](http://yiming_chang.gitee.io/pure-admin-doc/pages/39156f/)\r\n\r\n### 🐞 Bug fixes\r\n\r\n- `token` 过期，刷新死循环\r\n\r\n### 🍏 Perf\r\n\r\n- 重置路由时，清空缓存页面"
            },
            {
              created_at: "2022-08-23T02:31:44Z",
              published_at: "2022-08-23T02:32:49Z",
              body: "# 3.4.6 (2022-8-23)\r\n\r\n### 🐞 Bug fixes\r\n\r\n- `process` is not defined in path\r\n- 修复动态路由`children`为空数组时报错\r\n- 修复`iframe`加载失败"
            },
            {
              created_at: "2022-08-22T12:21:53Z",
              published_at: "2022-08-22T12:23:21Z",
              body: "# 3.4.5 (2022-8-22)\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复本地响应式存储对象设置问题"
            },
            {
              created_at: "2022-08-22T09:21:18Z",
              published_at: "2022-08-22T09:22:26Z",
              body: "# 3.4.0 (2022-8-22)\r\n\r\n### 🍏 Perf\r\n\r\n- 优化路由\r\n- 优化移动端兼容性\r\n- 优化路由传参（`query`、`params` 方式刷新页面不需要再开启标签页缓存也能保留参数在`url`和`标签页`上）"
            },
            {
              created_at: "2022-08-19T07:29:06Z",
              published_at: "2022-08-19T07:31:08Z",
              body: "# 3.3.5 (2022-8-19)\r\n\r\n### 🎫 Feat\r\n\r\n- 将 `element-plus` 的 `Table` 二次封装到[@pureadmin/table](https://github.com/xiaoxian521/pure-admin-table)，提供灵活的配置项并集成到平台里\r\n- 将 `element-plus` 的 `Descriptions` 二次封装到[@pureadmin/descriptions](https://github.com/xiaoxian521/pure-admin-descriptions)，提供灵活的配置项并集成到平台里\r\n- 将平台的大部分工具以及 hooks 都集中到[@pureadmin/utils](https://pure-admin-utils-docs.vercel.app/)，并删除集中到这个库里的代码，减少平台体积\r\n- 添加[unplugin-vue-define-options](https://www.npmjs.com/package/unplugin-vue-define-options)插件，页面可直接写 `defineOptions({name: 自定义名称})`\r\n- 添加项目文件、语言分析工具 [cloc](https://www.npmjs.com/package/cloc)\r\n- 添加登陆页国际化\r\n- 添加完整路由配置表类型声明\r\n- 添加虚拟列表页面 demo\r\n- 添加 `PDF` 预览页面 demo\r\n- 添加导出 `excel` 页面 demo\r\n- 添加无 `Layout` 的空白页面 demo\r\n\r\n### ✔️ refactor\r\n\r\n- 重构主题色，适配 `element-plus` 暗黑模式（同时也解决了 `3.3.0` 及更低版本中同样的元素 `css` 被多次覆盖，导致样式不好调试的问题）\r\n- 重构路由重置功能\r\n\r\n### 🍏 Perf\r\n\r\n- 兼容项目存放目录以中文命名，但我们真心不推荐中文命名，因为可能某个库没有对中文路径做转义处理，导致项目奔溃\r\n- 优化接口类型\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复路由 `showlink` 为 `false` 的异步路由，刷新后不显示\r\n- 修复当没有 `icon` 时，垂直导航菜单折叠后文字被隐藏"
            },
            {
              created_at: "2022-05-11T07:51:38Z",
              published_at: "2022-05-11T07:52:31Z",
              body: "# 3.3.0 (2022-5-11)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加用户管理页面 demo\r\n- 添加角色管理页面 demo\r\n- 添加部门管理页面 demo\r\n- 添加卡片列表页面 demo\r\n- 集成表单设计器\r\n- 新增`PPT`demo\r\n- 在功能菜单中新增防抖截流 demo\r\n- 升级`wangeditorV5`（并支持国际化和自定义主题）\r\n- 集成`tauri`版本\r\n- 新增条形码功能\r\n- 新增二维码功能\r\n- 使用`element-plus`中的`Cascader`级联选择器编写中国省市区三级、二级联动 demo\r\n- 集成`Swiper`插件\r\n- 路由支持传`component`，代表组件路径\r\n- 添加预发布打包模式\r\n- 添加关闭某个标签的[hooks](https://github.com/xiaoxian521/vue-pure-admin/commit/5e8723a031923e79f507e5a17151d3bd88a51523)\r\n\r\n### ✔️ refactor\r\n\r\n- 重构登陆页，更偏向实际业务场景\r\n- 使用`unocss`替换`windicss`，`unocss`开发环境下性能更好，没有内存泄露，而且`api`使用上兼容`windicss`\r\n\r\n### 🍏 Perf\r\n\r\n- 优化平台的`split-pane`组件样式\r\n- 优化国际化，路由不再传`i18n`字段，平台自动读取根目录`locales`文件夹下文件进行国际化匹配\r\n- 优化图标选择器\r\n- 优化`layout`显示用户信息[commit](https://github.com/xiaoxian521/vue-pure-admin/commit/56f9dc85e7fbe0637605c43577c794de9f8968aa)\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复路由初始化问题（Cannot access 'constantRoutes' before initialization）"
            },
            {
              created_at: "2022-03-21T16:25:55Z",
              published_at: "2022-03-21T16:27:00Z",
              body: "# 3.2.0 (2022-3-22)\r\n\r\n### 🎫 Feat\r\n\r\n- 图标选择组件\r\n- 菜单搜索功能\r\n- 添加结果页面\r\n- 扩展`element-plus`时间线组件\r\n- 扩展`element-plus`树组件，支持连接线\r\n- 添加树形选择器，支持单选和多选\r\n\r\n### 🍏 Perf\r\n\r\n- 优化错误页面 UI\r\n- 优化国际化功能\r\n- 优化路由`rank`排序，兼容路由`meta`中`rank`字段值为`null`的情况\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复菜单展开折叠在部分电脑出现卡顿的情况"
            },
            {
              created_at: "2022-03-03T14:57:11Z",
              published_at: "2022-03-03T14:57:55Z",
              body: "# 3.1.0 (2022-3-3)\r\n\r\n### 🎫 Feat\r\n\r\n- iframe 支持动态加载\r\n- 水印示例\r\n- 打印示例（图片、表格、echarts）\r\n- 添加运行、打包信息, 使用`lodash-unified`替换`lodash-es`,`lodash-unified`支持`ESM`同时兼容`CJS`\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复在一个菜单页面内单独跳转到另一个菜单页面，路由页面跳转了但是标签页不显示的情况\r\n- 修复后台返回动态三级及以上的路由，出现菜单与页面不对应的情况"
            },
            {
              created_at: "2022-02-14T15:19:32Z",
              published_at: "2022-02-14T15:20:32Z",
              body: "# 3.0 (2022-2-14)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加混合导航\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复标签页 bug"
            },
            {
              created_at: "2022-02-05T09:36:21Z",
              published_at: "2022-02-05T09:38:09Z",
              body: "# 2.9.0(2022-2-5)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加打包大小分析，命令`pnpm report`\r\n\r\n### 🍏 Perf\r\n\r\n- 采用`iconify`按需引入图标，优化图标大小，减少网络请求\r\n- 优化路由，路由可不传`showLink: true`，默认显示"
            },
            {
              created_at: "2022-01-21T08:46:48Z",
              published_at: "2022-01-21T08:49:38Z",
              body: "# 2.8.5(2022-1-21)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加 `WindiCSS` 支持\r\n- 添加线上环境删 console 插件`vite-plugin-remove-console`\r\n\r\n### ✔️ refactor\r\n\r\n- 使用`@iconify-icons/ep`替换`@element-plus/icons-vue`"
            },
            {
              created_at: "2022-01-04T11:52:05Z",
              published_at: "2022-01-04T11:53:17Z",
              body: "# 2.8.0(2022-1-4)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加暗黑主题\r\n- 添加 element-plus 自定义主题\r\n- 添加引导页\r\n\r\n### 🍏 Perf\r\n\r\n- 优化国际化，兼容 vscode 插件 i18n Ally 智能提醒\r\n- 优化后端返回路由结构\r\n- 优化本地存储，内置四个键`responsive-configure`、`responsive-locale`、`responsive-layout`、`responsive-tags`，分别为基本配置、国际化配置、布局配置、标签页持久化配置"
            },
            {
              created_at: "2021-12-18T05:56:21Z",
              published_at: "2021-12-18T05:57:55Z",
              body: "# 2.7.0(2021-12-18)\r\n\r\n### 🎫 Feat\r\n\r\n- 新增标签页复用\r\n- 新增消息提醒模版\r\n- 新增前端菜单树结构例子\r\n- 重构路由，优化权限模块，带来更方便的体验\r\n- 重构 env 环境和 http 请求，带来更方便的体验\r\n- 目前平台的标签页强制关联了本地存储，下一步标签页默认放到内存中并支持可配置持久化标签页\r\n- 导航菜单图标支持 fontawesome、iconfont、remixicon、element-plus/icons、自定义 svg\r\n- 更新 font-awesome 到 5.0 版本，因为 5.0 以下的版本官方不再维护，但平台依旧会兼容 font-awesome4 版本\r\n\r\n### 🍏 Perf\r\n\r\n- 优化标签页，带来更好的交互体验\r\n- 路由 title 支持直接写中文，可脱离国际化\r\n- 路由历史模式从 env 读取并支持 base 参数\r\n- 打包后的文件提供传统浏览器兼容性支持，配置 VITE_LEGACY 为 true"
            },
            {
              created_at: "2021-11-10T05:30:48Z",
              published_at: "2021-11-10T05:33:37Z",
              body: "# 2.6.0(2021-11-10)\r\n\r\n### 🎫 Feat\r\n\r\n- 重构导航主题色，支持多种配色\r\n- 重构登录页，插画风格\r\n\r\n### 🍏 Perf\r\n\r\n- 优化导航样式\r\n- 剔除导航强依赖 vxe-table\r\n- 同步更新 element-plus，使用 SVG Icon 替换 Font Icon"
            },
            {
              created_at: "2021-10-14T09:50:03Z",
              published_at: "2021-10-14T09:52:01Z",
              body: "# 2.1.0(2021-10-14)\r\n\r\n### 🎫 Feat\r\n\r\n- 路由动画（每个路由都可添加不同动画）\r\n- 额外图标（比如这个是新加的页面，路由菜单右上角显示个新图标）\r\n- 抽离默认配置选项\r\n- 完善类型文件\r\n\r\n### 🐞 Bug fixes\r\n\r\n- 修复 element-plus 国际化使用问题\r\n- 修复路由问题\r\n- 修复导航适配问题"
            },
            {
              created_at: "2021-09-28T18:32:30Z",
              published_at: "2021-09-28T18:35:41Z",
              body: "# 2.0.1(2021-9-29)\r\n\r\n### 🎫 Feat\r\n\r\n- 添加 horizontal 水平模式导航"
            },
            {
              created_at: "2021-04-13T10:53:29Z",
              published_at: "2021-04-13T10:57:50Z",
              body: "# 2.0.0(2021-4-13)\r\n\r\n### 🎫 Chores\r\n\r\n- 发布 2.0.0 版本"
            }
          ]
        }
      };
    }
  }
]);
