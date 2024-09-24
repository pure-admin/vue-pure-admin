<script setup lang="ts">
import { ref } from "vue";
import { useColumns } from "./columns";

const tableRef = ref();

const { columns, dataList, onChange } = useColumns();
</script>

<template>
  <div>
    <el-button type="primary" class="mb-[20px]" @click="onChange">
      切换表头
    </el-button>
    <pure-table
      ref="tableRef"
      border
      row-key="id"
      alignWhole="center"
      showOverflowTooltip
      :data="dataList"
      :columns="columns"
    />
  </div>
</template>
