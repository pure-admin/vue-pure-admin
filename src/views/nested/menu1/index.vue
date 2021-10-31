<template>
  <div>
    <p>{{ $t("message.hsmenu1") }}</p>
    <router-view>
      <template #default="{ Component, route }">
        <transition appear name="fade-transform" mode="out-in">
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
  </div>
</template>

<script lang="ts">
import { ref, getCurrentInstance } from "vue";
import { usePermissionStoreHook } from "/@/store/modules/permission";
export default {
  name: "Menu1",
  setup() {
    const keepAlive: Boolean = ref(
      getCurrentInstance().appContext.config.globalProperties.$config?.KeepAlive
    );
    return {
      keepAlive,
      usePermissionStoreHook
    };
  }
};
</script>
