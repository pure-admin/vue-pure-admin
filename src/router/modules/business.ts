// 必须引入 Layout 组件
const Layout = () => import("@/layout/index.vue");

export default [
  // --- 获奖管理 ---
  {
    path: "/award",
    name: "Award",
    component: Layout, // 关键：没有这一行点击子菜单就会 404
    redirect: "/award/my",
    meta: {
      title: "获奖管理",
      icon: "ri:award-line",
      rank: 10
    },
    children: [
      {
        path: "/award/my",
        name: "AwardMy",
        component: () => import("@/views/award/my/index.vue"),
        meta: {
          title: "我的获奖",
          roles: ["Student", "Teacher"]
        }
      },
      {
        path: "/award/overview",
        name: "AwardOverview",
        component: () => import("@/views/award/overview/index.vue"),
        meta: {
          title: "总览",
          roles: ["CompetitionAdministrator"]
        }
      },
      {
        path: "/award/search",
        name: "AwardSearch",
        component: () => import("@/views/award/search/index.vue"),
        meta: {
          title: "获奖查询",
          roles: ["CompetitionAdministrator"]
        }
      },
      {
        path: "/award/entry",
        name: "AwardEntry",
        component: () => import("@/views/award/entry/index.vue"),
        meta: {
          title: "奖项录入",
          roles: ["CompetitionAdministrator"]
        }
      },
      {
        path: "/award/report",
        name: "AwardReport",
        component: () => import("@/views/award/report/index.vue"),
        meta: {
          title: "报表打印",
          roles: ["CompetitionAdministrator"]
        }
      }
    ]
  },

  // --- 竞赛管理 ---
  {
    path: "/competition",
    name: "Competition",
    component: Layout, // 关键
    redirect: "/competition/overview",
    meta: {
      title: "竞赛管理",
      icon: "ri:trophy-line",
      roles: ["CompetitionAdministrator"],
      rank: 20
    },
    children: [
      {
        path: "/competition/overview",
        name: "CompOverview",
        component: () => import("@/views/competition/overview/index.vue"),
        meta: { title: "总览" }
      },
      {
        path: "/competition/search",
        name: "CompSearch",
        component: () => import("@/views/competition/search/index.vue"),
        meta: { title: "查询竞赛" }
      },
      {
        path: "/competition/entry",
        name: "CompEntry",
        component: () => import("@/views/competition/entry/index.vue"),
        meta: { title: "竞赛录入" }
      }
    ]
  },

  // --- 证书管理 ---
  {
    path: "/certificate",
    name: "Certificate",
    component: Layout, // 关键
    redirect: "/certificate/overview",
    meta: {
      title: "证书管理",
      icon: "ri:medal-2-line",
      roles: ["CompetitionAdministrator"],
      rank: 30
    },
    children: [
      {
        path: "/certificate/overview",
        name: "CertOverview",
        component: () => import("@/views/certificate/overview/index.vue"),
        meta: { title: "总览" }
      },
      {
        path: "/certificate/search",
        name: "CertSearch",
        component: () => import("@/views/certificate/search/index.vue"),
        meta: { title: "证书查询" }
      },
      {
        path: "/certificate/entry",
        name: "CertEntry",
        component: () => import("@/views/certificate/entry/index.vue"),
        meta: { title: "证书录入" }
      }
    ]
  },

  // --- 用户管理 ---
  {
    path: "/user",
    name: "User",
    component: Layout, // 关键
    redirect: "/user/overview",
    meta: {
      title: "用户管理",
      icon: "ri:user-settings-line",
      roles: ["Administrator"],
      rank: 40
    },
    children: [
      {
        path: "/user/overview",
        name: "UserOverview",
        component: () => import("@/views/user/overview/index.vue"),
        meta: { title: "总览" }
      },
      {
        path: "/user/create",
        name: "UserCreate",
        component: () => import("@/views/user/create/index.vue"),
        meta: { title: "创建用户" }
      },
      {
        path: "/user/search",
        name: "UserSearch",
        component: () => import("@/views/user/search/index.vue"),
        meta: { title: "查询用户" }
      }
    ]
  }
] as Array<RouteConfigsTable>;
