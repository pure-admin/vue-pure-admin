<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { VxeTableBar } from "@/components/ReVxeTableBar";

const vxeTableRef = ref();
const loading = ref(true);
const tableData = ref([]);

const getTableHeight = computed(() => {
  return (size: string) => {
    switch (size) {
      case "medium":
        return 531;
      case "small":
        return 482;
      case "mini":
        return 433;
    }
  };
});

const pagerConfig = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
  pageSizes: [5, 10, 15, 20]
});

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
  for (let index = 0; index < 10; index++) {
    mockList.push({
      id: index,
      name: "Test" + index,
      role: "Developer",
      sex: "男"
    });
  }
  pagerConfig.total = 20;
  tableData.value = mockList;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

const handlePageChange = ({ currentPage, pageSize }) => {
  pagerConfig.currentPage = currentPage;
  pagerConfig.pageSize = pageSize;
  onSearch();
};

onSearch();
</script>

<template>
  <VxeTableBar
    :vxeTableRef="vxeTableRef"
    :columns="columns"
    title="分页表格"
    @refresh="onSearch"
  >
    <template v-slot="{ size, dynamicColumns }">
      <vxe-grid
        ref="vxeTableRef"
        v-loading="loading"
        show-overflow
        :height="getTableHeight(size)"
        :size="size"
        :column-config="{ resizable: true }"
        :columns="dynamicColumns"
        :pagerConfig="pagerConfig"
        :data="tableData"
        @page-change="handlePageChange"
      />
    </template>
  </VxeTableBar>
</template>
