import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const componentsRouter = {
  path: "/components",
  component: Layout,
  redirect: "/components/video",
  meta: {
    icon: "menu",
    title: $t("menus.hscomponents"),
    i18n: true,
    rank: 5
  },
  children: [
    {
      path: "/components/video",
      name: "video",
      component: () => import("/@/views/components/video/index.vue"),
      meta: {
        title: $t("menus.hsvideo"),
        i18n: true
      }
    },
    {
      path: "/components/map",
      name: "map",
      component: () => import("/@/views/components/map/index.vue"),
      meta: {
        title: $t("menus.hsmap"),
        keepAlive: true,
        i18n: true,
        transition: {
          name: "fade"
        }
      }
    },
    {
      path: "/components/draggable",
      name: "draggable",
      component: () => import("/@/views/components/draggable/index.vue"),
      meta: {
        title: $t("menus.hsdraggable"),
        i18n: true,
        transition: {
          enterTransition: "animate__zoomIn",
          leaveTransition: "animate__zoomOut"
        }
      }
    },

    {
      path: "/components/splitPane",
      name: "splitPane",
      component: () => import("/@/views/components/split-pane/index.vue"),
      meta: {
        title: $t("menus.hssplitPane"),
        i18n: true,
        extraIcon: {
          svg: true,
          name: "team-iconxinpinrenqiwang"
        }
      }
    },
    {
      path: "/components/button",
      name: "button",
      component: () => import("/@/views/components/button/index.vue"),
      meta: {
        title: $t("menus.hsbutton"),
        i18n: true
      }
    },
    {
      path: "/components/cropping",
      name: "cropping",
      component: () => import("/@/views/components/cropping/index.vue"),
      meta: {
        title: $t("menus.hscropping"),
        i18n: true
      }
    },
    {
      path: "/components/countTo",
      name: "countTo",
      component: () => import("/@/views/components/count-to/index.vue"),
      meta: {
        title: $t("menus.hscountTo"),
        i18n: true
      }
    },
    {
      path: "/components/selector",
      name: "selector",
      component: () => import("/@/views/components/selector/index.vue"),
      meta: {
        title: $t("menus.hsselector"),
        i18n: true
      }
    },
    {
      path: "/components/seamlessScroll",
      name: "seamlessScroll",
      component: () => import("/@/views/components/seamless-scroll/index.vue"),
      meta: {
        title: $t("menus.hsseamless"),
        i18n: true
      }
    },
    {
      path: "/components/contextmenu",
      name: "contextmenu",
      component: () => import("/@/views/components/contextmenu/index.vue"),
      meta: {
        title: $t("menus.hscontextmenu"),
        i18n: true
      }
    }
  ]
};

export default componentsRouter;
