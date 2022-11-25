import { $t } from "@/plugins/i18n";
import { tree } from "@/router/enums";
import hot from "@/assets/svg/hot.svg?component";

export default {
  path: "/tree",
  redirect: "/tree/index",
  meta: {
    icon: hot,
    title: $t("menus.hsTree"),
    rank: tree
  },
  children: [
    {
      path: "/tree/index",
      name: "Tree",
      component: () => import("@/views/tree/index.vue"),
      meta: {
        title: $t("menus.hsTree")
      }
    }
  ]
} as RouteConfigsTable;
