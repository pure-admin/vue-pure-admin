import Layout from "/@/layout/index.vue";

const remainingRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("/@/views/login.vue"),
    meta: {
      title: "message.hslogin",
      showLink: false,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("/@/views/register.vue"),
    meta: {
      title: "message.hsregister",
      showLink: false,
    },
  },
  {
    // 找不到路由重定向到404页面
    path: "/:pathMatch(.*)",
    component: Layout,
    redirect: "/error/404",
    meta: {
      icon: "el-icon-s-home",
      title: "message.hshome",
      showLink: false,
      savedPosition: false,
    },
  },
  {
    path: "/redirect",
    component: Layout,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("/@/views/redirect.vue"),
      },
    ],
  },
];

export default remainingRouter;
