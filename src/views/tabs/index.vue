<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";

const router = useRouter();
const route = useRoute();

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
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium"
          >标签页复用，超出限制自动关闭（使用场景: 动态路由）</span
        >
      </div>
    </template>
    <el-button v-for="index in 6" :key="index" @click="toDetail(index)">
      打开{{ index }}详情页
    </el-button>
  </el-card>
</template>
