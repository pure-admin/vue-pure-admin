import { defineStore } from "pinia";
import { store } from "/@/store";

import { constantRoutesArr, ascending } from "/@/router/index";

import { getAsyncRoutes } from "/@/api/routes";
import Layout from "/@/layout/index.vue";
import router from "/@/router/index";
import { storageSession } from "/@/utils/storage";

// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/*/*/*.vue");

// 过滤后端传来的动态路由重新生成规范路由
const addAsyncRoutes = (arrRoutes: Array<string>) => {
  if (!arrRoutes || !arrRoutes.length) return;
  arrRoutes.forEach((v: any) => {
    if (v.redirect) {
      v.component = Layout;
    } else {
      v.component = modulesRoutes[`/src/views${v.path}/index.vue`];
    }
    if (v.children) {
      addAsyncRoutes(v.children);
    }
  });
  return arrRoutes;
};

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    constantRoutes: constantRoutesArr, //静态路由
    asyncRoutes: [], //动态路由
    wholeRoutes: [],
  }),
  actions: {
    asyncActionRoutes(routes) {
      this.wholeRoutes = ascending(this.constantRoutes.concat(routes)).filter(
        (v) => v.meta.showLink
      );
      this.asyncRoutes.push(routes);
    },
    async changeSetting() {
      let name = storageSession.getItem("info")?.username;
      await getAsyncRoutes({ name }).then(({ info }) => {
        if (info.length === 0) {
          this.wholeRoutes = router.options.routes.filter(
            (v) => v.meta.showLink
          );
          return;
        }
        addAsyncRoutes([info]).forEach((v: any) => {
          // 防止重复添加路由
          if (
            router.options.routes.findIndex(
              (value) => value.path === v.path
            ) !== -1
          ) {
            return;
          } else {
            // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
            router.options.routes.push(v);
            // 最终路由进行升序
            ascending(router.options.routes);
            router.addRoute(v.name, v);
            this.asyncActionRoutes(v);
          }
        });
      });
    },
  },
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
