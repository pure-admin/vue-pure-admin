// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";
import { system, permission, frame, tabs } from "@/router/enums";

import FlUser from "@iconify-icons/ri/admin-line";
import Role from "@iconify-icons/ri/admin-fill";
import Dict from "@iconify-icons/ri/git-repository-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import Dept from "@iconify-icons/ri/git-branch-line";
import Lollipop from "@iconify-icons/ep/lollipop";
import Monitor from "@iconify-icons/ep/monitor";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const systemRouter = {
  path: "/system",
  meta: {
    icon: Setting,
    title: "menus.hssysManagement",
    rank: system
  },
  children: [
    {
      path: "/system/user/index",
      name: "User",
      meta: {
        icon: FlUser,
        title: "menus.hsUser",
        roles: ["admin"]
      }
    },
    {
      path: "/system/role/index",
      name: "Role",
      meta: {
        icon: Role,
        title: "menus.hsRole",
        roles: ["admin"]
      }
    },
    {
      path: "/system/dept/index",
      name: "Dept",
      meta: {
        icon: Dept,
        title: "menus.hsDept",
        roles: ["admin"]
      }
    },
    {
      path: "/system/dict",
      component: "/system/dict/index",
      name: "Dict",
      meta: {
        icon: Dict,
        title: "menus.hsDict",
        keepAlive: true,
        roles: ["admin"]
      }
    }
  ]
};

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "menus.permission",
    icon: Lollipop,
    rank: permission
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "menus.permissionPage",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button/index",
      name: "PermissionButton",
      meta: {
        title: "menus.permissionButton",
        roles: ["admin", "common"],
        auths: ["btn_add", "btn_edit", "btn_delete"]
      }
    }
  ]
};

const frameRouter = {
  path: "/iframe",
  meta: {
    icon: Monitor,
    title: "menus.hsExternalPage",
    rank: frame
  },
  children: [
    {
      path: "/external",
      name: "https://yiming_chang.gitee.io/pure-admin-doc",
      meta: {
        title: "menus.externalLink",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/iframe/pure",
      name: "FramePure",
      meta: {
        title: "menus.hsPureDocument",
        frameSrc: "https://yiming_chang.gitee.io/pure-admin-doc",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/iframe/ep",
      name: "FrameEp",
      meta: {
        title: "menus.hsEpDocument",
        frameSrc: "https://element-plus.org/zh-CN/",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/iframe/vue3",
      name: "FrameVue",
      meta: {
        title: "menus.hsVueDocument",
        frameSrc: "https://cn.vuejs.org/",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/iframe/vite",
      name: "FrameVite",
      meta: {
        title: "menus.hsViteDocument",
        frameSrc: "https://cn.vitejs.dev/",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/iframe/pinia",
      name: "FramePinia",
      meta: {
        title: "menus.hsPiniaDocument",
        frameSrc: "https://pinia.vuejs.org/zh/index.html",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/iframe/vue-router",
      name: "FrameRouter",
      meta: {
        title: "menus.hsRouterDocument",
        frameSrc: "https://router.vuejs.org/zh/",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/iframe/tailwindcss",
      name: "FrameTailwindcss",
      meta: {
        title: "menus.hsTailwindcssDocument",
        frameSrc: "https://tailwindcss.com/docs/installation",
        roles: ["admin", "common"]
      }
    }
  ]
};

const tabsRouter = {
  path: "/tabs",
  meta: {
    icon: "IF-team-icontabs",
    title: "menus.hstabs",
    rank: tabs
  },
  children: [
    {
      path: "/tabs/index",
      name: "Tabs",
      meta: {
        title: "menus.hstabs",
        roles: ["admin", "common"]
      }
    },
    // query 传参模式
    {
      path: "/tabs/query-detail",
      name: "TabQueryDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        roles: ["admin", "common"]
      }
    },
    // params 传参模式
    {
      path: "/tabs/params-detail/:id",
      component: "params-detail",
      name: "TabParamsDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        roles: ["admin", "common"]
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
        success: true,
        data: [systemRouter, permissionRouter, frameRouter, tabsRouter]
      };
    }
  }
] as MockMethod[];
