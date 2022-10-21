// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";

/**
 * roles：页面级别权限，分为三种 "super_admin"、"common"、"test"
 * super_admin：超级管理员角色
 * common：普通角色
 * test 测试角色
 */

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
        title: "menus.hsUser",
        roles: ["super_admin"]
      }
    },
    {
      path: "/system/role/index",
      name: "Role",
      meta: {
        icon: "role",
        title: "menus.hsRole",
        roles: ["super_admin"]
      }
    },
    {
      path: "/system/dept/index",
      name: "Dept",
      meta: {
        icon: "dept",
        title: "menus.hsDept",
        roles: ["super_admin"]
      }
    },
    {
      path: "/system/dict",
      component: "/system/dict/index",
      name: "Dict",
      meta: {
        icon: "dict",
        title: "menus.hsDict",
        keepAlive: true,
        roles: ["super_admin"]
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
        roles: ["super_admin", "common", "test"],
        title: "menus.permissionPage"
      }
    },
    {
      path: "/permission/button/index",
      name: "PermissionButton",
      meta: {
        title: "menus.permissionButton",
        roles: ["super_admin", "common", "test"],
        auths: ["btn_add", "btn_edit", "btn_delete"]
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
        frameSrc: "http://yiming_chang.gitee.io/pure-admin-doc",
        roles: ["super_admin", "common"]
      }
    },
    {
      path: "/external",
      name: "http://yiming_chang.gitee.io/pure-admin-doc",
      meta: {
        title: "menus.externalLink",
        roles: ["super_admin", "common"]
      }
    },
    {
      path: "/iframe/ep",
      name: "FrameEp",
      meta: {
        title: "menus.hsEpDocument",
        frameSrc: "https://element-plus.org/zh-CN/",
        roles: ["super_admin", "common"]
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
        title: "menus.hstabs",
        roles: ["super_admin", "common"]
      }
    },
    {
      path: "/tabs/query-detail",
      name: "TabQueryDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        roles: ["super_admin", "common"]
      }
    },
    {
      path: "/tabs/params-detail/:id",
      component: "params-detail",
      name: "TabParamsDetail",
      meta: {
        showLink: false,
        roles: ["super_admin", "common"]
      }
    }
  ]
};

export default [
  {
    url: "/getAsyncRoutes",
    method: "get",
    response: () => {
      return {
        code: 0,
        info: [systemRouter, permissionRouter, frameRouter, tabsRouter]
      };
    }
  }
] as MockMethod[];
