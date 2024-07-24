export default {
  path: "/user",
  name: "UserManagement",
  component: () => import("@/views/user_management/user.vue"),
  meta: {
    icon: "ep:user",
    title: "用户管理",
    rank: 6
  }
};
