export const routerArrays: Array<RouteConfigs> = [
  {
    path: "/welcome",
    parentPath: "/",
    meta: {
      title: "message.hshome",
      i18n: true,
      icon: "el-icon-s-home",
      showLink: true
    }
  }
];

export type RouteConfigs = {
  path?: string;
  parentPath?: string;
  query?: object;
  meta?: {
    title?: string;
    i18n?: boolean;
    icon?: string;
    showLink?: boolean;
    savedPosition?: boolean;
    authority?: Array<string>;
  };
  children?: RouteConfigs[];
  name?: string;
};

export type multiTagsType = {
  tags: Array<RouteConfigs>;
};

export type tagsViewsType = {
  icon: string;
  text: string;
  divided: boolean;
  disabled: boolean;
  show: boolean;
};

export interface setType {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    isClickHamburger: boolean;
  };
  device: string;
  fixedHeader: boolean;
  classes: {
    hideSidebar: boolean;
    openSidebar: boolean;
    withoutAnimation: boolean;
    mobile: boolean;
  };
  hideTabs: boolean;
}

export type childrenType = {
  path?: string;
  noShowingChildren?: boolean;
  children?: childrenType[];
  value: unknown;
  meta?: {
    icon?: string;
    title?: string;
    i18n?: boolean;
    extraIcon?: {
      svg?: boolean;
      name?: string;
    };
  };
  showTooltip?: boolean;
};

export type themeColorsType = {
  rgb: string;
  themeColor: string;
};

export interface scrollbarDomType extends HTMLElement {
  wrap?: {
    offsetWidth: number;
  };
}
