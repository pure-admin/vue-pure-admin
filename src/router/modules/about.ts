import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const aboutRouter = {
  path: "/about",
  component: Layout,
  redirect: "/about/index",
  meta: {
    icon: "question-line",
    title: $t("menus.hsAbout"),
    i18n: true,
    rank: 15
  },
  children: [
    {
      path: "/about/index",
      name: "reAbout",
      component: () => import("/@/views/about/index.vue"),
      meta: {
        title: $t("menus.hsAbout"),
        i18n: true
      }
    }
  ]
};

export default aboutRouter;
