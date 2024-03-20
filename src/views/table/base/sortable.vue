<script setup lang="ts">
import { tableDataSortable } from "./data";

const columns: TableColumnList = [
  {
    label: "日期",
    prop: "date",
    sortable: true
  },
  {
    label: "姓名",
    prop: "name"
  },
  {
    label: "地址",
    prop: "address",
    formatter: ({ address }) => `格式化后的内容：${address}`
  }
];
</script>

<template>
  <pure-table
    :data="tableDataSortable"
    :columns="columns"
    :default-sort="{ prop: 'date', order: 'ascending' }"
  />
</template>
