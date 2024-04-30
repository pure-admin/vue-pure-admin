import { $t } from "@/plugins/i18n";
import { formdesign } from "@/router/enums";
const IFrame = () => import("@/layout/frame.vue");

export default {
  path: "/form-design",
  redirect: "/form-design/index",
  meta: {
    icon: "ri:terminal-window-line",
    title: $t("menus.pureFormDesign"),
    rank: formdesign
  },
  children: [
    {
      path: "/form-design/index",
      name: "FormDesign",
      component: IFrame,
      meta: {
        title: $t("menus.pureFormDesign"),
        keepAlive: true,
        frameSrc:
          "https://haixin-fang.github.io/vue-form-design/playground/index.html",
        frameLoading: false
      }
    }
  ]
} satisfies RouteConfigsTable;
