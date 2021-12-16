import Layout from "/@/layout/index.vue";

const menuTreeRouter = {
  path: "/menuTree",
  name: "reMenuTree",
  component: Layout,
  redirect: "/menuTree/index",
  meta: {
    icon: "RI-node-tree",
    title: "message.hsMenuTree",
    i18n: true,
    showLink: true,
    rank: 9
  },
  children: [
    {
      path: "/menuTree/index",
      name: "reMenuTree",
      component: () => import("/@/views/menu-tree/index.vue"),
      meta: {
        title: "message.hsMenuTree",
        showLink: true,
        i18n: true
      }
    }
  ]
};

export default menuTreeRouter;
