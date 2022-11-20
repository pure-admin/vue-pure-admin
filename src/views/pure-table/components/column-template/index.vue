<script setup lang="ts">
import { useColumns } from "./columns";

const { columns, tableData } = useColumns();
</script>

<template>
  <PureTable :data="tableData" :columns="columns" />
</template>
