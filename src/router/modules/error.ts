import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const errorRouter = {
  path: "/error",
  name: "error",
  component: Layout,
  redirect: "/error/401",
  meta: {
    icon: "position",
    title: $t("menus.hserror"),
    i18n: true,
    rank: 7
  },
  children: [
    {
      path: "/error/401",
      name: "401",
      component: () => import("/@/views/error/401.vue"),
      meta: {
        title: $t("menus.hsfourZeroOne"),
        i18n: true
      }
    },
    {
      path: "/error/404",
      name: "404",
      component: () => import("/@/views/error/404.vue"),
      meta: {
        title: $t("menus.hsfourZeroFour"),
        i18n: true
      }
    }
  ]
};

export default errorRouter;
