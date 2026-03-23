<script setup lang="ts">
import { useColumns } from "./columns";

const { columns, dataList } = useColumns();
</script>

<template>
  <pure-table row-key="id" border :data="dataList" :columns="columns">
    <template #echart="{ index }">
      <div :ref="'PieChartRef' + index" class="w-full h-25" />
    </template>
  </pure-table>
</template>
