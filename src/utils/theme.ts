import { watch, computed } from "vue";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";
import { toggleTheme } from "@pureadmin/theme/dist/browser-utils";

// menu theme enum
export enum ThemeEnum {
  DARK = "dark",
  LIGHT = "light"
}

const getThemeName = (theme = "default") => {
  return `layout-theme-${theme}`;
};

export function watchChangeTheme() {
  const useEpThemeStore = useEpThemeStoreHook();
  const isDark = computed(() => useEpThemeStore.epTheme === ThemeEnum.DARK);
  watch(
    () => [isDark.value, useEpThemeStore.epTheme],
    () => {
      toggleTheme({
        scopeName: getThemeName(
          isDark.value ? undefined : useEpThemeStore.epTheme
        )
      });
    },
    { immediate: true }
  );
}
