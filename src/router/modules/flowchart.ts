import { $t } from "@/plugins/i18n";
import { flowchart } from "@/router/enums";

export default {
  path: "/flow-chart",
  redirect: "/flow-chart/index",
  meta: {
    icon: "setUp",
    title: $t("menus.hsflowChart"),
    rank: flowchart
  },
  children: [
    {
      path: "/flow-chart/index",
      name: "FlowChart",
      component: () => import("@/views/flow-chart/index.vue"),
      meta: {
        title: $t("menus.hsflowChart")
      }
    }
  ]
} satisfies RouteConfigsTable;
