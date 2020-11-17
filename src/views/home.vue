<template>
  <div>{{ text }}</div>
</template>

<script lang="ts">
import { ref, onMounted, nextTick } from "vue"
export default {
  mounted() {
    this.$http.request("get", "https://api.github.com/users")
  },
  setup() {
    const text = ref("vue-ts")
    return {
      text,
    }
  },
}
</script>