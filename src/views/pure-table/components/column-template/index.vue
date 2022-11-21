<script setup lang="ts">
import { useColumns } from "./columns";

const { columns, tableData } = useColumns();
</script>

<template>
  <pure-table :data="tableData" :columns="columns" />
</template>
