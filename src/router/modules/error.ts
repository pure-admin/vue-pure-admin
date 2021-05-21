import Layout from "/@/layout/index.vue";

const errorRouter = {
  path: "/error",
  name: "error",
  component: Layout,
  redirect: "/error/401",
  children: [
    {
      path: "/error/401",
      component: () => import("/@/views/error/401.vue"),
      meta: {
        title: "message.hsfourZeroOne",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/error/404",
      component: () => import("/@/views/error/404.vue"),
      meta: {
        title: "message.hsfourZeroFour",
        showLink: false,
        savedPosition: true,
      },
    },
  ],
  meta: {
    icon: "el-icon-position",
    title: "message.hserror",
    showLink: true,
    savedPosition: true,
  },
};

export default errorRouter;
