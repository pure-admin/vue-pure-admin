import Layout from "/@/layout/index.vue";

const permissionRouter = {
  path: "/permission",
  component: Layout,
  redirect: "/permission/page",
  name: "permission",
  meta: {
    title: "message.permission",
    icon: "el-icon-lollipop",
    showLink: true,
    savedPosition: false,
    rank: 3,
  },
  children: [
    {
      path: "/permission/page",
      component: () => import("/@/views/permission/page.vue"),
      name: "permissionPage",
      meta: {
        title: "message.permissionPage",
        showLink: true,
        savedPosition: false,
      },
    },
    {
      path: "/permission/button",
      component: () => import("/@/views/permission/button.vue"),
      name: "permissionButton",
      meta: {
        title: "message.permissionButton",
        showLink: true,
        savedPosition: false,
      },
    },
  ],
};

export default permissionRouter;
