<script setup lang="ts">
import { getCurrentInstance } from "vue";
const props = defineProps({
  collapse: Boolean
});

const title =
  getCurrentInstance().appContext.config.globalProperties.$config?.Title;
</script>

<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="props.collapse"
        key="props.collapse"
        :title="title"
        class="sidebar-logo-link"
        to="/"
      >
        <i class="fa fa-optin-monster"></i>
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link
        v-else
        key="expand"
        :title="title"
        class="sidebar-logo-link"
        to="/"
      >
        <i class="fa fa-optin-monster"></i>
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  text-align: center;
  overflow: hidden;

  .sidebar-logo-link {
    height: 100%;

    .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #1890ff;
      font-weight: 600;
      font-size: 20px;
      margin-top: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    }

    .fa-optin-monster {
      font-size: 30px;
      color: #1890ff;
      margin-top: 5px;
    }
  }

  .collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
