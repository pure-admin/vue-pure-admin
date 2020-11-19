<template>
  <div class="register">{{ text }}</div>
</template>

<script lang="ts">
import { ref } from "vue"
export default {
  mounted() {
    // @ts-ignore
    this.$http.request("get", "/getApi")
  },
  setup() {
    const text = ref("register")
    return {
      text,
    }
  },
}
</script>

<style scoped>
</style>