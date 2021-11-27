import Layout from "/@/layout/index.vue";

const tabsRouter = {
  path: "/tabs",
  name: "reTabs",
  component: Layout,
  redirect: "/tags/index",
  meta: {
    icon: "IF-team-icontabs",
    title: "message.hstabs",
    i18n: true,
    showLink: true,
    rank: 8
  },
  children: [
    {
      path: "/tabs/index",
      name: "reTabs",
      component: () => import("/@/views/tabs/index.vue"),
      meta: {
        title: "message.hstabs",
        showLink: true,
        i18n: true
      }
    }
  ]
};

export default tabsRouter;
