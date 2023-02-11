<script setup lang="ts">
import TypeIt from "@/components/ReTypeit";

defineOptions({
  name: "Typeit"
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium"> 打字机组件 </span>
      </div>
    </template>
    <TypeIt :values="['test1', 'test2', 'test3']" />
  </el-card>
</template>
