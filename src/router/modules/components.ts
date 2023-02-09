import { $t } from "@/plugins/i18n";
import { components } from "@/router/enums";

export default {
  path: "/components",
  redirect: "/components/video",
  meta: {
    icon: "menu",
    title: $t("menus.hscomponents"),
    rank: components
  },
  children: [
    {
      path: "/components/message",
      name: "Message",
      component: () => import("@/views/components/message/index.vue"),
      meta: {
        title: $t("menus.hsmessage"),
        extraIcon: "IF-pure-iconfont-new svg",
        transition: {
          enterTransition: "animate__fadeInLeft",
          leaveTransition: "animate__fadeOutRight"
        }
      }
    },
    {
      path: "/components/video",
      name: "Video",
      component: () => import("@/views/components/video/index.vue"),
      meta: {
        title: $t("menus.hsvideo")
      }
    },
    {
      path: "/components/map",
      name: "Map",
      component: () => import("@/views/components/map/index.vue"),
      meta: {
        title: $t("menus.hsmap"),
        keepAlive: true,
        transition: {
          name: "fade"
        }
      }
    },
    {
      path: "/components/draggable",
      name: "Draggable",
      component: () => import("@/views/components/draggable/index.vue"),
      meta: {
        title: $t("menus.hsdraggable"),
        transition: {
          enterTransition: "animate__zoomIn",
          leaveTransition: "animate__zoomOut"
        }
      }
    },
    {
      path: "/components/splitPane",
      name: "SplitPane",
      component: () => import("@/views/components/split-pane/index.vue"),
      meta: {
        title: $t("menus.hssplitPane")
      }
    },
    {
      path: "/components/button",
      name: "Button",
      component: () => import("@/views/components/button/index.vue"),
      meta: {
        title: $t("menus.hsbutton")
      }
    },
    {
      path: "/components/cropping",
      name: "Cropping",
      component: () => import("@/views/components/cropping/index.vue"),
      meta: {
        title: $t("menus.hscropping")
      }
    },
    {
      path: "/components/countTo",
      name: "CountTo",
      component: () => import("@/views/components/count-to/index.vue"),
      meta: {
        title: $t("menus.hscountTo")
      }
    },
    {
      path: "/components/selector",
      name: "Selector",
      component: () => import("@/views/components/selector/index.vue"),
      meta: {
        title: $t("menus.hsselector")
      }
    },
    {
      path: "/components/seamlessScroll",
      name: "SeamlessScroll",
      component: () => import("@/views/components/seamless-scroll/index.vue"),
      meta: {
        title: $t("menus.hsseamless")
      }
    },
    {
      path: "/components/contextmenu",
      name: "ContextMenu",
      component: () => import("@/views/components/contextmenu/index.vue"),
      meta: {
        title: $t("menus.hscontextmenu")
      }
    },
    {
      path: "/components/typeit",
      name: "Typeit",
      component: () => import("@/views/components/typeit/index.vue"),
      meta: {
        title: $t("menus.hstypeit")
      }
    },
    {
      path: "/components/json-editor",
      name: "JsonEditor",
      component: () => import("@/views/components/json-editor/index.vue"),
      meta: {
        title: $t("menus.hsjsoneditor")
      }
    },
    {
      path: "/components/danmaku",
      name: "Danmaku",
      component: () => import("@/views/components/danmaku/index.vue"),
      meta: {
        title: $t("menus.hsdanmaku")
      }
    }
  ]
} as RouteConfigsTable;
