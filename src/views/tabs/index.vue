<script setup lang="ts">
import { ref, computed } from "vue";
import { transformI18n } from "/@/plugins/i18n";
import { TreeSelect } from "@pureadmin/components";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import {
  deleteChildren,
  appendFieldByUniqueId,
  getNodeByUniqueId
} from "/@/utils/tree";
import { useDetail } from "./hooks";

defineOptions({
  name: "Tabs"
});

const { toDetail, router } = useDetail();

let treeData = computed(() => {
  return appendFieldByUniqueId(
    deleteChildren(usePermissionStoreHook().menusTree),
    0,
    { disabled: true }
  );
});

const value = ref<string[]>([]);

let multiTags = computed(() => {
  return useMultiTagsStoreHook()?.multiTags;
});

function onCloseTags() {
  value.value.forEach(uniqueId => {
    let currentPath =
      getNodeByUniqueId(treeData.value, uniqueId).redirect ??
      getNodeByUniqueId(treeData.value, uniqueId).path;
    useMultiTagsStoreHook().handleTags("splice", currentPath);
    if (currentPath === "/tabs/index")
      router.push({
        path: multiTags.value[multiTags.value.length - 1].path
      });
  });
}
</script>

<template>
  <el-card>
    <template #header>
      <div>标签页复用，超出限制自动关闭（使用场景: 动态路由）</div>
    </template>
    <div class="flex-wrap items-center">
      <p>query传参模式：</p>
      <el-button
        class="m-2"
        v-for="index in 6"
        :key="index"
        @click="toDetail(index, 'query')"
      >
        打开{{ index }}详情页
      </el-button>
    </div>

    <el-divider />

    <div class="flex-wrap items-center">
      <p>params传参模式：</p>
      <el-button
        class="m-2"
        v-for="index in 6"
        :key="index"
        @click="toDetail(index, 'params')"
      >
        打开{{ index }}详情页
      </el-button>
    </div>

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
          {{ transformI18n(option.meta.title) }}
        </el-tag>
      </template>

      <template #title="{ data }">
        <span>{{ transformI18n(data.meta.title) }}</span>
      </template>
    </TreeSelect>
    <el-button class="m-2" @click="onCloseTags">关闭标签</el-button>
  </el-card>
</template>
