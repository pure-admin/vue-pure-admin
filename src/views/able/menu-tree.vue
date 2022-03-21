<script lang="ts">
export default {
  name: "reMenuTree"
};
</script>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";
import type { ElTreeV2 } from "element-plus";
import { transformI18n } from "/@/plugins/i18n";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { extractPathList, deleteChildren } from "/@/utils/tree";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import type { TreeNode } from "element-plus/es/components/tree-v2/src/types";
const { t } = useI18n();

interface treeNode extends TreeNode {
  meta: {
    title: string;
    i18n: boolean;
  };
}

const query = ref("");
let dataProps = ref({
  value: "uniqueId",
  children: "children"
});
const treeRef = ref<InstanceType<typeof ElTreeV2>>();

let menusData = computed(() => {
  return deleteChildren(usePermissionStoreHook().menusTree);
});

let expandedKeys = extractPathList(menusData.value);

const onQueryChanged = (query: string) => {
  // @ts-expect-error
  treeRef.value!.filter(query);
};

const filterMethod = (query: string, node: treeNode) => {
  return transformI18n(node.meta.title, node.meta.i18n)!.indexOf(query) !== -1;
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium"
          >菜单树结构（采用element-plus的
          <el-link
            href="https://element-plus.gitee.io/zh-CN/component/tree-v2.html"
            target="_blank"
            :icon="useRenderIcon('node-tree')"
            style="font-size: 16px; margin: 0 5px 4px 0"
            >Tree V2</el-link
          >组件并支持国际化）</span
        >
      </div>
    </template>
    <el-input
      class="mb-4"
      v-model="query"
      placeholder="请输入关键字查找"
      clearable
      @input="onQueryChanged"
    />
    <el-tree-v2
      ref="treeRef"
      :data="menusData"
      :props="dataProps"
      show-checkbox
      :height="500"
      :filter-method="filterMethod"
      :default-expanded-keys="expandedKeys"
    >
      <template #default="{ data }">
        <span>{{ t(data.meta.title) }}</span>
      </template>
    </el-tree-v2>
  </el-card>
</template>
