import { defineFakeRoute } from "vite-plugin-fake-server/client";
import { faker } from "@faker-js/faker/locale/zh_CN";

export default defineFakeRoute([
  // 用户管理
  {
    url: "/user",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          username: "admin",
          nickname: "admin",
          avatar: "https://avatars.githubusercontent.com/u/44761321",
          phone: "15888886789",
          email: faker.internet.email(),
          sex: 0,
          id: 1,
          status: 1,
          dept: {
            // 部门id
            id: 103,
            // 部门名称
            name: "研发部门"
          },
          remark: "管理员",
          createTime: 1605456000000
        },
        {
          username: "common",
          nickname: "common",
          avatar: "https://avatars.githubusercontent.com/u/52823142",
          phone: "18288882345",
          email: faker.internet.email(),
          sex: 1,
          id: 2,
          status: 1,
          dept: {
            id: 105,
            name: "测试部门"
          },
          remark: "普通用户",
          createTime: 1605456000000
        }
      ];
      list = list.filter(item => item.username.includes(body?.username));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      if (body.phone) list = list.filter(item => item.phone === body.phone);
      if (body.deptId) list = list.filter(item => item.dept.id === body.deptId);
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 用户管理-获取所有角色列表
  {
    url: "/list-all-role",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          { id: 1, name: "超级管理员" },
          { id: 2, name: "普通角色" }
        ]
      };
    }
  },
  // 用户管理-根据userId，获取对应角色id列表（userId：用户id）
  {
    url: "/list-role-ids",
    method: "post",
    response: ({ body }) => {
      if (body.userId) {
        if (body.userId == 1) {
          return {
            success: true,
            data: [1]
          };
        } else if (body.userId == 2) {
          return {
            success: true,
            data: [2]
          };
        }
      } else {
        return {
          success: false,
          data: []
        };
      }
    }
  },
  // 角色管理
  {
    url: "/role",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          createTime: 1605456000000, // 时间戳（毫秒ms）
          updateTime: 1684512000000,
          id: 1,
          name: "超级管理员",
          code: "admin",
          status: 1, // 状态 1 启用 0 停用
          remark: "超级管理员拥有最高权限"
        },
        {
          createTime: 1605456000000,
          updateTime: 1684512000000,
          id: 2,
          name: "普通角色",
          code: "common",
          status: 1,
          remark: "普通角色拥有部分权限"
        }
      ];
      list = list.filter(item => item.name.includes(body?.name));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      if (body.code) list = list.filter(item => item.code === body.code);
      return {
        success: true,
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 菜单管理
  {
    url: "/menu",
    method: "post",
    response: () => {
      return {
        success: true,
        data: [
          // 外部页面
          {
            parentId: 0,
            id: 100,
            menuType: 0, // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
            title: "menus.hsExternalPage",
            name: "PureIframe",
            path: "/iframe",
            component: "",
            rank: 7,
            redirect: "",
            icon: "ep:monitor",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 100,
            id: 101,
            menuType: 0,
            title: "menus.hsExternalDoc",
            name: "PureIframeExternal",
            path: "/iframe/external",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 101,
            id: 102,
            menuType: 2,
            title: "menus.externalLink",
            name: "https://yiming_chang.gitee.io/pure-admin-doc",
            path: "/external",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 101,
            id: 103,
            menuType: 2,
            title: "menus.pureutilsLink",
            name: "https://pure-admin-utils.netlify.app/",
            path: "/pureutilsLink",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 100,
            id: 104,
            menuType: 1,
            title: "menus.hsEmbeddedDoc",
            name: "PureIframeEmbedded",
            path: "/iframe/embedded",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 105,
            menuType: 1,
            title: "menus.hsEpDocument",
            name: "FrameEp",
            path: "/iframe/ep",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://element-plus.org/zh-CN/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 106,
            menuType: 1,
            title: "menus.hsTailwindcssDocument",
            name: "FrameTailwindcss",
            path: "/iframe/tailwindcss",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://tailwindcss.com/docs/installation",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 107,
            menuType: 1,
            title: "menus.hsVueDocument",
            name: "FrameVue",
            path: "/iframe/vue3",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://cn.vuejs.org/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 108,
            menuType: 1,
            title: "menus.hsViteDocument",
            name: "FrameVite",
            path: "/iframe/vite",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://cn.vitejs.dev/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 109,
            menuType: 1,
            title: "menus.hsPiniaDocument",
            name: "FramePinia",
            path: "/iframe/pinia",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://pinia.vuejs.org/zh/index.html",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 110,
            menuType: 1,
            title: "menus.hsRouterDocument",
            name: "FrameRouter",
            path: "/iframe/vue-router",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://router.vuejs.org/zh/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          // 权限管理
          {
            parentId: 0,
            id: 200,
            menuType: 0,
            title: "menus.permission",
            name: "PurePermission",
            path: "/permission",
            component: "",
            rank: 9,
            redirect: "",
            icon: "ep:lollipop",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 200,
            id: 201,
            menuType: 0,
            title: "menus.permissionPage",
            name: "PermissionPage",
            path: "/permission/page/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 200,
            id: 202,
            menuType: 0,
            title: "menus.permissionButton",
            name: "PermissionButton",
            path: "/permission/button/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 202,
            id: 203,
            menuType: 3,
            title: "添加",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:add",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 202,
            id: 204,
            menuType: 3,
            title: "修改",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:edit",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 202,
            id: 205,
            menuType: 3,
            title: "删除",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:delete",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          // 系统管理
          {
            parentId: 0,
            id: 300,
            menuType: 0,
            title: "menus.hssysManagement",
            name: "PureSystem",
            path: "/system",
            component: "",
            rank: 10,
            redirect: "",
            icon: "ri:settings-3-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 301,
            menuType: 0,
            title: "menus.hsUser",
            name: "SystemUser",
            path: "/system/user/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ri:admin-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 302,
            menuType: 0,
            title: "menus.hsRole",
            name: "SystemRole",
            path: "/system/role/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ri:admin-fill",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 303,
            menuType: 0,
            title: "menus.hsSystemMenu",
            name: "SystemMenu",
            path: "/system/menu/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ep:menu",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 304,
            menuType: 0,
            title: "menus.hsDept",
            name: "SystemDept",
            path: "/system/dept/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ri:git-branch-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          // 标签页操作
          {
            parentId: 0,
            id: 400,
            menuType: 0,
            title: "menus.hstabs",
            name: "PureTabs",
            path: "/tabs",
            component: "",
            rank: 11,
            redirect: "",
            icon: "ri:bookmark-2-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 400,
            id: 401,
            menuType: 0,
            title: "menus.hstabs",
            name: "Tabs",
            path: "/tabs/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 400,
            id: 402,
            menuType: 0,
            title: "query传参模式",
            name: "TabQueryDetail",
            path: "/tabs/query-detail",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "/tabs/index",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: false,
            showParent: false
          },
          {
            parentId: 400,
            id: 403,
            menuType: 0,
            title: "params传参模式",
            name: "TabParamsDetail",
            path: "/tabs/params-detail/:id",
            component: "params-detail",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "/tabs/index",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: false,
            showParent: false
          }
        ]
      };
    }
  },
  // 部门管理
  {
    url: "/dept",
    method: "post",
    response: () => {
      return {
        success: true,
        data: [
          {
            name: "杭州总公司",
            parentId: 0,
            id: 100,
            sort: 0,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1, // 状态 1 启用 0 停用
            type: 1, // 1 公司 2 分公司 3 部门
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "郑州分公司",
            parentId: 100,
            id: 101,
            sort: 1,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 2,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "研发部门",
            parentId: 101,
            id: 103,
            sort: 1,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "市场部门",
            parentId: 102,
            id: 108,
            sort: 1,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "深圳分公司",
            parentId: 100,
            id: 102,
            sort: 2,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 2,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "市场部门",
            parentId: 101,
            id: 104,
            sort: 2,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "财务部门",
            parentId: 102,
            id: 109,
            sort: 2,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "测试部门",
            parentId: 101,
            id: 105,
            sort: 3,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 0,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "财务部门",
            parentId: 101,
            id: 106,
            sort: 4,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "运维部门",
            parentId: 101,
            id: 107,
            sort: 5,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 0,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          }
        ]
      };
    }
  }
]);
