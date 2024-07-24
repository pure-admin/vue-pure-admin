const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Total",
  component: Layout,
  redirect: "/home/index",
  meta: {
    icon: "ep:location",
    title: "测试总览",
    rank: 1
  },
  children: [
    {
      path: "/home/index",
      name: "TotalIndex",
      component: () => import("@/views/home/index.vue"),
      meta: {
        title: "测试总览"
      }
    }
  ]
} satisfies RouteConfigsTable;
