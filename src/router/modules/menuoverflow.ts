import { $t } from "@/plugins/i18n";
import { menuoverflow } from "@/router/enums";

export default {
  path: "/menuoverflow",
  redirect: "/menuoverflow/index",
  meta: {
    title: $t("menus.hsMenuoverflow"),
    rank: menuoverflow
  },
  children: [
    {
      path: "/menuoverflow/index",
      name: "MenuOverflow",
      component: () => import("@/views/menuoverflow/index.vue"),
      meta: {
        title: $t("menus.hsChildMenuoverflow"),
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
