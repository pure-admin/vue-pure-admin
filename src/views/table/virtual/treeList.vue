<script lang="ts" setup>
import { ref } from "vue";
import treeList from "./tree.json";
import { VxeTableBar } from "@/components/ReVxeTableBar";

const vxeTableRef = ref();

const loading = ref(true);
const tableData = ref([]);

const columns = [
  { type: "seq", field: "seq", title: "序号", width: 200, treeNode: true },
  { field: "id", title: "Id" },
  { field: "name", title: "地点" }
];

async function onSearch() {
  loading.value = true;
  tableData.value = treeList;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

onSearch();
</script>

<template>
  <VxeTableBar
    tree
    title="虚拟树形表格"
    :isExpandAll="false"
    :vxeTableRef="vxeTableRef"
    :columns="columns"
    @refresh="onSearch"
  >
    <template v-slot="{ size, dynamicColumns }">
      <vxe-grid
        ref="vxeTableRef"
        v-loading="loading"
        show-overflow
        height="500"
        :size="size"
        :tree-config="{ transform: true }"
        :scroll-y="{ enabled: true, gt: 20 }"
        :columns="dynamicColumns"
        :data="tableData"
      />
    </template>
  </VxeTableBar>
</template>
