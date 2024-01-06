<script setup lang="ts">
import { useColumns } from "./columns";

const { loading, columns, dataList, pagination, onCurrentChange } =
  useColumns();
</script>

<template>
  <pure-table
    row-key="id"
    alignWhole="center"
    showOverflowTooltip
    :loading="loading"
    :data="
      dataList.slice(
        (pagination.currentPage - 1) * pagination.pageSize,
        pagination.currentPage * pagination.pageSize
      )
    "
    :columns="columns"
    :pagination="pagination"
    @page-current-change="onCurrentChange"
  >
    <!-- <template #operation="{ row }">
      <IconifyIconOffline icon="search" />
    </template> -->
  </pure-table>
</template>

<style scoped>
:deep(.el-table) {
  --el-table-border: none;
  --el-table-border-color: transparent;
}
</style>
