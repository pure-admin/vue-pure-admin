// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const systemRouter = {
  path: "/system",
  redirect: "/system/user/index",
  meta: {
    icon: "setting",
    title: "menus.hssysManagement",
    i18n: true,
    rank: 11
  },
  children: [
    {
      path: "/system/user/index",
      name: "user",
      meta: {
        icon: "flUser",
        title: "menus.hsUser",
        i18n: true
      }
    },
    {
      path: "/system/role/index",
      name: "role",
      meta: {
        icon: "role",
        title: "menus.hsRole",
        i18n: true
      }
    },
    {
      path: "/system/dept/index",
      name: "dept",
      meta: {
        icon: "dept",
        title: "menus.hsDept",
        i18n: true
      }
    },
    {
      path: "/system/dict",
      component: "/system/dict/index",
      name: "dict",
      meta: {
        icon: "dict",
        title: "menus.hsDict",
        i18n: true,
        keepAlive: true
      }
    }
  ]
};

const permissionRouter = {
  path: "/permission",
  redirect: "/permission/page/index",
  meta: {
    title: "menus.permission",
    icon: "lollipop",
    i18n: true,
    rank: 7
  },
  children: [
    {
      path: "/permission/page/index",
      name: "permissionPage",
      meta: {
        title: "menus.permissionPage",
        i18n: true
      }
    },
    {
      path: "/permission/button/index",
      name: "permissionButton",
      meta: {
        title: "menus.permissionButton",
        i18n: true,
        authority: []
      }
    }
  ]
};

const frameRouter = {
  path: "/iframe",
  redirect: "/iframe/pure",
  meta: {
    icon: "monitor",
    title: "menus.hsExternalPage",
    i18n: true,
    rank: 10
  },
  children: [
    {
      path: "/iframe/pure",
      name: "reFramePure",
      meta: {
        i18n: true,
        title: "menus.hsPureDocument",
        frameSrc: "https://pure-admin-doc.vercel.app"
      }
    },
    {
      path: "/external",
      name: "https://pure-admin-doc.vercel.app",
      meta: {
        title: "menus.externalLink",
        i18n: true
      }
    },
    {
      path: "/iframe/ep",
      name: "reFrameEp",
      meta: {
        i18n: true,
        title: "menus.hsEpDocument",
        frameSrc: "https://element-plus.gitee.io/zh-CN/"
      }
    }
  ]
};

const tabsRouter = {
  path: "/tabs",
  redirect: "/tabs/index",
  meta: {
    icon: "IF-team-icontabs",
    title: "menus.hstabs",
    i18n: true,
    rank: 13
  },
  children: [
    {
      path: "/tabs/index",
      name: "reTabs",
      meta: {
        title: "menus.hstabs",
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
            frameRouter,
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
