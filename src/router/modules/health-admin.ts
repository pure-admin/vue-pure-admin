const Layout = () => import("@/layout/index.vue");

const ADMIN_PANEL_ROLES = ["admin", "operator", "super_admin"];

export default {
  path: "/manage",
  name: "HealthAdmin",
  component: Layout,
  redirect: "/manage/users",
  meta: {
    icon: "ep/setting",
    title: "后台管理",
    rank: 2,
    roles: ADMIN_PANEL_ROLES
  },
  children: [
    {
      path: "/manage/users",
      name: "AdminUsers",
      component: () => import("@/views/admin/users/index.vue"),
      meta: {
        title: "用户管理",
        roles: ADMIN_PANEL_ROLES,
        auths: [
          "admin:users:view",
          "admin:users:detail",
          "admin:users:status",
          "admin:users:plan",
          "admin:users:credits",
          "admin:users:role"
        ]
      }
    },
    {
      path: "/manage/admins",
      name: "AdminManagers",
      component: () => import("@/views/admin/admins/index.vue"),
      meta: {
        title: "管理员管理",
        roles: ADMIN_PANEL_ROLES,
        auths: ["admin:users:view", "admin:users:role", "admin:rbac:view"]
      }
    },
    {
      path: "/manage/roles",
      name: "AdminRoles",
      component: () => import("@/views/admin/roles/index.vue"),
      meta: {
        title: "角色管理",
        roles: ADMIN_PANEL_ROLES,
        auths: ["admin:rbac:view", "admin:rbac:update"]
      }
    },
    {
      path: "/manage/permissions",
      name: "AdminPermissions",
      component: () => import("@/views/admin/permissions/index.vue"),
      meta: {
        title: "路由管理",
        roles: ADMIN_PANEL_ROLES,
        auths: ["admin:rbac:view", "admin:rbac:update"]
      }
    },
    {
      path: "/manage/recognitions",
      name: "AdminRecognitions",
      component: () => import("@/views/admin/recognitions/index.vue"),
      meta: {
        title: "识别记录",
        roles: ADMIN_PANEL_ROLES,
        auths: ["admin:recognitions:view"]
      }
    },
    {
      path: "/manage/audits",
      name: "AdminAudits",
      component: () => import("@/views/admin/audits/index.vue"),
      meta: {
        title: "操作日志",
        roles: ADMIN_PANEL_ROLES,
        auths: ["admin:audits:view"]
      }
    },
    {
      path: "/manage/sessions",
      name: "AdminSessions",
      component: () => import("@/views/admin/sessions/index.vue"),
      meta: {
        title: "会话记录",
        roles: ADMIN_PANEL_ROLES,
        auths: ["admin:sessions:view"]
      }
    },
    {
      path: "/manage/rbac",
      name: "AdminRbac",
      component: () => import("@/views/admin/rbac/index.vue"),
      meta: {
        title: "权限配置",
        roles: ADMIN_PANEL_ROLES,
        auths: ["admin:rbac:view", "admin:rbac:update"]
      }
    }
  ]
} satisfies RouteConfigsTable;