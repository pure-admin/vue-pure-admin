<script setup lang="ts">
import { ref } from "vue";
import { tableData } from "./data";

type TableLayout = "fixed" | "auto";

const tableLayout = ref<TableLayout>("fixed");

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
    <el-radio-group v-model="tableLayout">
      <el-radio-button label="fixed" value="fixed" />
      <el-radio-button label="auto" value="auto" />
    </el-radio-group>

    <pure-table
      :data="tableData"
      :columns="columns"
      :table-layout="tableLayout"
    />
  </div>
</template>
