import { ref } from "vue";
import { utils, writeFile } from "xlsx";
import { tableDataDrag } from "../data";
import { clone } from "@pureadmin/utils";
import { message } from "@/utils/message";

export function useColumns() {
  const dataList = ref(clone(tableDataDrag, true));

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
    }
  ];

  const exportExcel = () => {
    const res = dataList.value.map(item => {
      const arr = [];
      columns.forEach(column => {
        arr.push(item[column.prop as string]);
      });
      return arr;
    });
    const titleList = [];
    columns.forEach(column => {
      titleList.push(column.label);
    });
    res.unshift(titleList);
    const workSheet = utils.aoa_to_sheet(res);
    const workBook = utils.book_new();
    utils.book_append_sheet(workBook, workSheet, "数据报表");
    writeFile(workBook, "pure-admin-table.xlsx");
    message("导出成功", {
      type: "success"
    });
  };

  return {
    columns,
    dataList,
    exportExcel
  };
}
