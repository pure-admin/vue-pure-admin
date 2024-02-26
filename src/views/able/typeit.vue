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
        <span class="font-medium"> 打字机组件 </span>
      </div>
    </template>
    <TypeIt :options="options" />
  </el-card>
</template>
