import { getConfig } from "/@/config";
import { toRouteType } from "./types";
import NProgress from "/@/utils/progress";
import { findIndex } from "lodash-unified";
import { transformI18n } from "/@/plugins/i18n";
import { sessionKey, type DataInfo } from "/@/utils/auth";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import {
  Router,
  createRouter,
  RouteRecordRaw,
  RouteComponent
} from "vue-router";
import {
  ascending,
  initRouter,
  isOneOfArray,
  getHistoryMode,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "./utils";
import {
  buildHierarchyTree,
  openLink,
  isUrl,
  storageSession
} from "@pureadmin/utils";

import pptRouter from "./modules/ppt";
import homeRouter from "./modules/home";
import ableRouter from "./modules/able";
import listRouter from "./modules/list";
import aboutRouter from "./modules/about";
import errorRouter from "./modules/error";
import guideRouter from "./modules/guide";
import resultRouter from "./modules/result";
import editorRouter from "./modules/editor";
import nestedRouter from "./modules/nested";
import flowChartRouter from "./modules/flowchart";
import remainingRouter from "./modules/remaining";
import componentsRouter from "./modules/components";
import formDesignRouter from "./modules/formdesign";

/** 原始静态路由（未做任何处理） */
const routes = [
  pptRouter,
  homeRouter,
  ableRouter,
  listRouter,
  aboutRouter,
  errorRouter,
  guideRouter,
  resultRouter,
  nestedRouter,
  editorRouter,
  flowChartRouter,
  componentsRouter,
  formDesignRouter
];

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
);

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(routes).concat(
  ...remainingRouter
);

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map(v => {
  return remainingRouter[v].path;
});

/** 创建路由实例 */
export const router: Router = createRouter({
  history: getHistoryMode(),
  routes: constantRoutes.concat(...(remainingRouter as any)),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
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
  }
});

/** 重置路由 */
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name, meta } = route;
    if (name && router.hasRoute(name) && meta?.backstage) {
      router.removeRoute(name);
      router.options.routes = formatTwoStageRoutes(
        formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
      );
    }
  });
  usePermissionStoreHook().clearAllCachePage();
}

/** 路由白名单 */
const whiteList = ["/login"];

router.beforeEach((to: toRouteType, _from, next) => {
  if (to.meta?.keepAlive) {
    const newMatched = to.matched;
    handleAliveRoute(newMatched, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "Redirect") {
      handleAliveRoute(newMatched);
    }
  }
  const userInfo = storageSession.getItem<DataInfo<number>>(sessionKey);
  NProgress.start();
  const externalLink = isUrl(to?.name as string);
  if (!externalLink) {
    to.matched.some(item => {
      if (!item.meta.title) return "";
      const Title = getConfig().Title;
      if (Title)
        document.title = `${transformI18n(item.meta.title)} | ${Title}`;
      else document.title = transformI18n(item.meta.title);
    });
  }
  if (userInfo) {
    // 无权限跳转403页面
    if (to.meta?.roles && !isOneOfArray(to.meta?.roles, userInfo?.roles)) {
      next({ path: "/error/403" });
    }
    if (_from?.name) {
      // name为超链接
      if (externalLink) {
        openLink(to?.name as string);
        NProgress.done();
      } else {
        next();
      }
    } else {
      // 刷新
      if (
        usePermissionStoreHook().wholeMenus.length === 0 &&
        to.path !== "/login"
      )
        initRouter().then((router: Router) => {
          if (!useMultiTagsStoreHook().getMultiTagsCache) {
            const { path } = to;
            const index = findIndex(remainingRouter, v => {
              return v.path == path;
            });
            const routes: any =
              index === -1
                ? router.options.routes[0].children
                : router.options.routes;
            const route = findRouteByPath(path, routes);
            // query、params模式路由传参数的标签页不在此处处理
            if (route && route.meta?.title) {
              useMultiTagsStoreHook().handleTags("push", {
                path: route.path,
                name: route.name,
                meta: route.meta
              });
            }
          }
          router.push(to.fullPath);
        });
      next();
    }
  } else {
    if (to.path !== "/login") {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next({ path: "/login" });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
