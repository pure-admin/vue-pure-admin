import { $t } from "@/plugins/i18n";
import { home } from "@/router/enums";
const Layout = () => import("@/layout/index.vue");
import HomeFilled from "@iconify-icons/ep/home-filled";

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: HomeFilled,
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
} as RouteConfigsTable;
