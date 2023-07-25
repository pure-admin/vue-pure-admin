<script setup lang="ts">
import { utils, writeFile, SSF } from "xlsx";
defineOptions({
  name: "Excel"
});

interface DataItem {
  readonly id: string;
  [propName: string]: string;
}

interface Columns {
  dataKey: string;
  key: string;
  title: string;
  width?: number;
  [propName: string]: string | number;
}

const generateColumns = (length = 10, prefix = "column-", props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150
  }));

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = "row-"
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`;
        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null
      }
    );
  });

const columns = generateColumns(10);
const data = generateData(columns, 1000);

const dnthresh = Date.UTC(1899, 11, 30, 0, 0, 0);
function datenum(v) {
  const epoch = v.getTime();
  const res = (epoch - dnthresh) / (24 * 60 * 60 * 1000);
  //这个地方-1 是为了兼容excel将1900年2月份当成闰年的错误，1900年是平年
  return res < 60 ? res - 1 : res;
}

//将当前时间转化为世界时
function local_to_utc(local) {
  return new Date(
    Date.UTC(
      local.getFullYear(),
      local.getMonth(),
      local.getDate(),
      local.getHours(),
      local.getMinutes(),
      local.getSeconds(),
      local.getMilliseconds()
    )
  );
}
//重写xlsx的aoa_to_sheet方法，修复Date格式数据不准确的问题
function aoa_to_sheet(data) {
  const ws = {};
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (let R = 0; R != data.length; ++R) {
    if (!data[R]) continue;
    if (!Array.isArray(data[R]))
      throw new Error("aoa_to_sheet expects an array of arrays");
    for (let C = 0; C != data[R].length; ++C) {
      if (typeof data[R][C] === "undefined") continue;
      let cell: Record<string, any> = { v: data[R][C] };
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      if (
        data[R][C] &&
        typeof data[R][C] === "object" &&
        !Array.isArray(data[R][C]) &&
        !(data[R][C] instanceof Date)
      )
        cell = data[R][C];
      else {
        if (Array.isArray(cell.v)) {
          cell.f = data[R][C][1];
          cell.v = cell.v[0];
        }
        if (cell.v === null) {
          if (cell.f) cell.t = "n";
          else cell.t = "z";
        } else if (typeof cell.v === "number") cell.t = "n";
        else if (typeof cell.v === "boolean") cell.t = "b";
        else if (cell.v instanceof Date) {
          cell.z = SSF.get_table()[14];
          cell.v = local_to_utc(cell.v);
          cell.t = "n";
          cell.v = datenum(cell.v);
          cell.w = SSF.format(cell.z, cell.v);
        } else {
          cell.t = "s";
        }
        const cell_ref = utils.encode_cell({ c: C, r: R });
        if (ws[cell_ref] && ws[cell_ref].z) cell.z = ws[cell_ref].z;
        ws[cell_ref] = cell;
      }
    }
  }
  if (range.s.c < 10000000) ws["!ref"] = utils.encode_range(range);
  return ws;
}

const exportExcel = () => {
  const res: string[][] = data.map((item: DataItem) => {
    const arr = [];
    columns.forEach((column: Columns) => {
      arr.push(item[column.dataKey]);
    });
    return arr;
  });
  const titleList: string[] = [];
  columns.forEach((column: Columns) => {
    titleList.push(column.title);
  });
  res.unshift(titleList);
  const workSheet = aoa_to_sheet(res);
  const workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, "数据报表");
  writeFile(workBook, "tableV2.xlsx");
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="font-medium">
        导出Excel（
        <el-link
          href="https://github.com/SheetJS/sheetjs"
          target="_blank"
          style="margin: 0 5px 4px 0; font-size: 16px"
        >
          github地址
        </el-link>
        ）
      </div>
    </template>
    <el-button type="primary" @click="exportExcel">导出Excel</el-button>
    <div class="h-[25rem] mt-3">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            :columns="columns"
            :data="data"
            :width="width"
            :height="height"
            fixed
          />
        </template>
      </el-auto-resizer>
    </div>
  </el-card>
</template>
