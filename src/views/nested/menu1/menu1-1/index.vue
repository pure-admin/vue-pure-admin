<template>
  <div>
    <p>{{ t("menus.hsmenu1") }}</p>
    <p style="text-indent: 2em">{{ t("menus.hsmenu1-1") }}</p>
    <el-input v-model="input" />
  </div>
</template>

<script lang="ts">
import { useI18n } from "vue-i18n";
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "Menu1-1",
  setup() {
    const { t } = useI18n();
    return {
      input: ref(""),
      t
    };
  }
});
</script>
