import { $t } from "@/plugins/i18n";
import { table } from "@/router/enums";

export default {
  path: "/table",
  redirect: "/table/index",
  meta: {
    icon: "ri:table-line",
    title: $t("menus.pureTable"),
    rank: table
  },
  children: [
    {
      path: "/table/index",
      name: "PureTable",
      component: () => import("@/views/table/index.vue"),
      meta: {
        title: $t("menus.pureTableBase")
      }
    },
    {
      path: "/table/high",
      name: "PureTableHigh",
      component: () => import("@/views/table/high.vue"),
      meta: {
        title: $t("menus.pureTableHigh")
      }
    },
    {
      path: "/table/edit",
      name: "PureTableEdit",
      component: () => import("@/views/table/edit.vue"),
      meta: {
        title: $t("menus.pureTableEdit"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/table/virtual",
      name: "VxeTable",
      component: () => import("@/views/table/virtual.vue"),
      meta: {
        title: $t("menus.pureVxeTable"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    }
  ]
} satisfies RouteConfigsTable;
