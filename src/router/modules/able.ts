import { $t } from "@/plugins/i18n";
import { able } from "@/router/enums";

export default {
  path: "/able",
  redirect: "/able/watermark",
  meta: {
    icon: "ri:ubuntu-fill",
    title: $t("menus.pureAble"),
    rank: able
  },
  children: [
    {
      path: "/able/mqtt-client",
      name: "MqttClient",
      component: () => import("@/views/able/mqtt-client.vue"),
      meta: {
        title: $t("menus.pureMqtt"),
        extraIcon: "IF-pure-iconfont-new svg"
      }
    },
    {
      path: "/able/verify",
      name: "Verify",
      component: () => import("@/views/able/verify.vue"),
      meta: {
        title: $t("menus.pureVerify")
      }
    },
    {
      path: "/able/watermark",
      name: "WaterMark",
      component: () => import("@/views/able/watermark.vue"),
      meta: {
        title: $t("menus.pureWatermark")
      }
    },
    {
      path: "/able/print",
      name: "Print",
      component: () => import("@/views/able/print/index.vue"),
      meta: {
        title: $t("menus.purePrint")
      }
    },
    {
      path: "/able/download",
      name: "Download",
      component: () => import("@/views/able/download.vue"),
      meta: {
        title: $t("menus.pureDownload")
      }
    },
    {
      path: "/able/excel",
      name: "Excel",
      component: () => import("@/views/able/excel.vue"),
      meta: {
        title: $t("menus.pureExcel")
      }
    },
    {
      path: "/components/ripple",
      name: "Ripple",
      component: () => import("@/views/able/ripple.vue"),
      meta: {
        title: $t("menus.pureRipple")
      }
    },
    {
      path: "/able/debounce",
      name: "Debounce",
      component: () => import("@/views/able/debounce.vue"),
      meta: {
        title: $t("menus.pureDebounce")
      }
    },
    {
      path: "/able/directives",
      name: "Directives",
      component: () => import("@/views/able/directives.vue"),
      meta: {
        title: $t("menus.pureOptimize")
      }
    },
    {
      path: "/able/draggable",
      name: "Draggable",
      component: () => import("@/views/able/draggable.vue"),
      meta: {
        title: $t("menus.pureDraggable"),
        transition: {
          enterTransition: "animate__zoomIn",
          leaveTransition: "animate__zoomOut"
        }
      }
    },
    {
      path: "/able/pdf",
      name: "Pdf",
      component: () => import("@/views/able/pdf.vue"),
      meta: {
        title: $t("menus.purePdf")
      }
    },
    {
      path: "/able/barcode",
      name: "BarCode",
      component: () => import("@/views/able/barcode.vue"),
      meta: {
        title: $t("menus.pureBarcode")
      }
    },
    {
      path: "/able/qrcode",
      name: "QrCode",
      component: () => import("@/views/able/qrcode.vue"),
      meta: {
        title: $t("menus.pureQrcode")
      }
    },
    {
      path: "/able/map",
      name: "MapPage",
      component: () => import("@/views/able/map.vue"),
      meta: {
        title: $t("menus.pureMap"),
        keepAlive: true,
        transition: {
          name: "fade"
        }
      }
    },
    {
      path: "/able/wavesurfer",
      name: "Wavesurfer",
      component: () => import("@/views/able/wavesurfer/index.vue"),
      meta: {
        title: $t("menus.pureWavesurfer")
      }
    },
    {
      path: "/able/video",
      name: "VideoPage",
      component: () => import("@/views/able/video.vue"),
      meta: {
        title: $t("menus.pureVideo")
      }
    },
    {
      path: "/able/video-frame",
      name: "VideoFrame",
      component: () => import("@/views/able/video-frame/index.vue"),
      meta: {
        title: $t("menus.pureVideoFrame")
      }
    },
    {
      path: "/able/danmaku",
      name: "Danmaku",
      component: () => import("@/views/able/danmaku/index.vue"),
      meta: {
        title: $t("menus.pureDanmaku")
      }
    },
    {
      path: "/able/infinite-scroll",
      name: "InfiniteScroll",
      component: () => import("@/views/able/infinite-scroll.vue"),
      meta: {
        title: $t("menus.pureInfiniteScroll")
      }
    },
    {
      path: "/able/menu-tree",
      name: "MenuTree",
      component: () => import("@/views/able/menu-tree.vue"),
      meta: {
        title: $t("menus.pureMenuTree")
      }
    },
    {
      path: "/able/line-tree",
      name: "LineTree",
      component: () => import("@/views/able/line-tree.vue"),
      meta: {
        title: $t("menus.pureLineTree")
      }
    },
    {
      path: "/able/typeit",
      name: "Typeit",
      component: () => import("@/views/able/typeit.vue"),
      meta: {
        title: $t("menus.pureTypeit")
      }
    },
    {
      path: "/able/sensitive",
      name: "Sensitive",
      component: () => import("@/views/able/sensitive.vue"),
      meta: {
        title: $t("menus.pureSensitive")
      }
    },
    {
      path: "/able/pinyin",
      name: "Pinyin",
      component: () => import("@/views/able/pinyin.vue"),
      meta: {
        title: $t("menus.purePinyin")
      }
    }
  ]
} satisfies RouteConfigsTable;
