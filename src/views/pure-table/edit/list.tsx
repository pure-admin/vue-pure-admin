import Demo1 from "./demo1/index.vue";

const rendContent = (val: string) =>
  `代码位置：src/views/pure-table/edit/${val}/index.vue`;

export const list = [
  {
    key: "demo1",
    content: rendContent("demo1"),
    title: "示例一",
    component: Demo1
  }
];
