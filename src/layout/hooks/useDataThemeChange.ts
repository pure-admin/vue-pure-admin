import { ref } from "vue";
import { getConfig } from "@/config";
import { find } from "lodash-unified";
import { useLayout } from "./useLayout";
import { themeColorsType } from "../types";
import { useGlobal } from "@pureadmin/utils";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import {
  darken,
  lighten,
  toggleTheme
} from "@pureadmin/theme/dist/browser-utils";

export function useDataThemeChange() {
  const { layoutTheme, layout } = useLayout();
  const themeColors = ref<Array<themeColorsType>>([
    /* 道奇蓝（默认） */
    { color: "#1b2a47", themeColor: "default" },
    /* 亮白色 */
    { color: "#ffffff", themeColor: "light" },
    /* 猩红色 */
    { color: "#f5222d", themeColor: "dusk" },
    /* 橙红色 */
    { color: "#fa541c", themeColor: "volcano" },
    /* 金色 */
    { color: "#fadb14", themeColor: "yellow" },
    /* 绿宝石 */
    { color: "#13c2c2", themeColor: "mingQing" },
    /* 酸橙绿 */
    { color: "#52c41a", themeColor: "auroraGreen" },
    /* 深粉色 */
    { color: "#eb2f96", themeColor: "pink" },
    /* 深紫罗兰色 */
    { color: "#722ed1", themeColor: "saucePurple" }
  ]);

  const { $storage } = useGlobal<GlobalPropertiesApi>();
  const dataTheme = ref<boolean>($storage?.layout?.darkMode);
  const body = document.documentElement as HTMLElement;

  /** 设置导航主题色 */
  function setLayoutThemeColor(theme = "default") {
    layoutTheme.value.theme = theme;
    toggleTheme({
      scopeName: `layout-theme-${theme}`
    });
    $storage.layout = {
      layout: layout.value,
      theme,
      darkMode: dataTheme.value,
      sidebarStatus: $storage.layout?.sidebarStatus,
      epThemeColor: $storage.layout?.epThemeColor
    };

    if (theme === "default" || theme === "light") {
      setEpThemeColor(getConfig().EpThemeColor);
    } else {
      const colors = find(themeColors.value, { themeColor: theme });
      setEpThemeColor(colors.color);
    }
  }

  function setPropertyPrimary(mode: string, i: number, color: string) {
    document.documentElement.style.setProperty(
      `--el-color-primary-${mode}-${i}`,
      dataTheme.value ? darken(color, i / 10) : lighten(color, i / 10)
    );
  }

  /** 设置 `element-plus` 主题色 */
  const setEpThemeColor = (color: string) => {
    useEpThemeStoreHook().setEpThemeColor(color);
    document.documentElement.style.setProperty("--el-color-primary", color);
    for (let i = 1; i <= 2; i++) {
      setPropertyPrimary("dark", i, color);
    }
    for (let i = 1; i <= 9; i++) {
      setPropertyPrimary("light", i, color);
    }
  };

  /** 日间、夜间主题切换 */
  function dataThemeChange() {
    /* 如果当前是light夜间主题，默认切换到default主题 */
    if (useEpThemeStoreHook().epTheme === "light" && dataTheme.value) {
      setLayoutThemeColor("default");
    } else {
      setLayoutThemeColor(useEpThemeStoreHook().epTheme);
    }

    if (dataTheme.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return {
    body,
    dataTheme,
    layoutTheme,
    themeColors,
    dataThemeChange,
    setEpThemeColor,
    setLayoutThemeColor
  };
}
