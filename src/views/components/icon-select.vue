<script setup lang="ts">
import { ref } from "vue";
import { IconSelect } from "@/components/ReIcon";
import ReCodePath from "@/components/ReCodePath";
defineOptions({
  name: "IconSelect"
});

const icon = ref("ep:add-location");
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <ReCodePath />
    </template>
    <IconSelect v-model="icon" class="w-[200px]" />
  </el-card>
</template>
