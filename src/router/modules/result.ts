import { $t } from "/@/plugins/i18n";
import type { RouteConfigsTable } from "/#/index";

const resultRouter: RouteConfigsTable = {
  path: "/result",
  redirect: "/result/success",
  meta: {
    icon: "checkbox-circle-line",
    title: $t("menus.hsResult"),
    rank: 8
  },
  children: [
    {
      path: "/result/success",
      name: "Success",
      component: () => import("/@/views/result/success.vue"),
      meta: {
        title: $t("menus.hsSuccess")
      }
    },
    {
      path: "/result/fail",
      name: "Fail",
      component: () => import("/@/views/result/fail.vue"),
      meta: {
        title: $t("menus.hsFail")
      }
    }
  ]
};

export default resultRouter;
