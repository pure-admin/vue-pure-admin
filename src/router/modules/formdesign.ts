import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const formDesignRouter = {
  path: "/formDesign",
  component: Layout,
  redirect: "/formDesign/index",
  meta: {
    icon: "terminal-window-line",
    title: $t("menus.hsFormDesign"),
    i18n: true,
    rank: 2
  },
  children: [
    {
      path: "/formDesign/index",
      name: "formDesign",
      component: () => import("/@/views/form-design/index.vue"),
      meta: {
        title: $t("menus.hsFormDesign"),
        i18n: true
      }
    }
  ]
};

export default formDesignRouter;
