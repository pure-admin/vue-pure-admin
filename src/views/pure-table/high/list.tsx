import RowDrag from "./drag/row/index.vue";
import ColumnDrag from "./drag/column/index.vue";
import Contextmenu from "./contextmenu/index.vue";
import Execl from "./execl/index.vue";
import Edit from "./edit/index.vue";
import Watermark from "./watermark/index.vue";

const rendContent = (val: string) =>
  `代码位置：src/views/pure-table/high/${val}/index.vue`;

export const list = [
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
    key: "execl",
    content: rendContent("execl"),
    title: "导出execl",
    component: Execl
  },
  {
    key: "edit",
    content: rendContent("edit"),
    title: "单元格编辑",
    component: Edit
  },
  {
    key: "watermark",
    content: rendContent("watermark"),
    title: "表格水印",
    component: Watermark
  }
];
