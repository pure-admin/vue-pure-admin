import { $t } from "@/plugins/i18n";
import { about } from "@/router/enums";
import type { RouteConfigsTable } from "/#/index";

const aboutRouter: RouteConfigsTable = {
  path: "/about",
  redirect: "/about/index",
  meta: {
    // icon: "question-line",
    title: $t("menus.hsAbout"),
    rank: about
  },
  children: [
    {
      path: "/about/index",
      name: "About",
      component: () => import("@/views/about/index.vue"),
      meta: {
        title: $t("menus.hsAbout")
      }
    }
  ]
};

export default aboutRouter;
