// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const systemRouter = {
  path: "/system",
  name: "system",
  redirect: "/system/user",
  meta: {
    icon: "el-icon-setting",
    title: "message.hssysManagement",
    showLink: true,
    rank: 6
  },
  children: [
    {
      path: "/system/user",
      name: "user",
      meta: {
        title: "message.hsBaseinfo",
        showLink: true
      }
    },
    {
      path: "/system/dict",
      name: "dict",
      meta: {
        title: "message.hsDict",
        showLink: true
      }
    }
  ]
};

const permissionRouter = {
  path: "/permission",
  name: "permission",
  redirect: "/permission/page",
  meta: {
    title: "message.permission",
    icon: "el-icon-lollipop",
    showLink: true,
    rank: 3
  },
  children: [
    {
      path: "/permission/page",
      name: "permissionPage",
      meta: {
        title: "message.permissionPage",
        showLink: true
      }
    },
    {
      path: "/permission/button",
      name: "permissionButton",
      meta: {
        title: "message.permissionButton",
        showLink: true,
        authority: []
      }
    }
  ]
};

// 添加不同按钮权限到/permission/button页面中
function setDifAuthority(authority, routes) {
  routes.children[1].meta.authority = [authority];
  return routes;
}

export default [
  {
    url: "/getAsyncRoutes",
    method: "get",
    response: ({ query }) => {
      if (query.name === "admin") {
        return {
          code: 0,
          info: [systemRouter, setDifAuthority("v-admin", permissionRouter)]
        };
      } else {
        return {
          code: 0,
          info: [setDifAuthority("v-test", permissionRouter)]
        };
      }
    }
  }
] as MockMethod[];
