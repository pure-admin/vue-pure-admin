// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const systemRouter = {
  path: "/system",
  name: "system",
  redirect: "/system/user/index",
  meta: {
    icon: "Setting",
    title: "menus.hssysManagement",
    i18n: true,
    showLink: true,
    rank: 6
  },
  children: [
    {
      path: "/system/user/index",
      name: "user",
      meta: {
        title: "menus.hsBaseinfo",
        i18n: true,
        showLink: true
      }
    },
    {
      path: "/system/dict/index",
      name: "dict",
      meta: {
        title: "menus.hsDict",
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
  redirect: "/permission/page/index",
  meta: {
    title: "menus.permission",
    icon: "Lollipop",
    i18n: true,
    showLink: true,
    rank: 3
  },
  children: [
    {
      path: "/permission/page/index",
      name: "permissionPage",
      meta: {
        title: "menus.permissionPage",
        i18n: true,
        showLink: true
      }
    },
    {
      path: "/permission/button/index",
      name: "permissionButton",
      meta: {
        title: "menus.permissionButton",
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
    title: "menus.hstabs",
    i18n: true,
    showLink: true,
    rank: 8
  },
  children: [
    {
      path: "/tabs/index",
      name: "reTabs",
      meta: {
        title: "menus.hstabs",
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
