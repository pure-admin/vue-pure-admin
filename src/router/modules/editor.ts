import Layout from "/@/layout/index.vue";

const editorRouter = {
  path: "/editor",
  name: "editor",
  component: Layout,
  redirect: "/editor/index",
  children: [
    {
      path: "/editor/index",
      component: () => import("/@/views/editor/index.vue"),
      meta: {
        title: "message.hseditor",
        showLink: false,
        savedPosition: true,
      },
    },
  ],
  meta: {
    icon: "el-icon-edit-outline",
    title: "message.hseditor",
    showLink: true,
    savedPosition: true,
  },
};

export default editorRouter;
