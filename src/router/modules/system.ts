import Layout from "/@/layout/index.vue";

const systemRouter = {
  path: "/system",
  name: "system",
  component: Layout,
  redirect: "/system/base",
  children: [
    {
      path: "/system/base",
      component: () => import("/@/views/system/user.vue"),
      meta: {
        title: "message.hsBaseinfo",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/system/dict",
      component: () => import("/@/views/system/dict/index.vue"),
      meta: {
        title: "message.hsDict",
        showLink: false,
        savedPosition: true,
      },
    },
  ],
  meta: {
    icon: "el-icon-setting",
    title: "message.hssysManagement",
    showLink: true,
    savedPosition: true,
  },
};

export default systemRouter;
