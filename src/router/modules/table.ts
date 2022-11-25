import { $t } from "@/plugins/i18n";
import { table } from "@/router/enums";
import hot from "@/assets/svg/hot.svg?component";

export default {
  path: "/pure-table",
  redirect: "/pure-table/index",
  meta: {
    icon: hot,
    title: "pure-admin-table",
    rank: table
  },
  children: [
    {
      path: "/pure-table/index",
      name: "PureTable",
      component: () => import("@/views/pure-table/index.vue"),
      meta: {
        title: $t("menus.hsPureTableBase")
      }
    },
    {
      path: "/pure-table/high",
      name: "PureTableHigh",
      component: () => import("@/views/pure-table/high.vue"),
      meta: {
        title: $t("menus.hsPureTableHigh")
      }
    }
  ]
} as RouteConfigsTable;
