import { $t } from "@/plugins/i18n";
import { home } from "@/router/enums";
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

const homeRouter: RouteConfigsTable = {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "home-filled",
    title: $t("menus.hshome"),
    rank: home
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
