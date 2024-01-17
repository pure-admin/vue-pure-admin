import { $t } from "@/plugins/i18n";
import { components } from "@/router/enums";

export default {
  path: "/components",
  redirect: "/components/dialog",
  meta: {
    icon: "menu",
    title: $t("menus.hscomponents"),
    rank: components
  },
  children: [
    {
      path: "/components/dialog",
      name: "DialogPage",
      component: () => import("@/views/components/dialog/index.vue"),
      meta: {
        title: $t("menus.hsdialog"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/components/message",
      name: "Message",
      component: () => import("@/views/components/message.vue"),
      meta: {
        title: $t("menus.hsmessage")
      }
    },
    {
      path: "/components/iconSelect",
      name: "IconSelect",
      component: () => import("@/views/components/icon-select.vue"),
      meta: {
        title: $t("menus.hsIconSelect")
      }
    },
    {
      path: "/components/animatecss",
      name: "AnimateCss",
      component: () => import("@/views/components/animatecss.vue"),
      meta: {
        title: $t("menus.hsanimatecss")
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
      path: "/components/segmented",
      name: "Segmented",
      component: () => import("@/views/components/segmented.vue"),
      meta: {
        title: $t("menus.hssegmented"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/components/cascader",
      name: "Cascader",
      component: () => import("@/views/components/cascader.vue"),
      meta: {
        title: $t("menus.hsCascader")
      }
    },
    {
      path: "/components/selector",
      name: "Selector",
      component: () => import("@/views/components/selector.vue"),
      meta: {
        title: $t("menus.hsselector")
      }
    },
    {
      path: "/components/waterfall",
      name: "Waterfall",
      component: () => import("@/views/components/waterfall/index.vue"),
      meta: {
        title: $t("menus.hswaterfall")
      }
    },
    {
      path: "/components/splitPane",
      name: "SplitPane",
      component: () => import("@/views/components/split-pane.vue"),
      meta: {
        title: $t("menus.hssplitPane")
      }
    },
    {
      path: "/components/swiper",
      name: "Swiper",
      component: () => import("@/views/components/swiper.vue"),
      meta: {
        title: $t("menus.hsSwiper")
      }
    },
    {
      path: "/components/timeline",
      name: "TimeLine",
      component: () => import("@/views/components/timeline.vue"),
      meta: {
        title: $t("menus.hsTimeline")
      }
    },
    {
      path: "/components/countTo",
      name: "CountTo",
      component: () => import("@/views/components/count-to.vue"),
      meta: {
        title: $t("menus.hscountTo")
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
      path: "/components/json-editor",
      name: "JsonEditor",
      component: () => import("@/views/components/json-editor.vue"),
      meta: {
        title: $t("menus.hsjsoneditor")
      }
    },
    {
      path: "/components/seamlessScroll",
      name: "SeamlessScroll",
      component: () => import("@/views/components/seamless-scroll.vue"),
      meta: {
        title: $t("menus.hsseamless")
      }
    },
    {
      path: "/components/virtualList",
      name: "VirtualList",
      component: () => import("@/views/components/virtual-list/index.vue"),
      meta: {
        title: $t("menus.hsVirtualList")
      }
    },
    {
      path: "/components/button",
      name: "ButtonPage",
      component: () => import("@/views/components/button.vue"),
      meta: {
        title: $t("menus.hsbutton")
      }
    }
  ]
} satisfies RouteConfigsTable;
