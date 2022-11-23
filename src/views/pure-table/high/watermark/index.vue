<script setup lang="ts">
import { ref } from "vue";
import { useColumns } from "./columns";

const waterRef = ref();
const { columns, dataList } = useColumns(waterRef);
</script>

<template>
  <pure-table
    ref="waterRef"
    row-key="id"
    border
    :data="dataList"
    :columns="columns"
  />
</template>
