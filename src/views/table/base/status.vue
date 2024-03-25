<script setup lang="ts">
import { tableData } from "./data";

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex === 1 || rowIndex === 5) {
    return "pure-warning-row";
  } else if (rowIndex === 3 || rowIndex === 7) {
    return "pure-success-row";
  }
  return "";
};

const columns: TableColumnList = [
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
</script>

<template>
  <pure-table
    :data="tableData"
    :columns="columns"
    :row-class-name="tableRowClassName"
  />
</template>

<style>
/* 此处样式会在全局都生效，上面 tableRowClassName 函数返回的值也就是类名必须在全局中唯一，避免样式突出 */
.pure-warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.pure-success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
