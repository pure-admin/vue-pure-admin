<script setup lang="ts">
import { ref, watch } from "vue";
import ReAnimateSelector from "@/components/ReAnimateSelector";

defineOptions({
  name: "AnimateCss"
});

const icon = ref("");

watch(icon, () => {
  console.log("icon", icon.value);
});
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          <el-link
            href="https://animate.style/"
            target="_blank"
            style="margin: 0 4px 5px; font-size: 16px"
          >
            animate.css
          </el-link>
          选择器组件
        </span>
      </div>
    </template>
    <ReAnimateSelector v-model="icon" />
  </el-card>
</template>
