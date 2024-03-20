import List from "./list.vue";
import TreeList from "./treeList.vue";

const rendContent = (val: string) =>
  `代码位置：src/views/table/virtual/${val}.vue`;

export const list = [
  {
    key: "list",
    content: rendContent("list"),
    title: "虚拟列表",
    component: List
  },
  {
    key: "treeList",
    content: rendContent("treeList"),
    title: "虚拟树",
    component: TreeList
  }
];
