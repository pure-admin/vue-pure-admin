import Layout from "/@/layout/index.vue";

const homeRouter = {
  path: "/",
  name: "home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "el-icon-s-home",
    showLink: true,
    savedPosition: false,
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "welcome",
      component: () => import("/@/views/welcome.vue"),
      meta: {
        title: "message.hshome",
        showLink: true,
        savedPosition: false
      }
    }
  ]
};

export default homeRouter;
