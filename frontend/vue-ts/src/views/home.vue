<template>
  <div>{{ text }}</div>
</template>

<script lang="ts">
import { ref } from "vue"
export default {
  setup() {
    const text = ref("vue-ts")
    return {
      text
    }
  }
}
</script>