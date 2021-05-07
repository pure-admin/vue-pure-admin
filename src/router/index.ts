import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import Layout from "../layout/index.vue";

import { storageSession } from "../utils/storage";

import { i18n } from "/@/plugins/i18n/index";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Layout,
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        name: "welcome",
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/welcome.vue"),
        meta: {
          title: "message.hshome",
          showLink: true,
          savedPosition: false,
        },
      },
    ],
    meta: {
      icon: "el-icon-s-home",
      showLink: true,
      savedPosition: false,
    },
  },
  {
    path: "/components",
    name: "components",
    component: Layout,
    redirect: "/components/split-pane",
    children: [
      {
        path: "/components/video",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "../views/components/video/index.vue"
          ),
        meta: {
          title: "message.hsvideo",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/components/map",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "../views/components/map/index.vue"
          ),
        meta: {
          title: "message.hsmap",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/components/draggable",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "../views/components/draggable/index.vue"
          ),
        meta: {
          title: "message.hsdraggable",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/components/split-pane",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "../views/components/split-pane/index.vue"
          ),
        meta: {
          title: "message.hssplitPane",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/components/button",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "../views/components/button/index.vue"
          ),
        meta: {
          title: "message.hsbutton",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/components/cropping",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "../views/components/cropping/index.vue"
          ),
        meta: {
          title: "message.hscropping",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/components/countTo",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "../views/components/count-to/index.vue"
          ),
        meta: {
          title: "message.hscountTo",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/components/selector",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "../views/components/selector/index.vue"
          ),
        meta: {
          title: "message.hsselector",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/components/seamlessScroll",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "../views/components/seamless-scroll/index.vue"
          ),
        meta: {
          title: "message.hsseamless",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/components/contextmenu",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "../views/components/contextmenu/index.vue"
          ),
        meta: {
          title: "message.hscontextmenu",
          showLink: false,
          savedPosition: true,
        },
      },
    ],
    meta: {
      icon: "el-icon-menu",
      title: "message.hscomponents",
      showLink: true,
      savedPosition: true,
    },
  },
  {
    path: "/flowChart",
    name: "flowChart",
    component: Layout,
    redirect: "/flowChart/index",
    children: [
      {
        path: "/flowChart/index",
        component: () =>
          import(
            /* webpackChunkName: "user" */ "../views/flow-chart/index.vue"
          ),
        meta: {
          title: "message.hsflowChart",
          showLink: false,
          savedPosition: true,
        },
      },
    ],
    meta: {
      icon: "el-icon-set-up",
      title: "message.hsflowChart",
      showLink: true,
      savedPosition: true,
    },
  },
  {
    path: "/editor",
    name: "editor",
    component: Layout,
    redirect: "/editor/index",
    children: [
      {
        path: "/editor/index",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/editor/index.vue"),
        meta: {
          // icon: 'el-icon-edit-outline',
          title: "message.hseditor",
          showLink: false,
          savedPosition: true,
        },
      },
    ],
    meta: {
      icon: "el-icon-edit-outline",
      title: "message.hseditor",
      showLink: true,
      savedPosition: true,
    },
  },
  {
    path: "/system",
    name: "system",
    component: Layout,
    redirect: "/system/base",
    children: [
      {
        path: "/system/base",
        component: () =>
          import(/* webpackChunkName: "system" */ "../views/system/user.vue"),
        meta: {
          // icon: '',
          title: "message.hsBaseinfo",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/system/dict",
        component: () =>
          import(
            /* webpackChunkName: "system" */ "../views/system/dict/index.vue"
          ),
        meta: {
          // icon: '',
          title: "message.hsDict",
          showLink: false,
          savedPosition: true,
        },
      },
    ],
    meta: {
      icon: "el-icon-setting",
      title: "message.hssysManagement",
      showLink: true,
      savedPosition: true,
    },
  },
  {
    path: "/error",
    name: "error",
    component: Layout,
    redirect: "/error/401",
    children: [
      {
        path: "/error/401",
        component: () =>
          import(/* webpackChunkName: "error" */ "../views/error/401.vue"),
        meta: {
          title: "message.hsfourZeroOne",
          showLink: false,
          savedPosition: true,
        },
      },
      {
        path: "/error/404",
        component: () =>
          import(/* webpackChunkName: "error" */ "../views/error/404.vue"),
        meta: {
          title: "message.hsfourZeroFour",
          showLink: false,
          savedPosition: true,
        },
      },
    ],
    meta: {
      icon: "el-icon-position",
      title: "message.hserror",
      showLink: true,
      savedPosition: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login.vue"),
    meta: {
      title: "message.hslogin",
      showLink: false,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/register.vue"),
    meta: {
      title: "message.hsregister",
      showLink: false,
    },
  },
  {
    // 找不到路由重定向到404页面
    path: "/:pathMatch(.*)",
    component: Layout,
    redirect: "/error/404",
    meta: {
      icon: "el-icon-s-home",
      title: "message.hshome",
      showLink: false,
      savedPosition: false,
    },
  },
  {
    path: "/redirect",
    component: Layout,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("../views/redirect.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  },
});

import NProgress from "../utils/progress";

const whiteList = ["/login", "/register"];

router.beforeEach((to, _from, next) => {
  NProgress.start();
  const { t } = i18n.global;
  // @ts-ignore
  to.meta.title ? (document.title = t(to.meta.title)) : ""; // 动态title
  whiteList.indexOf(to.path) !== -1 || storageSession.getItem("info")
    ? next()
    : next("/login"); // 全部重定向到登录页
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
