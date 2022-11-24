import { $t } from "@/plugins/i18n";
import { flowchart } from "@/router/enums";
import type { RouteConfigsTable } from "/#/index";

const flowChartRouter: RouteConfigsTable = {
  path: "/flowChart",
  redirect: "/flowChart/index",
  meta: {
    icon: "set-up",
    title: $t("menus.hsflowChart"),
    rank: flowchart
  },
  children: [
    {
      path: "/flowChart/index",
      name: "FlowChart",
      component: () => import("@/views/flow-chart/index.vue"),
      meta: {
        title: $t("menus.hsflowChart")
      }
    }
  ]
};

export default flowChartRouter;
