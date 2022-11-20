<script setup lang="ts">
import { tableData } from "../data";
import { useColumns } from "./columns";

const { columns } = useColumns();
</script>

<template>
  <PureTable :data="tableData" :columns="columns" />
</template>
