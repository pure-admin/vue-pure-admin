import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const ableRouter = {
  path: "/able",
  component: Layout,
  redirect: "/able/watermark",
  meta: {
    icon: "ubuntu-fill",
    title: $t("menus.hsAble"),
    i18n: true,
    rank: 4
  },
  children: [
    {
      path: "/able/watermark",
      name: "reWatermark",
      component: () => import("/@/views/able/watermark.vue"),
      meta: {
        title: $t("menus.hsWatermark"),
        i18n: true
      }
    },
    {
      path: "/able/print",
      name: "rePrint",
      component: () => import("/@/views/able/print.vue"),
      meta: {
        title: $t("menus.hsPrint"),
        i18n: true
      }
    },
    {
      path: "/able/iconSelect",
      name: "reIconSelect",
      component: () => import("/@/views/able/icon-select.vue"),
      meta: {
        title: $t("menus.hsIconSelect"),
        i18n: true
      }
    },
    {
      path: "/able/timeline",
      name: "reTimeline",
      component: () => import("/@/views/able/timeline.vue"),
      meta: {
        title: $t("menus.hsTimeline"),
        i18n: true
      }
    },
    {
      path: "/able/menuTree",
      name: "reMenuTree",
      component: () => import("/@/views/able/menu-tree.vue"),
      meta: {
        title: $t("menus.hsMenuTree"),
        i18n: true
      }
    },
    {
      path: "/able/lineTree",
      name: "reLineTree",
      component: () => import("/@/views/able/line-tree.vue"),
      meta: {
        title: $t("menus.hsLineTree"),
        i18n: true
      }
    },
    {
      path: "/able/antTabs",
      name: "reAntTabs",
      component: () => import("/@/views/able/ant-tabs.vue"),
      meta: {
        title: $t("menus.hsAntTabs"),
        i18n: true
      }
    },
    {
      path: "/able/antAnchor",
      name: "reAntAnchor",
      component: () => import("/@/views/able/ant-anchor.vue"),
      meta: {
        title: $t("menus.hsAntAnchor"),
        i18n: true
      }
    },
    {
      path: "/able/antTreeSelect",
      name: "reAntTreeSelect",
      component: () => import("/@/views/able/ant-treeSelect.vue"),
      meta: {
        title: $t("menus.hsAntTreeSelect"),
        i18n: true
      }
    },
    {
      path: "/able/debounce",
      name: "reDebounce",
      component: () => import("/@/views/able/debounce.vue"),
      meta: {
        title: $t("menus.hsDebounce"),
        i18n: true
      }
    },
    {
      path: "/able/barcode",
      name: "reBarcode",
      component: () => import("/@/views/able/barcode.vue"),
      meta: {
        title: $t("menus.hsBarcode"),
        i18n: true
      }
    },
    {
      path: "/able/qrcode",
      name: "reQrcode",
      component: () => import("/@/views/able/qrcode.vue"),
      meta: {
        title: $t("menus.hsQrcode"),
        i18n: true
      }
    },
    {
      path: "/able/cascader",
      name: "reCascader",
      component: () => import("/@/views/able/cascader.vue"),
      meta: {
        title: $t("menus.hsCascader"),
        i18n: true
      }
    }
  ]
};

export default ableRouter;
