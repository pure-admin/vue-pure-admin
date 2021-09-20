import {
  Router,
  createRouter,
  RouteComponent,
  createWebHashHistory
} from "vue-router";
import { i18n } from "/@/plugins/i18n";
import NProgress from "/@/utils/progress";
import { storageSession, storageLocal } from "/@/utils/storage";
import { usePermissionStoreHook } from "/@/store/modules/permission";

// 静态路由
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

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: ascending(constantRoutes).concat(...remainingRouter),
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

export const initRouter = name => {
  return new Promise(resolve => {
    getAsyncRoutes({ name }).then(({ info }) => {
      if (info.length === 0) {
        usePermissionStoreHook().changeSetting(info);
      } else {
        addAsyncRoutes(info).map((v: any) => {
          // 防止重复添加路由
          if (
            router.options.routes.findIndex(value => value.path === v.path) !==
            -1
          ) {
            return;
          } else {
            // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
            router.options.routes.push(v);
            // 最终路由进行升序
            ascending(router.options.routes);
            router.addRoute(v.name, v);
            usePermissionStoreHook().changeSetting(info);
          }
          resolve(router);
        });
      }
      router.addRoute({
        path: "/:pathMatch(.*)",
        redirect: "/error/404"
      });
    });
  });
};

// reset router
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

const whiteList = ["/login", "/register"];

router.beforeEach((to, _from, next) => {
  const name = storageSession.getItem("info");
  NProgress.start();
  // @ts-ignore
  const { t } = i18n.global;
  // @ts-ignore
  to.meta.title ? (document.title = t(to.meta.title)) : "";
  if (name) {
    if (_from?.name) {
      next();
    } else {
      // 刷新
      if (usePermissionStoreHook().wholeRoutes.length === 0)
        initRouter(name.username).then((router: Router) => {
          router.push(to.path);
          // 刷新页面更新标签栏与页面路由匹配
          const localRoutes = storageLocal.getItem(
            "responsive-routesInStorage"
          );
          const optionsRoutes = router.options?.routes;
          const newLocalRoutes = [];
          optionsRoutes.forEach(ors => {
            localRoutes.forEach(lrs => {
              if (ors.path === lrs.parentPath) {
                newLocalRoutes.push(lrs);
              }
            });
          });
          storageLocal.setItem("responsive-routesInStorage", newLocalRoutes);
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
