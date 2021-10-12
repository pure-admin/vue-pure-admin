import Layout from "/@/layout/index.vue";

const nestedRouter = {
  path: "/nested",
  component: Layout,
  redirect: "/nested/menu1/menu1-1",
  name: "Nested",
  meta: {
    title: "message.hsmenus",
    icon: "el-icon-s-data",
    showLink: true,
    savedPosition: false,
    rank: 5
  },
  children: [
    {
      path: "/nested/menu1",
      component: () => import("/@/views/nested/menu1/index.vue"),
      name: "Menu1",
      meta: {
        title: "message.hsmenu1",
        showLink: true,
        keepAlive: true,
        savedPosition: false
      },
      redirect: "/nested/menu1/menu1-1",
      children: [
        {
          path: "/nested/menu1/menu1-1",
          component: () => import("/@/views/nested/menu1/menu1-1/index.vue"),
          name: "Menu1-1",
          meta: {
            title: "message.hsmenu1-1",
            showLink: true,
            keepAlive: true,
            savedPosition: false
          }
        },
        {
          path: "/nested/menu1/menu1-2",
          component: () => import("/@/views/nested/menu1/menu1-2/index.vue"),
          name: "Menu1-2",
          redirect: "/nested/menu1/menu1-2/menu1-2-1",
          meta: {
            title: "message.hsmenu1-2",
            showLink: true,
            keepAlive: true,
            savedPosition: false
          },
          children: [
            {
              path: "/nested/menu1/menu1-2/menu1-2-1",
              component: () =>
                import("/@/views/nested/menu1/menu1-2/menu1-2-1/index.vue"),
              name: "Menu1-2-1",
              meta: {
                title: "message.hsmenu1-2-1",
                showLink: true,
                keepAlive: true,
                savedPosition: false
              }
            },
            {
              path: "/nested/menu1/menu1-2/menu1-2-2",
              component: () =>
                import("/@/views/nested/menu1/menu1-2/menu1-2-2/index.vue"),
              name: "Menu1-2-2",
              meta: {
                title: "message.hsmenu1-2-2",
                showLink: true,
                keepAlive: true,
                savedPosition: false
              }
            }
          ]
        },
        {
          path: "/nested/menu1/menu1-3",
          component: () => import("/@/views/nested/menu1/menu1-3/index.vue"),
          name: "Menu1-3",
          meta: {
            title: "message.hsmenu1-3",
            showLink: true,
            keepAlive: true,
            savedPosition: false
          }
        }
      ]
    },
    {
      path: "/nested/menu2",
      name: "Menu2",
      component: () => import("/@/views/nested/menu2/index.vue"),
      meta: {
        title: "message.hsmenu2",
        showLink: true,
        keepAlive: true,
        savedPosition: false
      }
    }
  ]
};

export default nestedRouter;
