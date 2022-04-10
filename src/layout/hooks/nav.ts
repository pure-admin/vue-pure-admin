import { computed } from "vue";
import { router } from "/@/router";
import { getConfig } from "/@/config";
import { emitter } from "/@/utils/mitt";
import { routeMetaType } from "../types";
import { remainingPaths } from "/@/router";
import { transformI18n } from "/@/plugins/i18n";
import { storageSession } from "/@/utils/storage";
import { useAppStoreHook } from "/@/store/modules/app";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";

export function useNav() {
  const pureApp = useAppStoreHook();
  // 用户名
  const usename: string = storageSession.getItem("info")?.username;

  // 设置国际化选中后的样式
  const getDropdownItemStyle = computed(() => {
    return (locale, t) => {
      return {
        background: locale === t ? useEpThemeStoreHook().epThemeColor : "",
        color: locale === t ? "#f4f4f5" : "#000"
      };
    };
  });

  const isCollapse = computed(() => {
    return !pureApp.getSidebarStatus;
  });

  // 动态title
  function changeTitle(meta: routeMetaType) {
    const Title = getConfig().Title;
    if (Title)
      document.title = `${transformI18n(meta.title, meta.i18n)} | ${Title}`;
    else document.title = transformI18n(meta.title, meta.i18n);
  }

  // 退出登录
  function logout() {
    storageSession.removeItem("info");
    router.push("/login");
  }

  function backHome() {
    router.push("/welcome");
  }

  function onPanel() {
    emitter.emit("openPanel");
  }

  function toggleSideBar() {
    pureApp.toggleSideBar();
  }

  function handleResize(menuRef) {
    menuRef.handleResize();
  }

  function resolvePath(route) {
    const httpReg = /^http(s?):\/\//;
    const routeChildPath = route.children[0]?.path;
    if (httpReg.test(routeChildPath)) {
      return route.path + "/" + routeChildPath;
    } else {
      return routeChildPath;
    }
  }

  function menuSelect(indexPath: string, routers): void {
    if (isRemaining(indexPath)) return;
    let parentPath = "";
    const parentPathIndex = indexPath.lastIndexOf("/");
    if (parentPathIndex > 0) {
      parentPath = indexPath.slice(0, parentPathIndex);
    }
    // 找到当前路由的信息
    function findCurrentRoute(indexPath: string, routes) {
      return routes.map(item => {
        if (item.path === indexPath) {
          if (item.redirect) {
            findCurrentRoute(item.redirect, item.children);
          } else {
            // 切换左侧菜单 通知标签页
            emitter.emit("changLayoutRoute", {
              indexPath,
              parentPath
            });
          }
        } else {
          if (item.children) findCurrentRoute(indexPath, item.children);
        }
      });
    }
    findCurrentRoute(indexPath, routers);
  }

  // 判断路径是否参与菜单
  function isRemaining(path: string): boolean {
    return remainingPaths.includes(path);
  }

  return {
    logout,
    backHome,
    onPanel,
    changeTitle,
    toggleSideBar,
    menuSelect,
    handleResize,
    resolvePath,
    isCollapse,
    pureApp,
    usename,
    getDropdownItemStyle
  };
}
