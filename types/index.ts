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
