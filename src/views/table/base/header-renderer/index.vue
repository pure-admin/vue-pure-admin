<script setup lang="ts">
import { useColumns } from "./columns";

const { columns, filterTableData } = useColumns();
</script>

<template>
  <pure-table :data="filterTableData" :columns="columns" />
</template>
