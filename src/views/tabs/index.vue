<script setup lang="ts">
import { ref, computed } from "vue";
import { cloneDeep } from "lodash-unified";
import { transformI18n } from "/@/plugins/i18n";
import { TreeSelect } from "@pureadmin/components";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import {
  deleteChildren,
  getNodeByUniqueId,
  appendFieldByUniqueId
} from "@pureadmin/utils";
import { useDetail } from "./hooks";

defineOptions({
  name: "Tabs"
});

const { toDetail, router } = useDetail();
let menusTree = cloneDeep(usePermissionStoreHook().wholeMenus);

let treeData = computed(() => {
  return appendFieldByUniqueId(deleteChildren(menusTree), 0, {
    disabled: true
  });
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
        path: multiTags.value[(multiTags as any).value.length - 1].path
      });
  });
}
</script>

<template>
  <el-card>
    <template #header>
      <div>标签页复用，超出限制自动关闭（使用场景: 动态路由）</div>
    </template>
    <div class="flex flex-wrap items-center">
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

    <div class="flex flex-wrap items-center">
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
      class="w-[300px]"
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
        <el-tag class="mr-[3px]" :closable="closable" @close="onClose">
          {{ transformI18n(option.meta.title) }}
        </el-tag>
      </template>

      <template #title="{ data }">
        <span>{{ transformI18n(data.meta.title) }}</span>
      </template>
    </TreeSelect>
    <el-button class="m-2" @click="onCloseTags">关闭标签</el-button>

    <el-divider />
    <el-button @click="$router.push({ name: 'Menu1-2-2' })">
      跳转页内菜单（传name对象，优先推荐）
    </el-button>
    <el-button @click="$router.push('/nested/menu1/menu1-2/menu1-2-2')">
      跳转页内菜单（直接传要跳转的路径）
    </el-button>
    <el-button
      @click="$router.push({ path: '/nested/menu1/menu1-2/menu1-2-2' })"
    >
      跳转页内菜单（传path对象）
    </el-button>
    <el-link
      class="ml-4"
      href="https://router.vuejs.org/zh/guide/essentials/navigation.html#%E5%AF%BC%E8%88%AA%E5%88%B0%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE"
      target="_blank"
    >
      点击查看更多跳转方式
    </el-link>

    <el-divider />
    <el-button @click="$router.push({ name: 'Empty' })">
      跳转无Layout的空白页面
    </el-button>
  </el-card>
</template>
