import Layout from "/@/layout/index.vue";

const editorRouter = {
  path: "/editor",
  name: "reEditor",
  component: Layout,
  redirect: "/editor/index",
  meta: {
    icon: "Edit",
    title: "message.hseditor",
    i18n: true,
    showLink: true,
    rank: 2
  },
  children: [
    {
      path: "/editor/index",
      name: "reEditor",
      component: () => import("/@/views/editor/index.vue"),
      meta: {
        title: "message.hseditor",
        showLink: true,
        i18n: true,
        keepAlive: true,
        extraIcon: {
          svg: true,
          name: "team-iconxinpin"
        }
      }
    }
  ]
};

export default editorRouter;
