<script setup lang="ts">
import { useColumns } from "./columns";

const { columns, dataList, exportExcel } = useColumns();
</script>

<template>
  <div>
    <el-button
      type="primary"
      class="mb-[20px] float-right"
      @click="exportExcel"
    >
      导出
    </el-button>
    <pure-table row-key="id" border :data="dataList" :columns="columns" />
  </div>
</template>
