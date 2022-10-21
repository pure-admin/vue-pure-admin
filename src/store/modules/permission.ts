import { defineStore } from "pinia";
import { store } from "/@/store";
import { cacheType } from "./types";
import { constantMenus } from "/@/router";
import { cloneDeep } from "lodash-unified";
import { ascending, filterTree } from "/@/router/utils";

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    // 静态路由生成的菜单
    constantMenus,
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
    // 深拷贝一个菜单树，与导航菜单不突出
    menusTree: [],
    // 缓存页面keepAlive
    cachePageList: []
  }),
  actions: {
    /** 获取异步路由菜单 */
    asyncActionRoutes(routes) {
      if (this.wholeMenus.length > 0) return;
      this.wholeMenus = filterTree(
        ascending(this.constantMenus.concat(routes))
      );

      this.menusTree = cloneDeep(
        filterTree(ascending(this.constantMenus.concat(routes)))
      );
    },
    async changeSetting(routes) {
      await this.asyncActionRoutes(routes);
    },
    cacheOperate({ mode, name }: cacheType) {
      switch (mode) {
        case "add":
          this.cachePageList.push(name);
          this.cachePageList = [...new Set(this.cachePageList)];
          break;
        case "delete":
          // eslint-disable-next-line no-case-declarations
          const delIndex = this.cachePageList.findIndex(v => v === name);
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
          break;
      }
    },
    /** 清空缓存页面 */
    clearAllCachePage() {
      this.wholeMenus = [];
      this.menusTree = [];
      this.cachePageList = [];
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
