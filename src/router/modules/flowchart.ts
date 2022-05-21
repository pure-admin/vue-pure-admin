import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const flowChartRouter = {
  path: "/flowChart",
  component: Layout,
  redirect: "/flowChart/index",
  meta: {
    icon: "set-up",
    title: $t("menus.hsflowChart"),
    rank: 1
  },
  children: [
    {
      path: "/flowChart/index",
      name: "FlowChart",
      component: () => import("/@/views/flow-chart/index.vue"),
      meta: {
        title: $t("menus.hsflowChart")
      }
    }
  ]
};

export default flowChartRouter;
