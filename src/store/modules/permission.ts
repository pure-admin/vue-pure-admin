import { defineStore } from "pinia";
import { store } from "/@/store";
import { cacheType } from "./types";
import { constantRoutesArr, ascending, filterTree } from "/@/router/index";

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    // 静态路由
    constantRoutes: constantRoutesArr,
    wholeRoutes: [],
    buttonAuth: [],
    // 缓存页面keepAlive
    cachePageList: []
  }),
  actions: {
    asyncActionRoutes(routes) {
      if (this.wholeRoutes.length > 0) return;
      this.wholeRoutes = filterTree(
        ascending(this.constantRoutes.concat(routes))
      );

      const getButtonAuth = (arrRoutes: Array<string>) => {
        if (!arrRoutes || !arrRoutes.length) return;
        arrRoutes.forEach((v: any) => {
          if (v.meta && v.meta.authority) {
            this.buttonAuth.push(...v.meta.authority);
          }
          if (v.children) {
            getButtonAuth(v.children);
          }
        });
      };

      getButtonAuth(this.wholeRoutes);
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
    // 清空缓存页面
    clearAllCachePage() {
      this.cachePageList = [];
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
