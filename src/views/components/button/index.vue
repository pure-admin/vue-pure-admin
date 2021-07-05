<template>
  <iframe :src="url" frameborder="0" class="iframe"></iframe>
</template>

<script lang="ts">
import { ref } from "vue";
export default {
  setup() {
    const url = ref(
      process.env.NODE_ENV === "production"
        ? "/manages/html/button.html"
        : "/html/button.html"
    );
    return {
      url
    };
  }
};
</script>

<style scoped>
.iframe {
  width: 98%;
  height: 90vh;
  border-radius: 6px;
}
</style>
