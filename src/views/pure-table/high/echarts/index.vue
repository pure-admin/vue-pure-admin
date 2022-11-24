<script setup lang="ts">
import { useColumns } from "./columns";

const { columns, dataList } = useColumns();
</script>

<template>
  <pure-table row-key="id" border :data="dataList" :columns="columns">
    <template #echart="{ index }">
      <div :ref="'PieChartRef' + index" style="height: 100px" />
    </template>
  </pure-table>
</template>
