<script setup lang="ts">
import { getCurrentInstance } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import en from "element-plus/lib/locale/lang/en";

let locale: string =
  getCurrentInstance().appContext.config.globalProperties.$storage?.locale
    ?.locale;

let currentLocale = () => {
  switch (locale) {
    case "zh":
      return zhCn;
    case "en":
      return en;
  }
};
</script>

<template>
  <el-config-provider :locale="currentLocale()">
    <router-view />
  </el-config-provider>
</template>
