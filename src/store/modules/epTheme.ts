import { store } from "/@/store";
import { defineStore } from "pinia";
import { storageLocal } from "/@/utils/storage";

export const useEpThemeStore = defineStore({
  id: "pure-epTheme",
  state: () => ({
    mainColor: storageLocal.getItem("mainColor") || "#409EFF"
  }),
  getters: {
    getMainColor() {
      return this.mainColor;
    }
  },
  actions: {
    setMainColor(newColor) {
      this.mainColor = newColor;
      storageLocal.setItem("mainColor", newColor);
    }
  }
});

export function useEpThemeStoreHook() {
  return useEpThemeStore(store);
}
