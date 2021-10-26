<script setup lang="ts">
import { ref, computed, getCurrentInstance } from "vue";
import { usePermissionStoreHook } from "/@/store/modules/permission";

const props = defineProps({
  fixedHeader: Boolean
});
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
  <section
    :class="[props.fixedHeader ? 'app-main' : 'app-main-nofixed-header']"
  >
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
          <el-scrollbar v-if="props.fixedHeader">
            <el-backtop target=".app-main .el-scrollbar__wrap"></el-backtop>
            <keep-alive
              v-if="keepAlive"
              :include="usePermissionStoreHook().cachePageList"
            >
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
            <component v-else :is="Component" :key="route.fullPath" />
          </el-scrollbar>
          <div v-else>
            <keep-alive
              v-if="keepAlive"
              :include="usePermissionStoreHook().cachePageList"
            >
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
            <component v-else :is="Component" :key="route.fullPath" />
          </div>
        </transition>
      </template>
    </router-view>
  </section>
</template>

<style scoped>
.app-main {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.app-main-nofixed-header {
  width: 100%;
  min-height: 100vh;
  position: relative;
}
</style>
