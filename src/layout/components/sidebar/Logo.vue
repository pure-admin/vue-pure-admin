<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        :title="settings.title"
        class="sidebar-logo-link"
        to="/"
      >
        <i class="fa fa-optin-monster"></i>
        <h1 class="sidebar-title">{{ settings.title }}</h1>
      </router-link>
      <router-link
        v-else
        key="expand"
        :title="settings.title"
        class="sidebar-logo-link"
        to="/"
      >
        <i class="fa fa-optin-monster"></i>
        <h1 class="sidebar-title">{{ settings.title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import settings from "/@/settings";
export default defineComponent({
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    return {
      settings
    };
  }
});
</script>

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
      margin-right: 0px;
    }
  }
}
</style>
