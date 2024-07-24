export default {
  path: "/result",
  name: "TestingResult",
  component: () => import("@/views/test_result_management/testResultList.vue"),
  meta: {
    icon: "ep:data-line",
    title: "测试结果",
    rank: 4
  }
};
