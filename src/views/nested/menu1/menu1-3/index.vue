<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

defineOptions({
  name: "Menu1-3"
});

let input = ref("");
const { t } = useI18n();
</script>

<template>
  <div>
    <p>{{ t("menus.hsmenu1") }}</p>
    <p style="text-indent: 2em">{{ t("menus.hsmenu1-3") }}</p>
    <el-input v-model="input" />
  </div>
</template>
