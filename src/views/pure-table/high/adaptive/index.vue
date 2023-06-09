<script setup lang="ts">
import { useColumns } from "./columns";
import { emitter } from "@/utils/mitt";
import { ref, onMounted, onBeforeUnmount } from "vue";

const tableRef = ref();

const {
  loading,
  columns,
  dataList,
  pagination,
  loadingConfig,
  adaptiveConfig,
  onSizeChange,
  onCurrentChange
} = useColumns();

onMounted(() => {
  emitter.on("setAdaptive", () => {
    // 设置表格自适应高度（用于表格外的元素高度改变或者元素隐藏时主动对表格进行自适应高度调整）
    tableRef.value.setAdaptive();
  });
});

onBeforeUnmount(() => {
  // 解绑`setAdaptive`公共事件，防止多次触发
  emitter.off("setAdaptive");
});
</script>

<template>
  <pure-table
    ref="tableRef"
    border
    adaptive
    :adaptiveConfig="adaptiveConfig"
    row-key="id"
    alignWhole="center"
    showOverflowTooltip
    :loading="loading"
    :loading-config="loadingConfig"
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
</template>
