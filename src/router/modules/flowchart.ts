import Layout from "/@/layout/index.vue";

const flowChartRouter = {
  path: "/flowChart",
  name: "flowChart",
  component: Layout,
  redirect: "/flowChart/index",
  meta: {
    icon: "el-icon-set-up",
    title: "message.hsflowChart",
    showLink: true,
    savedPosition: true,
    rank: 1
  },
  children: [
    {
      path: "/flowChart/index",
      name: "flowChart",
      component: () => import("/@/views/flow-chart/index.vue"),
      meta: {
        title: "message.hsflowChart",
        showLink: true,
        savedPosition: true
      }
    }
  ]
};

export default flowChartRouter;
