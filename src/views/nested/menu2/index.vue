<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

defineOptions({
  name: "Menu2"
});

const input = ref("");
const { t } = useI18n();
</script>

<template>
  <div class="dark:text-white">
    <p>{{ t("menus.pureMenu2") }}</p>
    <el-input v-model="input" />
  </div>
</template>
