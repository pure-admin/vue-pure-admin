import defaultSettings from "../../settings";
import { defineStore } from "pinia";
import { store } from "/@/store";

interface SettingState {
  title: String;
  fixedHeader: Boolean;
}

export const useSettingStore = defineStore({
  id: "pure-setting",
  state: (): SettingState => ({
    title: defaultSettings.title,
    fixedHeader: defaultSettings.fixedHeader,
  }),
  getters: {
    getTitle() {
      return this.title;
    },
    getFixedHeader() {
      return this.fixedHeader;
    },
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    },
    changeSetting(data) {
      this.CHANGE_SETTING(data);
    },
  },
});

export function useSettingStoreHook() {
  return useSettingStore(store);
}
