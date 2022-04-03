const themeColors = {
  default: {
    color: "#409EFF",
    subMenuActiveText: "#fff",
    menuBg: "#001529",
    menuHover: "#4091f7",
    subMenuBg: "#0f0303",
    subMenuActiveBg: "#4091f7",
    navTextColor: "#fff",
    menuText: "rgb(254 254 254 / 65%)",
    sidebarLogo: "#002140",
    menuTitleHover: "#fff",
    menuActiveBefore: "#4091f7"
  },
  light: {
    color: "#409EFF",
    subMenuActiveText: "#409eff",
    menuBg: "#fff",
    menuHover: "#e0ebf6",
    subMenuBg: "#fff",
    subMenuActiveBg: "#e0ebf6",
    navTextColor: "#7a80b4",
    menuText: "#7a80b4",
    sidebarLogo: "#fff",
    menuTitleHover: "#000",
    menuActiveBefore: "#4091f7"
  },
  dusk: {
    color: "#f5222d",
    subMenuActiveText: "#fff",
    menuBg: "#2a0608",
    menuHover: "#e13c39",
    subMenuBg: "#000",
    subMenuActiveBg: "#e13c39",
    navTextColor: "#red",
    menuText: "rgb(254 254 254 / 65.1%)",
    sidebarLogo: "#42090c",
    menuTitleHover: "#fff",
    menuActiveBefore: "#e13c39"
  },
  volcano: {
    color: "#fa541c",
    subMenuActiveText: "#fff",
    menuBg: "#2b0e05",
    menuHover: "#e85f33",
    subMenuBg: "#0f0603",
    subMenuActiveBg: "#e85f33",
    navTextColor: "#fff",
    menuText: "rgb(254 254 254 / 65%)",
    sidebarLogo: "#441708",
    menuTitleHover: "#fff",
    menuActiveBefore: "#e85f33"
  },
  yellow: {
    color: "#fadb14",
    subMenuActiveText: "#d25f00",
    menuBg: "#2b2503",
    menuHover: "#f6da4d",
    subMenuBg: "#0f0603",
    subMenuActiveBg: "#f6da4d",
    navTextColor: "#fff",
    menuText: "rgb(254 254 254 / 65%)",
    sidebarLogo: "#443b05",
    menuTitleHover: "#fff",
    menuActiveBefore: "#f6da4d"
  },
  mingQing: {
    color: "#13c2c2",
    subMenuActiveText: "#fff",
    menuBg: "#032121",
    menuHover: "#59bfc1",
    subMenuBg: "#000",
    subMenuActiveBg: "#59bfc1",
    navTextColor: "#7a80b4",
    menuText: "#7a80b4",
    sidebarLogo: "#053434",
    menuTitleHover: "#fff",
    menuActiveBefore: "#59bfc1"
  },
  auroraGreen: {
    color: "#52c41a",
    subMenuActiveText: "#fff",
    menuBg: "#0b1e15",
    menuHover: "#60ac80",
    subMenuBg: "#000",
    subMenuActiveBg: "#60ac80",
    navTextColor: "#7a80b4",
    menuText: "#7a80b4",
    sidebarLogo: "#112f21",
    menuTitleHover: "#fff",
    menuActiveBefore: "#60ac80"
  },
  pink: {
    color: "#eb2f96",
    subMenuActiveText: "#fff",
    menuBg: "#28081a",
    menuHover: "#d84493",
    subMenuBg: "#000",
    subMenuActiveBg: "#d84493",
    navTextColor: "#7a80b4",
    menuText: "#7a80b4",
    sidebarLogo: "#3f0d29",
    menuTitleHover: "#fff",
    menuActiveBefore: "#d84493"
  },
  saucePurple: {
    color: "#722ed1",
    subMenuActiveText: "#fff",
    menuBg: "#130824",
    menuHover: "#693ac9",
    subMenuBg: "#000",
    subMenuActiveBg: "#693ac9",
    navTextColor: "#7a80b4",
    menuText: "#7a80b4",
    sidebarLogo: "#1f0c38",
    menuTitleHover: "#fff",
    menuActiveBefore: "#693ac9"
  }
};

type MultipleScopeVarsItem = {
  scopeName: string;
  path: string;
  varsContent: string;
};

export function genScssMultipleScopeVars(): MultipleScopeVarsItem[] {
  const result = [] as MultipleScopeVarsItem[];
  Object.keys(themeColors).forEach(key => {
    result.push({
      scopeName: `layout-theme-${key}`,
      varsContent: `$primary-color: ${themeColors[key].color} !default;$vxe-primary-color: $primary-color;$subMenuActiveText: ${themeColors[key].subMenuActiveText} !default;$menuBg: ${themeColors[key].menuBg} !default;$menuHover: ${themeColors[key].menuHover} !default;$subMenuBg: ${themeColors[key].subMenuBg} !default;$subMenuActiveBg: ${themeColors[key].subMenuActiveBg} !default;$navTextColor: ${themeColors[key].navTextColor} !default;$menuText: ${themeColors[key].menuText} !default;$sidebarLogo: ${themeColors[key].sidebarLogo} !default;$menuTitleHover: ${themeColors[key].menuTitleHover} !default;$menuActiveBefore: ${themeColors[key].menuActiveBefore} !default;`
    } as MultipleScopeVarsItem);
  });
  return result;
}
