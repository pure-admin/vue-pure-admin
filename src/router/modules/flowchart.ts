import { $t } from "@/plugins/i18n";
import { flowchart } from "@/router/enums";
import SetUp from "@iconify-icons/ep/set-up";

export default {
  path: "/flowChart",
  redirect: "/flowChart/index",
  meta: {
    icon: SetUp,
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
} as RouteConfigsTable;
