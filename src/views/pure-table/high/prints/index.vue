<script setup lang="ts">
import { ref } from "vue";
import { useColumns } from "./columns";

const printRef = ref();
const { columns, dataList, print, cellStyle, rowStyle, headerCellStyle } =
  useColumns(printRef);
</script>

<template>
  <div>
    <el-button type="primary" class="mb-[20px] float-right" @click="print">
      打印
    </el-button>
    <!-- rowHoverBgColor="transparent" 鼠标经过行时，去掉行的背景色 -->
    <pure-table
      ref="printRef"
      rowHoverBgColor="transparent"
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
