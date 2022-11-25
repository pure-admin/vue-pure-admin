import Demo1 from "./demo1.vue";
import Demo2 from "./demo2.vue";

const rendContent = (val: string) =>
  `代码位置：src/views/tree/components/${val}.vue`;

export const list = [
  {
    key: "one",
    content: rendContent("demo1"),
    title: "示例一",
    component: Demo1
  },
  {
    key: "two",
    content: rendContent("demo2"),
    title: "示例二",
    component: Demo2
  }
];
