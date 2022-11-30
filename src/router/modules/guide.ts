import { $t } from "@/plugins/i18n";
import { guide } from "@/router/enums";
import Guide from "@iconify-icons/ep/guide";

export default {
  path: "/guide",
  redirect: "/guide/index",
  meta: {
    icon: Guide,
    title: $t("menus.hsguide"),
    rank: guide
  },
  children: [
    {
      path: "/guide/index",
      name: "Guide",
      component: () => import("@/views/guide/index.vue"),
      meta: {
        title: $t("menus.hsguide")
      }
    }
  ]
} as RouteConfigsTable;
