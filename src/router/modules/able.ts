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
      name: "reWatermark",
      component: () => import("/@/views/able/watermark.vue"),
      meta: {
        title: $t("menus.hsWatermark")
      }
    },
    {
      path: "/able/print",
      name: "rePrint",
      component: () => import("/@/views/able/print.vue"),
      meta: {
        title: $t("menus.hsPrint")
      }
    },
    {
      path: "/able/iconSelect",
      name: "reIconSelect",
      component: () => import("/@/views/able/icon-select.vue"),
      meta: {
        title: $t("menus.hsIconSelect")
      }
    },
    {
      path: "/able/timeline",
      name: "reTimeline",
      component: () => import("/@/views/able/timeline.vue"),
      meta: {
        title: $t("menus.hsTimeline")
      }
    },
    {
      path: "/able/menuTree",
      name: "reMenuTree",
      component: () => import("/@/views/able/menu-tree.vue"),
      meta: {
        title: $t("menus.hsMenuTree")
      }
    },
    {
      path: "/able/lineTree",
      name: "reLineTree",
      component: () => import("/@/views/able/line-tree.vue"),
      meta: {
        title: $t("menus.hsLineTree")
      }
    },
    {
      path: "/able/antTabs",
      name: "reAntTabs",
      component: () => import("/@/views/able/ant-tabs.vue"),
      meta: {
        title: $t("menus.hsAntTabs")
      }
    },
    {
      path: "/able/antAnchor",
      name: "reAntAnchor",
      component: () => import("/@/views/able/ant-anchor.vue"),
      meta: {
        title: $t("menus.hsAntAnchor")
      }
    },
    {
      path: "/able/antTreeSelect",
      name: "reAntTreeSelect",
      component: () => import("/@/views/able/ant-treeSelect.vue"),
      meta: {
        title: $t("menus.hsAntTreeSelect")
      }
    },
    {
      path: "/able/debounce",
      name: "reDebounce",
      component: () => import("/@/views/able/debounce.vue"),
      meta: {
        title: $t("menus.hsDebounce")
      }
    },
    {
      path: "/able/barcode",
      name: "reBarcode",
      component: () => import("/@/views/able/barcode.vue"),
      meta: {
        title: $t("menus.hsBarcode")
      }
    },
    {
      path: "/able/qrcode",
      name: "reQrcode",
      component: () => import("/@/views/able/qrcode.vue"),
      meta: {
        title: $t("menus.hsQrcode")
      }
    },
    {
      path: "/able/cascader",
      name: "reCascader",
      component: () => import("/@/views/able/cascader.vue"),
      meta: {
        title: $t("menus.hsCascader")
      }
    },
    {
      path: "/able/swiper",
      name: "reSwiper",
      component: () => import("/@/views/able/swiper.vue"),
      meta: {
        title: $t("menus.hsSwiper")
      }
    }
  ]
};

export default ableRouter;
