<script setup lang="ts">
import { ref } from "vue";
import { useColumns } from "./columns";

const printRef = ref();
const { columns, dataList, print, cellStyle, rowStyle, headerCellStyle } =
  useColumns(printRef);
</script>

<template>
  <div>
    <el-button type="primary" @click="print" class="mb-[20px] float-right">
      打印
    </el-button>
    <pure-table
      rowHoverBgColor="transparent"
      ref="printRef"
      row-key="id"
      border
      :data="dataList"
      :columns="columns"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
    />
  </div>
</template>
