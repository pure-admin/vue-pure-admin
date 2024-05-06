<script lang="ts" setup>
import { ref } from "vue";
import { VxeTableBar } from "@/components/ReVxeTableBar";

const vxeTableRef = ref();
const loading = ref(true);
const tableData = ref([]);

const columns = [
  { type: "seq", field: "seq", title: "序号", width: 100 },
  { field: "name", title: "名称", sortable: true },
  { field: "role", title: "角色" },
  { field: "sex", title: "性别" }
];

async function onSearch() {
  loading.value = true;
  // 模拟数据
  const mockList = [];
  for (let index = 0; index < 500; index++) {
    mockList.push({
      id: index,
      name: "Test" + index,
      role: "Developer",
      sex: "男"
    });
  }
  tableData.value = mockList;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

onSearch();
</script>

<template>
  <VxeTableBar
    :vxeTableRef="vxeTableRef"
    :columns="columns"
    title="虚拟表格"
    @refresh="onSearch"
  >
    <template v-slot="{ size, dynamicColumns }">
      <vxe-grid
        ref="vxeTableRef"
        v-loading="loading"
        show-overflow
        height="500"
        :size="size"
        :row-config="{ isHover: true }"
        :scroll-y="{ enabled: true }"
        :columns="dynamicColumns"
        :data="tableData"
      />
    </template>
  </VxeTableBar>
</template>
