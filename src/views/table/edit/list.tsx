import Demo1 from "./demo1/index.vue";
import Demo2 from "./demo2/index.vue";
import Demo3 from "./demo3/index.vue";

const rendContent = (val: string) =>
  `代码位置：src/views/table/edit/${val}/index.vue`;

export const list = [
  {
    key: "demo1",
    content: rendContent("demo1"),
    title: "整体编辑",
    component: Demo1
  },
  {
    key: "demo2",
    content: rendContent("demo2"),
    title: "单行编辑",
    component: Demo2
  },
  {
    key: "demo3",
    content: rendContent("demo3"),
    title: "单元格编辑",
    component: Demo3
  }
];
