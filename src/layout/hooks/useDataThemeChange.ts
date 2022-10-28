import { ref } from "vue";
import { getConfig } from "@/config";
import { find } from "lodash-unified";
import { useLayout } from "./useLayout";
import { themeColorsType } from "../types";
import { TinyColor } from "@ctrl/tinycolor";
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

  /**
   * @description 自动计算hover和active颜色
   * @see {@link https://element-plus.org/zh-CN/component/button.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A2%9C%E8%89%B2}
   */
  const shadeBgColor = (color: string): string => {
    return new TinyColor(color).shade(10).toString();
  };

  /** 设置ep主题色 */
  const setEpThemeColor = (color: string) => {
    useEpThemeStoreHook().setEpThemeColor(color);
    body.style.setProperty("--el-color-primary-active", shadeBgColor(color));
    document.documentElement.style.setProperty("--el-color-primary", color);
    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        lighten(color, i / 10)
      );
    }
    for (let i = 1; i <= 2; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-dark-${i}`,
        darken(color, i / 10)
      );
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
