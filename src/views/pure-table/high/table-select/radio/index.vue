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
    placeholder="请选择"
    clearable
  >
    <template #empty>
      <div class="w-[600px] m-4">
        <pure-table
          height="355"
          row-key="id"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#303133'
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
