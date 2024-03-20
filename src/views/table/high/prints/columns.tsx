import Print from "@/utils/print";
import { ref, type Ref } from "vue";
import { tableDataEdit } from "../data";
import { clone } from "@pureadmin/utils";

export function useColumns(printRef: Ref) {
  const dataList = ref(clone(tableDataEdit, true));

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id"
    },
    {
      label: "日期",
      prop: "date"
    },
    {
      label: "姓名",
      prop: "name"
    },
    {
      label: "地址",
      prop: "address"
    }
  ];

  const print = () => {
    Print(printRef.value.getTableDoms().tableWrapper).toPrint;
  };

  function cellStyle({ column: { property }, rowIndex }) {
    if (property === "id") {
      return rowIndex < 3
        ? { background: "#87baf9" }
        : { background: "#87e8de" };
    }
  }

  function headerCellStyle({ columnIndex }) {
    return columnIndex === 0
      ? { background: "#f3b2d0" }
      : { background: "#fafafa" };
  }

  function rowStyle({ rowIndex }) {
    return rowIndex % 2 === 1
      ? { background: "#ffa39e" }
      : { background: "#91d5ff" };
  }

  return {
    columns,
    dataList,
    print,
    rowStyle,
    cellStyle,
    headerCellStyle
  };
}
