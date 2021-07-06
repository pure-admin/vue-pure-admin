import { defineStore } from "pinia";
import { store } from "/@/store";

import { constantRoutesArr, ascending } from "/@/router/index";

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    constantRoutes: constantRoutesArr, //静态路由
    wholeRoutes: [],
    buttonAuth: []
  }),
  actions: {
    asyncActionRoutes(routes) {
      if (this.wholeRoutes.length > 0) return;
      this.wholeRoutes = ascending(this.constantRoutes.concat(routes)).filter(
        v => v.meta.showLink
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
