<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useLoader } from "@pureadmin/utils";
import { ElDesignForm } from "vue-form-create2";

defineOptions({
  name: "FormDesign"
});

const loading = ref(true);
const { loadScript } = useLoader();

onBeforeMount(() => {
  loadScript({
    src: "https://unpkg.com/ace-builds/src-noconflict/ace.js"
  }).then(message => {
    if (message === "success") loading.value = false;
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
