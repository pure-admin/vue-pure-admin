<script setup lang="ts">
import { useColumns } from "./columns";

const { columns, dataList } = useColumns();
</script>

<template>
  <pure-table row-key="id" border :data="dataList" :columns="columns" />
</template>
