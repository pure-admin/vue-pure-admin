import { $t } from "@/plugins/i18n";
import { formdesign } from "@/router/enums";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/formDesign",
  redirect: "/formDesign/index",
  meta: {
    icon: "terminalWindowLine",
    title: $t("menus.hsFormDesign"),
    rank: formdesign
  },
  children: [
    {
      path: "/formDesign/index",
      name: "FormDesign",
      component: IFrame,
      meta: {
        title: $t("menus.hsFormDesign"),
        frameSrc:
          "https://haixin-fang.github.io/vue-form-design/playground/index.html",
        frameLoading: false
      }
    }
  ]
} satisfies RouteConfigsTable;
