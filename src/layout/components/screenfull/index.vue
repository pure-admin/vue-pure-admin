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
  width: 40px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  &:hover {
    cursor: pointer;
    background: #f0f0f0;
  }
}
</style>
