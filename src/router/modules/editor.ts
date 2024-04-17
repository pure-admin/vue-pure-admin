import { $t } from "@/plugins/i18n";
import { editor } from "@/router/enums";

export default {
  path: "/editor",
  redirect: "/editor/index",
  meta: {
    icon: "ep:edit",
    title: $t("menus.pureEditor"),
    rank: editor
  },
  children: [
    {
      path: "/editor/index",
      name: "Editor",
      component: () => import("@/views/editor/index.vue"),
      meta: {
        title: $t("menus.pureEditor"),
        keepAlive: true
      }
    }
  ]
} satisfies RouteConfigsTable;
