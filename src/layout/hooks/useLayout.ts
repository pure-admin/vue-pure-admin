import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { routerArrays } from "../types";
import { useGlobal } from "@pureadmin/utils";
import { useMultiTagsStore } from "@/store/modules/multiTags";

export function useLayout() {
  const { $storage, $config } = useGlobal<GlobalPropertiesApi>();

  const initStorage = () => {
    /** 路由 */
    if (
      useMultiTagsStore().multiTagsCache &&
      (!$storage.tags || $storage.tags.length === 0)
    ) {
      $storage.tags = routerArrays;
    }
    /** 国际化 */
    if (!$storage.locale) {
      $storage.locale = { locale: $config?.Locale ?? "zh" };
      useI18n().locale.value = $config?.Locale ?? "zh";
    }
    /** 导航 */
    if (!$storage.layout) {
      $storage.layout = {
        layout: $config?.Layout ?? "vertical",
        theme: $config?.Theme ?? "light",
        darkMode: $config?.DarkMode ?? false,
        sidebarStatus: $config?.SidebarStatus ?? true,
        epThemeColor: $config?.EpThemeColor ?? "#409EFF",
        themeColor: $config?.Theme ?? "light",
        overallStyle: $config?.OverallStyle ?? "light"
      };
    }
    /** 灰色模式、色弱模式、隐藏标签页 */
    if (!$storage.configure) {
      $storage.configure = {
        grey: $config?.Grey ?? false,
        weak: $config?.Weak ?? false,
        hideTabs: $config?.HideTabs ?? false,
        hideFooter: $config.HideFooter ?? true,
        showLogo: $config?.ShowLogo ?? true,
        showModel: $config?.ShowModel ?? "smart",
        multiTagsCache: $config?.MultiTagsCache ?? false,
        stretch: $config?.Stretch ?? false
      };
    }
  };

  /** 清空缓存后从platform-config.json读取默认配置并赋值到storage中 */
  const layout = computed(() => {
    return $storage?.layout.layout;
  });

  const layoutTheme = computed(() => {
    return $storage.layout;
  });

  return {
    layout,
    layoutTheme,
    initStorage
  };
}
