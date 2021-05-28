// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const systemRouter = {
  path: "/system",
  name: "system",
  // component: Layout,
  redirect: "/system/user",
  meta: {
    icon: "el-icon-setting",
    title: "message.hssysManagement",
    showLink: true,
    savedPosition: true,
    rank: 6,
  },
  children: [
    {
      path: "/system/user",
      name: "user",
      // component: () => import("/@/views/system/user/index.vue"),
      meta: {
        title: "message.hsBaseinfo",
        showLink: true,
        savedPosition: true,
      },
    },
    {
      path: "/system/dict",
      name: "dict",
      // component: () => import("/@/views/system/dict/index.vue"),
      meta: {
        title: "message.hsDict",
        showLink: true,
        savedPosition: true,
      },
    },
  ],
};

export default [
  {
    url: "/getAsyncRoutes",
    method: "get",
    response: ({ query }) => {
      if (query.name === "admin") {
        return {
          code: 0,
          info: systemRouter,
        };
      } else {
        return {
          code: 0,
          info: [],
        };
      }
    },
  },
] as MockMethod[];
