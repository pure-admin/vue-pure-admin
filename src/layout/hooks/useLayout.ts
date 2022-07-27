import { useI18n } from "vue-i18n";
import { routerArrays } from "../types";
import { computed, getCurrentInstance } from "vue";
import { useMultiTagsStore } from "/@/store/modules/multiTags";

export function useLayout() {
  const instance = getCurrentInstance().appContext.app.config.globalProperties;

  const initStorage = () => {
    // 路由
    if (
      useMultiTagsStore().multiTagsCache &&
      (!instance.$storage.tags || instance.$storage.tags.length === 0)
    ) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      instance.$storage.tags = routerArrays;
    }
    // 国际化
    if (!instance.$storage.locale) {
      // eslint-disable-next-line
      instance.$storage.locale = { locale: instance.$config?.Locale ?? "zh" };
      useI18n().locale.value = instance.$config?.Locale ?? "zh";
    }
    // 导航
    if (!instance.$storage.layout) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      instance.$storage.layout = {
        layout: instance.$config?.Layout ?? "vertical",
        theme: instance.$config?.Theme ?? "default",
        darkMode: instance.$config?.DarkMode ?? false,
        sidebarStatus: instance.$config?.SidebarStatus ?? true,
        epThemeColor: instance.$config?.EpThemeColor ?? "#409EFF"
      };
    }
    // 灰色模式、色弱模式、隐藏标签页
    if (!instance.$storage.configure) {
      // eslint-disable-next-line
      instance.$storage.configure = {
        grey: instance.$config?.Grey ?? false,
        weak: instance.$config?.Weak ?? false,
        hideTabs: instance.$config?.HideTabs ?? false,
        showLogo: instance.$config?.ShowLogo ?? true,
        showModel: instance.$config?.ShowModel ?? "smart",
        multiTagsCache: instance.$config?.MultiTagsCache ?? false
      };
    }
  };
  // 清空缓存后从serverConfig.json读取默认配置并赋值到storage中
  const layout = computed(() => {
    return instance.$storage?.layout.layout;
  });
  const layoutTheme = computed(() => {
    return instance.$storage.layout;
  });
  return {
    layout,
    instance,
    layoutTheme,
    initStorage
  };
}
