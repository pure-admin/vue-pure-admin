<script setup lang="ts">
import { useColumns } from "./columns";
const { columnsA, columnsB, columnsC } = useColumns();

const list = [
  {
    columns: columnsA,
    column: 3
  },
  {
    columns: columnsB,
    column: 2
  },
  {
    columns: columnsC,
    column: 1
  }
];
</script>

<template>
  <PureDescriptions
    v-for="(item, index) in list"
    :key="index"
    :columns="item.columns"
    :column="item.column"
    direction="vertical"
    border
  />
</template>
