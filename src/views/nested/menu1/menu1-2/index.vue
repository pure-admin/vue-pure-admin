<template>
  <div>
    <p style="text-indent: 2em">{{ $t("message.hsmenu1-2") }}</p>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
