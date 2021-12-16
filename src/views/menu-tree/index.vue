<script lang="ts">
export default {
  name: "reMenuTree"
};
</script>

<script setup lang="ts">
import { ref, computed } from "vue";
import { extractPathList, deleteChildren } from "/@/utils/tree";
import { usePermissionStoreHook } from "/@/store/modules/permission";

let dataProps = ref({
  value: "uniqueId",
  children: "children"
});

let menusData = computed(() => {
  return deleteChildren(usePermissionStoreHook().menusTree);
});

let expandedKeys = extractPathList(menusData.value);
</script>

<template>
  <el-tree-v2
    :data="menusData"
    :props="dataProps"
    show-checkbox
    :height="500"
    :default-expanded-keys="expandedKeys"
  >
    <template #default="{ data }">
      <span>{{ $t(data.meta.title) }}</span>
    </template>
  </el-tree-v2>
</template>
