import Layout from "/@/layout/index.vue";

const componentsRouter = {
  path: "/components",
  name: "components",
  component: Layout,
  redirect: "/components/video",
  meta: {
    icon: "Menu",
    title: "message.hscomponents",
    showLink: true,
    rank: 4
  },
  children: [
    {
      path: "/components/video",
      name: "video",
      component: () => import("/@/views/components/video/index.vue"),
      meta: {
        title: "message.hsvideo",
        showLink: true
      }
    },
    {
      path: "/components/map",
      name: "map",
      component: () => import("/@/views/components/map/index.vue"),
      meta: {
        title: "message.hsmap",
        showLink: true,
        keepAlive: true,
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
        title: "message.hsdraggable",
        showLink: true,
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
        title: "message.hssplitPane",
        showLink: true,
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
        title: "message.hsbutton",
        showLink: true
      }
    },
    {
      path: "/components/cropping",
      name: "cropping",
      component: () => import("/@/views/components/cropping/index.vue"),
      meta: {
        title: "message.hscropping",
        showLink: true
      }
    },
    {
      path: "/components/countTo",
      name: "countTo",
      component: () => import("/@/views/components/count-to/index.vue"),
      meta: {
        title: "message.hscountTo",
        showLink: true
      }
    },
    {
      path: "/components/selector",
      name: "selector",
      component: () => import("/@/views/components/selector/index.vue"),
      meta: {
        title: "message.hsselector",
        showLink: true
      }
    },
    {
      path: "/components/seamlessScroll",
      name: "seamlessScroll",
      component: () => import("/@/views/components/seamless-scroll/index.vue"),
      meta: {
        title: "message.hsseamless",
        showLink: true
      }
    },
    {
      path: "/components/contextmenu",
      name: "contextmenu",
      component: () => import("/@/views/components/contextmenu/index.vue"),
      meta: {
        title: "message.hscontextmenu",
        showLink: true
      }
    }
  ]
};

export default componentsRouter;
