import Layout from "/@/layout/index.vue";

const remainingRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("/@/views/login.vue"),
    meta: {
      title: "message.hslogin",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("/@/views/register.vue"),
    meta: {
      title: "message.hsregister",
      showLink: false,
      rank: 102
    }
  },
  // {
  //   // 找不到路由重定向到404页面
  //   path: "/:pathMatch(.*)",
  //   name: "pathMatch",
  //   component: Layout,
  //   redirect: "/error/404",
  //   meta: {
  //     icon: "el-icon-s-home",
  //     title: "message.hshome",
  //     showLink: false,
  //     savedPosition: false,
  //     rank: 103,
  //   },
  // },
  {
    path: "/redirect",
    name: "redirect",
    component: Layout,
    meta: {
      icon: "el-icon-s-home",
      title: "message.hshome",
      showLink: false,
      savedPosition: false,
      rank: 104
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "redirect",
        component: () => import("/@/views/redirect.vue")
      }
    ]
  }
];

export default remainingRouter;
