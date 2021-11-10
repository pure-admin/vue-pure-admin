// 菜单国际化配置
// vxe-table组件国际化
import zhVxeTable from "vxe-table/lib/locale/lang/zh-CN";
import enVxeTable from "vxe-table/lib/locale/lang/en-US";

// element-plus国际化
import enLocale from "element-plus/lib/locale/lang/en";
import zhLocale from "element-plus/lib/locale/lang/zh-cn";

// 导航菜单配置
export const menusConfig = {
  zh: {
    message: {
      hshome: "首页",
      hssysManagement: "系统管理",
      hsBaseinfo: "基础信息",
      hsDict: "字典管理",
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
      hscontextmenu: "右键菜单",
      hsmenus: "多级菜单",
      hsmenu1: "菜单1",
      "hsmenu1-1": "菜单1-1",
      "hsmenu1-2": "菜单1-2",
      "hsmenu1-2-1": "菜单1-2-1",
      "hsmenu1-2-2": "菜单1-2-2",
      "hsmenu1-3": "菜单1-3",
      hsmenu2: "菜单2",
      permission: "权限管理",
      permissionPage: "页面权限",
      permissionButton: "按钮权限",
      externalLink: "外链"
    }
  },
  en: {
    message: {
      hshome: "Home",
      hssysManagement: "System Manage",
      hsBaseinfo: "Base Info",
      hsDict: "Dict Manage",
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
      hscontextmenu: "Context Menu",
      hsmenus: "MultiLevel Menu",
      hsmenu1: "Menu1",
      "hsmenu1-1": "Menu1-1",
      "hsmenu1-2": "Menu1-2",
      "hsmenu1-2-1": "Menu1-2-1",
      "hsmenu1-2-2": "Menu1-2-2",
      "hsmenu1-3": "Menu1-3",
      hsmenu2: "Menu2",
      permission: "Permission Manage",
      permissionPage: "Page Permission",
      permissionButton: "Button Permission",
      externalLink: "External Link"
    }
  }
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
      hsadd: "新增",
      hsmark: "标记/取消",
      hssave: "保存",
      hssearch: "搜索",
      hsexpendAll: "全部展开",
      hscollapseAll: "全部折叠",
      hssystemSet: "打开项目配置",
      hsdelete: "删除",
      hsreload: "重新加载",
      hscloseCurrentTab: "关闭当前标签页",
      hscloseLeftTabs: "关闭左侧标签页",
      hscloseRightTabs: "关闭右侧标签页",
      hscloseOtherTabs: "关闭其他标签页",
      hscloseAllTabs: "关闭全部标签页"
    }
  },
  en: {
    message: {
      hsLoginOut: "loginOut",
      hsfullscreen: "fullScreen",
      hsexitfullscreen: "exitFullscreen",
      hsrefreshRoute: "refreshRoute",
      hslogin: "login",
      hsadd: "Add",
      hsmark: "Mark/Cancel",
      hssave: "Save",
      hssearch: "Search",
      hsexpendAll: "Expand All",
      hscollapseAll: "Collapse All",
      hssystemSet: "Open ProjectConfig",
      hsdelete: "Delete",
      hsreload: "Reload",
      hscloseCurrentTab: "Close CurrentTab",
      hscloseLeftTabs: "Close LeftTabs",
      hscloseRightTabs: "Close RightTabs",
      hscloseOtherTabs: "Close OtherTabs",
      hscloseAllTabs: "Close AllTabs"
    }
  }
};

// 配置
// export const xxxx = {
//   zh: {
//     message: {},
//   },
//   en: {
//     message: {},
//   },
// };

const localesList = [menusConfig, buttonConfig];

export const localesConfigs = {
  zh: {
    message: Object.assign({}, ...localesList.map(v => v.zh.message)),
    ...zhVxeTable,
    ...zhLocale
  },
  en: {
    message: Object.assign({}, ...localesList.map(v => v.en.message)),
    ...enVxeTable,
    ...enLocale
  }
};
