<script setup lang="ts">
import { ref } from "vue";
import { loadEnv } from "@build/index";

defineOptions({
  name: "Button"
});

const { VITE_PUBLIC_PATH } = loadEnv();

const url = ref(`${VITE_PUBLIC_PATH}html/button.html`);
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">通过iframe引入按钮页面</span>
      </div>
    </template>
    <iframe :src="url" frameborder="0" class="iframe" />
  </el-card>
</template>

<style scoped>
.iframe {
  width: 100%;
  height: 60vh;
}
</style>
