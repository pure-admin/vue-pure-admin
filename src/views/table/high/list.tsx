import Adaptive from "./adaptive/index.vue";
import Page from "./page/index.vue";
import Header from "./header/index.vue";
import RowDrag from "./drag/row/index.vue";
import ColumnDrag from "./drag/column/index.vue";
import Contextmenu from "./contextmenu/index.vue";
import Excel from "./excel/index.vue";
import Watermark from "./watermark/index.vue";
import Print from "./prints/index.vue";
import Echarts from "./echarts/index.vue";
import TableSelect from "./table-select/index.vue";

const rendContent = (val: string) =>
  `代码位置：src/views/table/high/${val}/index.vue`;

export const list = [
  {
    key: "adaptive",
    content: rendContent("adaptive"),
    title: "自适应内容区高度",
    component: Adaptive
  },
  {
    key: "page",
    content: rendContent("page"),
    title: "分页、加载动画、动态列",
    component: Page
  },
  {
    key: "header",
    content: rendContent("header"),
    title: "动态表头",
    component: Header
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
    key: "excel",
    content: rendContent("excel"),
    title: "导出excel",
    component: Excel
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
    title: "水印",
    component: Watermark
  },
  {
    key: "echarts",
    content: rendContent("echarts"),
    title: "内嵌echarts图表",
    component: Echarts
  }
];
