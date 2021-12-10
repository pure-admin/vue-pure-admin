<template>
  <div>
    <router-view>
      <template #default="{ Component, route }">
        <transition appear name="fade-transform" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </template>
    </router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: "layoutParentView"
};
</script>
