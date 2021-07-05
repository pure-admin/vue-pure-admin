import Layout from "/@/layout/index.vue";

const editorRouter = {
  path: "/editor",
  name: "editor",
  component: Layout,
  redirect: "/editor/index",
  meta: {
    icon: "el-icon-edit-outline",
    title: "message.hseditor",
    showLink: true,
    savedPosition: true,
    rank: 2
  },
  children: [
    {
      path: "/editor/index",
      name: "editor",
      component: () => import("/@/views/editor/index.vue"),
      meta: {
        title: "message.hseditor",
        showLink: true,
        savedPosition: true
      }
    }
  ]
};

export default editorRouter;
