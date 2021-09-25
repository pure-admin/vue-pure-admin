<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";
const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <div class="screen-full" @click="toggle">
    <i
      :title="
        isFullscreen
          ? $t('message.hsexitfullscreen')
          : $t('message.hsfullscreen')
      "
      :class="
        isFullscreen
          ? 'iconfont team-iconexit-fullscreen'
          : 'iconfont team-iconfullscreen'
      "
    ></i>
  </div>
</template>

<style lang="scss" scoped>
.screen-full {
  width: 36px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
