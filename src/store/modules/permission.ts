import { defineStore } from "pinia";
import { store } from "/@/store";

import { constantRoutesArr, ascending } from "/@/router/index";

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    // 静态路由
    constantRoutes: constantRoutesArr,
    wholeRoutes: [],
    buttonAuth: []
  }),
  actions: {
    asyncActionRoutes(routes) {
      const filterTree = data => {
        const newTree = data.filter(v => v.meta.showLink);
        newTree.forEach(
          v => v.children && (v.children = filterTree(v.children))
        );
        return newTree;
      };

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
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
