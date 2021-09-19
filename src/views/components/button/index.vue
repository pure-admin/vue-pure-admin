<script setup lang="ts">
import { ref } from "vue";

const url = ref(
  process.env.NODE_ENV === "production"
    ? "/manages/html/button.html"
    : "/html/button.html"
);
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
