import Page from "./page/index.vue";
import RowDrag from "./drag/row/index.vue";
import ColumnDrag from "./drag/column/index.vue";
import Contextmenu from "./contextmenu/index.vue";
import Execl from "./execl/index.vue";
import Edit from "./edit/index.vue";
import Watermark from "./watermark/index.vue";
import Print from "./prints/index.vue";
import Echarts from "./echarts/index.vue";
import TableSelect from "./table-select/index.vue";

const rendContent = (val: string) =>
  `代码位置：src/views/pure-table/high/${val}/index.vue`;

export const list = [
  {
    key: "page",
    content: rendContent("page"),
    title: "分页、加载动画、动态列",
    component: Page
  },
  {
    key: "tableSelect",
    content: rendContent("table-select"),
    title: "表格选择器",
    component: TableSelect
  },
  {
    key: "rowDrag",
    content: rendContent("drag/row"),
    title: "拖拽表格（行拖拽）",
    component: RowDrag
  },
  {
    key: "columnDrag",
    content: rendContent("drag/column"),
    title: "拖拽表格（列拖拽）",
    component: ColumnDrag
  },
  {
    key: "contextmenu",
    content: rendContent("contextmenu"),
    title: "右键菜单",
    component: Contextmenu
  },
  {
    key: "edit",
    content: rendContent("edit"),
    title: "单元格编辑",
    component: Edit
  },
  {
    key: "execl",
    content: rendContent("execl"),
    title: "导出execl",
    component: Execl
  },
  {
    key: "print",
    content: rendContent("print"),
    title: "打印",
    component: Print
  },
  {
    key: "watermark",
    content: rendContent("watermark"),
    title: "水印（无法删除的水印哦🤓️）",
    component: Watermark
  },
  {
    key: "echarts",
    content: rendContent("echarts"),
    title: "内嵌echarts图表",
    component: Echarts
  }
];
