<script setup lang="ts">
import {
  deleteChildren,
  getNodeByUniqueId,
  appendFieldByUniqueId
} from "@/utils/tree";
import { useDetail } from "./hooks";
import { ref, computed } from "vue";
import { clone } from "@pureadmin/utils";
import { transformI18n } from "@/plugins/i18n";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";

defineOptions({
  name: "Tabs"
});

const { toDetail, router } = useDetail();
const menusTree = clone(usePermissionStoreHook().wholeMenus, true);

const treeData = computed(() => {
  return appendFieldByUniqueId(deleteChildren(menusTree), 0, {
    disabled: true
  });
});

const currentValues = ref<string[]>([]);

const multiTags = computed(() => {
  return useMultiTagsStoreHook()?.multiTags;
});

function onCloseTags() {
  if (currentValues.value.length === 0) return;
  currentValues.value.forEach(uniqueId => {
    const currentPath =
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
  <el-card shadow="never">
    <template #header>
      <div>标签页复用，超出限制自动关闭</div>
    </template>
    <div class="flex flex-wrap items-center">
      <p>query传参模式：</p>
      <el-button
        class="m-2"
        v-for="index in 6"
        :key="index"
        @click="toDetail({ id: index }, 'query')"
      >
        打开{{ index }}详情页
      </el-button>
      <el-button
        @click="
          toDetail({ id: 666, name: '小明', age: 18, job: '工程师' }, 'query')
        "
      >
        多个参数
      </el-button>
    </div>

    <el-divider />

    <div class="flex flex-wrap items-center">
      <p>params传参模式：</p>
      <el-button
        class="m-2"
        v-for="index in 6"
        :key="index"
        @click="toDetail({ id: index }, 'params')"
      >
        打开{{ index }}详情页
      </el-button>
    </div>

    <el-divider />
    <el-tree-select
      class="w-[300px]"
      node-key="uniqueId"
      placeholder="请选择要关闭的标签"
      clearable
      multiple
      filterable
      default-expand-all
      :props="{
        label: data => transformI18n(data.meta.title),
        value: 'uniqueId',
        children: 'children',
        disabled: 'disabled'
      }"
      :data="treeData"
      v-model="currentValues"
    >
      <template #default="{ data }">
        <span>{{ transformI18n(data.meta.title) }}</span>
      </template>
    </el-tree-select>
    <el-button class="m-2" @click="onCloseTags">关闭标签</el-button>

    <el-divider />
    <el-button @click="router.push({ name: 'Menu1-2-2' })">
      跳转页内菜单（传name对象，优先推荐）
    </el-button>
    <el-button @click="router.push('/nested/menu1/menu1-2/menu1-2-2')">
      跳转页内菜单（直接传要跳转的路径）
    </el-button>
    <el-button
      @click="router.push({ path: '/nested/menu1/menu1-2/menu1-2-2' })"
    >
      跳转页内菜单（传path对象）
    </el-button>

    <el-divider />
    <el-button
      @click="
        router.push({
          name: 'Menu1-2-2',
          query: { text: '传name对象，优先推荐' }
        })
      "
    >
      携参跳转页内菜单（传name对象，优先推荐）
    </el-button>
    <el-button
      @click="
        router.push({
          path: '/nested/menu1/menu1-2/menu1-2-2',
          query: { text: '传path对象' }
        })
      "
    >
      携参跳转页内菜单（传path对象）
    </el-button>
    <el-link
      class="ml-4"
      href="https://router.vuejs.org/zh/guide/essentials/navigation.html#%E5%AF%BC%E8%88%AA%E5%88%B0%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE"
      target="_blank"
    >
      点击查看更多跳转方式
    </el-link>

    <el-divider />
    <el-button @click="router.push({ name: 'Empty' })">
      跳转无Layout的空白页面
    </el-button>
  </el-card>
</template>
