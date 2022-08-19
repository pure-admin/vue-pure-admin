import { $t } from "/@/plugins/i18n";
import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("/@/layout/index.vue");

const editorRouter: RouteConfigsTable = {
  path: "/editor",
  component: Layout,
  redirect: "/editor/index",
  meta: {
    icon: "edit",
    title: $t("menus.hseditor"),
    rank: 2
  },
  children: [
    {
      path: "/editor/index",
      name: "Editor",
      component: () => import("/@/views/editor/index.vue"),
      meta: {
        title: $t("menus.hseditor"),
        keepAlive: true
      }
    }
  ]
};

export default editorRouter;
