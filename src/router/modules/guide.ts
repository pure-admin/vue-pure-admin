import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const guideRouter = {
  path: "/guide",
  component: Layout,
  redirect: "/guide/index",
  meta: {
    icon: "guide",
    title: $t("menus.hsguide"),
    i18n: true,
    rank: 14
  },
  children: [
    {
      path: "/guide/index",
      name: "reGuide",
      component: () => import("/@/views/guide/index.vue"),
      meta: {
        title: $t("menus.hsguide"),
        i18n: true
      }
    }
  ]
};

export default guideRouter;
