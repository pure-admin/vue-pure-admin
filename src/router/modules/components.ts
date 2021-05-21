import Layout from "/@/layout/index.vue";

const componentsRouter = {
  path: "/components",
  name: "components",
  component: Layout,
  redirect: "/components/split-pane",
  children: [
    {
      path: "/components/video",
      component: () => import("/@/views/components/video/index.vue"),
      meta: {
        title: "message.hsvideo",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/components/map",
      component: () => import("/@/views/components/map/index.vue"),
      meta: {
        title: "message.hsmap",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/components/draggable",
      component: () => import("/@/views/components/draggable/index.vue"),
      meta: {
        title: "message.hsdraggable",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/components/split-pane",
      component: () => import("/@/views/components/split-pane/index.vue"),
      meta: {
        title: "message.hssplitPane",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/components/button",
      component: () => import("/@/views/components/button/index.vue"),
      meta: {
        title: "message.hsbutton",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/components/cropping",
      component: () => import("/@/views/components/cropping/index.vue"),
      meta: {
        title: "message.hscropping",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/components/countTo",
      component: () => import("/@/views/components/count-to/index.vue"),
      meta: {
        title: "message.hscountTo",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/components/selector",
      component: () => import("/@/views/components/selector/index.vue"),
      meta: {
        title: "message.hsselector",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/components/seamlessScroll",
      component: () => import("/@/views/components/seamless-scroll/index.vue"),
      meta: {
        title: "message.hsseamless",
        showLink: false,
        savedPosition: true,
      },
    },
    {
      path: "/components/contextmenu",
      component: () => import("/@/views/components/contextmenu/index.vue"),
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
};

export default componentsRouter;
