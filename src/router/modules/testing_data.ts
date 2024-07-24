export default {
  path: "/testdata",
  name: "TestData",
  component: () => import("@/views/test_data_management/testData.vue"),
  meta: {
    icon: "ep:box",
    title: "数据管理",
    rank: 5
  }
};
