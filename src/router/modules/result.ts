import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const resultRouter = {
  path: "/result",
  component: Layout,
  redirect: "/result/success",
  meta: {
    icon: "checkbox-circle-line",
    title: $t("menus.hsResult"),
    i18n: true,
    rank: 8
  },
  children: [
    {
      path: "/result/success",
      name: "reSuccess",
      component: () => import("/@/views/result/success.vue"),
      meta: {
        title: $t("menus.hsSuccess"),
        i18n: true
      }
    },
    {
      path: "/result/fail",
      name: "reFail",
      component: () => import("/@/views/result/fail.vue"),
      meta: {
        title: $t("menus.hsFail"),
        i18n: true
      }
    }
  ]
};

export default resultRouter;
