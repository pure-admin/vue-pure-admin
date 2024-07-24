export default {
  path: "/project",
  name: "ProjectManagement",
  component: () => import("@/views/project_management/projectlist.vue"),
  meta: {
    icon: "ep:files",
    title: "项目管理",
    rank: 3
  }
};
