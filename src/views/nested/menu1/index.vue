<template>
  <div class="app-container">
    <p>{{ $t("message.hsmenu1") }}</p>
    <router-view v-slot="{ Component }">
      <transition>
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
