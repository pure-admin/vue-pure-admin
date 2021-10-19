<script setup lang="ts">
import { ref, computed, getCurrentInstance } from "vue";
import { usePermissionStoreHook } from "/@/store/modules/permission";

const keepAlive: Boolean = ref(
  getCurrentInstance().appContext.config.globalProperties.$config?.KeepAlive
);

const transition = computed(() => {
  return route => {
    return route.meta.transition;
  };
});
</script>

<template>
  <section class="app-main">
    <el-scrollbar>
      <router-view>
        <template #default="{ Component, route }">
          <transition
            :name="
              transition(route) && route.meta.transition.enterTransition
                ? 'pure-classes-transition'
                : (transition(route) && route.meta.transition.name) ||
                  'fade-transform'
            "
            :enter-active-class="
              transition(route) &&
              `animate__animated ${route.meta.transition.enterTransition}`
            "
            :leave-active-class="
              transition(route) &&
              `animate__animated ${route.meta.transition.leaveTransition}`
            "
            mode="out-in"
            appear
          >
            <keep-alive
              v-if="keepAlive"
              :include="usePermissionStoreHook().cachePageList"
            >
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
            <component v-else :is="Component" :key="route.fullPath" />
          </transition>
        </template>
      </router-view>
    </el-scrollbar>
  </section>
</template>

<style scoped>
.app-main {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-x: hidden;
}
</style>
