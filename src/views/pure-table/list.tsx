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
  Filters,
  ColumnTemplate,
  HeaderRenderer,
  Expand,
  TreeTable,
  TotalRow,
  Merge,
  CustomIndex,
  Layout,
  NestProp,
  ImgPreview
} from "./components";

const rendContent = (val: string) =>
  `代码位置：src/views/pure-table/components/${val}.vue`;

export const list = [
  {
    key: "base",
    content: rendContent("base"),
    title: "基础表格",
    component: Base
  },
  {
    key: "stripe",
    content: rendContent("stripe"),
    title: "带斑马纹表格",
    component: Stripe
  },
  {
    key: "border",
    content: rendContent("border"),
    title: "带边框表格",
    component: Border
  },
  {
    key: "status",
    content: rendContent("status"),
    title: "带状态表格",
    component: Status
  },
  {
    key: "fixHeader",
    content: rendContent("fixHeader"),
    title: "固定表头",
    component: FixHeader
  },
  {
    key: "fixColumn",
    content: rendContent("fixColumn"),
    title: "固定列",
    component: FixColumn
  },
  {
    key: "fixColumnHeader",
    content: rendContent("fixColumn"),
    title: "固定列和表头",
    component: () => <FixColumn height={"360"} />
  },
  {
    key: "groupHeader",
    content: rendContent("groupHeader"),
    title: "多级表头（表头分组）",
    component: GroupHeader
  },
  {
    key: "fluidHeight",
    content: rendContent("fluidHeight"),
    title: "流体高度",
    component: FluidHeight
  },
  {
    key: "radio",
    content: rendContent("radio"),
    title: "单选",
    component: Radio
  },
  {
    key: "multipleChoice",
    content: rendContent("multipleChoice"),
    title: "多选",
    component: MultipleChoice
  },
  {
    key: "sortable",
    content: rendContent("sortable"),
    title: "排序和格式化",
    component: Sortable
  },
  {
    key: "filters",
    content: rendContent("filters"),
    title: "筛选",
    component: Filters
  },
  {
    key: "column-template",
    content: rendContent("column-template/index"),
    title: "自定义列模板",
    component: ColumnTemplate
  },
  {
    key: "header-renderer",
    content: rendContent("header-renderer/index"),
    title: "自定义表头",
    component: HeaderRenderer
  },
  {
    key: "expand",
    content: rendContent("expand"),
    title: "展开行",
    component: Expand
  },
  {
    key: "tree",
    content: rendContent("tree"),
    title: "树形数据与懒加载",
    component: TreeTable
  },
  {
    key: "totalRow",
    content: rendContent("totalRow"),
    title: "表尾合计行",
    component: TotalRow
  },
  {
    key: "merge",
    content: rendContent("merge"),
    title: "合并行或列",
    component: Merge
  },
  {
    key: "customIndex",
    content: rendContent("customIndex"),
    title: "自定义索引",
    component: CustomIndex
  },
  {
    key: "layout",
    content: rendContent("layout"),
    title: "表格布局",
    component: Layout
  },
  {
    key: "nestProp",
    content: rendContent("nestProp"),
    title: "多种数据格式（深层结构）",
    component: NestProp
  },
  {
    key: "imgPreview",
    content: rendContent("imgPreview"),
    title: "图像预览",
    component: ImgPreview
  }
];
