import { $t } from "@/plugins/i18n";
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

/** 此文件不要进行任何增删改操作，如需添加新静态路由在同级目录 `modules` 里加就行  */
const homeRouter: RouteConfigsTable = {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "home-filled",
    title: $t("menus.hshome"),
    showLink: false,
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: $t("menus.hshome")
      }
    }
  ]
};

export default homeRouter;
