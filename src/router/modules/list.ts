import { $t } from "@/plugins/i18n";
import { list } from "@/router/enums";
import ListCheck from "@iconify-icons/ri/list-check";
import Card from "@iconify-icons/ri/bank-card-line";

export default {
  path: "/list",
  redirect: "/list/card",
  meta: {
    icon: ListCheck,
    title: $t("menus.hsList"),
    rank: list
  },
  children: [
    {
      path: "/list/card",
      name: "ListCard",
      component: () => import("@/views/list/card/index.vue"),
      meta: {
        icon: Card,
        title: $t("menus.hsListCard"),
        showParent: true
      }
    }
  ]
} as RouteConfigsTable;
