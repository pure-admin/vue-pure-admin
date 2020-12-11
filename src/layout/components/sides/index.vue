<template>
  <div class="sides">
    <!-- logo  -->
    <div class="logo">
      <p>CURD Admin</p>
    </div>
    <el-menu
      default-active="home"
      class="el-menu-vertical"
      :router="true"
      :collapse="isCollapse"
      :popper-append-to-body="true"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span>{{ $t("home") }}</span>
      </el-menu-item>

      <el-submenu v-for="item in routes" :key="item.key" :index="item.key">
        <template #title>
          <i :class="item.meta.icon"></i>
          <span>{{ $t(item.meta.title) }}</span>
        </template>
        <el-menu-item-group v-for="(child, key) in item.children" :key="key">
          <el-menu-item :index="child.path">{{ $t(child.meta.title) }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <slot />
  </div>
</template>

<script lang='ts'>
import mitt from "mitt";
export const sidesEmitter = mitt();
import { ref, defineComponent, onUnmounted } from "vue";
import router from "../../../router/index";
import { algorithm } from "../../../utils/algorithm";
export default defineComponent({
  setup() {
    let isCollapse = ref(false);

    let { getRoutes } = router;

    sidesEmitter.on("collapse", e => (isCollapse.value = !e));

    let routes = algorithm.increaseIndexes(getRoutes());

    console.log(routes);

    const handleOpen = (key, keyPath): void => {
      // console.log(key, keyPath);
    };

    const handleClose = (key, keyPath): void => {
      // console.log(key, keyPath);
    };

    onUnmounted(() => {
      sidesEmitter.off("collapse", callback => Boolean);
    });

    return {
      isCollapse,
      handleOpen,
      handleClose,
      routes
    };
  }
});
</script>

<style lang="scss" scoped>
.sides {
  height: 100vh;
  width: 210px;
  .logo {
    width: 210px;
    height: 48px;
    text-align: center;
    line-height: 48px;
    border-bottom: 1px solid #f0f0f0;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 210px;
    height: 100%;
    position: absolute;
    color: #fff;
    // background: #001529;
  }
}
</style>
