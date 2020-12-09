<template>
  <div class="sides">
    <!-- logo  -->
    <!-- <header class="header">
      <p>CURD Admin</p>
    </header>-->
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
        <el-menu-item-group v-for="(child, key) in item.children" :key="key">
          <el-menu-item :index="child.path">
            {{
            child.meta.title
            }}
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script lang='ts'>
import mitt from "mitt";
export const emitter = mitt();
import { ref, defineComponent, onUnmounted } from "vue";
import router from "../../router/index";
import { algorithm } from "../../utils/algorithm";
export default defineComponent({
  setup() {
    let isCollapse = ref(false);

    let { getRoutes } = router;

    emitter.on("collapse", e => (isCollapse.value = !e));

    let routes = algorithm.increaseIndexes(getRoutes());

    console.log(routes);

    const handleOpen = (key, keyPath): void => {
      // console.log(key, keyPath);
    };

    const handleClose = (key, keyPath): void => {
      // console.log(key, keyPath);
    };

    onUnmounted(() => {
      emitter.off("collapse", callback => Boolean);
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
  width: 210px;
  height: 100vh;
  overflow: hidden;
  .header {
    width: 210px;
    height: 48px;
    text-align: center;
    // background: red;
    line-height: 48px;
    border-bottom: 1px solid #f0f0f0;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 210px;
    height: 100%;
    position: absolute;
    // background: #001529;
    color: #fff;
  }
}
</style>
