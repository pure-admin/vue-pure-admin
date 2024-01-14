import { $t } from "@/plugins/i18n";
import { board } from "@/router/enums";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/board",
  redirect: "/board/index",
  meta: {
    icon: "artboard",
    title: $t("menus.hsboard"),
    rank: board
  },
  children: [
    {
      path: "/board/index",
      name: "FrameBoard",
      component: IFrame,
      meta: {
        title: $t("menus.hsboard"),
        frameSrc: "https://songlh.top/paint-board/",
        extraIcon: "IF-pure-iconfont-new svg"
      }
    }
  ]
} satisfies RouteConfigsTable;
