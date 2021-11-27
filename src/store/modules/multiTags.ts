import { defineStore } from "pinia";
import { store } from "/@/store";
import { getConfig } from "/@/config";
import { positionType } from "./types";
import { storageLocal } from "/@/utils/storage";

export const useMultiTagsStore = defineStore({
  id: "pure-multiTags",
  state: () => ({
    // 存储标签页信息（路由信息）
    multiTags: getConfig().MultiTagsCache
      ? storageLocal.getItem("responsive-tags")
      : [
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
    tagsCache(multiTags) {
      this.getMultiTagsCache &&
        storageLocal.setItem("responsive-tags", multiTags);
    },
    handleTags<T>(mode: string, value?: T, position?: positionType): any {
      switch (mode) {
        case "equal":
          this.multiTags = value;
          break;
        case "push":
          this.multiTags.push(value);
          this.tagsCache(this.multiTags);
          break;
        case "splice":
          this.multiTags.splice(position?.startIndex, position?.length);
          this.tagsCache(this.multiTags);
          return this.multiTags;
          break;
        case "slice":
          return this.multiTags.slice(-1);
          break;
      }
    }
  }
});

export function useMultiTagsStoreHook() {
  return useMultiTagsStore(store);
}
