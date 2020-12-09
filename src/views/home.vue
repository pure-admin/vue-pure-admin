<template>
  <div class="home">
    <!-- 头部 -->
    <head-bar />
    <!-- 内容主体 -->
    <div class="ctnBody">
      <!-- 侧边栏 -->
      <sides />
      <!-- 内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang='ts'>
import headBar from "../layout/header/index.vue";
import sides from "../layout/sides/index.vue";
export default {
  components: {
    headBar,
    sides,
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
}
</style>
