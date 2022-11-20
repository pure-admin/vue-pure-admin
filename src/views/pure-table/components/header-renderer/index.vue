<script setup lang="ts">
import { useColumns } from "./columns";

const { columns, filterTableData } = useColumns();
</script>

<template>
  <PureTable :data="filterTableData" :columns="columns" />
</template>
