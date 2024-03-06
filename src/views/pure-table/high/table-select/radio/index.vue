<script setup lang="ts">
import { ref } from "vue";
import { useColumns } from "./columns";

const selectRef = ref();
const {
  columns,
  pagination,
  selectValue,
  tableDataEdit,
  rowStyle,
  onRowClick
} = useColumns(selectRef);
</script>

<template>
  <el-select
    ref="selectRef"
    v-model="selectValue"
    class="!w-[200px]"
    placeholder="请选择"
    value-key="id"
    clearable
  >
    <template #empty>
      <div class="m-4">
        <pure-table
          row-key="id"
          alignWhole="center"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :row-style="rowStyle"
          :data="
            tableDataEdit.slice(
              (pagination.currentPage - 1) * pagination.pageSize,
              pagination.currentPage * pagination.pageSize
            )
          "
          :columns="columns"
          :pagination="pagination"
          @row-click="onRowClick"
        />
      </div>
    </template>
  </el-select>
</template>
