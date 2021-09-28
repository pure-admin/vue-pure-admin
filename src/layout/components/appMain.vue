<script setup lang="ts">
import { ref, unref, computed, getCurrentInstance } from "vue";
import { useSettingStoreHook } from "/@/store/modules/settings";

const keepAlive: Boolean = ref(
  getCurrentInstance().appContext.config.globalProperties.$config?.keepAlive
);

const getCachedPageList = computed((): string[] => {
  if (!unref(keepAlive)) {
    return [];
  }
  return useSettingStoreHook().cachedPageList;
});
</script>

<template>
  <section class="app-main">
    <router-view>
      <template #default="{ Component, route }">
        <transition appear name="fade-transform" mode="out-in">
          <keep-alive v-if="keepAlive" :include="getCachedPageList">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
          <component v-else :is="Component" :key="route.fullPath" />
        </transition>
      </template>
    </router-view>
  </section>
</template>

<style scoped>
.app-main {
  min-height: calc(100vh - 70px);
  width: 100%;
  height: 90vh;
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
