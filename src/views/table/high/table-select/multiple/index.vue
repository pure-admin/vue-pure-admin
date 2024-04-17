<script setup lang="ts">
import { ref } from "vue";
import { useColumns } from "./columns";

const formRef = ref();
const tableRef = ref();
const selectRef = ref();
const {
  searchForm,
  sexOptions,
  columns,
  pagination,
  selectValue,
  tableData,
  onSure,
  onClear,
  onReset,
  onSearch,
  removeTag,
  handleSelectionChange
} = useColumns(selectRef, formRef, tableRef);
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
        <!-- <el-config-provider size="small"> -->
        <el-form ref="formRef" :inline="true" :model="searchForm">
          <el-form-item prop="sexValue">
            <el-select
              v-model="searchForm.sexValue"
              class="!w-[120px]"
              placeholder="请选择性别"
              :teleported="false"
              clearable
            >
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="searchDate">
            <el-date-picker
              v-model="searchForm.searchDate"
              class="!w-[150px]"
              type="date"
              placeholder="请选择日期"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-D"
            />
          </el-form-item>
          <el-form-item class="float-right !mr-0">
            <el-button type="primary" text bg @click="onSearch">
              查询
            </el-button>
            <el-button text bg @click="onReset"> 重置 </el-button>
          </el-form-item>
        </el-form>

        <pure-table
          ref="tableRef"
          row-key="id"
          alignWhole="center"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :data="
            tableData.slice(
              (pagination.currentPage - 1) * pagination.pageSize,
              pagination.currentPage * pagination.pageSize
            )
          "
          :columns="columns"
          :pagination="pagination"
          @selection-change="handleSelectionChange"
        />
        <el-button
          class="absolute bottom-[25px] left-[20px]"
          type="primary"
          size="small"
          text
          bg
          @click="onSure"
        >
          确定
        </el-button>
        <!-- </el-config-provider> -->
      </div>
    </template>
  </el-select>
</template>
