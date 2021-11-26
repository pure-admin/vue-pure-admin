import { defineStore } from "pinia";
import { store } from "/@/store";
import { getConfig } from "/@/config";
// import { multiTagsType } from "/@/layout/types";

export const useMultiTagsStore = defineStore({
  id: "pure-multiTags",
  state: () => ({
    multiTagsCache: getConfig().MultiTagsCache
  }),
  getters: {
    getMultiTagsCache() {
      return this.multiTagsCache;
    }
  },
  actions: {}
});

export function useMultiTagsStoreHook() {
  return useMultiTagsStore(store);
}
