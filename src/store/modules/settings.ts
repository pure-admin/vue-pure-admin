import defaultSettings from "../../settings";
import { defineStore } from "pinia";
import { store } from "/@/store";

interface SettingState {
  title: string;
  fixedHeader: boolean;
  cachedPageList: string[];
}

export const useSettingStore = defineStore({
  id: "pure-setting",
  state: (): SettingState => ({
    title: defaultSettings.title,
    fixedHeader: defaultSettings.fixedHeader,
    // 需要开启keepalive的页面数组，里面放页面的name即可
    cachedPageList: ["welcome", "reEditor"]
  }),
  getters: {
    getTitle() {
      return this.title;
    },
    getFixedHeader() {
      return this.fixedHeader;
    }
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    },
    changeSetting(data) {
      this.CHANGE_SETTING(data);
    }
  }
});

export function useSettingStoreHook() {
  return useSettingStore(store);
}
