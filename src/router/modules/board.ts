import { $t } from "@/plugins/i18n";
import { board } from "@/router/enums";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/board",
  redirect: "/board/index",
  meta: {
    icon: "ri:artboard-line",
    title: $t("menus.pureBoard"),
    rank: board
  },
  children: [
    {
      path: "/board/index",
      name: "FrameBoard",
      component: IFrame,
      meta: {
        title: $t("menus.pureBoard"),
        frameSrc: "https://songlh.top/paint-board/"
      }
    }
  ]
} satisfies RouteConfigsTable;
