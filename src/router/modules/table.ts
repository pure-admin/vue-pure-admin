import { $t } from "@/plugins/i18n";
import hot from "@/assets/svg/hot.svg?component";
import type { RouteConfigsTable } from "/#/index";

const flowChartRouter: RouteConfigsTable = {
  path: "/pure-table",
  redirect: "/pure-table/index",
  meta: {
    icon: hot,
    title: "pure-admin-table",
    rank: 4
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
};

export default flowChartRouter;
