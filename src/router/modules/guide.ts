import { $t } from "/@/plugins/i18n";
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("/@/layout/index.vue");

const guideRouter: RouteConfigsTable = {
  path: "/guide",
  component: Layout,
  redirect: "/guide/index",
  meta: {
    icon: "guide",
    title: $t("menus.hsguide"),
    rank: 14
  },
  children: [
    {
      path: "/guide/index",
      name: "Guide",
      component: () => import("/@/views/guide/index.vue"),
      meta: {
        title: $t("menus.hsguide")
      }
    }
  ]
};

export default guideRouter;
