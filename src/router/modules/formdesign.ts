import { $t } from "@/plugins/i18n";
import type { RouteConfigsTable } from "/#/index";
const IFrame = () => import("@/layout/frameView.vue");

const formDesignRouter: RouteConfigsTable = {
  path: "/formDesign",
  redirect: "/formDesign/index",
  meta: {
    icon: "terminal-window-line",
    title: $t("menus.hsFormDesign"),
    rank: 2
  },
  children: [
    {
      path: "/formDesign/index",
      name: "FormDesign",
      component: IFrame,
      meta: {
        title: $t("menus.hsFormDesign"),
        frameSrc:
          "https://haixin-fang.github.io/starfish-vue3-lowcode/playground/index.html#/"
      }
    }
  ]
};

export default formDesignRouter;
