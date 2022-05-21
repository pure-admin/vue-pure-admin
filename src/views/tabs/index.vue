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
          {{ transformI18n(option.meta.title) }}
        </el-tag>
      </template>

      <template #title="{ data }">
        <span>{{ transformI18n(data.meta.title) }}</span>
      </template>
    </TreeSelect>
    <el-button class="ml-2" @click="onCloseTags">关闭标签</el-button>
    <br />
    <p class="mt-4">
      注意：此demo并未开启标签页缓存，如果需要在
      <span class="text-red-500">刷新页面</span>
      的时候同时
      <span class="text-red-500">保留标签页的显示</span>
      或者
      <span class="text-red-500">保留url的参数</span>
      ，那么就需要开启标签页持久化。
      <br />
      开启方式：在页面最右上角有个设置的小图标，点进去，会看到项目配置面板，找到标签页持久化开启即可。
    </p>
  </el-card>
</template>
