<template>
  <div>
    <p style="text-indent: 2em">{{ $t("message.hsmenu1-3") }}</p>
    <el-input v-model="input" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "Menu1-3",
  setup() {
    return {
      input: ref("")
    };
  }
});
</script>
