<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

defineOptions({
  name: "Menu1-2-2"
});

const input = ref("");
const { t } = useI18n();
const { query } = useRoute();
</script>

<template>
  <div class="dark:text-white">
    <p>{{ t("menus.pureMenu1") }}</p>
    <p style="text-indent: 2em">{{ t("menus.pureMenu1-2") }}</p>
    <p style="text-indent: 4em">{{ t("menus.pureMenu1-2-2") }}</p>
    <el-input v-model="input" />

    <div v-if="query.text" class="mt-4">
      此页面携带的参数值为：{{ query.text }}
    </div>
  </div>
</template>
