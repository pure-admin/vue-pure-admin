import Layout from "/@/layout/index.vue";

const remainingRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("/@/views/login.vue"),
    meta: {
      title: "message.hslogin",
      showLink: false,
      i18n: true,
      rank: 101
    }
  },
  {
    path: "/redirect",
    name: "redirect",
    component: Layout,
    meta: {
      icon: "HomeFilled",
      title: "message.hshome",
      i18n: true,
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
