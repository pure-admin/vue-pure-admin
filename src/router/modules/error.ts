import { $t } from "/@/plugins/i18n";
import type { RouteConfigsTable } from "/#/index";

const errorRouter: RouteConfigsTable = {
  path: "/error",
  redirect: "/error/403",
  meta: {
    icon: "information-line",
    title: $t("menus.hsabnormal"),
    rank: 9
  },
  children: [
    {
      path: "/error/403",
      name: "403",
      component: () => import("/@/views/error/403.vue"),
      meta: {
        title: $t("menus.hsfourZeroOne")
      }
    },
    {
      path: "/error/404",
      name: "404",
      component: () => import("/@/views/error/404.vue"),
      meta: {
        title: $t("menus.hsfourZeroFour")
      }
    },
    {
      path: "/error/500",
      name: "500",
      component: () => import("/@/views/error/500.vue"),
      meta: {
        title: $t("menus.hsFive")
      }
    }
  ]
};

export default errorRouter;
