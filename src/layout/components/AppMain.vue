<template>
  <section class="app-main" :style="{'margin': appMargin}">
    <router-view :key="key" v-slot="{ Component }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { deviceDetection } from "../../utils/deviceDetection";
export default defineComponent({
  name: "AppMain",
  setup() {
    const route = useRoute();
    const key = computed(() => route.path);
    const appMargin = computed(() => (deviceDetection() ? 0 : "10px"));

    return { key, appMargin };
  },
});
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 70px);
  width: 100%;
  position: relative;
  overflow-x: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
