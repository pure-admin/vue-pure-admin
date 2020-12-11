<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
@import "../src/style/transition.scss";
.app-main {
  min-height: calc(100vh - 50px);
  width: calc(100vw - 210px);
  margin-left: 220px;
  position: relative;
  overflow: hidden;
}
</style>