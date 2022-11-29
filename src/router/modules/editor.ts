import { $t } from "@/plugins/i18n";
import { editor } from "@/router/enums";
import Edit from "@iconify-icons/ep/edit";

export default {
  path: "/editor",
  redirect: "/editor/index",
  meta: {
    icon: Edit,
    title: $t("menus.hseditor"),
    rank: editor
  },
  children: [
    {
      path: "/editor/index",
      name: "Editor",
      component: () => import("@/views/editor/index.vue"),
      meta: {
        title: $t("menus.hseditor"),
        keepAlive: true
      }
    }
  ]
} as RouteConfigsTable;
