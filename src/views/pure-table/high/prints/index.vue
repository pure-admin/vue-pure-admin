<script setup lang="ts">
import { ref } from "vue";
import { useColumns } from "./columns";

const printRef = ref();
const { columns, dataList, print, rowStyle, headerCellStyle } =
  useColumns(printRef);
</script>

<template>
  <div>
    <el-button type="primary" @click="print" class="mb-[20px] float-right">
      打印
    </el-button>
    <pure-table
      ref="printRef"
      row-key="id"
      border
      :data="dataList"
      :columns="columns"
      :row-style="rowStyle"
      :header-cell-style="headerCellStyle"
    />
  </div>
</template>

<style lang="scss" scoped>
// 去掉鼠标悬停行背景色
:deep(.el-table) {
  tbody tr:hover > td {
    background-color: transparent !important;
  }
}
</style>
