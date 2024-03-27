<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

defineOptions({
  name: "Menu1-2-1"
});

const input = ref("");
const { t } = useI18n();
</script>

<template>
  <div class="dark:text-white">
    <p>{{ t("menus.pureMenu1") }}</p>
    <p style="text-indent: 2em">{{ t("menus.pureMenu1-2") }}</p>
    <p style="text-indent: 4em">{{ t("menus.pureMenu1-2-1") }}</p>
    <el-input v-model="input" />
  </div>
</template>
