import { $t } from "@/plugins/i18n";
import { nested } from "@/router/enums";

export default {
  path: "/nested",
  redirect: "/nested/menu1/menu1-1",
  meta: {
    title: $t("menus.hsmenus"),
    icon: "histogram",
    rank: nested
  },
  children: [
    {
      path: "/nested/menu1",
      meta: {
        title: $t("menus.hsmenu1"),
        keepAlive: true
      },
      redirect: "/nested/menu1/menu1-1",
      children: [
        {
          path: "/nested/menu1/menu1-1",
          component: () => import("@/views/nested/menu1/menu1-1/index.vue"),
          name: "Menu1-1",
          meta: {
            title: $t("menus.hsmenu1-1"),
            keepAlive: true
          }
        },
        {
          path: "/nested/menu1/menu1-2",
          redirect: "/nested/menu1/menu1-2/menu1-2-1",
          meta: {
            title: $t("menus.hsmenu1-2"),
            keepAlive: true
          },
          children: [
            {
              path: "/nested/menu1/menu1-2/menu1-2-1",
              component: () =>
                import("@/views/nested/menu1/menu1-2/menu1-2-1/index.vue"),
              name: "Menu1-2-1",
              meta: {
                title: $t("menus.hsmenu1-2-1"),
                keepAlive: true
              }
            },
            {
              path: "/nested/menu1/menu1-2/menu1-2-2",
              component: () =>
                import("@/views/nested/menu1/menu1-2/menu1-2-2/index.vue"),
              name: "Menu1-2-2",
              meta: {
                title: $t("menus.hsmenu1-2-2"),
                keepAlive: true,
                extraIcon: "IF-pure-iconfont-new svg"
              }
            }
          ]
        },
        {
          path: "/nested/menu1/menu1-3",
          component: () => import("@/views/nested/menu1/menu1-3/index.vue"),
          name: "Menu1-3",
          meta: {
            title: $t("menus.hsmenu1-3"),
            keepAlive: true
          }
        }
      ]
    },
    {
      path: "/nested/menu2",
      name: "Menu2",
      component: () => import("@/views/nested/menu2/index.vue"),
      meta: {
        title: $t("menus.hsmenu2"),
        keepAlive: true
      }
    }
  ]
} as RouteConfigsTable;
