<script setup lang="ts">
import { ref } from "vue";
import { tableData } from "./data";

const tableRef = ref();
const currentRow = ref();

const setCurrent = (row?: any) => {
  // 获取表格的方法 tableRef.value.getTableRef()
  const { setCurrentRow } = tableRef.value.getTableRef();
  setCurrentRow(row);
};
const handleCurrentChange = val => {
  currentRow.value = val;
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
  <div>
    <pure-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      highlight-current-row
      @page-current-change="handleCurrentChange"
    />
    <div style="margin-top: 20px">
      <el-button @click="setCurrent(tableData[1])">Select second row</el-button>
      <el-button @click="setCurrent()">Clear selection</el-button>
    </div>
  </div>
</template>
