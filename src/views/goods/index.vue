<script setup lang="ts">
import { ref } from "vue";
let title = ref("goods_dial");
</script>
<template>
  <div class="app-container">{{ title }}</div>
  <router-view />
</template>
