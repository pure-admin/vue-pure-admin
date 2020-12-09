<template>
  <el-menu
    default-active="home"
    class="el-menu-vertical"
    :router="true"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="home">
      <i class="el-icon-s-home"></i>
      <span>首页</span>
    </el-menu-item>

    <el-submenu v-for="item in routes" :key="item.key">
      <template #title>
        <i :class="item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <el-menu-item-group v-for="(child,key) in item.children" :key="key">
        <el-menu-item :index="child.path">{{ child.meta.title }}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script lang='ts'>
import { ref, defineComponent } from "vue";
import router from "../../router/index";
import { algorithm } from "../../utils/algorithm";
export default defineComponent({
  setup() {
    let isCollapse = ref(false);

    let { getRoutes } = router;

    let routes = algorithm.increaseIndexes(getRoutes())

    console.log(routes);

    const handleOpen = (key, keyPath): void => {
      // console.log(key, keyPath);
    };

    const handleClose = (key, keyPath): void => {
      // console.log(key, keyPath);
    };

    return {
      isCollapse,
      handleOpen,
      handleClose,
      routes
    };
  }
});
</script>

<style scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
  /* background: #001529; */
  color: #fff;
}
</style>
