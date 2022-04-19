<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { TreeSelect } from "@pureadmin/components";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";

import {
  deleteChildren,
  appendFieldByUniqueId,
  getNodeByUniqueId
} from "/@/utils/tree";
import { usePermissionStoreHook } from "/@/store/modules/permission";

let treeData = computed(() => {
  return appendFieldByUniqueId(
    deleteChildren(usePermissionStoreHook().menusTree),
    0,
    { disabled: true }
  );
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const value = ref<string[]>([]);

function toDetail(index: number) {
  useMultiTagsStoreHook().handleTags("push", {
    path: `/tabs/detail`,
    parentPath: route.matched[0].path,
    name: "tabDetail",
    query: { id: String(index) },
    meta: {
      title: { zh: `No.${index} - 详情信息`, en: `No.${index} - DetailInfo` },
      showLink: false,
      i18n: false,
      dynamicLevel: 3
    }
  });
  router.push({ name: "tabDetail", query: { id: String(index) } });
}

function onCloseTags() {
  value.value.forEach(uniqueId => {
    let currentPath =
      getNodeByUniqueId(treeData.value, uniqueId).redirect ??
      getNodeByUniqueId(treeData.value, uniqueId).path;
    useMultiTagsStoreHook().handleTags("splice", currentPath);
  });
}
</script>

<template>
  <el-card>
    <template #header>
      <div>标签页复用，超出限制自动关闭（使用场景: 动态路由）</div>
    </template>
    <el-button v-for="index in 6" :key="index" @click="toDetail(index)">
      打开{{ index }}详情页
    </el-button>
    <el-divider />
    <TreeSelect
      class="w-300px"
      v-model:value="value"
      show-search
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="请选择要关闭的标签"
      :fieldNames="{
        children: 'children',
        key: 'uniqueId',
        value: 'uniqueId'
      }"
      allow-clear
      multiple
      tree-default-expand-all
      :tree-data="treeData"
    >
      <template #tagRender="{ closable, onClose, option }">
        <el-tag class="mr-3px" :closable="closable" @close="onClose">
          {{ t(option.meta.title) }}
        </el-tag>
      </template>

      <template #title="{ data }">
        <span>{{ t(data.meta.title) }}</span>
      </template>
    </TreeSelect>
    <el-button class="ml-2" @click="onCloseTags">关闭标签</el-button>
  </el-card>
</template>
