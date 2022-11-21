<script setup lang="ts">
import { tableData } from "./data";

const indexMethod = (index: number) => {
  return index * 2;
};

const columns: TableColumnList = [
  {
    type: "index",
    index: indexMethod
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
</script>

<template>
  <pure-table :data="tableData" :columns="columns" />
</template>
