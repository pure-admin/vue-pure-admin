import { defineStore } from "pinia";
import { store } from "/@/store";
import { getConfig } from "/@/config";

interface SettingState {
  title: string;
  fixedHeader: boolean;
}

export const useSettingStore = defineStore({
  id: "pure-setting",
  state: (): SettingState => ({
    title: getConfig().Title,
    fixedHeader: getConfig().FixedHeader
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
