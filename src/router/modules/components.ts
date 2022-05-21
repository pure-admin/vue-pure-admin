import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const componentsRouter = {
  path: "/components",
  component: Layout,
  redirect: "/components/video",
  meta: {
    icon: "menu",
    title: $t("menus.hscomponents"),
    rank: 5
  },
  children: [
    {
      path: "/components/video",
      name: "Video",
      component: () => import("/@/views/components/video/index.vue"),
      meta: {
        title: $t("menus.hsvideo")
      }
    },
    {
      path: "/components/map",
      name: "Map",
      component: () => import("/@/views/components/map/index.vue"),
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
      component: () => import("/@/views/components/draggable/index.vue"),
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
      component: () => import("/@/views/components/split-pane/index.vue"),
      meta: {
        title: $t("menus.hssplitPane"),
        extraIcon: {
          svg: true,
          name: "team-iconxinpinrenqiwang"
        }
      }
    },
    {
      path: "/components/button",
      name: "Button",
      component: () => import("/@/views/components/button/index.vue"),
      meta: {
        title: $t("menus.hsbutton")
      }
    },
    {
      path: "/components/cropping",
      name: "Cropping",
      component: () => import("/@/views/components/cropping/index.vue"),
      meta: {
        title: $t("menus.hscropping")
      }
    },
    {
      path: "/components/countTo",
      name: "CountTo",
      component: () => import("/@/views/components/count-to/index.vue"),
      meta: {
        title: $t("menus.hscountTo")
      }
    },
    {
      path: "/components/selector",
      name: "Selector",
      component: () => import("/@/views/components/selector/index.vue"),
      meta: {
        title: $t("menus.hsselector")
      }
    },
    {
      path: "/components/seamlessScroll",
      name: "SeamlessScroll",
      component: () => import("/@/views/components/seamless-scroll/index.vue"),
      meta: {
        title: $t("menus.hsseamless")
      }
    },
    {
      path: "/components/contextmenu",
      name: "ContextMenu",
      component: () => import("/@/views/components/contextmenu/index.vue"),
      meta: {
        title: $t("menus.hscontextmenu")
      }
    }
  ]
};

export default componentsRouter;
