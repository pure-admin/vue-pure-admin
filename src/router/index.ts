import {
  Router,
  RouteMeta,
  createRouter,
  RouteComponent,
  RouteRecordName,
  createWebHashHistory,
  RouteRecordNormalized
} from "vue-router";
import { openLink } from "/@/utils/link";
import NProgress from "/@/utils/progress";
import { split, uniqBy } from "lodash-es";
import { useTimeoutFn } from "@vueuse/core";
import { RouteConfigs } from "/@/layout/types";
import { transformI18n } from "/@/plugins/i18n";
import { storageSession, storageLocal } from "/@/utils/storage";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";

// 静态路由
import tabsRouter from "./modules/tabs";
import homeRouter from "./modules/home";
import Layout from "/@/layout/index.vue";
import errorRouter from "./modules/error";
import editorRouter from "./modules/editor";
import nestedRouter from "./modules/nested";
import externalLink from "./modules/externalLink";
import remainingRouter from "./modules/remaining";
import flowChartRouter from "./modules/flowchart";
import componentsRouter from "./modules/components";

// 动态路由
import { getAsyncRoutes } from "/@/api/routes";

// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/*/*/*.vue");

const constantRoutes: Array<RouteComponent> = [
  tabsRouter,
  homeRouter,
  flowChartRouter,
  editorRouter,
  componentsRouter,
  nestedRouter,
  externalLink,
  errorRouter
];

// 按照路由中meta下的rank等级升序来排序路由
export const ascending = arr => {
  return arr.sort((a: any, b: any) => {
    return a?.meta?.rank - b?.meta?.rank;
  });
};

// 将所有静态路由导出
export const constantRoutesArr: Array<RouteComponent> = ascending(
  constantRoutes
).concat(...remainingRouter);

// 过滤meta中showLink为false的路由
export const filterTree = data => {
  const newTree = data.filter(v => v.meta.showLink);
  newTree.forEach(v => v.children && (v.children = filterTree(v.children)));
  return newTree;
};

// 从路由中提取keepAlive为true的name组成数组（此处本项目中并没有用到，只是暴露个方法）
export const getAliveRoute = () => {
  const alivePageList = [];
  const recursiveSearch = treeLists => {
    if (!treeLists || !treeLists.length) {
      return;
    }
    for (let i = 0; i < treeLists.length; i++) {
      if (treeLists[i]?.meta?.keepAlive) alivePageList.push(treeLists[i].name);
      recursiveSearch(treeLists[i].children);
    }
  };
  recursiveSearch(router.options.routes[0].children);
  return alivePageList;
};

// 批量删除缓存路由
export const delAliveRoutes = (delAliveRouteList: Array<RouteConfigs>) => {
  delAliveRouteList.forEach(route => {
    usePermissionStoreHook().cacheOperate({
      mode: "delete",
      name: route?.name
    });
  });
};

// 处理缓存路由（添加、删除、刷新）
export const handleAliveRoute = (
  matched: RouteRecordNormalized[],
  mode?: string
) => {
  switch (mode) {
    case "add":
      matched.forEach(v => {
        usePermissionStoreHook().cacheOperate({ mode: "add", name: v.name });
      });
      break;
    case "delete":
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name: matched[matched.length - 1].name
      });
      break;
    default:
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name: matched[matched.length - 1].name
      });
      useTimeoutFn(() => {
        matched.forEach(v => {
          usePermissionStoreHook().cacheOperate({ mode: "add", name: v.name });
        });
      }, 100);
  }
};

// 过滤后端传来的动态路由 重新生成规范路由
export const addAsyncRoutes = (arrRoutes: Array<RouteComponent>) => {
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

const constRoutes = formatTwoStageRoutes(
  formatFlatteningRoutes(ascending(constantRoutes))
);

// 创建路由实例
export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: constRoutes.concat(...remainingRouter),
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

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
  if (arr.length <= 0) return false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
    }
  }
  return arr;
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
export function formatTwoStageRoutes(arr: any) {
  if (arr.length <= 0) return false;
  const newArr: any = [];
  arr.forEach((v: any) => {
    if (v.path === "/") {
      newArr.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: []
      });
    } else {
      newArr[0].children.push({ ...v });
    }
  });
  return newArr;
}

// 初始化路由
export const initRouter = name => {
  return new Promise(resolve => {
    getAsyncRoutes({ name }).then(({ info }) => {
      if (info.length === 0) {
        usePermissionStoreHook().changeSetting(info);
      } else {
        formatFlatteningRoutes(addAsyncRoutes(info)).map((v: any) => {
          // 防止重复添加路由
          if (
            router.options.routes[0].children.findIndex(
              value => value.path === v.path
            ) !== -1
          ) {
            return;
          } else {
            // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
            router.options.routes[0].children.push(v);
            // 最终路由进行升序
            ascending(router.options.routes[0].children);
            router.addRoute("home", v);
          }
          resolve(router);
        });
        usePermissionStoreHook().changeSetting(info);
      }
      router.addRoute({
        path: "/:pathMatch(.*)",
        redirect: "/error/404"
      });
    });
  });
};

// 重置路由
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

function findRouteByPath(path, routes) {
  let res = routes.find(item => item.path == path);
  if (res) {
    return res;
  } else {
    for (let i = 0; i < routes.length; i++) {
      if (
        routes[i].children instanceof Array &&
        routes[i].children.length > 0
      ) {
        res = findRouteByPath(path, routes[i].children);
        if (res) {
          return res;
        }
      }
    }
    return null;
  }
}

function getParentPaths(path, routes) {
  // 深度遍历查找
  function dfs(routes, path, parents) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      // 找到path则返回父级path
      if (item.path === path) return parents;
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue;
      // 往下查找时将当前path入栈
      parents.push(item.path);

      if (dfs(item.children, path, parents).length) return parents;
      // 深度遍历查找未找到时当前path 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }

  return dfs(routes, path, []);
}

// 路由白名单
const whiteList = ["/login"];

router.beforeEach((to, _from, next) => {
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
      if (usePermissionStoreHook().wholeRoutes.length === 0)
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
            const parentPath = to.matched[0]?.path;
            if (to.meta?.realPath) {
              const { path, name, meta } = to.matched[0]?.children[0];
              handTag(path, parentPath, name, meta);
              return router.push(path);
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
