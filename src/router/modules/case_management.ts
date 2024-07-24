export default {
  path: "/caselist",
  name: "CaseManagement",
  component: () => import("@/views/case_management/caselist.vue"),
  meta: {
    icon: "ep:document",
    title: "用例管理",
    rank: 2
  }
};
