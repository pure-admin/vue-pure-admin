import { store } from "/@/store";
import { defineStore } from "pinia";
import { getConfig } from "/@/config";
import { storageLocal } from "/@/utils/storage";

export const useEpThemeStore = defineStore({
  id: "pure-epTheme",
  state: () => ({
    epThemeColor:
      storageLocal.getItem("responsive-layout")?.epThemeColor ??
      getConfig().EpThemeColor
  }),
  getters: {
    getEpThemeColor() {
      return this.epThemeColor;
    }
  },
  actions: {
    setEpThemeColor(newColor) {
      const layout = storageLocal.getItem("responsive-layout");
      this.epThemeColor = newColor;
      layout.epThemeColor = newColor;
      storageLocal.setItem("responsive-layout", layout);
    }
  }
});

export function useEpThemeStoreHook() {
  return useEpThemeStore(store);
}
