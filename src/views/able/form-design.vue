<script setup lang="ts">
import { onBeforeMount } from "vue";
import { loader } from "/@/utils/loaders";
import { ElDesignForm } from "vue-form-create";

onBeforeMount(() => {
  loader.loadScript("https://unpkg.com/ace-builds/src-noconflict/ace.js");
});
</script>

<template>
  <ElDesignForm style="height: 100vh" />
</template>

<style lang="scss" scoped>
.main-content {
  margin: 0 !important;
}
</style>
