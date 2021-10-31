<template>
  <div>
    <p>{{ $t("message.hsmenu2") }}</p>
    <el-input v-model="input" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "Menu2",
  setup() {
    return {
      input: ref("")
    };
  }
});
</script>
