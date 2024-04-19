import List from "./list.vue";
import TreeList from "./treeList.vue";
import PageList from "./pageList.vue";

const rendContent = (val: string) =>
  `代码位置：src/views/table/virtual/${val}.vue`;

export const list = [
  {
    key: "list",
    content: rendContent("list"),
    title: "虚拟表格",
    component: List
  },
  {
    key: "treeList",
    content: rendContent("treeList"),
    title: "虚拟树形表格",
    component: TreeList
  },
  {
    key: "pageList",
    content: rendContent("pageList"),
    title: "分页表格",
    component: PageList
  }
];
