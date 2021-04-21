// 菜单国际化配置
// vxe-table组件国际化
import zhVxeTable from "vxe-table/lib/locale/lang/zh-CN";
import enVxeTable from "vxe-table/lib/locale/lang/en-US";

export const menusConfig = {
  zh: {
    message: {
      hshome: "首页",
      hsuserManagement: "用户管理",
      hsBaseinfo: "基础信息",
      hseditor: "编辑器",
      hserror: "错误页面",
      hsfourZeroFour: "404",
      hsfourZeroOne: "401",
      hscomponents: "组件",
      hsvideo: "视频组件",
      hsmap: "地图组件",
      hsdraggable: "拖拽组件",
      hssplitPane: "切割面板",
      hsbutton: "按钮组件",
      hscropping: "图片裁剪",
      hscountTo: "数字动画",
      hsselector: "选择器组件",
      hsflowChart: "流程图",
      hsseamless: "无缝滚动",
    },
  },
  en: {
    message: {
      hshome: "Home",
      hsuserManagement: "User Manage",
      hsBaseinfo: "Base Info",
      hseditor: "Editor",
      hserror: "Error Page",
      hsfourZeroFour: "404",
      hsfourZeroOne: "401",
      hscomponents: "Components",
      hsvideo: "Video Components",
      hsmap: "Map Components",
      hsdraggable: "Draggable Components",
      hssplitPane: "Split Pane",
      hsbutton: "Button Components",
      hscropping: "Picture Cropping",
      hscountTo: "Digital Animation",
      hsselector: "Selector Components",
      hsflowChart: "Flow Chart",
      hsseamless: "Seamless Scroll",
    },
  },
};

// 按钮配置
export const buttonConfig = {
  zh: {
    message: {
      hsLoginOut: "退出系统",
      hsfullscreen: "全屏",
      hsexitfullscreen: "退出全屏",
      hsrefreshRoute: "刷新路由",
      hslogin: "登陆",
      hsregister: "注册",
      hsadd: "新增",
      hsmark: "标记/取消",
      hssave: "保存",
    },
  },
  en: {
    message: {
      hsLoginOut: "loginOut",
      hsfullscreen: "fullScreen",
      hsexitfullscreen: "exitFullscreen",
      hsrefreshRoute: "refreshRoute",
      hslogin: "login",
      hsregister: "register",
      hsadd: "Add",
      hsmark: "Mark/Cancel",
      hssave: "Save",
    },
  },
};

const localesList = [menusConfig, buttonConfig];

export const localesConfigs = {
  zh: {
    message: Object.assign({}, ...localesList.map((v) => v.zh.message)),
    ...zhVxeTable,
  },
  en: {
    message: Object.assign({}, ...localesList.map((v) => v.en.message)),
    ...enVxeTable,
  },
};
