import type { RouteConfigsTable } from "/#/index";

const flowChartRouter: RouteConfigsTable = {
  path: "/pure-table",
  redirect: "/pure-table/index",
  meta: {
    icon: "mdi:table-large",
    title: "pure-admin-table",
    rank: 4
  },
  children: [
    {
      path: "/pure-table/index",
      name: "PureTable",
      component: () => import("@/views/pure-table/index.vue"),
      meta: {
        title: "pure-admin-table"
      }
    }
  ]
};

export default flowChartRouter;
