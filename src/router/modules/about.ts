import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const aboutRouter = {
  path: "/about",
  name: "reAbout",
  component: Layout,
  redirect: "/about",
  meta: {
    icon: "question-line",
    title: $t("menus.hsAbout"),
    i18n: true,
    rank: 14
  },
  children: [
    {
      path: "/about",
      name: "reAbout",
      component: () => import("/@/views/about.vue"),
      meta: {
        title: $t("menus.hsAbout"),
        i18n: true
      }
    }
  ]
};

export default aboutRouter;
