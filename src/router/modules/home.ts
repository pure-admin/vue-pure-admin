import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const homeRouter = {
  path: "/",
  name: "home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "home-filled",
    title: $t("menus.hshome"),
    i18n: true,
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "welcome",
      component: () => import("/@/views/welcome.vue"),
      meta: {
        title: $t("menus.hshome"),
        i18n: true
      }
    }
  ]
};

export default homeRouter;
