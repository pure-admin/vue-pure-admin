<script lang="ts" setup>
import { ref } from "vue";
import treeList from "./tree.json";

const tableRef = ref();

const loading = ref(false);
const tableData = ref([]);

const loadList = () => {
  loading.value = true;
  setTimeout(() => {
    tableData.value = treeList;
    loading.value = false;
  }, 200);
};

const expandAllEvent = () => {
  const $table = tableRef.value;
  if ($table) {
    $table.setAllTreeExpand(true);
  }
};

const claseExpandEvent = () => {
  const $table = tableRef.value;
  if ($table) {
    $table.clearTreeExpand();
  }
};

loadList();
</script>

<template>
  <div>
    <div class="mb-4">
      <el-button @click="expandAllEvent">展开所有</el-button>
      <el-button @click="claseExpandEvent">收起所有</el-button>
    </div>

    <vxe-table
      ref="tableRef"
      show-overflow
      height="500"
      :loading="loading"
      :tree-config="{ transform: true }"
      :scroll-y="{ enabled: true, gt: 20 }"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="200" tree-node />
      <vxe-column field="id" title="Id" />
      <vxe-column field="name" title="地点" />
    </vxe-table>
  </div>
</template>
