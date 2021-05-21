import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import homeRouter from "./modules/home";
import flowChartRouter from "./modules/flowchart";
import editorRouter from "./modules/editor";
import componentsRouter from "./modules/components";
import nestedRouter from "./modules/nested";
import systemRouter from "./modules/system";
import errorRouter from "./modules/error";
import remainingRouter from "./modules/remaining";

import { storageSession } from "../utils/storage";
import { i18n } from "/@/plugins/i18n/index";

const routes: Array<RouteRecordRaw> = [
  homeRouter,
  flowChartRouter,
  editorRouter,
  componentsRouter,
  nestedRouter,
  systemRouter,
  errorRouter,
  ...remainingRouter,
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
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
  NProgress.start();
  const { t } = i18n.global;
  // @ts-ignore
  to.meta.title ? (document.title = t(to.meta.title)) : ""; // 动态title
  whiteList.indexOf(to.path) !== -1 || storageSession.getItem("info")
    ? next()
    : next("/login"); // 全部重定向到登录页
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
