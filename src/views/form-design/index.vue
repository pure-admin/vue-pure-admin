<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { loader } from "/@/utils/loaders";
import { ElDesignForm } from "vue-form-create2";

defineOptions({
  name: "FormDesign"
});

const loading = ref(true);

onBeforeMount(() => {
  loader
    .loadScript("https://unpkg.com/ace-builds/src-noconflict/ace.js")
    .then(() => {
      loading.value = false;
    });
});
</script>

<template>
  <ElDesignForm v-loading="loading" style="height: 100vh" />
</template>

<style lang="scss" scoped>
.main-content {
  margin: 0 !important;
}
</style>
