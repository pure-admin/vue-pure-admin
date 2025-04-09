<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Motion from "../utils/motion";
import ReQrcode from "@/components/ReQrcode";
import { useUserStoreHook } from "@/store/modules/user";

const { t } = useI18n();
</script>

<template>
  <Motion class="-mt-2 -mb-2">
    <ReQrcode :text="t('login.pureTest')" />
  </Motion>
  <Motion :delay="100">
    <el-divider>
      <p class="text-gray-500 text-xs">{{ t("login.pureTip") }}</p>
    </el-divider>
  </Motion>
  <Motion :delay="150">
    <el-button
      class="w-full mt-4!"
      @click="useUserStoreHook().SET_CURRENTPAGE(0)"
    >
      {{ t("login.pureBack") }}
    </el-button>
  </Motion>
</template>
