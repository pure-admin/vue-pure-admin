<script setup lang="ts">
import { useColumns } from "./columns";

const {
  loading,
  columns,
  dataList,
  select,
  hideVal,
  tableSize,
  pagination,
  loadingConfig,
  paginationAlign,
  onChange,
  onSizeChange,
  onCurrentChange
} = useColumns();
</script>

<template>
  <div>
    <el-space class="float-right mb-4">
      <p class="text-sm">多选：</p>
      <el-radio-group v-model="select" size="small">
        <el-radio-button value="yes">是</el-radio-button>
        <el-radio-button value="no">否</el-radio-button>
      </el-radio-group>
      <el-divider direction="vertical" />
      <p class="text-sm">动态列：</p>
      <el-radio-group v-model="hideVal" size="small">
        <el-radio-button value="nohide">不隐藏</el-radio-button>
        <el-radio-button value="hideDate">隐藏日期</el-radio-button>
        <el-radio-button value="hideName">隐藏姓名</el-radio-button>
        <el-radio-button value="hideAddress">隐藏地址</el-radio-button>
      </el-radio-group>
      <el-divider direction="vertical" />
      <p class="text-sm">表格大小：</p>
      <el-radio-group v-model="tableSize" size="small">
        <el-radio-button value="large">large</el-radio-button>
        <el-radio-button value="default">default</el-radio-button>
        <el-radio-button value="small">small</el-radio-button>
      </el-radio-group>
      <el-divider direction="vertical" />
      <p class="text-sm">分页大小：</p>
      <el-radio-group v-model="pagination.size" size="small" @change="onChange">
        <el-radio-button value="large">large</el-radio-button>
        <el-radio-button value="default">default</el-radio-button>
        <el-radio-button value="small">small</el-radio-button>
      </el-radio-group>
      <el-divider direction="vertical" />
      <p class="text-sm">分页的对齐方式：</p>
      <el-radio-group v-model="paginationAlign" size="small">
        <el-radio-button value="right">right</el-radio-button>
        <el-radio-button value="center">center</el-radio-button>
        <el-radio-button value="left">left</el-radio-button>
      </el-radio-group>
    </el-space>

    <pure-table
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :size="tableSize as any"
      :loading="loading"
      :loading-config="loadingConfig"
      :height="tableSize === 'small' ? 352 : 440"
      :data="
        dataList.slice(
          (pagination.currentPage - 1) * pagination.pageSize,
          pagination.currentPage * pagination.pageSize
        )
      "
      :columns="columns"
      :pagination="pagination"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    />
  </div>
</template>
