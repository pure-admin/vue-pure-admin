import { $t } from "/@/plugins/i18n";
import Layout from "/@/layout/index.vue";

const guideRouter = {
  path: "/guide",
  name: "reGuide",
  component: Layout,
  redirect: "/guide/index",
  meta: {
    icon: "Guide",
    title: $t("menus.hsguide"),
    i18n: true,
    showLink: true,
    rank: 10
  },
  children: [
    {
      path: "/guide/index",
      name: "reGuide",
      component: () => import("/@/views/guide/index.vue"),
      meta: {
        title: $t("menus.hsguide"),
        showLink: true,
        i18n: true
      }
    }
  ]
};

export default guideRouter;
