<script setup lang="ts">
import { TypeIt, type TypeItOptions } from "@/components/ReTypeit";

defineOptions({
  name: "Typeit"
});

const options: TypeItOptions = {
  strings: ["test1", "test2", "test3"]
};
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <p class="font-medium">打字机组件</p>
        <el-link
          class="mt-2"
          href="https://github.com/pure-admin/vue-pure-admin/blob/main/src/views/able/typeit.vue"
          target="_blank"
        >
          代码位置 src/views/able/typeit.vue
        </el-link>
      </div>
    </template>
    <TypeIt :options="options" />
  </el-card>
</template>
