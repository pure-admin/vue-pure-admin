import {
  Base,
  Stripe,
  Border,
  Status,
  FixHeader,
  FixColumn,
  FluidHeight,
  GroupHeader,
  Radio,
  MultipleChoice,
  Sortable,
  Filters
} from "./components";

const rendContent = (val: string) =>
  `代码位置：src/views/pure-table/components/${val}`;

export const list = [
  {
    key: "base",
    content: rendContent("base.vue"),
    title: "基础表格",
    component: Base
  },
  {
    key: "stripe",
    content: rendContent("stripe.vue"),
    title: "带斑马纹表格",
    component: Stripe
  },
  {
    key: "border",
    content: rendContent("border.vue"),
    title: "带边框表格",
    component: Border
  },
  {
    key: "status",
    content: rendContent("status.vue"),
    title: "带状态表格",
    component: Status
  },
  {
    key: "fixHeader",
    content: rendContent("fixHeader.vue"),
    title: "固定表头",
    component: FixHeader
  },
  {
    key: "fixColumn",
    content: rendContent("fixColumn.vue"),
    title: "固定列",
    component: FixColumn
  },
  {
    key: "fixColumnHeader",
    content: rendContent("fixColumn.vue"),
    title: "固定列和表头",
    component: () => <FixColumn height={"360"} />
  },
  {
    key: "groupHeader",
    content: rendContent("groupHeader.vue"),
    title: "多级表头（表头分组）",
    component: GroupHeader
  },
  {
    key: "fluidHeight",
    content: rendContent("fluidHeight.vue"),
    title: "流体高度",
    component: FluidHeight
  },
  {
    key: "radio",
    content: rendContent("radio.vue"),
    title: "单选",
    component: Radio
  },
  {
    key: "multipleChoice",
    content: rendContent("multipleChoice.vue"),
    title: "多选",
    component: MultipleChoice
  },
  {
    key: "sortable",
    content: rendContent("sortable.vue"),
    title: "排序和格式化",
    component: Sortable
  },
  {
    key: "filters",
    content: rendContent("filters.vue"),
    title: "筛选",
    component: Filters
  }
];
