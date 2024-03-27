<script setup lang="ts">
import { utils, writeFile } from "xlsx";

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
  const workSheet = utils.aoa_to_sheet(res);
  const workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, "数据报表");
  writeFile(workBook, "tableV2.xlsx");
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="font-medium">
        <el-link
          href="https://github.com/SheetJS/sheetjs"
          target="_blank"
          style="margin: 0 5px 4px 0; font-size: 16px"
        >
          导出Excel
        </el-link>
      </div>
      <el-link
        class="mt-2"
        href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/excel.vue"
        target="_blank"
      >
        代码位置 src/views/able/excel.vue
      </el-link>
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
