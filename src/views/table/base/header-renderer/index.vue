<script setup lang="ts">
import { useColumns } from "./columns";
import Calendar from "@iconify-icons/ri/calendar-2-line";

const { columns, filterTableData } = useColumns();
</script>

<template>
  <pure-table :data="filterTableData" :columns="columns">
    <template #nameHeader>
      <span class="flex items-center">
        <IconifyIconOffline :icon="Calendar" />
        日期
      </span>
    </template>
  </pure-table>
</template>
