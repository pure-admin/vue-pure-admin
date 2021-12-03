<script setup lang="ts">
import { ref } from "vue";
import { loadEnv } from "@build/index";
const { VITE_PUBLIC_PATH } = loadEnv();

const url = ref(`${VITE_PUBLIC_PATH}html/button.html`);
</script>

<template>
  <iframe :src="url" frameborder="0" class="iframe"></iframe>
</template>

<style scoped>
.iframe {
  width: 98%;
  height: 90vh;
  border-radius: 6px;
}
</style>
