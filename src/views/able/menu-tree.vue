<script setup lang="ts">
import { ref, computed } from "vue";
import { clone } from "@pureadmin/utils";
import type { ElTreeV2 } from "element-plus";
import { transformI18n } from "@/plugins/i18n";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { extractPathList, deleteChildren } from "@/utils/tree";
import { usePermissionStoreHook } from "@/store/modules/permission";
import type { TreeNode } from "element-plus/es/components/tree-v2/src/types";
import NodeTree from "@iconify-icons/ri/node-tree";

defineOptions({
  name: "MenuTree"
});

interface treeNode extends TreeNode {
  meta: {
    title: string;
  };
}

const query = ref("");
const dataProps = ref({
  value: "uniqueId",
  children: "children"
});
const treeRef = ref<InstanceType<typeof ElTreeV2>>();
const menusTree = clone(usePermissionStoreHook().wholeMenus, true);

const menusData = computed(() => {
  return deleteChildren(menusTree);
});

const expandedKeys = extractPathList(menusData.value);

const onQueryChanged = (query: string) => {
  (treeRef as any).value!.filter(query);
};

const filterMethod = (query: string, node: treeNode) => {
  return transformI18n(node.meta.title)!.indexOf(query) !== -1;
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          菜单树结构（采用element-plus的
          <el-link
            href="https://element-plus.gitee.io/zh-CN/component/tree-v2.html"
            target="_blank"
            :icon="useRenderIcon(NodeTree)"
            style="margin: 0 5px 4px 0; font-size: 16px"
          >
            Tree V2
          </el-link>
          组件并支持国际化）
        </span>
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
        <span>{{ transformI18n(data.meta.title) }}</span>
      </template>
    </el-tree-v2>
  </el-card>
</template>
