import Layout from "/@/layout/index.vue";

const flowChartRouter = {
  path: "/flowChart",
  name: "flowChart",
  component: Layout,
  redirect: "/flowChart/index",
  children: [
    {
      path: "/flowChart/index",
      component: () => import("/@/views/flow-chart/index.vue"),
      meta: {
        title: "message.hsflowChart",
        showLink: false,
        savedPosition: true,
      },
    },
  ],
  meta: {
    icon: "el-icon-set-up",
    title: "message.hsflowChart",
    showLink: true,
    savedPosition: true,
  },
};

export default flowChartRouter;
