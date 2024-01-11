<script setup lang="ts">
import { ref } from "vue";
import { useColumns } from "./columns";

const selectRef = ref();
const tableRef = ref();
const {
  columns,
  pagination,
  selectValue,
  tableDataEdit,
  onClear,
  onSure,
  removeTag,
  handleSelectionChange
} = useColumns(selectRef, tableRef);
</script>

<template>
  <el-select
    ref="selectRef"
    v-model="selectValue"
    class="!w-[200px]"
    placeholder="请选择"
    clearable
    multiple
    collapse-tags
    value-key="id"
    @remove-tag="removeTag"
    @clear="onClear"
  >
    <template #empty>
      <div class="m-4">
        <pure-table
          ref="tableRef"
          row-key="id"
          alignWhole="center"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#303133'
          }"
          :data="
            tableDataEdit.slice(
              (pagination.currentPage - 1) * pagination.pageSize,
              pagination.currentPage * pagination.pageSize
            )
          "
          :columns="columns"
          :pagination="pagination"
          @selection-change="handleSelectionChange"
        />
        <el-button
          class="absolute bottom-[17px]"
          type="primary"
          size="small"
          text
          bg
          @click="onSure"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-select>
</template>
