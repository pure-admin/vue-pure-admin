import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const ableRouter = {
  path: "/list",
  component: Layout,
  redirect: "/list/card",
  meta: {
    icon: "list-check",
    title: $t("menus.hsList"),
    i18n: true,
    rank: 12
  },
  children: [
    {
      path: "/list/card",
      name: "listCard",
      component: () => import("/@/views/list/card/index.vue"),
      meta: {
        icon: "card",
        title: $t("menus.hsListCard"),
        i18n: true,
        showParent: true
      }
    }
  ]
};

export default ableRouter;
