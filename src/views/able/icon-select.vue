<script setup lang="ts">
import { ref } from "vue";
import { IconSelect } from "@/components/ReIcon";

defineOptions({
  name: "IconSelect"
});

const icon = ref("ep:add-location");
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">图标选择器</span>
      </div>
    </template>
    <IconSelect class="w-[200px]" v-model="icon" />
  </el-card>
</template>
