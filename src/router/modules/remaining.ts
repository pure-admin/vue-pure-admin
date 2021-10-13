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
  {
    path: "/redirect",
    name: "redirect",
    component: Layout,
    meta: {
      icon: "el-icon-s-home",
      title: "message.hshome",
      showLink: false,
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
