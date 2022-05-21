<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

defineOptions({
  name: "Menu2"
});

let input = ref("");
const { t } = useI18n();
</script>

<template>
  <div>
    <p>{{ t("menus.hsmenu2") }}</p>
    <el-input v-model="input" />
  </div>
</template>
