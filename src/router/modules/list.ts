import { $t } from "@/plugins/i18n";
import { list } from "@/router/enums";

export default {
  path: "/list",
  redirect: "/list/card",
  meta: {
    icon: "ri:list-check",
    title: $t("menus.pureList"),
    rank: list
  },
  children: [
    {
      path: "/list/card",
      name: "CardList",
      component: () => import("@/views/list/card/index.vue"),
      meta: {
        icon: "ri:bank-card-line",
        title: $t("menus.pureCardList"),
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
