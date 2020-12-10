<template>
  <div class="layout">
    <!-- 头部 -->
    <head-bar />
    <!-- 标签 -->
    <tags />
    <!-- 内容主体 -->
    <div class="layout-body">
      <!-- 侧边栏 -->
      <sides />
      <!-- 内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang='ts'>
import headBar from "./header/index.vue";
import sides from "./sides/index.vue";
import tags from "./tag/index.vue";
export default {
  components: {
    headBar,
    sides,
    tags
  }
};
</script>

<style lang="scss" scoped>
.layout {
  width: 100vw;
}
</style>
