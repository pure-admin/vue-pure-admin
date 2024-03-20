<script lang="ts" setup>
import { ref } from "vue";

const tableData = ref([]);

setTimeout(() => {
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
}, 100);
</script>

<template>
  <vxe-table
    border
    show-overflow
    height="500"
    :row-config="{ isHover: true }"
    :data="tableData"
    :scroll-y="{ enabled: true }"
  >
    <vxe-column type="seq" title="序号" width="100" />
    <vxe-column field="name" title="名称" sortable />
    <vxe-column field="role" title="角色" />
    <vxe-column field="sex" title="性别" />
  </vxe-table>
</template>
