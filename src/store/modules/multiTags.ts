import { defineStore } from "pinia";
import { store } from "/@/store";
import { getConfig } from "/@/config";
import { positionType } from "./types";
import { storageLocal } from "/@/utils/storage";

interface Itag {
  path: string;
  parentPath: string;
  name: string;
  meta: any;
}

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
    handleTags<T>(
      mode: string,
      value?: T | Itag,
      position?: positionType
    ): any {
      switch (mode) {
        case "equal":
          this.multiTags = value;
          break;
        case "push":
          {
            const tagVal = value as Itag;
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
