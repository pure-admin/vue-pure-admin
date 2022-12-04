<script setup lang="ts">
import { useColumns } from "./columns";

const {
  loading,
  columns,
  dataList,
  pagination,
  loadingConfig,
  paginationAlign,
  onSizeChange,
  onCurrentChange
} = useColumns();
</script>

<template>
  <div>
    <el-space class="float-right mb-2">
      <p>分页的对齐方式：</p>
      <el-radio-group v-model="paginationAlign">
        <el-radio-button label="right">right</el-radio-button>
        <el-radio-button label="center">center</el-radio-button>
        <el-radio-button label="left">left</el-radio-button>
      </el-radio-group>
    </el-space>
    <pure-table
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :loading="loading"
      :loading-config="loadingConfig"
      :height="440"
      :data="
        dataList.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
      :columns="columns"
      :pagination="pagination"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </div>
</template>
