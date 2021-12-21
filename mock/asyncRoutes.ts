// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const systemRouter = {
  path: "/system",
  name: "system",
  redirect: "/system/user",
  meta: {
    icon: "Setting",
    title: "message.hssysManagement",
    i18n: true,
    showLink: true,
    rank: 6
  },
  children: [
    {
      path: "/system/user",
      name: "user",
      meta: {
        title: "message.hsBaseinfo",
        i18n: true,
        showLink: true
      }
    },
    {
      path: "/system/dict",
      name: "dict",
      meta: {
        title: "message.hsDict",
        i18n: true,
        showLink: true,
        keepAlive: true
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
    icon: "Lollipop",
    i18n: true,
    showLink: true,
    rank: 3
  },
  children: [
    {
      path: "/permission/page",
      name: "permissionPage",
      meta: {
        title: "message.permissionPage",
        i18n: true,
        showLink: true
      }
    },
    {
      path: "/permission/button",
      name: "permissionButton",
      meta: {
        title: "message.permissionButton",
        i18n: true,
        showLink: true,
        authority: []
      }
    }
  ]
};

const tabsRouter = {
  path: "/tabs",
  name: "reTabs",
  redirect: "/tabs/index",
  meta: {
    icon: "IF-team-icontabs",
    title: "message.hstabs",
    i18n: true,
    showLink: true,
    rank: 8
  },
  children: [
    {
      path: "/tabs/index",
      name: "reTabs",
      meta: {
        title: "message.hstabs",
        showLink: true,
        i18n: true
      }
    },
    {
      path: "/tabs/detail",
      name: "tabDetail",
      meta: {
        title: "",
        showLink: false,
        i18n: false,
        dynamicLevel: 3,
        refreshRedirect: "/tabs/index"
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
          info: [
            tabsRouter,
            systemRouter,
            setDifAuthority("v-admin", permissionRouter)
          ]
        };
      } else {
        return {
          code: 0,
          info: [tabsRouter, setDifAuthority("v-test", permissionRouter)]
        };
      }
    }
  }
] as MockMethod[];
