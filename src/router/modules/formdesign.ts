import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const formDesignRouter = {
  path: "/formDesign",
  component: Layout,
  redirect: "/formDesign/index",
  meta: {
    icon: "terminal-window-line",
    title: $t("menus.hsFormDesign"),
    rank: 2
  },
  children: [
    {
      path: "/formDesign/index",
      name: "FormDesign",
      component: () => import("/@/views/form-design/index.vue"),
      meta: {
        title: $t("menus.hsFormDesign")
      }
    }
  ]
};

export default formDesignRouter;
