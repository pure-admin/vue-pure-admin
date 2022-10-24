import { type RouteComponent } from "vue-router";

export interface StorageConfigs {
  version?: string;
  title?: string;
  fixedHeader?: boolean;
  hiddenSideBar?: boolean;
  multiTagsCache?: boolean;
  keepAlive?: boolean;
  locale?: string;
  layout?: string;
  theme?: string;
  darkMode?: boolean;
  grey?: boolean;
  weak?: boolean;
  hideTabs?: boolean;
  sidebarStatus?: boolean;
  epThemeColor?: string;
  showLogo?: boolean;
  showModel?: string;
  mapConfigure?: {
    amapKey?: string;
    options: {
      resizeEnable?: boolean;
      center?: number[];
      zoom?: number;
    };
  };
  username?: string;
}

export interface ResponsiveStorage {
  locale: {
    locale?: string;
  };
  layout: {
    layout?: string;
    theme?: string;
    darkMode?: boolean;
    sidebarStatus?: boolean;
    epThemeColor?: string;
  };
  configure: {
    grey?: boolean;
    weak?: boolean;
    hideTabs?: boolean;
    showLogo?: boolean;
    showModel?: string;
    multiTagsCache?: boolean;
  };
  tags?: Array<any>;
}

export interface RouteChildrenConfigsTable {
  /** 子路由地址 `必填` */
  path: string;
  /** 路由名字（对应不要重复，和当前组件的`name`保持一致）`必填` */
  name?: string;
  /** 路由重定向 `可选` */
  redirect?: string;
  /** 按需加载组件 `可选` */
  component?: RouteComponent;
  meta?: {
    /** 菜单名称（兼容国际化、非国际化，如何用国际化的写法就必须在根目录的`locales`文件夹下对应添加） `必填` */
    title: string;
    /** 菜单图标 `可选` */
    icon?: string;
    /** 菜单名称右侧的额外图标，支持`fontawesome`、`iconfont`、`element-plus-icon` `可选` */
    extraIcon?: {
      svg?: boolean;
      name?: string;
    };
    /** 是否在菜单中显示（默认`true`）`可选` */
    showLink?: boolean;
    /** 是否显示父级菜单 `可选` */
    showParent?: boolean;
    /** 页面级别权限设置 `可选` */
    roles?: Array<string>;
    /** 按钮级别权限设置 `可选` */
    auths?: Array<string>;
    /** 路由组件缓存（开启 `true`、关闭 `false`）`可选` */
    keepAlive?: boolean;
    /** 内嵌的`iframe`链接 `可选` */
    frameSrc?: string;
    /** `iframe`页是否开启首次加载动画（默认`true`）`可选` */
    frameLoading?: boolean;
    /** 页面加载动画（有两种形式，一种直接采用vue内置的`transitions`动画，另一种是使用`animate.css`写进、离场动画）`可选` */
    transition?: {
      /**
       * @description 当前路由动画效果
       * @see {@link https://next.router.vuejs.org/guide/advanced/transitions.html#transitions}
       */
      name?: string;
      /** 进场动画 */
      enterTransition?: string;
      /** 离场动画 */
      leaveTransition?: string;
    };
    // 是否不添加信息到标签页，（默认`false`）
    hiddenTag?: boolean;
    /** 动态路由可打开的最大数量 `可选` */
    dynamicLevel?: number;
  };
  /** 子路由配置项 */
  children?: Array<RouteChildrenConfigsTable>;
}

/**
 * @description 完整路由配置表
 * @see {@link https://yiming_chang.gitee.io/pure-admin-doc/pages/782b6e/#%E4%B8%80-%E9%85%8D%E7%BD%AE%E9%A1%B9}
 */
export interface RouteConfigsTable {
  /** 路由地址 `必填` */
  path: string;
  /** 路由名字（保持唯一）`可选` */
  name?: string;
  /** `Layout`组件 `可选` */
  component?: RouteComponent;
  /** 路由重定向 `可选` */
  redirect?: string;
  meta?: {
    /** 菜单名称（兼容国际化、非国际化，如何用国际化的写法就必须在根目录的`locales`文件夹下对应添加）`必填` */
    title: string;
    /** 菜单图标 `可选` */
    icon?: string;
    /** 是否在菜单中显示（默认`true`）`可选` */
    showLink?: boolean;
    /** 菜单升序排序，值越高排的越后（只针对顶级路由）`可选` */
    rank?: number;
  };
  /** 子路由配置项 */
  children?: Array<RouteChildrenConfigsTable>;
}
