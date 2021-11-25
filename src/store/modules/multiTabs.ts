import { defineStore } from "pinia";
import { store } from "/@/store";
import { getConfig } from "/@/config";

export const useMultiTabsStore = defineStore({
  id: "pure-multiTabs",
  state: () => ({
    multiTabsCache: getConfig().MultiTabsCache
  }),
  getters: {
    getMultiTabsCache() {
      return this.multiTabsCache;
    }
  },
  actions: {}
});

export function useMultiTabsStoreHook() {
  return useMultiTabsStore(store);
}
