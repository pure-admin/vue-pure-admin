export default {
  path: "/exec",
  name: "TestCaseExecution",
  component: () => import("@/views/case_exec/case_exec.vue"),
  meta: {
    icon: "ep:video-play",
    title: "测试执行",
    rank: 1
  }
};
