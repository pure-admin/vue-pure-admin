import { defineStore } from "pinia";
import { store } from "/@/store";
import { storageLocal } from "/@/utils/storage";
import { multiType, positionType } from "./types";

export const useMultiTagsStore = defineStore({
  id: "pure-multiTags",
  state: () => ({
    // 存储标签页信息（路由信息）
    multiTags: storageLocal.getItem("responsive-sets").multiTagsCache
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
    multiTagsCache: storageLocal.getItem("responsive-sets").multiTagsCache
  }),
  getters: {
    getMultiTagsCache() {
      return this.multiTagsCache;
    }
  },
  actions: {
    multiTagsCacheChange(multiTagsCache: boolean) {
      this.multiTagsCache = multiTagsCache;
      if (multiTagsCache) {
        storageLocal.setItem("responsive-tags", this.multiTags);
      } else {
        storageLocal.removeItem("responsive-tags");
      }
    },
    tagsCache(multiTags) {
      this.getMultiTagsCache &&
        storageLocal.setItem("responsive-tags", multiTags);
    },
    handleTags<T>(
      mode: string,
      value?: T | multiType,
      position?: positionType
    ): T {
      switch (mode) {
        case "equal":
          this.multiTags = value;
          this.tagsCache(this.multiTags);
          break;
        case "push":
          {
            const tagVal = value as multiType;
            // 判断tag是否已存在:
            const tagHasExits = this.multiTags.some(tag => {
              return tag.path === tagVal?.path;
            });

            if (tagHasExits) return;
            const meta = tagVal?.meta;
            const dynamicLevel = meta?.dynamicLevel ?? -1;
            if (dynamicLevel > 0) {
              // dynamicLevel动态路由可打开的数量
              const realPath = meta?.realPath ?? "";
              // 获取到已经打开的动态路由数, 判断是否大于dynamicLevel
              if (
                this.multiTags.filter(e => e.meta?.realPath ?? "" === realPath)
                  .length >= dynamicLevel
              ) {
                // 关闭第一个
                const index = this.multiTags.findIndex(
                  item => item.meta?.realPath === realPath
                );
                index !== -1 && this.multiTags.splice(index, 1);
              }
            }
            this.multiTags.push(value);
            this.tagsCache(this.multiTags);
          }
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
