import Layout from "/@/layout/index.vue";

const flowChartRouter = {
  path: "/flowChart",
  name: "flowChart",
  component: Layout,
  redirect: "/flowChart/index",
  meta: {
    icon: "SetUp",
    title: "message.hsflowChart",
    showLink: true,
    i18n: true,
    rank: 1
  },
  children: [
    {
      path: "/flowChart/index",
      name: "flowChart",
      component: () => import("/@/views/flow-chart/index.vue"),
      meta: {
        title: "message.hsflowChart",
        i18n: true,
        showLink: true
      }
    }
  ]
};

export default flowChartRouter;
