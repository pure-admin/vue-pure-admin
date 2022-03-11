<template>
  <div>
    <p>{{ t("menus.hsmenu2") }}</p>
    <el-input v-model="input" />
  </div>
</template>

<script lang="ts">
import { useI18n } from "vue-i18n";
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "Menu2",
  setup() {
    const { t } = useI18n();
    return {
      input: ref(""),
      t
    };
  }
});
</script>
