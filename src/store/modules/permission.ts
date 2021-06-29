import { defineStore } from "pinia";
import { store } from "/@/store";

import { constantRoutesArr, ascending } from "/@/router/index";

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    constantRoutes: constantRoutesArr, //静态路由
    wholeRoutes: [],
  }),
  actions: {
    asyncActionRoutes(routes) {
      this.wholeRoutes = ascending(this.constantRoutes.concat(routes)).filter(
        (v) => v.meta.showLink
      );
    },
    async changeSetting(routes) {
      await this.asyncActionRoutes(routes);
    },
  },
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
