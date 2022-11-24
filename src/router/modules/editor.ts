import { $t } from "@/plugins/i18n";
import { editor } from "@/router/enums";
import type { RouteConfigsTable } from "/#/index";

const editorRouter: RouteConfigsTable = {
  path: "/editor",
  redirect: "/editor/index",
  meta: {
    icon: "edit",
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
};

export default editorRouter;
