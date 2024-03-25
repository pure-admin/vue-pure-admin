import Base from "./form/base.vue";
import Dialog from "./form/dialog.vue";
import Drawer from "./form/drawer.vue";
import Steps from "./form/steps.vue";
import Search from "./form/search.vue";

const rendContent = (val: string) =>
  `代码位置：src/views/schema-form/form/${val}.vue`;

export const list = [
  {
    key: "base",
    content: rendContent("base"),
    title: "基础表单",
    component: Base
  },
  {
    key: "dialog",
    content: rendContent("dialog"),
    title: "弹框表单",
    component: Dialog
  },
  {
    key: "drawer",
    content: rendContent("drawer"),
    title: "抽屉表单",
    component: Drawer
  },
  {
    key: "steps",
    content: rendContent("steps"),
    title: "分步表单",
    component: Steps
  },
  {
    key: "search",
    content: rendContent("search"),
    title: "搜索表单",
    component: Search
  }
];
