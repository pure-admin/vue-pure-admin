<template>
  <div class="layout">
    <!-- 头部 -->
    <headBar />
    <!-- 标签 -->
    <tags />
    <!-- 侧边栏 -->
    <sides>
      <!-- 内容 -->
      <appMain />
    </sides>
    <!-- 系统设置 -->
    <panel />
  </div>
</template>

<script lang='ts'>
import { headBar, panel, sides, tags, appMain } from "./components/index";
export default {
  components: {
    headBar,
    panel,
    sides,
    tags,
    appMain,
  },
};
</script>

<style lang="scss" scoped>
.layout {
  width: 100vw;
}
</style>
