import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const nestedRouter = {
  path: "/nested",
  component: Layout,
  redirect: "/nested/menu1/menu1-1",
  meta: {
    title: $t("menus.hsmenus"),
    icon: "histogram",
    i18n: true,
    rank: 6
  },
  children: [
    {
      path: "/nested/menu1",
      meta: {
        title: $t("menus.hsmenu1"),
        i18n: true,
        keepAlive: true
      },
      redirect: "/nested/menu1/menu1-1",
      children: [
        {
          path: "/nested/menu1/menu1-1",
          component: () => import("/@/views/nested/menu1/menu1-1/index.vue"),
          name: "Menu1-1",
          meta: {
            title: $t("menus.hsmenu1-1"),
            i18n: true,
            keepAlive: true
          }
        },
        {
          path: "/nested/menu1/menu1-2",
          redirect: "/nested/menu1/menu1-2/menu1-2-1",
          meta: {
            title: $t("menus.hsmenu1-2"),
            i18n: true,
            keepAlive: true
          },
          children: [
            {
              path: "/nested/menu1/menu1-2/menu1-2-1",
              component: () =>
                import("/@/views/nested/menu1/menu1-2/menu1-2-1/index.vue"),
              name: "Menu1-2-1",
              meta: {
                title: $t("menus.hsmenu1-2-1"),
                i18n: true,
                keepAlive: true
              }
            },
            {
              path: "/nested/menu1/menu1-2/menu1-2-2",
              component: () =>
                import("/@/views/nested/menu1/menu1-2/menu1-2-2/index.vue"),
              name: "Menu1-2-2",
              meta: {
                title: $t("menus.hsmenu1-2-2"),
                keepAlive: true,
                i18n: true,
                extraIcon: {
                  svg: true,
                  name: "team-iconxinpinrenqiwang"
                }
              }
            }
          ]
        },
        {
          path: "/nested/menu1/menu1-3",
          component: () => import("/@/views/nested/menu1/menu1-3/index.vue"),
          name: "Menu1-3",
          meta: {
            title: $t("menus.hsmenu1-3"),
            i18n: true,
            keepAlive: true
          }
        }
      ]
    },
    {
      path: "/nested/menu2",
      name: "Menu2",
      component: () => import("/@/views/nested/menu2/index.vue"),
      meta: {
        title: $t("menus.hsmenu2"),
        i18n: true,
        keepAlive: true
      }
    }
  ]
};

export default nestedRouter;
