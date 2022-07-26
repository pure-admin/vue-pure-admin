<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useFullscreen } from "@vueuse/core";

const { t } = useI18n();
const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <div
    class="screen-full w-36px h-48px flex-ac cursor-pointer navbar-bg-hover"
    @click="toggle"
  >
    <FontIcon
      :title="
        isFullscreen ? t('buttons.hsexitfullscreen') : t('buttons.hsfullscreen')
      "
      :icon="isFullscreen ? 'team-iconexit-fullscreen' : 'team-iconfullscreen'"
    />
  </div>
</template>
