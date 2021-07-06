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

<script>
import { useFullscreen } from "@vueuse/core";
import { defineComponent } from "vue";
export default defineComponent({
  name: "screenfull",
  setup() {
    const { isFullscreen, toggle } = useFullscreen();

    return {
      isFullscreen,
      toggle
    };
  }
});
</script>

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
