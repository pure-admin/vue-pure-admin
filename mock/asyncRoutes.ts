// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

// http://mockjs.com/examples.html#Object
const systemRouter = {
  path: "/system",
  meta: {
    icon: "setting",
    title: "menus.hssysManagement",
    rank: 11
  },
  children: [
    {
      path: "/system/user/index",
      name: "User",
      meta: {
        icon: "flUser",
        title: "menus.hsUser"
      }
    },
    {
      path: "/system/role/index",
      name: "Role",
      meta: {
        icon: "role",
        title: "menus.hsRole"
      }
    },
    {
      path: "/system/dept/index",
      name: "Dept",
      meta: {
        icon: "dept",
        title: "menus.hsDept"
      }
    },
    {
      path: "/system/dict",
      component: "/system/dict/index",
      name: "Dict",
      meta: {
        icon: "dict",
        title: "menus.hsDict",
        keepAlive: true
      }
    }
  ]
};

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "menus.permission",
    icon: "lollipop",
    rank: 7
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "menus.permissionPage"
      }
    },
    {
      path: "/permission/button/index",
      name: "PermissionButton",
      meta: {
        title: "menus.permissionButton",
        authority: []
      }
    }
  ]
};

const frameRouter = {
  path: "/iframe",
  meta: {
    icon: "monitor",
    title: "menus.hsExternalPage",
    rank: 10
  },
  children: [
    {
      path: "/iframe/pure",
      name: "FramePure",
      meta: {
        title: "menus.hsPureDocument",
        frameSrc: "http://yiming_chang.gitee.io/pure-admin-doc"
      }
    },
    {
      path: "/external",
      name: "http://yiming_chang.gitee.io/pure-admin-doc",
      meta: {
        title: "menus.externalLink"
      }
    },
    {
      path: "/iframe/ep",
      name: "FrameEp",
      meta: {
        title: "menus.hsEpDocument",
        frameSrc: "https://element-plus.org/zh-CN/"
      }
    }
  ]
};

const tabsRouter = {
  path: "/tabs",
  meta: {
    icon: "IF-team-icontabs",
    title: "menus.hstabs",
    rank: 13
  },
  children: [
    {
      path: "/tabs/index",
      name: "Tabs",
      meta: {
        title: "menus.hstabs"
      }
    },
    {
      path: "/tabs/query-detail",
      name: "TabQueryDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false
      }
    },
    {
      path: "/tabs/params-detail/:id",
      component: "params-detail",
      name: "TabParamsDetail",
      meta: {
        showLink: false
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
