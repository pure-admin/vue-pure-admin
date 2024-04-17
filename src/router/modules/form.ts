import { $t } from "@/plugins/i18n";
import { form } from "@/router/enums";

export default {
  path: "/form",
  redirect: "/form/index",
  meta: {
    icon: "ri:edit-box-line",
    title: $t("menus.pureSchemaForm"),
    rank: form
  },
  children: [
    {
      path: "/form/index",
      name: "SchemaForm",
      component: () => import("@/views/schema-form/index.vue"),
      meta: {
        title: $t("menus.pureSchemaForm"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    }
  ]
} satisfies RouteConfigsTable;
