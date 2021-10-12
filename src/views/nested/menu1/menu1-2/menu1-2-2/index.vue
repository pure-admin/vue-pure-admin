<template>
  <div>
    <p style="text-indent: 4em">{{ $t("message.hsmenu1-2-2") }}</p>
    <el-input v-model="input" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "Menu1-2-2",
  setup() {
    return {
      input: ref("")
    };
  }
});
</script>
