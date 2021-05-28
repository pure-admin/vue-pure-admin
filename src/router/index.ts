import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import homeRouter from "./modules/home";
import flowChartRouter from "./modules/flowchart";
import editorRouter from "./modules/editor";
import componentsRouter from "./modules/components";
import nestedRouter from "./modules/nested";
import errorRouter from "./modules/error";
import permissionRouter from "./modules/permission";
import remainingRouter from "./modules/remaining"; //静态路由

import { storageSession } from "../utils/storage";
import { i18n } from "/@/plugins/i18n/index";
import { usePermissionStoreHook } from "/@/store/modules/permission";

const constantRoutes: Array<RouteRecordRaw> = [
  homeRouter,
  flowChartRouter,
  editorRouter,
  componentsRouter,
  nestedRouter,
  permissionRouter,
  errorRouter,
];

// 按照路由中meta下的rank等级升序来排序路由
export const ascending = (arr) => {
  return arr.sort((a: any, b: any) => {
    return a?.meta?.rank - b?.meta?.rank;
  });
};

// 将所有静态路由导出
export const constantRoutesArr = ascending(constantRoutes).concat(
  ...remainingRouter
);

const router = createRouter({
  history: createWebHashHistory(),
  routes: ascending(constantRoutes).concat(...remainingRouter),
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  },
});

import NProgress from "../utils/progress";

const whiteList = ["/login", "/register"];

router.beforeEach((to, _from, next) => {
  // _from?.name;
  let name = storageSession.getItem("info");
  if (name) {
    usePermissionStoreHook().changeSetting();
  }
  NProgress.start();
  const { t } = i18n.global;
  // @ts-ignore
  to.meta.title ? (document.title = t(to.meta.title)) : ""; // 动态title
  whiteList.indexOf(to.path) !== -1 || name ? next() : next("/login"); // 全部重定向到登录页
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
