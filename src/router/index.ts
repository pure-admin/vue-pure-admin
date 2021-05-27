import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import homeRouter from "./modules/home";
import flowChartRouter from "./modules/flowchart";
import editorRouter from "./modules/editor";
import componentsRouter from "./modules/components";
import nestedRouter from "./modules/nested";
import errorRouter from "./modules/error";
import permissionRouter from "./modules/permission";
import remainingRouter from "./modules/remaining"; //静态路由
import Layout from "/@/layout/index.vue";

// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/*/*/*.vue");

import { getAsyncRoutes } from "/@/api/routes";
import { storageSession } from "../utils/storage";
import { i18n } from "/@/plugins/i18n/index";

const constantRoutes: Array<RouteRecordRaw> = [
  homeRouter,
  flowChartRouter,
  editorRouter,
  componentsRouter,
  nestedRouter,
  permissionRouter,
  errorRouter,
];

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

// 按照路由中meta下的rank等级升序来排序路由
function ascending(arr) {
  return arr.sort((a: any, b: any) => {
    return a?.meta?.rank - b?.meta?.rank;
  });
}

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
  let isLogin = storageSession.getItem("info");
  // _from?.name;
  if (isLogin) {
    // 异步路由
    getAsyncRoutes({ name: isLogin.username }).then(({ info }) => {
      if (info.length === 0) {
        return;
      }
      addAsyncRoutes([info]).forEach((v: any) => {
        // 防止重复添加路由
        if (
          router.options.routes.findIndex((value) => value.path === v.path) !==
          -1
        )
          return;
        // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
        router.options.routes.push(v);
        // 最终路由进行升序
        ascending(router.options.routes);
        router.addRoute(v.name, v);
      });
    });
    console.log(router.options.routes);
  }
  NProgress.start();
  const { t } = i18n.global;
  // @ts-ignore
  to.meta.title ? (document.title = t(to.meta.title)) : ""; // 动态title
  whiteList.indexOf(to.path) !== -1 || isLogin ? next() : next("/login"); // 全部重定向到登录页
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
