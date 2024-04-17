import Base from "./base.vue";
import Stripe from "./stripe.vue";
import Border from "./border.vue";
import Status from "./status.vue";
import FixHeader from "./fixHeader.vue";
import FixColumn from "./fixColumn.vue";
import FluidHeight from "./fluidHeight.vue";
import GroupHeader from "./groupHeader.vue";
import Radio from "./radio.vue";
import MultipleChoice from "./multipleChoice.vue";
import Sortable from "./sortable.vue";
import Filters from "./filters.vue";
import ColumnTemplate from "./column-template/index.vue";
import HeaderRenderer from "./header-renderer/index.vue";
import Expand from "./expand.vue";
import TreeTable from "./tree.vue";
import TotalRow from "./totalRow.vue";
import Merge from "./merge.vue";
import CustomIndex from "./customIndex.vue";
import Layout from "./layout.vue";
import NestProp from "./nestProp.vue";
import ImgPreview from "./imgPreview.vue";

const rendContent = (val: string) =>
  `代码位置：src/views/table/base/${val}.vue`;

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
