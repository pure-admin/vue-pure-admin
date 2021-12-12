import {
  Router,
  RouteMeta,
  createRouter,
  RouteRecordName,
  createWebHashHistory
} from "vue-router";
import { toRouteType } from "./types";
import { openLink } from "/@/utils/link";
import NProgress from "/@/utils/progress";
import { split, uniqBy } from "lodash-es";
import { constantRoutes } from "./modules";
import { transformI18n } from "/@/plugins/i18n";
import remainingRouter from "./modules/remaining";
import { storageSession, storageLocal } from "/@/utils/storage";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import {
  initRouter,
  getParentPaths,
  findRouteByPath,
  handleAliveRoute
} from "./utils";

// 创建路由实例
export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes.concat(...remainingRouter),
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

// 路由白名单
const whiteList = ["/login"];

router.beforeEach((to: toRouteType, _from, next) => {
  if (to.meta?.keepAlive) {
    const newMatched = to.matched;
    handleAliveRoute(newMatched, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "redirect") {
      handleAliveRoute(newMatched);
    }
  }
  const name = storageSession.getItem("info");
  NProgress.start();
  const externalLink = to?.redirectedFrom?.fullPath;
  if (!externalLink)
    to.matched.some(item => {
      item.meta.title
        ? (document.title = transformI18n(
            item.meta.title as string,
            item.meta?.i18n as boolean
          ))
        : "";
    });
  if (name) {
    if (_from?.name) {
      // 如果路由包含http 则是超链接 反之是普通路由
      if (externalLink && externalLink.includes("http")) {
        openLink(`http${split(externalLink, "http")[1]}`);
        NProgress.done();
      } else {
        next();
      }
    } else {
      // 刷新
      if (usePermissionStoreHook().wholeMenus.length === 0)
        initRouter(name.username).then((router: Router) => {
          if (!useMultiTagsStoreHook().getMultiTagsCache) {
            const handTag = (
              path: string,
              parentPath: string,
              name: RouteRecordName,
              meta: RouteMeta
            ): void => {
              useMultiTagsStoreHook().handleTags("push", {
                path,
                parentPath,
                name,
                meta
              });
            };
            // 未开启标签页缓存，刷新页面重定向到顶级路由（参考标签页操作例子）
            if (to.meta?.realPath) {
              const routes = router.options.routes;
              const { refreshRedirect } = to.meta;
              const { name, meta } = findRouteByPath(refreshRedirect, routes);
              handTag(
                refreshRedirect,
                getParentPaths(refreshRedirect, routes)[1],
                name,
                meta
              );
              return router.push(refreshRedirect);
            } else {
              const { path } = to;
              const index = remainingRouter.findIndex(v => {
                return v.path == path;
              });
              const routes =
                index === -1
                  ? router.options.routes[0].children
                  : router.options.routes;
              const route = findRouteByPath(path, routes);
              const routePartent = getParentPaths(path, routes);
              handTag(
                route.path,
                routePartent[routePartent.length - 1],
                route.name,
                route.meta
              );
              return router.push(path);
            }
          }
          router.push(to.path);
          // 刷新页面更新标签栏与页面路由匹配
          const localRoutes = storageLocal.getItem("responsive-tags");
          const optionsRoutes = router.options?.routes[0].children;
          const newLocalRoutes = [];
          optionsRoutes.forEach(ors => {
            localRoutes.forEach(lrs => {
              if (ors.path === lrs.parentPath) {
                newLocalRoutes.push(lrs);
              }
            });
          });
          storageLocal.setItem(
            "responsive-tags",
            uniqBy(newLocalRoutes, "path")
          );
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
