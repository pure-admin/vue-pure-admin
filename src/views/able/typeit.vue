<script setup lang="ts">
import { TypeIt, type TypeItOptions } from "@/components/ReTypeit";
import ReCodePath from "@/components/ReCodePath";

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
      <ReCodePath />
    </template>
    <TypeIt :options="options" />
  </el-card>
</template>
