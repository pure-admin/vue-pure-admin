<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";

const router = useRouter();
const route = useRoute();
const activeName = ref("tag");

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
      dynamicLevel: 3,
      realPath: "/tabs/detail"
    }
  });
  router.push({ name: "tabDetail", query: { id: String(index) } });
}
</script>

<template>
  <el-collapse v-model="activeName" class="tabs-container">
    <el-collapse-item
      title="标签页复用超出限制自动关闭(使用场景: 动态路由)"
      name="tag"
    >
      <el-button
        v-for="index in 6"
        :key="index"
        size="medium"
        @click="toDetail(index)"
      >
        打开{{ index }}详情页
      </el-button>
    </el-collapse-item>
  </el-collapse>
</template>

<style lang="scss" scoped>
.tabs-container {
  padding: 10px;
  background: #fff;

  ::v-deep(.el-collapse-item__header) {
    line-height: 20px;
  }

  ::v-deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }

  button {
    margin: 10px;
  }
}
</style>
