import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const ableRouter = {
  path: "/able",
  name: "components",
  component: Layout,
  redirect: "/able/menuTree",
  meta: {
    icon: "ubuntu-fill",
    title: $t("menus.hsAble"),
    i18n: true,
    rank: 3
  },
  children: [
    {
      path: "/able/menuTree",
      name: "reMenuTree",
      component: () => import("/@/views/able/menu-tree.vue"),
      meta: {
        title: $t("menus.hsMenuTree"),
        i18n: true
      }
    },
    {
      path: "/able/watermark",
      name: "reWatermark",
      component: () => import("/@/views/able/watermark.vue"),
      meta: {
        title: $t("menus.hsWatermark"),
        i18n: true
      }
    }
  ]
};

export default ableRouter;
