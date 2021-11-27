import { defineStore } from "pinia";
import { store } from "/@/store";
import { getConfig } from "/@/config";
import { positionType } from "./types";

export const useMultiTagsStore = defineStore({
  id: "pure-multiTags",
  state: () => ({
    // 存储标签页信息（路由信息）
    multiTags: [
      {
        path: "/welcome",
        parentPath: "/",
        meta: {
          title: "message.hshome",
          icon: "el-icon-s-home",
          i18n: true,
          showLink: true
        }
      }
    ],
    multiTagsCache: getConfig().MultiTagsCache
  }),
  getters: {
    getMultiTagsCache() {
      return this.multiTagsCache;
    }
  },
  actions: {
    handleTags<T>(mode: string, value?: T, position?: positionType): any {
      switch (mode) {
        case "equal":
          this.multiTags = value;
          break;
        case "push":
          this.multiTags.push(value);
          break;
        case "splice":
          this.multiTags.splice(position?.startIndex, position?.length);
          break;
        case "slice":
          this.multiTags.slice(-1);
          break;
      }
    }
  }
});

export function useMultiTagsStoreHook() {
  return useMultiTagsStore(store);
}
