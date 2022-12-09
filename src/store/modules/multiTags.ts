import { defineStore } from "pinia";
import { store } from "@/store";
import { isEqual } from "@pureadmin/utils";
import { routerArrays } from "@/layout/types";
import { multiType, positionType } from "./types";
import { isUrl, storageLocal } from "@pureadmin/utils";

export const useMultiTagsStore = defineStore({
  id: "pure-multiTags",
  state: () => ({
    // 存储标签页信息（路由信息）
    multiTags: storageLocal().getItem<StorageConfigs>("responsive-configure")
      ?.multiTagsCache
      ? storageLocal().getItem<StorageConfigs>("responsive-tags")
      : [...routerArrays],
    multiTagsCache: storageLocal().getItem<StorageConfigs>(
      "responsive-configure"
    )?.multiTagsCache
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
        storageLocal().setItem("responsive-tags", this.multiTags);
      } else {
        storageLocal().removeItem("responsive-tags");
      }
    },
    tagsCache(multiTags) {
      this.getMultiTagsCache &&
        storageLocal().setItem("responsive-tags", multiTags);
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
            // 不添加到标签页
            if (tagVal?.meta?.hiddenTag) return;
            // 如果是外链无需添加信息到标签页
            if (isUrl(tagVal?.name)) return;
            // 如果title为空拒绝添加空信息到标签页
            if (tagVal?.meta?.title.length === 0) return;
            const tagPath = tagVal.path;
            // 判断tag是否已存在
            const tagHasExits = this.multiTags.some(tag => {
              return tag.path === tagPath;
            });

            // 判断tag中的query键值是否相等
            const tagQueryHasExits = this.multiTags.some(tag => {
              return isEqual(tag?.query, tagVal?.query);
            });

            // 判断tag中的params键值是否相等
            const tagParamsHasExits = this.multiTags.some(tag => {
              return isEqual(tag?.params, tagVal?.params);
            });

            if (tagHasExits && tagQueryHasExits && tagParamsHasExits) return;

            // 动态路由可打开的最大数量
            const dynamicLevel = tagVal?.meta?.dynamicLevel ?? -1;
            if (dynamicLevel > 0) {
              if (
                this.multiTags.filter(e => e?.path === tagPath).length >=
                dynamicLevel
              ) {
                // 如果当前已打开的动态路由数大于dynamicLevel，替换第一个动态路由标签
                const index = this.multiTags.findIndex(
                  item => item?.path === tagPath
                );
                index !== -1 && this.multiTags.splice(index, 1);
              }
            }
            this.multiTags.push(value);
            this.tagsCache(this.multiTags);
          }
          break;
        case "splice":
          if (!position) {
            const index = this.multiTags.findIndex(v => v.path === value);
            if (index === -1) return;
            this.multiTags.splice(index, 1);
          } else {
            this.multiTags.splice(position?.startIndex, position?.length);
          }
          this.tagsCache(this.multiTags);
          return this.multiTags;
        case "slice":
          return this.multiTags.slice(-1);
      }
    }
  }
});

export function useMultiTagsStoreHook() {
  return useMultiTagsStore(store);
}
