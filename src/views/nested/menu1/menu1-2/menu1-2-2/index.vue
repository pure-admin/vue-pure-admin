<template>
  <div>
    <p>{{ $t("menus.hsmenu1") }}</p>
    <p style="text-indent: 2em">{{ $t("menus.hsmenu1-2") }}</p>
    <p style="text-indent: 4em">{{ $t("menus.hsmenu1-2-2") }}</p>
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
