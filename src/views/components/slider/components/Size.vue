<script setup lang="ts">
import { ref } from "vue";

const value = ref(0);
</script>

<template>
  <div class="max-w-[600px] ml-4">
    <el-slider v-model="value" show-input size="large" />
    <el-slider v-model="value" show-input />
    <el-slider v-model="value" show-input size="small" />
  </div>
</template>

<style lang="scss" scoped>
.el-slider {
  margin-top: 20px;
}

.el-slider:first-child {
  margin-top: 0;
}
</style>
