<template>
  <div>{{ text }}</div>
</template>

<script lang="ts">
import { ref, onMounted, nextTick } from "vue"
export default {
  mounted() {
    this.$http.request("get", "/getApi")
  },
  setup() {
    const text = ref("vue-ts")
    return {
      text,
    }
  },
}
</script>