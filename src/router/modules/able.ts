import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const ableRouter = {
  path: "/able",
  component: Layout,
  redirect: "/able/watermark",
  meta: {
    icon: "ubuntu-fill",
    title: $t("menus.hsAble"),
    rank: 4
  },
  children: [
    {
      path: "/able/watermark",
      name: "WaterMark",
      component: () => import("/@/views/able/watermark.vue"),
      meta: {
        title: $t("menus.hsWatermark")
      }
    },
    {
      path: "/able/print",
      name: "Print",
      component: () => import("/@/views/able/print.vue"),
      meta: {
        title: $t("menus.hsPrint")
      }
    },
    {
      path: "/able/iconSelect",
      name: "IconSelect",
      component: () => import("/@/views/able/icon-select.vue"),
      meta: {
        title: $t("menus.hsIconSelect")
      }
    },
    {
      path: "/able/timeline",
      name: "TimeLine",
      component: () => import("/@/views/able/timeline.vue"),
      meta: {
        title: $t("menus.hsTimeline")
      }
    },
    {
      path: "/able/menuTree",
      name: "MenuTree",
      component: () => import("/@/views/able/menu-tree.vue"),
      meta: {
        title: $t("menus.hsMenuTree")
      }
    },
    {
      path: "/able/lineTree",
      name: "LineTree",
      component: () => import("/@/views/able/line-tree.vue"),
      meta: {
        title: $t("menus.hsLineTree")
      }
    },
    {
      path: "/able/antTabs",
      name: "AntTabs",
      component: () => import("/@/views/able/ant-tabs.vue"),
      meta: {
        title: $t("menus.hsAntTabs")
      }
    },
    {
      path: "/able/antAnchor",
      name: "AntAnchor",
      component: () => import("/@/views/able/ant-anchor.vue"),
      meta: {
        title: $t("menus.hsAntAnchor")
      }
    },
    {
      path: "/able/antTreeSelect",
      name: "AntTreeSelect",
      component: () => import("/@/views/able/ant-treeSelect.vue"),
      meta: {
        title: $t("menus.hsAntTreeSelect")
      }
    },
    {
      path: "/able/debounce",
      name: "Debounce",
      component: () => import("/@/views/able/debounce.vue"),
      meta: {
        title: $t("menus.hsDebounce")
      }
    },
    {
      path: "/able/barcode",
      name: "BarCode",
      component: () => import("/@/views/able/barcode.vue"),
      meta: {
        title: $t("menus.hsBarcode")
      }
    },
    {
      path: "/able/qrcode",
      name: "QrCode",
      component: () => import("/@/views/able/qrcode.vue"),
      meta: {
        title: $t("menus.hsQrcode")
      }
    },
    {
      path: "/able/cascader",
      name: "Cascader",
      component: () => import("/@/views/able/cascader.vue"),
      meta: {
        title: $t("menus.hsCascader")
      }
    },
    {
      path: "/able/swiper",
      name: "Swiper",
      component: () => import("/@/views/able/swiper.vue"),
      meta: {
        title: $t("menus.hsSwiper")
      }
    },
    {
      path: "/able/virtualList",
      name: "VirtualList",
      component: () => import("/@/views/able/virtual-list/index.vue"),
      meta: {
        title: $t("menus.hsVirtualList")
      }
    },
    {
      path: "/able/pdf",
      name: "Pdf",
      component: () => import("/@/views/able/pdf.vue"),
      meta: {
        title: $t("menus.hsPdf")
      }
    },
    {
      path: "/able/execl",
      name: "Execl",
      component: () => import("/@/views/able/execl.vue"),
      meta: {
        title: $t("menus.hsExecl")
      }
    }
  ]
};

export default ableRouter;
