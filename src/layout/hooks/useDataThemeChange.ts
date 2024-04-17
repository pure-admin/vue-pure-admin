import { ref } from "vue";
import { getConfig } from "@/config";
import { useLayout } from "./useLayout";
import { removeToken } from "@/utils/auth";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import type { themeColorsType } from "../types";
import { useAppStoreHook } from "@/store/modules/app";
import { useGlobal, storageLocal } from "@pureadmin/utils";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import {
  darken,
  lighten,
  toggleTheme
} from "@pureadmin/theme/dist/browser-utils";

export function useDataThemeChange() {
  const { layoutTheme, layout } = useLayout();
  const themeColors = ref<Array<themeColorsType>>([
    /* 亮白色 */
    { color: "#ffffff", themeColor: "light" },
    /* 道奇蓝 */
    { color: "#1b2a47", themeColor: "default" },
    /* 深紫罗兰色 */
    { color: "#722ed1", themeColor: "saucePurple" },
    /* 深粉色 */
    { color: "#eb2f96", themeColor: "pink" },
    /* 猩红色 */
    { color: "#f5222d", themeColor: "dusk" },
    /* 橙红色 */
    { color: "#fa541c", themeColor: "volcano" },
    /* 绿宝石 */
    { color: "#13c2c2", themeColor: "mingQing" },
    /* 酸橙绿 */
    { color: "#52c41a", themeColor: "auroraGreen" }
  ]);

  const { $storage } = useGlobal<GlobalPropertiesApi>();
  const dataTheme = ref<boolean>($storage?.layout?.darkMode);
  const overallStyle = ref<string>($storage?.layout?.overallStyle);
  const body = document.documentElement as HTMLElement;

  function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
    const targetEl = target || document.body;
    let { className } = targetEl;
    className = className.replace(clsName, "").trim();
    targetEl.className = flag ? `${className} ${clsName}` : className;
  }

  /** 设置导航主题色 */
  function setLayoutThemeColor(
    theme = getConfig().Theme ?? "light",
    isClick = true
  ) {
    layoutTheme.value.theme = theme;
    toggleTheme({
      scopeName: `layout-theme-${theme}`
    });
    // 如果非isClick，保留之前的themeColor
    const storageThemeColor = $storage.layout.themeColor;
    $storage.layout = {
      layout: layout.value,
      theme,
      darkMode: dataTheme.value,
      sidebarStatus: $storage.layout?.sidebarStatus,
      epThemeColor: $storage.layout?.epThemeColor,
      themeColor: isClick ? theme : storageThemeColor,
      overallStyle: overallStyle.value
    };

    if (theme === "default" || theme === "light") {
      setEpThemeColor(getConfig().EpThemeColor);
    } else {
      const colors = themeColors.value.find(v => v.themeColor === theme);
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

  /** 浅色、深色整体风格切换 */
  function dataThemeChange(overall?: string) {
    overallStyle.value = overall;
    if (useEpThemeStoreHook().epTheme === "light" && dataTheme.value) {
      setLayoutThemeColor("default", false);
    } else {
      setLayoutThemeColor(useEpThemeStoreHook().epTheme, false);
    }

    if (dataTheme.value) {
      document.documentElement.classList.add("dark");
    } else {
      if ($storage.layout.themeColor === "light") {
        setLayoutThemeColor("light", false);
      }
      document.documentElement.classList.remove("dark");
    }
  }

  /** 清空缓存并返回登录页 */
  function onReset() {
    removeToken();
    storageLocal().clear();
    const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
    useAppStoreHook().setLayout(Layout);
    setEpThemeColor(EpThemeColor);
    useMultiTagsStoreHook().multiTagsCacheChange(MultiTagsCache);
    toggleClass(Grey, "html-grey", document.querySelector("html"));
    toggleClass(Weak, "html-weakness", document.querySelector("html"));
    router.push("/login");
    useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
    resetRouter();
  }

  return {
    body,
    dataTheme,
    overallStyle,
    layoutTheme,
    themeColors,
    onReset,
    toggleClass,
    dataThemeChange,
    setEpThemeColor,
    setLayoutThemeColor
  };
}
