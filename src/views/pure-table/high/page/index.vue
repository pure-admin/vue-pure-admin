<script setup lang="ts">
import { useColumns } from "./columns";

const {
  loading,
  columns,
  dataList,
  hideVal,
  tableSize,
  pagination,
  loadingConfig,
  paginationAlign,
  paginationSmall,
  onChange,
  onSizeChange,
  onCurrentChange
} = useColumns();
</script>

<template>
  <div>
    <el-space class="float-right mb-4">
      <p class="text-sm">动态列：</p>
      <el-radio-group v-model="hideVal" size="small">
        <el-radio-button label="nohide">不隐藏</el-radio-button>
        <el-radio-button label="hideDate">隐藏日期</el-radio-button>
        <el-radio-button label="hideName">隐藏姓名</el-radio-button>
        <el-radio-button label="hideAddress">隐藏地址</el-radio-button>
      </el-radio-group>
      <el-divider direction="vertical" />
      <p class="text-sm">表格大小：</p>
      <el-radio-group v-model="tableSize" size="small">
        <el-radio-button label="large">large</el-radio-button>
        <el-radio-button label="default">default</el-radio-button>
        <el-radio-button label="small">small</el-radio-button>
      </el-radio-group>
      <el-divider direction="vertical" />
      <p class="text-sm">分页大小：</p>
      <el-radio-group v-model="paginationSmall" size="small" @change="onChange">
        <el-radio-button :label="false">no small</el-radio-button>
        <el-radio-button :label="true">small</el-radio-button>
      </el-radio-group>
      <el-divider direction="vertical" />
      <p class="text-sm">分页的对齐方式：</p>
      <el-radio-group v-model="paginationAlign" size="small">
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
      :size="tableSize"
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
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </div>
</template>
