import { $t } from "/@/plugins/i18n";
import type { RouteConfigsTable } from "/#/index";

const ableRouter: RouteConfigsTable = {
  path: "/list",
  redirect: "/list/card",
  meta: {
    icon: "list-check",
    title: $t("menus.hsList"),
    rank: 12
  },
  children: [
    {
      path: "/list/card",
      name: "ListCard",
      component: () => import("/@/views/list/card/index.vue"),
      meta: {
        icon: "card",
        title: $t("menus.hsListCard"),
        showParent: true
      }
    }
  ]
};

export default ableRouter;
