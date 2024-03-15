import { $t } from "@/plugins/i18n";
import { ganttchart } from "@/router/enums";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/gantt-chart",
  redirect: "/gantt-chart/index",
  meta: {
    icon: "ri:equalizer-line",
    title: $t("menus.hsganttChart"),
    rank: ganttchart
  },
  children: [
    {
      path: "/gantt-chart/index",
      name: "GanttChart",
      component: IFrame,
      meta: {
        title: $t("menus.hsganttChart"),
        frameSrc:
          "https://docs.dhtmlx.com/gantt/samples/08_api/16_dynamic_progress.html"
      }
    }
  ]
} satisfies RouteConfigsTable;
