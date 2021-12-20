import { store } from "/@/store";
import { defineStore } from "pinia";
import { storageLocal } from "/@/utils/storage";

export const useEpThemeStore = defineStore({
  id: "pure-epTheme",
  state: () => ({
    epThemeColor: storageLocal.getItem("epThemeColor") || "#409EFF"
  }),
  getters: {
    getEpThemeColor() {
      return this.epThemeColor;
    }
  },
  actions: {
    setEpThemeColor(newColor) {
      this.epThemeColor = newColor;
      storageLocal.setItem("epThemeColor", newColor);
    }
  }
});

export function useEpThemeStoreHook() {
  return useEpThemeStore(store);
}
