import { Layout } from "./index";
import { $t } from "/@/plugins/i18n";

const flowChartRouter = {
  path: "/flowChart",
  name: "flowChart",
  component: Layout,
  redirect: "/flowChart/index",
  meta: {
    icon: "set-up",
    title: $t("menus.hsflowChart"),
    i18n: true,
    rank: 1
  },
  children: [
    {
      path: "/flowChart/index",
      name: "flowChart",
      component: () => import("/@/views/flow-chart/index.vue"),
      meta: {
        title: $t("menus.hsflowChart"),
        i18n: true
      }
    }
  ]
};

export default flowChartRouter;
