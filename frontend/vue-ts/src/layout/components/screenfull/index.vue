<template>
  <div class="screen-full" @click="onClick">
    <i
      :title="isFullscreen ? '退出全屏' : '全屏'"
      :class="
        isFullscreen
          ? 'iconfont team-iconexit-fullscreen'
          : 'iconfont team-iconfullscreen'
      "
    ></i>
  </div>
</template>

<script>
import screenfull from "screenfull";
import {
  ref,
  onBeforeMount,
  onUnmounted,
  defineComponent,
  onMounted,
} from "vue";
export default defineComponent({
  name: "screenfull",
  setup() {
    let isFullscreen = ref(false);

    const onClick = () => {
      if (!screenfull.isEnabled) return;
      screenfull.toggle();
    };

    const change = () => {
      isFullscreen.value = screenfull.isFullscreen;
    };

    const init = () => {
      if (screenfull.isEnabled) {
        screenfull.on("change", change);
      }
    };

    const destroy = () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", change);
      }
    };

    onMounted(() => {
      init();
    });

    onUnmounted(() => {
      destroy();
    });

    return {
      isFullscreen,
      onClick,
    };
  },
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